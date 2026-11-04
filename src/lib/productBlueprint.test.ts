import { describe, it, expect } from "vitest";
import { specsFromDescription, eightSetSaving, BLUEPRINT } from "./productBlueprint";
import { FLEX_PRODUCT_HANDLE } from "./productConfig";

const v = (size: string, color: string, price: string) => ({ price: { amount: price }, selectedOptions: [{ name: "Maat", value: size }, { name: "Kleur", value: color }] });
const wall = [v("4-delige set", "Zwart", "39.95"), v("8-delige set", "Zwart", "64.95")];

describe("productBlueprint", () => {
  it("8-set is €14,95 voordeliger dan 2 sets van 4", () => {
    expect(eightSetSaving(wall[1], wall)).toBe(14.95);
  });
  it("4-set toont geen voordeelregel", () => {
    expect(eightSetSaving(wall[0], wall)).toBeNull();
  });
  it("leest alleen de regels onder Specificaties", () => {
    const d = "Dit doet hij Iets Specificaties Beschikbaar in: wit en zwart Vermogen: 2W tungsten LED Materiaal: PC + ABS";
    expect(specsFromDescription(d)).toEqual([["Beschikbaar in", "wit en zwart"], ["Vermogen", "2W tungsten LED"], ["Materiaal", "PC + ABS"]]);
  });
  it("Flex noemt geen sensor en geen boorvraag", () => {
    const f = BLUEPRINT[FLEX_PRODUCT_HANDLE];
    expect(f.faqs.some((q) => q.question === "Moet ik boren?")).toBe(false);
    expect(JSON.stringify(f.benefits)).not.toMatch(/sensor/i);
  });
});
