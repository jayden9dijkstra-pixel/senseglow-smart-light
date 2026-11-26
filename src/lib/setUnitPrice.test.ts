import { describe, expect, it } from "vitest";
import { setUnitPrice } from "./setUnitPrice";

describe("gekozen Shopify-setprijs per lamp", () => {
  it("deelt de prijs door de gekozen 4 of 8 lampen, afgerond op centen", () => {
    expect(setUnitPrice(39.95, 4)).toBe(9.99);
    expect(setUnitPrice(64.95, 8)).toBe(8.12);
  });
  it("volgt de actuele prijs, ook wanneer een tijdelijke prijs eindigt", () => {
    expect(setUnitPrice(31.96, 4)).toBe(7.99);
    expect(setUnitPrice(39.95, 4)).toBe(9.99);
  });
  it("toont geen bedrag zonder geldige setprijs of aantal", () => {
    expect(setUnitPrice(null, 4)).toBeNull();
    expect(setUnitPrice(39.95, 0)).toBeNull();
  });
});