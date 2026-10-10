import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, findCost, importLevy, isCountedOrder, maskClickId, orderEconomics, vatSplit } from "./dashboardMetrics";

const tiers = DEFAULT_SETTINGS.levy_tiers;
const costs = [
  { variant_key: "wave-30", product: "Wave", variant: "30 cm", match_pattern: "wave.*30\\s?cm", cost_excl_vat: 7.65 },
  { variant_key: "wall-8", product: "Wall", variant: "8", match_pattern: "(wall\\s?lamp|applique).*\\b8\\b", cost_excl_vat: 19 },
  { variant_key: "wall-4", product: "Wall", variant: "4", match_pattern: "(wall\\s?lamp|applique)", cost_excl_vat: 9.5 },
];

describe("importheffing staffel (Nova)", () => {
  it("onder 15 euro inkoop: 3,00", () => expect(importLevy(14.99, tiers)).toBe(3));
  it("15 tot 24,99: 2,50", () => expect(importLevy(15, tiers)).toBe(2.5));
  it("25 tot 49,99: 1,50", () => expect(importLevy(49.99, tiers)).toBe(1.5));
  it("vanaf 50: 0", () => expect(importLevy(50, tiers)).toBe(0));
});

describe("btw 21%", () => {
  it("splitst 24,20 in 20,00 + 4,20", () => {
    const v = vatSplit(24.2);
    expect(v.excl).toBeCloseTo(20, 6);
    expect(v.vat).toBeCloseTo(4.2, 6);
  });
});

describe("dekkingsbijdrage", () => {
  it("1x Wave 30 cm voor 24,95: excl x 0,905 - 7,65 - 3,00", () => {
    const e = orderEconomics(
      { order_number: "#1", ordered_at: "", total: 24.95, financial_status: "paid", gclid: null, utm_source: null, utm_medium: null, utm_campaign: null, country_code: null,
        line_items: [{ title: "SenseGlow Wave", variant_title: "Zwart 30 cm", quantity: 1, price: 24.95 }] },
      costs, DEFAULT_SETTINGS);
    expect(e.contribution).toBeCloseTo((24.95 / 1.21) * 0.905 - 7.65 - 3, 6);
  });
  it("ontbrekende inkoop geeft null, geen schatting", () => {
    const e = orderEconomics(
      { order_number: "#2", ordered_at: "", total: 10, financial_status: "paid", gclid: null, utm_source: null, utm_medium: null, utm_campaign: null, country_code: null,
        line_items: [{ title: "Onbekend", variant_title: null, quantity: 1, price: 10 }] },
      costs, DEFAULT_SETTINGS);
    expect(e.contribution).toBeNull();
    expect(e.missingCost).toHaveLength(1);
  });
  it("Wall Lamp 8-delig matcht de 8-set, niet de 4-set", () => {
    expect(findCost(costs, "SenseGlow Wall Lamp", "8-delige set / Wit")?.variant_key).toBe("wall-8");
    expect(findCost(costs, "SenseGlow Wall Lamp", "4-delige set / Wit")?.variant_key).toBe("wall-4");
  });
});

describe("overig", () => {
  it("testbestellingen en terugbetaalde tellen niet mee", () => {
    expect(isCountedOrder({ order_number: "#1004", financial_status: "paid" })).toBe(false);
    expect(isCountedOrder({ order_number: "#1005", financial_status: "refunded" })).toBe(false);
    expect(isCountedOrder({ order_number: "#1005", financial_status: "paid" })).toBe(true);
  });
  it("klik-id gemaskeerd tot eerste en laatste 4", () => expect(maskClickId("CjwKCAjwABCDxyz9")).toBe("CjwK…xyz9"));
});
