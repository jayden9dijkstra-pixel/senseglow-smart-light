import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/price";
import { quoteQty, qtyLabel } from "@/lib/quantityOffer";
import { readStoredConsent } from "@/lib/consent";
import { Truck, Package, RotateCcw } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { deliveryBetweenText } from "@/lib/delivery";

/** Event dat de cookiebanner stuurt zodra een keuze is opgeslagen. */
export const CONSENT_SAVED_EVENT = "sg:consent-saved";

/** Prijs per lamp groot, totaal klein eronder. Rekent alleen met de Shopify-prijs en het bestaande aanbod. */
export function PerLampPrice({ unitPrice, qty, offer }: { unitPrice: number | null; qty: number; offer: boolean }) {
  if (unitPrice == null) return null;
  const count = offer ? qty : 1;
  const q = quoteQty(unitPrice, count);
  if (!offer) return <p className="text-3xl font-bold text-primary">{formatPrice(unitPrice)}</p>;
  return (
    <div>
      <p className="text-3xl font-bold leading-tight text-primary">
        {formatPrice(q.perLamp)} <span className="text-base font-semibold">per lamp</span>
      </p>
      {count > 1 && (
        <p className="text-base text-foreground/80">
          {formatPrice(q.total)} voor {qtyLabel(count).replace(/\s*\(.*\)$/, "")}
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

const BAR_HEIGHT = 88;

/** Vaste balk onderaan op mobiel zolang de gewone koopknop buiten beeld is. */
export function StickyAddBar({
  watch,
  qty,
  total,
  disabled,
  onAdd,
}: {
  watch: RefObject<HTMLElement>;
  qty: number;
  total: number | null;
  disabled: boolean;
  onAdd: () => void;
}) {
  const [outOfView, setOutOfView] = useState(false);
  const consentPending = useConsentPending();

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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-lg backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground/80">{qty === 1 ? "1 lamp" : `${qty} lampen`}</p>
          <p className="font-semibold text-primary">{formatPrice(total)}</p>
        </div>
        <Button onClick={onAdd} disabled={disabled} className="h-12 flex-none rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
          In winkelwagen
        </Button>
      </div>
    </div>,
    document.body,
  );
}
