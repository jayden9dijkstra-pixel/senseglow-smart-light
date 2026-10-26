import { describe, it, expect } from "vitest";
import { addWorkdays, deliveryWindow } from "./delivery";

const ymd = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

describe("delivery window", () => {
  it("is today + 7 to 14 workdays, skipping weekends", () => {
    // maandag 26 oktober 2026
    const w = deliveryWindow(new Date(2026, 9, 26));
    expect(ymd(w.from)).toBe("2026-11-4");
    expect(ymd(w.to)).toBe("2026-11-13");
  });

  it("an order on Saturday starts counting on Monday", () => {
    expect(ymd(addWorkdays(new Date(2026, 9, 24), 1))).toBe("2026-10-26");
  });
});

import { BUSINESS_INFO, isBusinessInfoComplete } from "./businessInfo";
describe("footer business details", () => {
  it("stay hidden while any field is a placeholder", () => {
    expect(isBusinessInfoComplete()).toBe(false);
    expect(isBusinessInfoComplete({ ...BUSINESS_INFO, companyName: "X", legalForm: "X", kvk: "1", vat: "NL1", address: "A" })).toBe(true);
  });
});
