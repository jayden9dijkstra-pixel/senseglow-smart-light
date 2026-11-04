import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/price";
import { quoteQty, qtyLabel } from "@/lib/quantityOffer";

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
        <p className="text-sm text-muted-foreground">
          {formatPrice(q.total)} voor {qtyLabel(count).replace(/\s*\(.*\)$/, "")}
        </p>
      )}
    </div>
  );
}

/** Alleen betaalmethoden die actief zijn in de Shopify-checkout. */
const PAYMENT_METHODS = ["iDEAL", "Creditcard", "PayPal"];

export function TrustLine() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-foreground/75">Gratis verzending NL &amp; BE · 30 dagen retour · 1 jaar extra garantie</p>
      <ul className="flex flex-wrap gap-1.5" aria-label="Betaalmethoden">
        {PAYMENT_METHODS.map((m) => (
          <li key={m} className="rounded border border-foreground/15 bg-background px-2 py-0.5 text-[10px] font-semibold tracking-wide text-foreground/70">
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Vaste balk onderaan op mobiel zodra de gewone koopknop boven uit beeld is. */
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const el = watch.current;
      setVisible(!!el && el.getBoundingClientRect().bottom < 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [watch]);

  if (!visible || total == null) return null;
  // Portal: een transform op een voorouder zou position:fixed anders breken.
  return createPortal(
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-lg backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{qty === 1 ? "1 lamp" : `${qty} lampen`}</p>
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
