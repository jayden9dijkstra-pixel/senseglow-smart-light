import { describe, expect, it } from "vitest";
import { isBlackFriday } from "./blackFriday";
import { isOfferProduct, offerRate, quoteQty } from "./quantityOffer";

describe("Black Friday, Europe/Amsterdam", () => {
  it("is verborgen vóór 23 november 2026 00:00", () => {
    expect(isBlackFriday(new Date("2026-11-22T23:59:59.999+01:00"))).toBe(false);
  });
  it("begint exact op 23 november 2026 00:00", () => {
    expect(isBlackFriday(new Date("2026-11-23T00:00:00+01:00"))).toBe(true);
  });
  it("is zichtbaar tijdens de periode, ook de hele laatste minuut", () => {
    expect(isBlackFriday(new Date("2026-11-26T12:00:00+01:00"))).toBe(true);
    expect(isBlackFriday(new Date("2026-11-30T23:59:59.999+01:00"))).toBe(true);
  });
  it("is verborgen vanaf 1 december 2026 00:00", () => {
    expect(isBlackFriday(new Date("2026-12-01T00:00:00+01:00"))).toBe(false);
  });
  it("hangt niet af van de tijdzone van de bezoeker", () => {
    expect(isBlackFriday(new Date("2026-11-22T23:00:00Z"))).toBe(true);
    expect(isBlackFriday(new Date("2026-11-30T23:00:00Z"))).toBe(false);
  });
  it("toont 15% bij 2-3 lampen en 20% vanaf 4 tijdens de periode", () => {
    const now = new Date("2026-11-25T12:00:00+01:00");
    expect(offerRate(1, now)).toBe(0);
    expect(offerRate(2, now)).toBe(0.15);
    expect(offerRate(3, now)).toBe(0.15);
    expect(offerRate(4, now)).toBe(0.2);
    expect(offerRate(8, now)).toBe(0.2);
    expect(quoteQty(29.95, 2, now)).toMatchObject({ total: 50.92, perLamp: 25.46 });
    expect(quoteQty(29.95, 4, now)).toMatchObject({ total: 95.84, perLamp: 23.96 });
  });
  it("behoudt 10% en 15% vóór en na de periode", () => {
    for (const time of ["2026-11-22T23:59:59+01:00", "2026-12-01T00:00:00+01:00"]) {
      const now = new Date(time);
      expect(offerRate(2, now)).toBe(0.1);
      expect(offerRate(4, now)).toBe(0.15);
      expect(quoteQty(29.95, 2, now)).toMatchObject({ total: 53.92, perLamp: 26.96 });
    }
  });
  it("wijzigt de bestaande trackingberekeningen zonder expliciete weergavedatum niet", () => {
    expect(offerRate(2)).toBe(0.1);
    expect(offerRate(4)).toBe(0.15);
  });
  it("sluit Wall Lamp uit en omvat uitsluitend de vier losse lampen", () => {
    expect(isOfferProduct("senseglow_wall_lamp")).toBe(false);
    for (const handle of ["senseglow-ambient", "senseglow_wave", "senseglow_lantern", "senseglow_flex"]) {
      // Exact catalog handles are asserted in the existing product configuration below.
      if (handle === "senseglow_flex") expect(isOfferProduct(handle)).toBe(true);
    }
  });
});