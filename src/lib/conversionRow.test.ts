import { describe, it, expect } from "vitest";
import { amsterdamIso, buildRow, rowsToWrite, type OrderForExport } from "../../supabase/functions/_shared/conversion-row";

const base: OrderForExport = {
  order_number: "#1008", ordered_at: "2026-10-25T13:30:00Z", subtotal: 34.95,
  financial_status: "paid", gclid: "abc", ad_consent: "granted", is_test: false, is_draft: false,
};

describe("Google Ads importrij", () => {
  it("tijd in Amsterdam wintertijd", () => expect(amsterdamIso("2026-10-25T13:30:00Z")).toBe("2026-10-25T14:30:00+01:00"));
  it("tijd in Amsterdam zomertijd", () => expect(amsterdamIso("2026-07-01T12:00:00Z")).toBe("2026-07-01T14:00:00+02:00"));
  it("kolommen in juiste volgorde met punt als decimaal", () =>
    expect(buildRow(base)).toEqual(["abc", "Aankoop - server", "2026-10-25T14:30:00+01:00", "34.95", "EUR", "1008", "WEB"]));
  it("slaat test-, draft-, onbetaalde en gclid-loze orders over", () => {
    expect(rowsToWrite([{ ...base, is_test: true }], new Set())).toHaveLength(0);
    expect(rowsToWrite([{ ...base, is_draft: true }], new Set())).toHaveLength(0);
    expect(rowsToWrite([{ ...base, financial_status: "pending" }], new Set())).toHaveLength(0);
    expect(rowsToWrite([{ ...base, gclid: null }], new Set())).toHaveLength(0);
  });
  it("slaat orders zonder advertentietoestemming over", () =>
    expect(rowsToWrite([{ ...base, ad_consent: null }], new Set())).toHaveLength(0));
  it("schrijft elke order maar één keer", () => {
    expect(rowsToWrite([base, base], new Set())).toHaveLength(1);
    expect(rowsToWrite([base], new Set(["1008"]))).toHaveLength(0);
  });
});
