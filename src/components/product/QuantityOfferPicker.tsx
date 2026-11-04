import { QTY_OPTIONS, offerRate, qtyLabel, quoteQty, type OfferQty } from "@/lib/quantityOffer";
import { formatPrice } from "@/lib/price";

/** Aantal-kiezer: 1 lamp | 2 lampen (10%) | 4 lampen (15%), prijzen uit de Shopify-prijs van de variant. */
export function QuantityOfferPicker({
  unitPrice,
  value,
  onChange,
}: {
  unitPrice: number | null;
  value: OfferQty;
  onChange: (qty: OfferQty) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5 md:grid-cols-1 md:gap-2" role="radiogroup" aria-label="Aantal lampen">
        {QTY_OPTIONS.map((qty) => {
          const q = unitPrice != null ? quoteQty(unitPrice, qty) : null;
          const active = qty === value;
          const rate = offerRate(qty);
          return (
            <button
              key={qty}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={qtyLabel(qty)}
              onClick={() => onChange(qty)}
              className={`flex flex-col items-center gap-0.5 min-h-12 rounded-xl border px-1 py-2 text-center transition-colors md:flex-row md:justify-between md:gap-3 md:px-4 md:py-3 md:text-left ${
                active ? "border-primary bg-primary/5" : "border-foreground/15 hover:border-primary/40"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`hidden h-4 w-4 flex-shrink-0 rounded-full border-2 md:block ${active ? "border-primary bg-primary" : "border-foreground/30"}`}
                />
                <span className="text-base font-medium text-foreground md:hidden">{qty === 1 ? "1 lamp" : `${qty} lampen`}</span>
                <span className="hidden text-base font-medium text-foreground md:inline">{qtyLabel(qty)}</span>
              </span>
              <span className="text-sm font-semibold text-primary md:hidden">{rate ? `${Math.round(rate * 100)}% korting` : "\u00a0"}</span>
              {q && (
                <span className="md:text-right">
                  <span className="block text-base font-semibold text-foreground">{formatPrice(q.total)}</span>
                  {qty > 1 && <span className="hidden text-sm text-foreground/80 md:block">{formatPrice(q.perLamp)} per lamp</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
