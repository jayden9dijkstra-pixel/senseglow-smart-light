import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PlacementGuideBonus } from "@/components/product/PlacementGuideBonus";
import { PlacementGuideContent } from "@/pages/content/PlacementGuideContent";
import { ENABLED_PRODUCT_HANDLES, STEP_PRODUCT_HANDLE } from "./productConfig";
import { hasPlacementGuideBonus, PLACEMENT_GUIDE_BONUS, PLACEMENT_GUIDE_PATH } from "./placementGuide";
import { ROUTE_SEO } from "./seoContent";

const renderBonus = (handle: string) => renderToStaticMarkup(
  createElement(PlacementGuideBonus, { productHandle: handle }),
);

describe("plaatsingsgids Wall Lamp", () => {
  it("bestaat als indexeerbare route met eigen SEO en sitemapvermelding", () => {
    expect(PLACEMENT_GUIDE_PATH).toBe("/plaatsingsgids-trap");
    expect(ROUTE_SEO[PLACEMENT_GUIDE_PATH]).toBeDefined();
    expect(readFileSync(resolve("src/App.tsx"), "utf8")).toContain("path={PLACEMENT_GUIDE_PATH}");
    expect(readFileSync(resolve("public/sitemap.xml"), "utf8")).toContain(`https://www.senseglow.shop${PLACEMENT_GUIDE_PATH}`);
    const html = renderToStaticMarkup(createElement(PlacementGuideContent));
    expect(html).toContain("Plaatsingsgids: trapverlichting in 4 stappen");
    expect((html.match(/data-guide-step=/g) ?? []).length).toBe(12);
    expect((html.match(/data-guide-lamp=/g) ?? []).length).toBe(4);
  });

  it("toont de bonusregel bij de Wall Lamp en bij geen enkel ander product", () => {
    const wall = renderBonus(STEP_PRODUCT_HANDLE);
    expect(wall).toContain(PLACEMENT_GUIDE_BONUS);
    expect(wall).toContain(`href="${PLACEMENT_GUIDE_PATH}"`);
    for (const handle of ENABLED_PRODUCT_HANDLES.filter((handle) => handle !== STEP_PRODUCT_HANDLE)) {
      expect(hasPlacementGuideBonus(handle)).toBe(false);
      expect(renderBonus(handle)).toBe("");
    }
  });
});
