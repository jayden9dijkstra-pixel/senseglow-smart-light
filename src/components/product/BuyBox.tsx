import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/price";
import { quoteQty, qtyLabel } from "@/lib/quantityOffer";
import { readStoredConsent } from "@/lib/consent";
import { Truck, Package, RotateCcw, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { deliveryBetweenText, freeDeliveryBetweenText } from "@/lib/delivery";
import { shopifySized } from "@/lib/shopifyImage";
import { useOfferDate } from "@/hooks/useOfferDate";
import { isBlackFriday } from "@/lib/blackFriday";

/** Event dat de cookiebanner stuurt zodra een keuze is opgeslagen. */
export const CONSENT_SAVED_EVENT = "sg:consent-saved";

/** Prijs per lamp groot, totaal klein eronder. Rekent alleen met de Shopify-prijs en het bestaande aanbod. */
export function PerLampPrice({ unitPrice, qty, offer, setLamps = 0, compareAt = null }: { unitPrice: number | null; qty: number; offer: boolean; setLamps?: number; compareAt?: number | null }) {
  const now = useOfferDate();
  if (unitPrice == null) return null;
  const count = offer ? qty : 1;
  const q = quoteQty(unitPrice, count, now);
  if (!offer) {
    // Shopify's compare-at price is the only source for a reduced price (no codes on the site).
    const was = compareAt != null && compareAt > unitPrice ? compareAt : null;
    return (
      <div>
        {was != null && (
          <p className="text-base font-semibold text-foreground">
            <span className="mr-2 rounded bg-primary px-1.5 py-0.5 text-sm text-primary-foreground">
              {isBlackFriday(now) ? "Black Friday" : "Actie"} −{Math.round((1 - unitPrice / was) * 100)}%
            </span>
            <s className="text-foreground/70">{formatPrice(was)}</s>
          </p>
        )}
        <p className="text-3xl font-bold leading-tight text-primary">{formatPrice(unitPrice)}</p>
        {setLamps > 1 && (
          <p className="text-base text-foreground/80">
            {setLamps} lampen
          </p>
        )}
      </div>
    );
  }
  return (
    <div>
      <p className="text-3xl font-bold leading-tight text-primary">
        {formatPrice(q.total)}
      </p>
      {count > 1 && (
        <p className="text-base text-foreground/80">
          {qtyLabel(count)}
        </p>
      )}
    </div>
  );
}

import idealLogo from "@/assets/pay/ideal.svg";
import visaLogo from "@/assets/pay/visa.svg";
import masterLogo from "@/assets/pay/master.svg";
import paypalLogo from "@/assets/pay/paypal.svg";

/** Alleen betaalmethoden die actief zijn in de Shopify-checkout. */
const PAYMENT_METHODS = [
  { name: "Visa", src: visaLogo },
  { name: "Mastercard", src: masterLogo },
  { name: "PayPal", src: paypalLogo },
];

/** Rustig blok direct onder de koopknop: bezorgdatum, gratis verzending, retourtermijn (zoals op /retourneren), betaalmethoden. */
export function TrustLine() {
  const { locale } = useI18n();
  return (
    <div className="space-y-3 rounded-2xl bg-secondary/60 p-4">
      <ul className="space-y-2 text-base text-foreground">
        <li className="flex items-center gap-3"><Truck className="h-5 w-5 flex-none text-primary" aria-hidden />{deliveryBetweenText(new Date(), locale)}</li>
        <li className="flex items-center gap-3"><Package className="h-5 w-5 flex-none text-primary" aria-hidden />{locale === "en" ? "Free shipping" : locale === "fr" ? "Livraison gratuite" : "Gratis verzending"}</li>
        <li className="flex items-center gap-3"><RotateCcw className="h-5 w-5 flex-none text-primary" aria-hidden />{locale === "en" ? "30-day returns" : locale === "fr" ? "Retour sous 30 jours" : "30 dagen retour"}</li>
        <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 flex-none text-primary" aria-hidden />{locale === "en" ? "1 year extra warranty" : locale === "fr" ? "1 an de garantie supplémentaire" : "1 jaar extra garantie"}</li>
      </ul>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-foreground/10 pt-3">
        <span className="flex items-center gap-2 text-base text-foreground">
          <img src={idealLogo} alt="" width={36} height={23} className="h-[23px] w-[36px]" loading="lazy" />
          iDEAL
        </span>
        <span className="text-base text-foreground">
          <span className="mr-1.5 rounded bg-[#FFB3C7] px-1.5 py-0.5 text-sm font-bold text-[#0B051D]">Klarna</span>
          {locale === "en" ? "Pay later with Klarna" : locale === "fr" ? "Payer plus tard avec Klarna" : "Achteraf betalen met Klarna"}
        </span>
        <ul className="flex items-center gap-1.5" aria-label="Andere betaalmethoden">
          {PAYMENT_METHODS.map((m) => (
            <li key={m.name}>
              <img src={m.src} alt={m.name} title={m.name} width={36} height={23} className="h-[23px] w-[36px]" loading="lazy" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** True zolang er nog geen cookiekeuze is (dan staat de cookiebalk onderin). */
export function useConsentPending() {
  const [pending, setPending] = useState(() => !readStoredConsent());
  useEffect(() => {
    const done = () => setPending(false);
    window.addEventListener(CONSENT_SAVED_EVENT, done);
    return () => window.removeEventListener(CONSENT_SAVED_EVENT, done);
  }, []);
  return pending;
}

const BAR_HEIGHT = 112;

/** Vaste balk onderaan op mobiel zolang de gewone koopknop buiten beeld is. */
export function StickyAddBar({
  watch,
  qty,
  total,
  disabled,
  onAdd,
  image,
  label,
}: {
  watch: RefObject<HTMLElement>;
  qty: number;
  image?: string | null;
  label?: string;
  total: number | null;
  disabled: boolean;
  onAdd: () => void;
}) {
  const [outOfView, setOutOfView] = useState(false);
  const consentPending = useConsentPending();
  const { locale } = useI18n();

  useEffect(() => {
    const update = () => {
      const el = watch.current;
      if (!el) return setOutOfView(false);
      const r = el.getBoundingClientRect();
      setOutOfView(r.bottom < 0 || r.top > window.innerHeight - BAR_HEIGHT);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [watch]);

  // Ruimte onderaan de pagina, zodat niets achter de balk verdwijnt.
  useEffect(() => {
    document.body.classList.add("has-sticky-buy");
    return () => document.body.classList.remove("has-sticky-buy");
  }, []);

  if (!outOfView || consentPending || total == null) return null;
  // Portal: een transform op een voorouder zou position:fixed anders breken.
  return createPortal(
    <div style={{ bottom: "var(--consent-bar-h, 0px)" }} className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-lg backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        {image && <img src={shopifySized(image, 120)} alt="" width={48} height={48} className="h-12 w-12 flex-none rounded-lg border border-border/70 bg-background-secondary object-cover" />}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground/80">{label ?? (qty === 1 ? "1 lamp" : `${qty} lampen`)}</p>
          <p className="font-semibold text-primary">{formatPrice(total)}</p>
        </div>
        <Button onClick={onAdd} disabled={disabled} className="h-12 flex-none rounded-full bg-cta px-6 text-cta-foreground hover:bg-cta-hover focus-visible:ring-cta">
          In winkelwagen
        </Button>
      </div>
      <p className="mx-auto mt-1 max-w-md text-center text-sm text-foreground/80">{freeDeliveryBetweenText(new Date(), locale)}</p>
    </div>,
    document.body,
  );
}
