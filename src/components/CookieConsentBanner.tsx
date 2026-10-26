import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SHOPIFY_CHECKOUT_DOMAIN,
  SHOPIFY_STOREFRONT_ROOT_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
} from "@/lib/shopify";
import {
  OPEN_CONSENT_EVENT,
  googleConsentSignals,
  readStoredConsent,
  storeConsent,
  type ConsentChoice,
} from "@/lib/consent";

const CONSENT_SCRIPT_SRC =
  "https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js";

declare global {
  interface Window {
    Shopify?: {
      customerPrivacy?: {
        shouldShowBanner: () => boolean;
        setTrackingConsent: (consent: Record<string, unknown>, callback: () => void) => void;
      };
    };
    gtag?: (...args: unknown[]) => void;
  }
}

/** Geeft de keuze door aan de Google-tag (Consent Mode v2). */
function applyGoogleConsent(choice: ConsentChoice) {
  try {
    window.gtag?.("consent", "update", googleConsentSignals(choice));
  } catch {
    // meten mag de winkel nooit blokkeren
  }
}

/** Shopify's consent-API laadt asynchroon; luister op events en poll als vangnet. */
function loadConsentScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if (window.Shopify?.customerPrivacy) return resolve();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearInterval(pollId);
      clearTimeout(timeoutId);
      resolve();
    };
    document.addEventListener("shopifyCustomerPrivacyApiLoaded", finish, { once: true });
    document.addEventListener("consentTrackingApiLoaded", finish, { once: true });
    const pollId = window.setInterval(() => {
      if (window.Shopify?.customerPrivacy) finish();
    }, 200);
    const timeoutId = window.setTimeout(finish, 8000);
    if (!document.querySelector(`script[src="${CONSENT_SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = CONSENT_SCRIPT_SRC;
      script.async = true;
      script.onerror = finish;
      document.head.appendChild(script);
    }
  });
}

/** Zelfde toestemmingsniveau op de Shopify-checkout als op de site. */
function submitConsentToShopify(choice: ConsentChoice): Promise<void> {
  return new Promise((resolve) => {
    const api = window.Shopify?.customerPrivacy;
    if (!api) return resolve();
    try {
      api.setTrackingConsent(
        {
          analytics: choice.analytics,
          marketing: choice.marketing,
          preferences: choice.analytics || choice.marketing,
          sale_of_data: choice.marketing,
          headlessStorefront: true,
          checkoutRootDomain: SHOPIFY_CHECKOUT_DOMAIN,
          storefrontRootDomain: SHOPIFY_STOREFRONT_ROOT_DOMAIN,
          storefrontAccessToken: SHOPIFY_STOREFRONT_TOKEN,
        },
        () => resolve(),
      );
    } catch {
      resolve();
    }
  });
}

const NONE: ConsentChoice = { analytics: false, marketing: false };
const ALL: ConsentChoice = { analytics: true, marketing: true };

/**
 * Eigen cookiebalk: geen opgeslagen keuze = balk tonen. Keuze gevonden =
 * balk overslaan en de keuze opnieuw aan Shopify en Google doorgeven.
 * Via de footerlink 'Cookie-instellingen' gaat hij later weer open.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>(NONE);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const stored = readStoredConsent();
    if (!stored) {
      setVisible(true);
      void loadConsentScript();
    } else {
      applyGoogleConsent(stored);
      loadConsentScript().then(() => {
        if (!cancelled) void submitConsentToShopify(stored);
      });
    }
    const open = () => {
      const current = readStoredConsent();
      setDraft(current ?? NONE);
      setShowSettings(true);
      setVisible(true);
      void loadConsentScript();
    };
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => {
      cancelled = true;
      window.removeEventListener(OPEN_CONSENT_EVENT, open);
    };
  }, []);

  const respond = async (choice: ConsentChoice) => {
    setBusy(true);
    storeConsent(choice);
    applyGoogleConsent(choice);
    await loadConsentScript();
    await submitConsentToShopify(choice);
    setBusy(false);
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible || window.location.pathname.startsWith("/admin")) return null;

  const btn = "rounded-full flex-1 min-w-[9rem]";

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center px-4">
      <div
        role="dialog"
        aria-label="Cookie-instellingen"
        className="pointer-events-auto mx-auto w-full max-w-lg rounded-2xl border border-foreground/10 bg-card/95 p-6 shadow-xl backdrop-blur-md sm:p-8"
      >
        <p className="text-sm text-foreground/70 leading-relaxed">
          Deze site gebruikt cookies om een betere browsingervaring aan u te
          geven. Voor meer informatie lees ons{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            privacybeleid
          </a>
          .
        </p>

        {showSettings && (
          <div className="mt-5 space-y-3 text-sm">
            <label className="flex items-start gap-3 text-foreground/60">
              <input type="checkbox" checked disabled className="mt-1" />
              <span><strong className="text-foreground">Noodzakelijk</strong>. Winkelwagen, taal en je cookiekeuze. Altijd aan.</span>
            </label>
            <label className="flex items-start gap-3 text-foreground/70">
              <input
                type="checkbox"
                className="mt-1"
                checked={draft.analytics}
                onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })}
              />
              <span><strong className="text-foreground">Statistiek</strong>. Meten hoe de site gebruikt wordt.</span>
            </label>
            <label className="flex items-start gap-3 text-foreground/70">
              <input
                type="checkbox"
                className="mt-1"
                checked={draft.marketing}
                onChange={(e) => setDraft({ ...draft, marketing: e.target.checked })}
              />
              <span><strong className="text-foreground">Marketing</strong>. Meten welke advertentie tot een bestelling leidt.</span>
            </label>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => respond(ALL)} className={btn}>
            Alles accepteren
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => respond(NONE)} className={btn}>
            Alleen noodzakelijk
          </Button>
          {showSettings ? (
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => respond(draft)} className={btn}>
              Keuze opslaan
            </Button>
          ) : (
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => setShowSettings(true)} className={btn}>
              Instellingen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
