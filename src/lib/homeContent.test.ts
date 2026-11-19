import { describe, expect, it } from "vitest";
import { HOME_TILES, homeTileImage } from "./homeContent";

describe("homepage-productkaarten", () => {
  it("kiest voor alle vijf kaarten de bestaande foto met de passende alt-tekst", () => {
    for (const tile of HOME_TILES) {
      const fallback = { altText: "Een andere Shopify-foto" };
      const matching = { altText: tile.imageAlt };
      expect(homeTileImage(tile, [fallback, matching], fallback)).toBe(matching);
    }
  });

  it("laat de huidige foto staan als de passende alt-tekst ontbreekt", () => {
    const fallback = { altText: "Huidige foto" };
    expect(homeTileImage(HOME_TILES[0], [{ altText: "Alleen een trapfoto" }], fallback)).toBe(fallback);
  });
});
