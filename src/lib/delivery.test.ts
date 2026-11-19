import { describe, it, expect } from "vitest";
import { addWorkdays, deliveryWindow, deliveryBetweenText, freeDeliveryBetweenText } from "./delivery";
import { businessLine } from "./businessInfo";

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

describe("footer business details", () => {
  it("toont KvK, btw en adres als post- en retouradres", () => {
    const line = businessLine();
    expect(line).toContain("Jayden Ecom (SenseGlow)");
    expect(line).toContain("eenmanszaak");
    expect(line).toContain("KvK 99634929");
    expect(line).toContain("btw NL005399692B39");
    expect(line).toContain("Tolheksleane 4A, 8821 MD Kimswerd (post- en retouradres, geen bezoekadres)");
  });
});

describe("bezorgdatum bij de koopknop", () => {
  it("woensdag 4 november 2026: bezorgd tussen 13 en 24 november", () => {
    expect(deliveryBetweenText(new Date(2026, 10, 4))).toBe("Bezorgd tussen 13 en 24 november");
  });
  it("noemt beide maanden als het venster over de maandgrens loopt", () => {
    expect(deliveryBetweenText(new Date(2026, 10, 13))).toBe("Bezorgd tussen 24 november en 3 december");
  });
  it("gebruikt in compacte balken en cart dezelfde concrete datumrange", () => {
    const text = freeDeliveryBetweenText(new Date(2026, 10, 13));
    expect(text).toBe("Gratis verzending · Bezorgd tussen 24 november en 3 december");
    expect(text).not.toContain("Levering in 7-14 werkdagen");
  });
});
