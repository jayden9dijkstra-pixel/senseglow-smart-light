import { describe, it, expect } from "vitest";
import { AMBIENT_FAQS, AMBIENT_COMPARE, AMBIENT_TILES, AMBIENT_SPECS } from "./ambientPage";
import { offerRate } from "./quantityOffer";

describe("Ambient-productpagina", () => {
  it("vraagt naar batterijen en laat de daglichtvraag weg", () => {
    const qs = AMBIENT_FAQS.map((f) => f.question);
    expect(qs).toContain("Moet ik batterijen vervangen?");
    expect(qs.some((q) => /daglicht/i.test(q))).toBe(false);
  });
  it("vergelijkt op de vier gevraagde punten zonder merknamen", () => {
    expect(AMBIENT_COMPARE.rows.map((r) => r.label)).toEqual(["Oplaadbaar", "Zonder boren", "Verplaatsbaar", "Sensor"]);
    expect(AMBIENT_COMPARE.columns.slice(1)).toEqual(["Lamp met batterijen", "Lamp met snoer of elektricien"]);
  });
  it("gebruikt alleen Shopify-feiten voor sensor en lengtes", () => {
    expect(AMBIENT_TILES).toEqual(["USB-C", "120° sensor", "3 standen", "30 dagen retour"]);
    expect(Object.fromEntries(AMBIENT_SPECS).Sensor).toBe("Tot 5 meter, 120°");
  });
  it("bundelkaartjes volgen de bestaande staffel: 1 stuk 0%, 2 stuks 10%, 4 stuks 15%", () => {
    const d = new Date("2026-10-01T12:00:00Z");
    expect([1, 2, 4].map((q) => offerRate(q, d))).toEqual([0, 0.1, 0.15]);
  });
});
