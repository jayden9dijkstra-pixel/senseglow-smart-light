import { describe, it, expect } from "vitest";
import { decodeConsent, encodeConsent, googleConsentSignals } from "./consent";

describe("cookiekeuze", () => {
  it("alleen noodzakelijk zet alle vier de Google-signalen op denied", () => {
    expect(googleConsentSignals({ analytics: false, marketing: false })).toEqual({
      ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied",
    });
  });
  it("marketing stuurt ad_storage, ad_user_data en ad_personalization; statistiek alleen analytics_storage", () => {
    expect(googleConsentSignals({ analytics: false, marketing: true })).toEqual({
      ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "denied",
    });
    expect(googleConsentSignals({ analytics: true, marketing: false }).ad_user_data).toBe("denied");
  });
  it("bewaarde keuze blijft hetzelfde na opslaan en teruglezen", () => {
    const c = { analytics: true, marketing: false };
    expect(decodeConsent(encodeConsent(c))).toEqual(c);
    expect(decodeConsent("necessary")).toEqual({ analytics: false, marketing: false });
    expect(decodeConsent("rommel")).toBeNull();
  });
});
