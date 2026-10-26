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
import { getProductContent } from "../src/lib/productContent";
import { USE_CASES, USE_CASE_HEADING, PRODUCT_KITS, KITS_HEADING } from "../src/lib/angles";
import { purchaseFaqs, SHIPPING_RETURNS } from "../src/lib/productFaqs";
import { HOME_HERO, HOME_TILES, HOME_TILES_HEADING, HOME_TILES_SUBTITLE, HOME_PILLARS, HOME_PILLARS_HEADING, HOME_STORY, HOME_FAQS } from "../src/lib/homeContent";
import en from "../src/i18n/en.json";
import fr from "../src/i18n/fr.json";

type Locale = "nl" | "en" | "fr";
const DICTS: Record<Exclude<Locale, "nl">, Record<string, string>> = { en, fr };
const localeOf = (path: string): Locale =>
  path === "/en" || path.startsWith("/en/") ? "en" : path === "/fr" || path.startsWith("/fr/") ? "fr" : "nl";
const translate = (locale: Locale, text: string) => (locale === "nl" ? text : DICTS[locale][text] ?? text);
const localizeSeo = (locale: Locale, seo: SeoEntry): SeoEntry => ({
  ...seo,
  title: translate(locale, seo.title),
  description: translate(locale, seo.description),
});

const DIST = resolve("dist");
const TEMPLATE_PATH = resolve(DIST, "index.html");

const BASE_STATIC_ROUTES = [
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
  "/volg-je-bestelling",
  "/quiz",
  "/stel-je-bundel-samen",
];
const STATIC_ROUTES = BASE_STATIC_ROUTES.flatMap((path) => [path, `/en${path === "/" ? "/" : path}`, `/fr${path === "/" ? "/" : path}`]);

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
  const cleanPath = path.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<link rel="alternate" hreflang="nl" href="${SITE_URL}${cleanPath}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL}/en${cleanPath}" />`,
    `<link rel="alternate" hreflang="fr" href="${SITE_URL}/fr${cleanPath}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${cleanPath}" />`,
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
    .replace(/[ \t]*<meta\s+property=["']og:(?:type|url|title|description|site_name|image)["'][^>]*>\s*\n?/gi, "")
    .replace(/[ \t]*<meta\s+name=["']twitter:(?:card|title|description|image)["'][^>]*>\s*\n?/gi, "")
    .replace(
      /[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\s*\n?/gi,
      "",
    );
}

function extractOgImage(html: string): string | undefined {
  const m = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  return m?.[1];
}

/**
 * Statische catalogus-markup in de SPA-root. React vervangt deze inhoud bij
 * hydratie; crawlers en HTML-only checks zien wel de echte producten.
 */
function catalogFallback(products: ShopifyProduct[]): string {
  if (!products.length) return "";
  const items = products
    .map((p) => {
      const n = p.node;
      const img = n.images?.edges?.[0]?.node;
      const price = n.priceRange?.minVariantPrice;
      return [
        `<li>`,
        img?.url
          ? `<img src="${escapeAttr(img.url)}" alt="${escapeAttr(img.altText || n.title)}" width="600" height="600" />`
          : "",
        `<a href="${escapeAttr(`${SITE_URL}/product/${n.handle}`)}"><h2>${escapeHtml(n.title)}</h2></a>`,
        price
          ? `<p>Vanaf &euro;${escapeHtml(parseFloat(price.amount).toFixed(2))} ${escapeHtml(price.currencyCode)}</p>`
          : "",
        `</li>`,
      ].join("");
    })
    .join("");
  // Visueel verborgen (blijft leesbaar voor crawlers) zodat bezoekers bij een
  // refresh geen flits van productafbeeldingen zien voor React hydrateert.
  const hidden =
    "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0";
  return `<section id="prerendered-catalog" style="${hidden}"><h1>SenseGlow collectie</h1><ul>${items}</ul></section>`;
}

function catalogSchema(products: ShopifyProduct[], path: string): unknown {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SenseGlow collectie",
    url: `${SITE_URL}${path}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/product/${p.node.handle}`,
      name: p.node.title,
    })),
  };
}

/**
 * Leesbare productinhoud in de server-HTML. Zichtbaar zonder JavaScript;
 * met JavaScript verbergt een klasse op <html> hem tot React de pagina toont.
 */
function productFallback(handle: string, product: ShopifyProduct | null, locale: Locale): string {
  const t = (x: string) => escapeHtml(translate(locale, x));
  const content = getProductContent(handle);
  const title = content?.hero.h1 ?? product?.node.title ?? "";
  const parts: string[] = [`<article id="prerendered-product" style="max-width:48rem;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.5">`];
  parts.push(`<h1>${t(title)}</h1>`);
  if (content?.hero.subtitle) parts.push(`<p>${t(content.hero.subtitle)}</p>`);
  const price = product?.node.priceRange?.minVariantPrice;
  if (price) parts.push(`<p>${locale === "nl" ? "Vanaf" : locale === "fr" ? "Dès" : "From"} &euro;${escapeHtml(locale === "en" ? parseFloat(price.amount).toFixed(2) : parseFloat(price.amount).toFixed(2).replace(".", ","))}</p>`);
  if (content?.hero.bullets?.length) parts.push(`<ul>${content.hero.bullets.map((b) => `<li>${t(b)}</li>`).join("")}</ul>`);
  if (product?.node.description) parts.push(`<p${locale === "nl" ? "" : ' lang="nl"'}>${t(product.node.description)}</p>`);
  const kits = PRODUCT_KITS[handle];
  if (kits?.length) parts.push(`<h2>${t(KITS_HEADING)}</h2><ul>${kits.map((k) => `<li>${t(k.label)}</li>`).join("")}</ul>`);
  const uses = USE_CASES[handle];
  if (uses?.length) parts.push(`<h2>${t(USE_CASE_HEADING)}</h2><ul>${uses.map((u) => `<li>${t(u)}</li>`).join("")}</ul>`);
  parts.push(`<h2>${t("Verzending en retour")}</h2><ul>${SHIPPING_RETURNS.map((x) => `<li>${t(x)}</li>`).join("")}</ul>`);
  parts.push(`<h2>${t("Veelgestelde vragen")}</h2>${purchaseFaqs.map((f) => `<h3>${t(f.question)}</h3><p>${t(f.answer)}</p>`).join("")}`);
  parts.push(`</article>`);
  return parts.join("");
}

/** Leesbare homepage-tekst in de server-HTML, zichtbaar zonder JavaScript. */
function homeFallback(locale: Locale): string {
  const t = (x: string) => escapeHtml(translate(locale, x));
  const prefix = locale === "nl" ? "" : `/${locale}`;
  const p: string[] = [`<article id="prerendered-home" style="max-width:48rem;margin:0 auto;padding:24px;font-family:system-ui,sans-serif;line-height:1.5">`];
  p.push(`<p>${t(HOME_HERO.eyebrow)}</p><h1>${t(HOME_HERO.h1)}</h1><p>${t(HOME_HERO.subtitle)}</p>`);
  p.push(`<h2>${t(HOME_TILES_HEADING)}</h2><p>${t(HOME_TILES_SUBTITLE)}</p><ul>${HOME_TILES.map((x) => `<li><a href="${escapeAttr(`${SITE_URL}${prefix}${x.href}`)}"><h3>${t(x.title)}</h3></a><p>${t(x.body)}</p></li>`).join("")}</ul>`);
  p.push(`<h2>${t(HOME_PILLARS_HEADING)}</h2><ul>${HOME_PILLARS.map((x) => `<li><h3>${t(x.title)}</h3><p>${t(x.body)}</p></li>`).join("")}</ul>`);
  p.push(`<h2>${t(HOME_STORY.heading)}</h2>${HOME_STORY.paragraphs.map((x) => `<p>${t(x)}</p>`).join("")}`);
  p.push(`<h2>${t("Veelgestelde vragen")}</h2>${HOME_FAQS.map((f) => `<h3>${t(f.question)}</h3><p>${t(f.answer)}</p>`).join("")}`);
  p.push(`</article>`);
  return p.join("");
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

  const render = (input: HeadInput) => {
    const locale = localeOf(input.path);
    return template
      .replace(/<html([^>]*)\blang="[^"]*"/i, `<html$1lang="${locale}"`)
      .replace(
        /<\/head>/i,
        `${buildHead({ ogImage, ...input, seo: localizeSeo(locale, input.seo) })}\n  </head>`,
      );
  };

  let written = 0;
  let degraded = 0;

  // Catalogus eenmalig ophalen voor home en /producten.
  const catalogProducts: ShopifyProduct[] = [];
  const fetched = await Promise.all(
    ENABLED_PRODUCT_HANDLES.map(async (handle) => {
      try {
        return await fetchProduct(handle);
      } catch {
        return null;
      }
    }),
  );
  for (const p of fetched) if (p) catalogProducts.push(p);
  if (catalogProducts.length !== ENABLED_PRODUCT_HANDLES.length) {
    console.warn(
      `[prerender] catalogus onvolledig: ${catalogProducts.length}/${ENABLED_PRODUCT_HANDLES.length} producten opgehaald.`,
    );
  }
  const catalogMarkup = catalogFallback(catalogProducts);

  // Vaste routes
  for (const path of STATIC_ROUTES) {
    const cleanPath = path.replace(/^\/(en|fr)(?=\/|$)/, "") || "/";
    const seo = getRouteSeo(cleanPath) ?? DEFAULT_SEO;
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
    const withCatalog = cleanPath === "/" || cleanPath === "/producten";
    if (withCatalog && catalogProducts.length) schemas.push(catalogSchema(catalogProducts, path));
    let html = render({ path, seo, schemas, ogType: "website" });
    if (withCatalog && catalogMarkup) {
      html = html.replace(/(<div id="root">)/i, `$1${catalogMarkup}`);
    }
    if (cleanPath === "/") {
      html = html
        .replace(
          /<\/head>/i,
          `    <style>.js-on #prerendered-home{display:none}</style><script>document.documentElement.classList.add("js-on")</script>\n  </head>`,
        )
        .replace(/(<div id="root">)/i, `$1${homeFallback(localeOf(path))}`);
    }
    writeRoute(path, html);
    written++;
  }

  // Productroutes (parallel, faalveilig per route)
  await Promise.all(
    ENABLED_PRODUCT_HANDLES.flatMap((handle) => ["nl", "en", "fr"].map(async (locale) => {
      const path = `${locale === "nl" ? "" : `/${locale}`}/product/${handle}`;
      const seo = getProductSeo(handle) ?? DEFAULT_SEO;
      const schemas: unknown[] = [];
      let productImage: string | undefined;
      let fetchedProduct: ShopifyProduct | null = null;

      try {
        const product = await fetchProduct(handle);
        if (!product) throw new Error("product niet gevonden in Shopify");
        fetchedProduct = product;
        schemas.push(productSchema(product, { path, description: seo.description }));
        const firstImage = product.node.images?.edges?.[0]?.node?.url;
        if (firstImage) {
          productImage = firstImage.includes("?")
            ? `${firstImage}&width=1200&height=630&crop=center`
            : `${firstImage}?width=1200&height=630&crop=center`;
        }
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

      const html = render({ path, seo, schemas, ogType: "product", ogImage: productImage ?? ogImage })
        .replace(
          /<\/head>/i,
          `    <style>.js-on #prerendered-product{display:none}</style><script>document.documentElement.classList.add("js-on")</script>\n  </head>`,
        )
        .replace(/(<div id="root">)/i, `$1${productFallback(handle, fetchedProduct, locale as Locale)}`);
      writeRoute(path, html);
      written++;
    })),
  );

  console.log(
    `[prerender] ${written} routes geschreven${degraded ? `, ${degraded} zonder Shopify-data` : ""}.`,
  );
}

main().catch((error) => {
  // Nooit de build breken.
  console.warn("[prerender] overgeslagen door fout:", error);
});
