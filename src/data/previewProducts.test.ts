import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PREVIEW_PRODUCTS, getPreviewProduct } from "./previewProducts";

describe("verborgen voorbeeldpagina's", () => {
  it("vindt alleen bekende slugs", () => {
    expect(getPreviewProduct("tafellamp-510502f6")?.variant).toContain("Zwart");
    expect(getPreviewProduct("sunrise-5d837b08")?.specs.length).toBeGreaterThan(5);
    expect(getPreviewProduct("antislipstrips-3ed7bd13")?.images).toHaveLength(5);
    expect(getPreviewProduct("tafellamp")).toBeUndefined();
    expect(getPreviewProduct(undefined)).toBeUndefined();
  });

  it("heeft voor elk beeld een bestand in public/ of een eigen Shopify-bestand", () => {
    for (const p of PREVIEW_PRODUCTS)
      for (const img of p.images) {
        if (img.src.startsWith("https://")) expect(img.src.startsWith("https://cdn.shopify.com/s/files/1/0964/9497/7322/")).toBe(true);
        else expect(existsSync(join("public", img.src))).toBe(true);
      }
  });

  it("staat niet in de sitemap en is uitgesloten in robots.txt", () => {
    expect(readFileSync("public/sitemap.xml", "utf8")).not.toContain("/voorbeeld/");
    expect(readFileSync("public/robots.txt", "utf8")).toContain("Disallow: /voorbeeld/");
  });
});
