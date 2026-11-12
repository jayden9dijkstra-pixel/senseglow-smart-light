import { describe, expect, it } from "vitest";
import { RETURN_DAYS } from "./purchaseTrust";
import { parseVariantLabel } from "./productRegistry";

describe("Jay's purchase rules", () => {
  it("retains the 30-day return window", () => {
    expect(RETURN_DAYS).toBe(30);
  });
  it("labels a four-piece Wall Lamp variant as a set, not one lamp", () => {
    expect(parseVariantLabel("sconce", [{ name: "Set", value: "4-delige set" }, { name: "Kleur", value: "Zwart" }]).setSize).toBe("4-delige set");
  });
  it("labels the eight-piece Wall Lamp variant as its selected set size", () => {
    expect(parseVariantLabel("sconce", [{ name: "Set", value: "8-delige set" }, { name: "Kleur", value: "Wit" }]).setSize).toBe("8-delige set");
  });
});