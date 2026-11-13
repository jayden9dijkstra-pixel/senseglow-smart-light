import { describe, expect, it } from "vitest";
import { canPurchaseVariant } from "./purchaseAvailability";

describe("Voorraadcontrole voor beide landingskoopknoppen", () => {
  it("blokkeert een uitverkochte gekozen variant", () => {
    expect(canPurchaseVariant(true, { availableForSale: false })).toBe(false);
  });
  it("staat toevoegen van een beschikbare gekozen variant toe", () => {
    expect(canPurchaseVariant(true, { availableForSale: true })).toBe(true);
  });
  it("blokkeert zolang product of variant ontbreekt", () => {
    expect(canPurchaseVariant(false, { availableForSale: true })).toBe(false);
    expect(canPurchaseVariant(true, null)).toBe(false);
    expect(canPurchaseVariant(true, undefined)).toBe(false);
  });
});