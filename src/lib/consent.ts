/**
 * Cookiekeuze van de bezoeker. Opgeslagen als `sg_consent` in localStorage
 * en als cookie op .senseglow.shop (12 maanden), zodat de checkout hem ook ziet.
 * Waarden: "all" | "necessary" | "custom:a<0|1>m<0|1>".
 */
export const CONSENT_KEY = "sg_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 12 maanden
export const OPEN_CONSENT_EVENT = "sg:open-cookie-settings";

export type ConsentChoice = { analytics: boolean; marketing: boolean };

export function encodeConsent(c: ConsentChoice): string {
  if (c.analytics && c.marketing) return "all";
  if (!c.analytics && !c.marketing) return "necessary";
  return `custom:a${c.analytics ? 1 : 0}m${c.marketing ? 1 : 0}`;
}

export function decodeConsent(v: string | null | undefined): ConsentChoice | null {
  if (v === "all") return { analytics: true, marketing: true };
  if (v === "necessary") return { analytics: false, marketing: false };
  const m = v?.match(/^custom:a([01])m([01])$/);
  return m ? { analytics: m[1] === "1", marketing: m[2] === "1" } : null;
}

export function readStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const local = decodeConsent(window.localStorage.getItem(CONSENT_KEY));
    if (local) return local;
  } catch {
    // val terug op de cookie
  }
  const raw = document.cookie.match(/(?:^|;\s*)sg_consent=([^;]+)/)?.[1];
  return decodeConsent(raw ? decodeURIComponent(raw) : null);
}

export function storeConsent(c: ConsentChoice) {
  const v = encodeConsent(c);
  try {
    window.localStorage.setItem(CONSENT_KEY, v);
  } catch {
    // niet kritiek
  }
  try {
    const domain = window.location.hostname.endsWith("senseglow.shop") ? "; domain=.senseglow.shop" : "";
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_KEY}=${encodeURIComponent(v)}; max-age=${CONSENT_MAX_AGE}; path=/; SameSite=Lax${domain}${secure}`;
  } catch {
    // niet kritiek
  }
}

/** Google Consent Mode v2-signalen per categorie. */
export function googleConsentSignals(c: ConsentChoice) {
  const ad = c.marketing ? "granted" : "denied";
  return {
    ad_storage: ad,
    ad_user_data: ad,
    ad_personalization: ad,
    analytics_storage: c.analytics ? "granted" : "denied",
  };
}

/** Advertentietoestemming zoals die bij de order wordt vastgelegd. */
export function adConsentStatus(): "granted" | "denied" | null {
  const c = readStoredConsent();
  return c ? (c.marketing ? "granted" : "denied") : null;
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
