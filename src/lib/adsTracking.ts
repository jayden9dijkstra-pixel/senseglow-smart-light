/**
 * Google Ads click-id capture and event helpers.
 *
 * Doel: de klik-informatie (gclid / gbraid / wbraid) vasthouden bij binnenkomst
 * en meesturen naar de Shopify checkout op checkout.senseglow.shop, zodat
 * Google de advertentieklik aan de bestelling kan koppelen.
 */

export const ADS_CONVERSION_ID = "AW-18351813640";
const ANALYTICS_MEASUREMENT_ID = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined;

const ADS_EVENT_LABELS: Partial<Record<string, string>> = {
  add_to_cart: "OR-lCMDbmvMcEIjo6a5E",
  begin_checkout: "WiOLCL3bmvMcEIjo6a5E",
};

/** Activeer GA4 via dezelfde Google-tag die al voor Ads geladen is. */
export function initializeAnalytics(): void {
  try {
    const gtag = typeof window !== "undefined" ? window.gtag : undefined;
    if (typeof gtag !== "function" || !ANALYTICS_MEASUREMENT_ID) return;
    gtag("config", ANALYTICS_MEASUREMENT_ID, {
      send_page_view: true,
      linker: { domains: ["senseglow.shop", "www.senseglow.shop", "checkout.senseglow.shop"] },
    });
  } catch {
    // Analytics mag de winkel nooit blokkeren.
  }
}

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;
type ClickIdKey = (typeof CLICK_ID_KEYS)[number];

const STORAGE_PREFIX = "sg_";
const MAX_AGE_DAYS = 90;
const MAX_AGE_SECONDS = 60 * 60 * 24 * MAX_AGE_DAYS;

type StoredClickId = { value: string; ts: number };

function storageKey(key: ClickIdKey): string {
  return `${STORAGE_PREFIX}${key}`;
}

function cookieDomain(): string | null {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  if (host.endsWith("senseglow.shop")) return ".senseglow.shop";
  return null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const domain = cookieDomain();
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "path=/",
    `max-age=${MAX_AGE_SECONDS}`,
    "SameSite=Lax",
  ];
  if (domain) parts.push(`domain=${domain}`);
  if (window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join(";");
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Lees klik-ids uit de URL en bewaar ze 90 dagen. */
export function captureClickIds(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of CLICK_ID_KEYS) {
      const value = params.get(key);
      if (!value) continue;
      const record: StoredClickId = { value, ts: Date.now() };
      try {
        localStorage.setItem(storageKey(key), JSON.stringify(record));
      } catch {
        // localStorage kan geblokkeerd zijn; cookie is de terugval.
      }
      writeCookie(storageKey(key), value);
    }
  } catch {
    // Nooit de app laten breken op tracking.
  }
}

/** Haal een bewaarde klik-id op (niet verlopen), of null. */
export function getStoredClickId(key: ClickIdKey): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (raw) {
      const parsed = JSON.parse(raw) as StoredClickId;
      if (parsed?.value && Date.now() - parsed.ts < MAX_AGE_SECONDS * 1000) {
        return parsed.value;
      }
    }
  } catch {
    // val terug op de cookie
  }
  return readCookie(storageKey(key));
}

/**
 * Plak de bewaarde klik-ids aan een checkout-URL, plus Google's eigen
 * linker-parameter (_gl) als die beschikbaar is.
 */
export async function appendClickIdsToUrl(rawUrl: string): Promise<string> {
  try {
    const url = new URL(rawUrl);
    for (const key of CLICK_ID_KEYS) {
      const value = getStoredClickId(key);
      if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
    }

    const linker = await getLinkerParam();
    if (linker) url.searchParams.set("_gl", linker);

    return url.toString();
  } catch {
    return rawUrl;
  }
}

function getLinkerParam(): Promise<string | null> {
  return new Promise((resolve) => {
    const gtag = typeof window !== "undefined" ? window.gtag : undefined;
    if (typeof gtag !== "function") {
      resolve(null);
      return;
    }
    let settled = false;
    const done = (value: string | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    // Nooit langer dan 300ms wachten: de doorverwijzing mag niet vertragen.
    setTimeout(() => done(null), 300);
    try {
      gtag("get", ADS_CONVERSION_ID, "linker_param", (param: unknown) => {
        done(typeof param === "string" && param.length > 0 ? param : null);
      });
    } catch {
      done(null);
    }
  });
}

/** Stuur een gtag-event; stil no-op als gtag ontbreekt. */
export function trackAdsEvent(name: string, params: Record<string, unknown> = {}): void {
  try {
    const gtag = typeof window !== "undefined" ? window.gtag : undefined;
    if (typeof gtag !== "function") return;
    gtag("event", name, { send_to: ADS_CONVERSION_ID, ...params });

    const label = ADS_EVENT_LABELS[name];
    if (label) {
      gtag("event", "conversion", {
        send_to: `${ADS_CONVERSION_ID}/${label}`,
        ...params,
      });
    }
  } catch {
    // tracking mag nooit de flow blokkeren
  }
}

/** Meld een paginaweergave bij een routewissel (SPA). */
export function trackPageView(path: string): void {
  try {
    const gtag = typeof window !== "undefined" ? window.gtag : undefined;
    if (typeof gtag !== "function") return;
    const destinations = [ADS_CONVERSION_ID, ANALYTICS_MEASUREMENT_ID].filter(Boolean);
    gtag("event", "page_view", {
      send_to: destinations,
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  } catch {
    // stil
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
