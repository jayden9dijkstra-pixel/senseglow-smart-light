import { QTY_OPTIONS, MIX_NOTE, qtyLabel, quoteQty, type OfferQty } from "@/lib/quantityOffer";
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
      <div className="grid gap-1.5 md:gap-2" role="radiogroup" aria-label="Aantal lampen">
        {QTY_OPTIONS.map((qty) => {
          const q = unitPrice != null ? quoteQty(unitPrice, qty) : null;
          const active = qty === value;
          return (
            <button
              key={qty}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(qty)}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-2 md:py-3 text-left transition-colors ${
                active ? "border-primary bg-primary/5" : "border-foreground/15 hover:border-primary/40"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`h-4 w-4 flex-shrink-0 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-foreground/30"}`}
                />
                <span className="text-sm font-medium text-foreground">{qtyLabel(qty)}</span>
              </span>
              {q && (
                <span className="text-right">
                  <span className="block text-sm font-semibold text-foreground">{formatPrice(q.total)}</span>
                  {qty > 1 && <span className="block text-xs text-muted-foreground">{formatPrice(q.perLamp)} per lamp</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">{MIX_NOTE}</p>
    </div>
  );
}
