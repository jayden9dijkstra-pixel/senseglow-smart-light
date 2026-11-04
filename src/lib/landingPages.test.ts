import { describe, it, expect } from "vitest";
import { getLandingPage } from "./landingPages";
import { PRODUCT_HANDLE, FLEX_PRODUCT_HANDLE, STEP_PRODUCT_HANDLE, LANTERN_PRODUCT_HANDLE } from "./productConfig";
import { offerImage } from "./landingPages";
import { sceneAlt, withSceneFirst } from "./scenes";

describe("nieuwe landingspagina's", () => {
  it("/kastverlichting: Ambient 30 cm, 2 lampen", () => {
    const o = getLandingPage("/kastverlichting")!.offers;
    expect(o).toHaveLength(1);
    expect(o[0]).toMatchObject({ handle: PRODUCT_HANDLE, sizeCm: 30, qty: 2 });
  });
  it("/oplaadbare-wandlamp: Flex, 1 lamp", () => {
    const o = getLandingPage("/oplaadbare-wandlamp")!.offers;
    expect(o).toHaveLength(1);
    expect(o[0]).toMatchObject({ handle: FLEX_PRODUCT_HANDLE, qty: 1 });
  });
  it("/oplaadbare-wandlamp noemt nergens 'sensor'", () => {
    const json = JSON.stringify(getLandingPage("/oplaadbare-wandlamp"));
    expect(json.toLowerCase()).not.toContain("sensor");
  });

  it("/trapverlichting: Wall Lamp, standaard 4-delige set, keuze 4- of 8-set", () => {
    const o = getLandingPage("/trapverlichting")!.offers;
    expect(o).toHaveLength(1);
    expect(o[0]).toMatchObject({ handle: STEP_PRODUCT_HANDLE, optionValue: "4-delige set", choices: ["4-delige set", "8-delige set"] });
  });
  it("/keukenverlichting bestaat met Ambient Motion Bar", () => {
    expect(getLandingPage("/keukenverlichting")!.offers[0].handle).toBe(PRODUCT_HANDLE);
  });
  it("eerste foto per pagina volgt de afgesproken alt-tekst", () => {
    const want: Record<string, string> = {
      "/trapverlichting": "SenseGlow Wall Lamp zwart langs de trap",
      "/gangverlichting": "SenseGlow Ambient Motion Bar zwart in de gang, licht op de vloer",
      "/verlichting-vakantiewoning": "SenseGlow Ambient Motion Bar zwart in de gang, licht op de vloer",
      "/kastverlichting": "SenseGlow Ambient Motion Bar zilver in de kledingkast",
      "/keukenverlichting": "SenseGlow Ambient Motion Bar zilver onder keukenkastje",
      "/solar-buitenlamp": "SenseGlow Solar Lantern zwart brandt bij schemering",
    };
    for (const [path, alt] of Object.entries(want)) {
      const offer = getLandingPage(path)!.offers[0];
      const images = [{ url: "bed", altText: "bed" }, { url: "scene", altText: alt }];
      expect(offerImage(offer, images)?.url, path).toBe("scene");
    }
  });
  it("foto niet gevonden: huidige eerste foto blijft", () => {
    const offer = getLandingPage("/gangverlichting")!.offers[0];
    expect(offerImage(offer, [{ url: "a", altText: "x" }])?.url).toBe("a");
  });
  it("?scene= zet de scènefoto vooraan op de productpagina", () => {
    const imgs = [{ altText: "bed" }, { altText: "SenseGlow Solar Lantern zwart brandt bij schemering" }];
    expect(withSceneFirst(imgs, sceneAlt("buiten", LANTERN_PRODUCT_HANDLE))[0].altText).toContain("schemering");
    expect(withSceneFirst(imgs, sceneAlt("onbekend", LANTERN_PRODUCT_HANDLE))[0].altText).toBe("bed");
  });
});
