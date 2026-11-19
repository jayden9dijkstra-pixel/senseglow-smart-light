import { describe, it, expect } from "vitest";
import { getLandingPage, LANDING_PATHS } from "./landingPages";
import { PRODUCT_HANDLE, FLEX_PRODUCT_HANDLE, STEP_PRODUCT_HANDLE, LANTERN_PRODUCT_HANDLE } from "./productConfig";
import { offerImage } from "./landingPages";

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

  it("/trapverlichting: tredenvraag kiest alleen bestaande sets en volgt de FAQ-regel", () => {
    const o = getLandingPage("/trapverlichting")!.offers[0];
    expect(o.stepQuestion).toBe("Hoeveel treden heeft je trap?");
    expect(o.stepChoices).toEqual([
      { label: "Tot 12 treden", optionValue: "4-delige set" },
      { label: "13 of meer treden", optionValue: "8-delige set" },
    ]);
    for (const c of o.stepChoices!) expect(o.choices).toContain(c.optionValue);
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
  it("/gangverlichting selecteert standaard één Ambient-lamp van 30 cm", () => {
    expect(getLandingPage("/gangverlichting")?.offers[0]).toMatchObject({ handle: PRODUCT_HANDLE, qty: 1, sizeCm: 30 });
  });
});

describe("trap-advertentiepagina's", () => {
  it.each(["/trap-in-het-donker", "/trap-zonder-klussen"])("%s bestaat, is noindex en heeft exact hetzelfde aanbod", (path) => {
    const page = getLandingPage(path);
    const original = getLandingPage("/trapverlichting");
    expect(page).not.toBeNull();
    expect(LANDING_PATHS).toContain(path);
    expect(page?.noindex).toBe(true);
    expect(page?.offers).toHaveLength(1);

    const { id: _id, scene: _scene, ...offer } = page!.offers[0];
    const { id: _originalId, scene: _originalScene, ...originalOffer } = original!.offers[0];
    expect(offer).toEqual(originalOffer);
  });

  it("/trap-in-het-donker gebruikt de bestaande avondscène", () => {
    const offer = getLandingPage("/trap-in-het-donker")!.offers[0];
    const images = [
      { url: "dag", altText: "SenseGlow Wall Lamp zwart langs de trap" },
      { url: "avond", altText: "SenseGlow Wall Lamp zwart langs de trap, avondsfeer" },
    ];
    expect(offerImage(offer, images)?.url).toBe("avond");
  });
});
