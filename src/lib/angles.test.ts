import { describe, it, expect } from "vitest";
import { getAngle, variantIn, ANGLES } from "./angles";

const v = (id: string, value: string) => ({ id, selectedOptions: [{ name: "Kleur en maat", value }] });
const ambient = [v("z20", "Zwart 20 cm"), v("s20", "Zilver 20 cm"), v("z30", "Zwart 30 cm"), v("s30", "Zilver 30 cm"), v("s40", "Zilver 40 cm")];

describe("angles", () => {
  it("unknown or missing ?a= gives the neutral text", () => {
    expect(getAngle("senseglow_ambient_motion_bar", "onbekend")).toBeNull();
    expect(getAngle("senseglow_ambient_motion_bar", null)).toBeNull();
    expect(getAngle("senseglow_flex", "trap")).toBeNull();
  });

  it("angles only preselect the quantity picker", () => {
    const a = ANGLES["senseglow_ambient_motion_bar"];
    expect(a.trap.preselect).toEqual({ qty: 4, sizeCm: 20 });
    expect(a.gang.preselect).toEqual({ qty: 2, sizeCm: 30 });
    expect(a.verhuur.preselect).toEqual({ qty: 4, sizeCm: 30 });
    expect(ANGLES["senseglow_solar_lantern"].buiten.preselect).toEqual({ qty: 2 });
  });

  it("preselection keeps the chosen colour but switches size", () => {
    expect(variantIn({ sizeCm: 20 }, ambient[4], ambient)?.id).toBe("s20");
    expect(variantIn({ sizeCm: 30 }, ambient[0], ambient)?.id).toBe("z30");
  });

  it("Flex never mentions a motion sensor", () => {
    const text = JSON.stringify(ANGLES["senseglow_flex"]).toLowerCase();
    expect(text).not.toMatch(/beweg|sensor|pir/);
  });
});
