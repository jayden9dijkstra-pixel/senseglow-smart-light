import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SHOPIFY_CHECKOUT_DOMAIN,
  SHOPIFY_STOREFRONT_ROOT_DOMAIN,
  SHOPIFY_STOREFRONT_TOKEN,
} from "@/lib/shopify";

const CONSENT_SCRIPT_SRC =
  "https://cdn.shopify.com/shopifycloud/consent-tracking-api/v0.1/consent-tracking-api.js";

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

function submitConsent(choice: ConsentChoice): Promise<void> {
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
 * Eigen cookiebalk die Shopify's headless Customer Privacy API aanroept.
 * Zonder dit blijft checkout.senseglow.shop ervan uitgaan dat niemand
 * toestemming heeft gegeven, waardoor de Google Ads-conversiepixel daar
 * nooit mag afvuren — ook niet als de koppeling zelf correct staat.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadConsentScript().then(() => {
      if (cancelled) return;
      try {
        if (window.Shopify?.customerPrivacy?.shouldShowBanner()) {
          setVisible(true);
        }
      } catch {
        // liever geen balk tonen dan de pagina breken
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const respond = async (choice: ConsentChoice) => {
    setBusy(true);
    await submitConsent(choice);
    setBusy(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[95] px-4 pb-4">
      <div className="mx-auto max-w-2xl rounded-sm border border-foreground/10 bg-card/95 p-4 shadow-lg backdrop-blur-md sm:p-5">
        <p className="text-sm text-foreground/70 leading-relaxed">
          We gebruiken cookies om de site goed te laten werken en om te meten
          welke advertenties resultaat opleveren. Lees ons{" "}
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
            onClick={() =>
              respond({
                analytics: true,
                marketing: true,
                preferences: true,
                sale_of_data: true,
              })
            }
            className="rounded-sm"
          >
            Alles accepteren
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() =>
              respond({
                analytics: false,
                marketing: false,
                preferences: false,
                sale_of_data: false,
              })
            }
            className="rounded-sm border-foreground/20"
          >
            Alleen noodzakelijke
          </Button>
        </div>
      </div>
    </div>
  );
}
