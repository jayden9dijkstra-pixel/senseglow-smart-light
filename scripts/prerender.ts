/**
 * Postbuild prerender: schrijft per route een statische HTML met de juiste
 * head (title, description, canonical, og/twitter, JSON-LD) op basis van
 * dist/index.html. De body blijft de SPA-root; React hydrateert client-side.
 *
 * Faalt een Shopify-fetch, dan valt die route terug op de statische SEO-head
 * zonder Product JSON-LD. De build breekt nooit.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { ENABLED_PRODUCT_HANDLES } from "../src/lib/productConfig";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_SEO,
  getRouteSeo,
  getProductSeo,
  type SeoEntry,
} from "../src/lib/seoContent";
import {
  organizationSchema,
  productSchema,
  breadcrumbSchema,
} from "../src/lib/structuredData";
import type { ShopifyProduct } from "../src/lib/shopify";

const DIST = resolve("dist");
const TEMPLATE_PATH = resolve(DIST, "index.html");

const STATIC_ROUTES = [
  "/",
  "/producten",
  "/verzending",
  "/retourneren",
  "/voorwaarden",
  "/privacy",
  "/over",
  "/duurzaamheid",
  "/contact",
  "/bestelling-volgen",
  "/quiz",
];

/* ---------------------------------------------------------------- Shopify */

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "senseglow-smart-light-5jjoq.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "d888e2f5ee17de858e6626f4c34cf9b7";
const FETCH_TIMEOUT_MS = 10000;

const PRODUCT_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id title description handle
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 20) { edges { node { url altText } } }
      variants(first: 30) {
        edges { node {
          id title
          price { amount currencyCode }
          availableForSale
          selectedOptions { name value }
        } }
      }
      options { name values }
    }
  }
`;

async function fetchProduct(handle: string): Promise<ShopifyProduct | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: PRODUCT_QUERY, variables: { handle } }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as {
      errors?: Array<{ message?: string }>;
      data?: { productByHandle?: ShopifyProduct["node"] };
    };
    if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(", "));
    const node = json.data?.productByHandle;
    return node ? { node } : null;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------- HTML */

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function jsonLdScript(data: unknown): string {
  // </script> in data zou de tag vroegtijdig sluiten.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

interface HeadInput {
  path: string;
  seo: SeoEntry;
  schemas: unknown[];
  ogType: string;
  ogImage?: string;
}

function buildHead({ path, seo, schemas, ogType, ogImage }: HeadInput): string {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
  ];
  if (ogImage) {
    lines.push(`<meta property="og:image" content="${escapeAttr(ogImage)}" />`);
    lines.push(`<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`);
  }
  for (const schema of schemas) lines.push(jsonLdScript(schema));
  return lines.map((l) => `    ${l}`).join("\n");
}

/**
 * Verwijdert de tags uit de template die we per route zelf zetten, zodat er
 * geen dubbele title/canonical/og in de ruwe HTML staat.
 */
function stripTemplateHead(html: string): string {
  return html
    .replace(/[ \t]*<title>[\s\S]*?<\/title>\s*\n?/gi, "")
    .replace(/[ \t]*<meta\s+name=["']description["'][^>]*>\s*\n?/gi, "")
    .replace(/[ \t]*<link\s+rel=["']canonical["'][^>]*>\s*\n?/gi, "")
    .replace(/[ \t]*<meta\s+property=["']og:(?:type|url|title|description|site_name)["'][^>]*>\s*\n?/gi, "")
    .replace(/[ \t]*<meta\s+name=["']twitter:(?:card|title|description)["'][^>]*>\s*\n?/gi, "")
    .replace(
      /[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*\n?/gi,
      "",
    );
}

function extractOgImage(html: string): string | undefined {
  const m = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  return m?.[1];
}

function writeRoute(path: string, html: string) {
  const outPath =
    path === "/" ? resolve(DIST, "index.html") : resolve(DIST, `.${path}/index.html`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
}

/* ------------------------------------------------------------------- main */

async function main() {
  if (!existsSync(TEMPLATE_PATH)) {
    console.warn("[prerender] dist/index.html niet gevonden, overgeslagen.");
    return;
  }

  const rawTemplate = readFileSync(TEMPLATE_PATH, "utf8");
  const ogImage = extractOgImage(rawTemplate);
  const template = stripTemplateHead(rawTemplate);

  if (!/<\/head>/i.test(template)) {
    console.warn("[prerender] geen </head> in template, overgeslagen.");
    return;
  }

  const render = (input: HeadInput) =>
    template.replace(/<\/head>/i, `${buildHead({ ...input, ogImage })}\n  </head>`);

  let written = 0;
  let degraded = 0;

  // Vaste routes
  for (const path of STATIC_ROUTES) {
    const seo = getRouteSeo(path) ?? DEFAULT_SEO;
    const schemas: unknown[] = [];
    if (path === "/") schemas.push(organizationSchema());
    schemas.push(
      breadcrumbSchema(
        path === "/"
          ? [{ name: "Home", path: "/" }]
          : [
              { name: "Home", path: "/" },
              { name: seo.title.split(",")[0].split("|")[0].trim(), path },
            ],
      ),
    );
    writeRoute(path, render({ path, seo, schemas, ogType: "website" }));
    written++;
  }

  // Productroutes (parallel, faalveilig per route)
  await Promise.all(
    ENABLED_PRODUCT_HANDLES.map(async (handle) => {
      const path = `/product/${handle}`;
      const seo = getProductSeo(handle) ?? DEFAULT_SEO;
      const schemas: unknown[] = [];

      try {
        const product = await fetchProduct(handle);
        if (!product) throw new Error("product niet gevonden in Shopify");
        schemas.push(productSchema(product, { path, description: seo.description }));
        schemas.push(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Producten", path: "/producten" },
            { name: product.node.title, path },
          ]),
        );
      } catch (error) {
        degraded++;
        console.warn(
          `[prerender] ${path}: Shopify-data niet beschikbaar (${
            error instanceof Error ? error.message : String(error)
          }), fallback naar client-render voor JSON-LD.`,
        );
        schemas.push(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Producten", path: "/producten" },
            { name: seo.title.split(",")[0].split("|")[0].trim(), path },
          ]),
        );
      }

      writeRoute(path, render({ path, seo, schemas, ogType: "product" }));
      written++;
    }),
  );

  console.log(
    `[prerender] ${written} routes geschreven${degraded ? `, ${degraded} zonder Shopify-data` : ""}.`,
  );
}

main().catch((error) => {
  // Nooit de build breken.
  console.warn("[prerender] overgeslagen door fout:", error);
});
