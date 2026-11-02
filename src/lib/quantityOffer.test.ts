import { describe, it, expect } from "vitest";
import { offerRate, quoteQty, cartUpsell, isOfferProduct } from "./quantityOffer";

describe("Meer lampen-aanbod", () => {
  it("1 lamp geeft geen korting", () => expect(offerRate(1)).toBe(0));
  it("2 lampen geven 10% korting", () => expect(offerRate(2)).toBe(0.1));
  it("3 lampen geven nog steeds 10% korting", () => expect(offerRate(3)).toBe(0.1));
  it("4 of meer lampen geven 15% korting", () => {
    expect(offerRate(4)).toBe(0.15);
    expect(offerRate(7)).toBe(0.15);
  });
  it("rekent totaal en prijs per lamp uit de Shopify-prijs", () => {
    expect(quoteQty(24.95, 4)).toMatchObject({ total: 84.84, perLamp: 21.21 });
    expect(quoteQty(29.95, 2)).toMatchObject({ total: 53.92, perLamp: 26.96 });
  });
  it("Wall Lamp doet niet mee", () => {
    expect(isOfferProduct("senseglow_wall_lamp")).toBe(false);
    expect(isOfferProduct("senseglow_flex")).toBe(true);
  });
  it("toont één passende upsell", () => {
    expect(cartUpsell(1)).toBe("Voeg 1 lamp toe: 10% korting op beide");
    expect(cartUpsell(2)).toBe("Nog 2 lampen tot 15% korting");
    expect(cartUpsell(3)).toBe("Nog 1 lamp tot 15% korting");
    expect(cartUpsell(4)).toBeNull();
    expect(cartUpsell(0)).toBeNull();
  });
});
