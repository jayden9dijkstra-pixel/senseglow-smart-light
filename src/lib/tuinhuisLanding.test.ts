import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getLandingPage, LANDING_PATHS } from "./landingPages";
import { LANTERN_PRODUCT_HANDLE, PRODUCT_HANDLE, STEP_PRODUCT_HANDLE } from "./productConfig";

describe("/tuinhuis-verlichting", () => {
  it("bestaat als indexeerbare pagina met de afgesproken aanbiedingen en een sitemapvermelding", () => {
    const page = getLandingPage("/tuinhuis-verlichting");

    expect(LANDING_PATHS).toContain("/tuinhuis-verlichting");
    expect(page).toMatchObject({
      path: "/tuinhuis-verlichting",
      title: "Tuinhuis- en schuurverlichting zonder stroom | SenseGlow",
      h1: "Licht in je tuinhuis of schuur, zonder stroom",
      trackOffers: true,
    });
    expect(page?.noindex).toBeUndefined();
    expect(page?.offers).toHaveLength(3);
    expect(page?.offers[0]).toMatchObject({
      handle: LANTERN_PRODUCT_HANDLE,
      note: "Hang hem op een plek waar overdag daglicht komt.",
    });
    expect(page?.offers[1]).toMatchObject({ handle: PRODUCT_HANDLE, sizeCm: 30, qty: 1 });
    expect(page?.offers[2]).toMatchObject({ handle: STEP_PRODUCT_HANDLE, optionValue: "4-delige set" });
    expect(readFileSync("public/sitemap.xml", "utf8")).toContain(
      "https://www.senseglow.shop/tuinhuis-verlichting",
    );
  });
});
