// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { ENABLED_PRODUCT_HANDLES } from "../src/lib/productConfig";
import { LANDING_PATHS } from "../src/lib/landingPages";

const BASE_URL = "https://www.senseglow.shop";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/producten", changefreq: "weekly", priority: "0.9" },
  ...ENABLED_PRODUCT_HANDLES.map((handle) => ({
    path: `/product/${handle}`,
    changefreq: "weekly" as const,
    priority: "0.9",
  })),
  { path: "/quiz", changefreq: "monthly", priority: "0.6" },
  { path: "/verzending", changefreq: "yearly", priority: "0.5" },
  { path: "/retourneren", changefreq: "yearly", priority: "0.5" },
  { path: "/herroepingsformulier", changefreq: "yearly", priority: "0.3" },
  { path: "/bestelling-volgen", changefreq: "yearly", priority: "0.4" },
  { path: "/over", changefreq: "yearly", priority: "0.5" },
  { path: "/duurzaamheid", changefreq: "yearly", priority: "0.4" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/voorwaarden", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
];

const localizedEntries = entries.flatMap((entry) => [entry, { ...entry, path: `/en${entry.path === "/" ? "/" : entry.path}` }, { ...entry, path: `/fr${entry.path === "/" ? "/" : entry.path}` }]);

function generateSitemap(list: SitemapEntry[]) {
  const urls = list.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

// Landingspagina's bestaan alleen in het Nederlands.
const allEntries = [
  ...localizedEntries,
  ...LANDING_PATHS.map((path) => ({ path, changefreq: "weekly" as const, priority: "0.8" })),
];

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(allEntries));
console.log(`sitemap.xml written (${allEntries.length} entries)`);
