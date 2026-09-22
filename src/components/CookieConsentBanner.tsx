import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SHOPIFY_CHECKOUT_DOMAIN,
  SHOPIFY_STOREFRONT_ROOT_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
} from "@/lib/shopify";

const CONSENT_SCRIPT_SRC =
  "https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js";

const CONSENT_KEY = "sg_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 12 maanden

type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  sale_of_data: boolean;
};

declare global {
  interface Window {
    Shopify?: {
      customerPrivacy?: {
        shouldShowBanner: () => boolean;
        setTrackingConsent: (
          consent: Record<string, unknown>,
          callback: () => void,
        ) => void;
      };
    };
    gtag?: (...args: unknown[]) => void;
  }
}

const ACCEPT_ALL: ConsentChoice = {
  analytics: true,
  marketing: true,
  preferences: true,
  sale_of_data: true,
};

const NECESSARY_ONLY: ConsentChoice = {
  analytics: false,
  marketing: false,
  preferences: false,
  sale_of_data: false,
};

/** Leest de eerder gemaakte keuze: localStorage eerst, daarna de cookie. */
function readStoredConsent(): "all" | "necessary" | null {
  if (typeof window === "undefined") return null;
  try {
    const local = window.localStorage.getItem(CONSENT_KEY);
    if (local === "all" || local === "necessary") return local;
  } catch {
    // opslag kan geblokkeerd zijn; val terug op de cookie
  }
  const match = document.cookie.match(/(?:^|;\s*)sg_consent=(all|necessary)/);
  return (match?.[1] as "all" | "necessary" | undefined) ?? null;
}

/** Bewaart de keuze lokaal én in een cookie op het hoofddomein, zodat ook
 *  checkout.senseglow.shop hem ziet. */
function storeConsent(kind: "all" | "necessary") {
  try {
    window.localStorage.setItem(CONSENT_KEY, kind);
  } catch {
    // niet kritiek
  }
  try {
    const host = window.location.hostname;
    const domain = host.endsWith("senseglow.shop") ? "; domain=.senseglow.shop" : "";
    document.cookie = `${CONSENT_KEY}=${kind}; max-age=${CONSENT_MAX_AGE}; path=/; SameSite=Lax${domain}`;
  } catch {
    // niet kritiek
  }
}

/** Geeft de keuze door aan de Google-tag (Consent Mode). */
function applyGoogleConsent(choice: ConsentChoice) {
  try {
    window.gtag?.("consent", "update", {
      analytics_storage: choice.analytics ? "granted" : "denied",
      ad_storage: choice.marketing ? "granted" : "denied",
    });
  } catch {
    // meten mag de winkel nooit blokkeren
  }
}

/**
 * Shopify's consent-API laadt asynchroon en meldt zich pas klaar via een
 * document-event nadat het script zelf al binnen is (niet via het gewone
 * <script>-load-event). We luisteren op beide bekende eventnamen en pollen
 * daarnaast even als vangnet, zodat een verkeerde/undocumented eventnaam de
 * banner nooit stilzwijgend laat verdwijnen.
 */
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

    document.addEventListener("shopifyCustomerPrivacyApiLoaded", finish, {
      once: true,
    });
    document.addEventListener("consentTrackingApiLoaded", finish, {
      once: true,
    });

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

function submitConsentToShopify(choice: ConsentChoice): Promise<void> {
  return new Promise((resolve) => {
    const api = window.Shopify?.customerPrivacy;
    if (!api) return resolve();
    try {
      api.setTrackingConsent(
        {
          ...choice,
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

/**
 * Eigen cookiebalk die de keuze zelf beheert in plaats van te wachten op
 * Shopify's shouldShowBanner() — die geeft op deze headless storefront vaak
 * false, waardoor de balk nooit verscheen en er nooit toestemming naar
 * Shopify (en daarmee naar de conversiepixel op de afrekenpagina) ging.
 *
 * Nu: geen opgeslagen keuze = balk tonen. Keuze gevonden = balk overslaan en
 * de keuze alsnog aan Shopify en Google doorgeven.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const stored = readStoredConsent();

    if (!stored) {
      // Geen keuze bekend: balk meteen tonen, niet wachten op Shopify.
      setVisible(true);
      // Laad het Shopify-script alvast op de achtergrond, zodat de keuze
      // direct doorgestuurd kan worden zodra de bezoeker klikt.
      void loadConsentScript();
      return;
    }

    // Keuze bekend: balk overslaan, keuze opnieuw doorgeven (idempotent).
    const choice = stored === "all" ? ACCEPT_ALL : NECESSARY_ONLY;
    applyGoogleConsent(choice);
    loadConsentScript().then(() => {
      if (cancelled) return;
      void submitConsentToShopify(choice);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const respond = async (kind: "all" | "necessary") => {
    const choice = kind === "all" ? ACCEPT_ALL : NECESSARY_ONLY;
    setBusy(true);
    storeConsent(kind);
    applyGoogleConsent(choice);
    await loadConsentScript();
    await submitConsentToShopify(choice);
    setBusy(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[95] px-4 pb-4">
      <div className="mx-auto max-w-2xl rounded-sm border border-foreground/10 bg-card/95 p-4 shadow-lg backdrop-blur-md sm:p-5">
        <p className="text-sm text-foreground/70 leading-relaxed">
          Deze site gebruikt cookies om een betere browsingervaring aan u te
          geven. Voor meer informatie lees ons{" "}
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            privacybeleid
          </a>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={() => respond("all")}
            className="rounded-sm"
          >
            Alles accepteren
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => respond("necessary")}
            className="rounded-sm border-foreground/20"
          >
            Alleen noodzakelijke
          </Button>
        </div>
      </div>
    </div>
  );
}
