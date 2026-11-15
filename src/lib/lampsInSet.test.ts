import { describe, expect, it } from "vitest";
import { lampsInSet } from "./productBlueprint";

const v = (...values: string[]) => ({ price: { amount: "39.95" }, selectedOptions: values.map((value, i) => ({ name: `o${i}`, value })) });

describe("lampsInSet", () => {
  it("leest het aantal lampen uit een set-variant", () => {
    expect(lampsInSet(v("4-delige set", "Zwart"))).toBe(4);
    expect(lampsInSet(v("8-delige set", "Wit"))).toBe(8);
  });
  it("geeft 0 voor losse producten of geen variant", () => {
    expect(lampsInSet(v("30 cm", "Zwart"))).toBe(0);
    expect(lampsInSet(null)).toBe(0);
  });
});
