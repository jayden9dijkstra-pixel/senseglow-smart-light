import { describe, it, expect } from "vitest";
import { getAngle, kitVariant, KITS, PRODUCT_KITS, ANGLES } from "./angles";

const v = (id: string, value: string) => ({ id, selectedOptions: [{ name: "Kleur en maat", value }] });
const ambient = [v("z20", "Zwart 20 cm"), v("s20", "Zilver 20 cm"), v("z30", "Zwart 30 cm"), v("s30", "Zilver 30 cm"), v("s40", "Zilver 40 cm")];

describe("angles", () => {
  it("unknown or missing ?a= gives the neutral text", () => {
    expect(getAngle("senseglow_ambient_motion_bar", "onbekend")).toBeNull();
    expect(getAngle("senseglow_ambient_motion_bar", null)).toBeNull();
    expect(getAngle("senseglow_flex", "trap")).toBeNull();
  });

  it("kit quantities match the brief", () => {
    expect([KITS.trapkit.quantity, KITS.trapkit.sizeCm]).toEqual([4, 20]);
    expect([KITS.gangset.quantity, KITS.gangset.sizeCm]).toEqual([2, 30]);
    expect([KITS.verhuurderskit.quantity, KITS.verhuurderskit.sizeCm]).toEqual([4, 30]);
    expect(KITS.solarduo.quantity).toBe(2);
  });

  it("kit keeps the chosen colour but switches to the kit size", () => {
    expect(kitVariant(KITS.trapkit, ambient[4], ambient)?.id).toBe("s20");
    expect(kitVariant(KITS.gangset, ambient[0], ambient)?.id).toBe("z30");
  });

  it("Flex has no kit and never mentions a motion sensor", () => {
    expect(PRODUCT_KITS["senseglow_flex"]).toBeUndefined();
    const text = JSON.stringify(ANGLES["senseglow_flex"]).toLowerCase();
    expect(text).not.toMatch(/beweg|sensor|pir/);
  });
});
