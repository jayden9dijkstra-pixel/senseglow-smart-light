import { describe, expect, it } from "vitest";
import { RETURN_DAYS, SUPPORT_TRUST } from "./purchaseTrust";
import { parseVariantLabel } from "./productRegistry";

describe("Jay's purchase rules", () => {
  it("retains the 30-day return window", () => {
    expect(RETURN_DAYS).toBe(30);
  });
  it("shows the support-first trust line under the buy button", () => {
    expect(SUPPORT_TRUST).toBe(
      "Vragen? Je krijgt snel persoonlijk antwoord van ons, binnen 24 uur op werkdagen. Niet goed? Geld terug binnen 30 dagen."
    );
  });
  it("never mentions being a new brand", () => {
    expect(SUPPORT_TRUST).not.toMatch(/nieuw merk/i);
  });
  it("labels a four-piece Wall Lamp variant as a set, not one lamp", () => {
    expect(parseVariantLabel("sconce", [{ name: "Set", value: "4-delige set" }, { name: "Kleur", value: "Zwart" }]).setSize).toBe("4-delige set");
  });
  it("labels the eight-piece Wall Lamp variant as its selected set size", () => {
    expect(parseVariantLabel("sconce", [{ name: "Set", value: "8-delige set" }, { name: "Kleur", value: "Wit" }]).setSize).toBe("8-delige set");
  });
});