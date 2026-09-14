import { useMemo, useState } from "react";
import { Check, ChevronRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShopifyProduct } from "@/lib/shopify";
import { BundleSlotSelection, formatEuro } from "@/lib/bundleBuilder";

type BundleSlotProps = {
  index: number;
  selection: BundleSlotSelection | null;
  products: ShopifyProduct[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selection: BundleSlotSelection) => void;
};

const minPrice = (product: ShopifyProduct) =>
  parseFloat(product.node.priceRange.minVariantPrice.amount || "0");

const productAvailable = (product: ShopifyProduct) =>
  product.node.variants.edges.some((v) => v.node.availableForSale);

export function BundleSlot({
  index,
  selection,
  products,
  open,
  onOpenChange,
  onConfirm,
}: BundleSlotProps) {
  const [pickedHandle, setPickedHandle] = useState<string | null>(null);
  const [options, setOptions] = useState<Record<string, string>>({});

  const picked = products.find((p) => p.node.handle === pickedHandle) ?? null;

  const variant = useMemo(() => {
    if (!picked) return null;
    const names = picked.node.options.map((o) => o.name);
    if (names.some((n) => !options[n])) return null;
    return (
      picked.node.variants.edges.find((v) =>
        v.node.selectedOptions.every((o) => options[o.name] === o.value)
      )?.node ?? null
    );
  }, [picked, options]);

  const startPicking = () => {
    setPickedHandle(null);
    setOptions({});
    onOpenChange(true);
  };

  const choose = (product: ShopifyProduct) => {
    setPickedHandle(product.node.handle);
    const first = product.node.variants.edges.find((v) => v.node.availableForSale)?.node;
    const preset: Record<string, string> = {};
    first?.selectedOptions.forEach((o) => {
      preset[o.name] = o.value;
    });
    setOptions(preset);
  };

  const confirm = () => {
    if (!picked || !variant || !variant.availableForSale) return;
    onConfirm({
      handle: picked.node.handle,
      productTitle: picked.node.title,
      variantId: variant.id,
      variantTitle: variant.title,
      selectedOptions: variant.selectedOptions,
      price: parseFloat(variant.price.amount),
      currencyCode: variant.price.currencyCode,
      image: picked.node.images?.edges?.[0]?.node?.url,
    });
    setPickedHandle(null);
    setOptions({});
  };

  // ── Ingevuld ────────────────────────────────────────
  if (selection && !open) {
    return (
      <div className="rounded-[10px] border border-primary/30 bg-background-secondary p-4 md:p-5">
        <div className="flex items-center gap-4">
          {selection.image ? (
            <img
              src={selection.image}
              alt={selection.productTitle}
              loading="lazy"
              className="h-16 w-16 shrink-0 rounded-[10px] object-cover"
            />
          ) : (
            <div className="h-16 w-16 shrink-0 rounded-[10px] bg-foreground/10" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{selection.productTitle}</p>
            <p className="truncate text-xs text-foreground/50">
              {selection.selectedOptions.map((o) => o.value).join(" · ")}
            </p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
              {formatEuro(selection.price)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={startPicking}
            className="shrink-0 text-xs text-glow hover:text-glow"
          >
            <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            Wijzig
          </Button>
        </div>
      </div>
    );
  }

  // ── Leeg, dicht ─────────────────────────────────────
  if (!open) {
    return (
      <button
        type="button"
        onClick={startPicking}
        className="flex w-full items-center justify-between rounded-[10px] border border-dashed border-foreground/20 bg-background-secondary/60 p-5 text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="text-sm text-foreground/70">
          Plek {index + 1} · Kies een product
        </span>
        <ChevronRight className="h-4 w-4 text-foreground/40" aria-hidden="true" />
      </button>
    );
  }

  // ── Open: product kiezen of variant kiezen ──────────
  return (
    <div className="rounded-[10px] border border-primary/30 bg-background-secondary p-4 md:p-6">
      {!picked ? (
        <>
          <p className="mb-4 text-sm font-medium text-foreground">
            Plek {index + 1} · Kies een product
          </p>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => {
              const available = productAvailable(product);
              return (
                <button
                  key={product.node.handle}
                  type="button"
                  disabled={!available}
                  onClick={() => choose(product)}
                  className="relative overflow-hidden rounded-[10px] border border-foreground/10 bg-background p-3 text-left transition-all hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {product.node.images?.edges?.[0]?.node?.url && (
                    <img
                      src={product.node.images.edges[0].node.url}
                      alt={product.node.title}
                      loading="lazy"
                      className="mb-3 aspect-square w-full rounded-[8px] object-cover"
                    />
                  )}
                  <p className="text-sm font-medium leading-snug text-foreground">{product.node.title}</p>
                  <p className="mt-1 text-xs tabular-nums text-foreground/50">
                    vanaf {formatEuro(minPrice(product))}
                  </p>
                  {!available && (
                    <span className="mt-2 block text-xs text-destructive">Tijdelijk uitverkocht</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="mb-4 text-sm font-medium text-foreground">Kies je variant</p>
          <div className="flex flex-col gap-5 sm:flex-row">
            {picked.node.images?.edges?.[0]?.node?.url && (
              <img
                src={picked.node.images.edges[0].node.url}
                alt={picked.node.title}
                loading="lazy"
                className="h-[140px] w-[140px] shrink-0 rounded-[10px] object-cover"
              />
            )}
            <div className="flex-1 space-y-4">
              <p className="text-base font-semibold text-foreground">{picked.node.title}</p>
              {picked.node.options
                .filter((option) => option.values.length > 0 && option.name !== "Title")
                .map((option) => (
                  <div key={option.name} className="space-y-1.5">
                    <label
                      htmlFor={`slot-${index}-${option.name}`}
                      className="block text-xs uppercase tracking-[0.2em] text-foreground/50"
                    >
                      {option.name}
                    </label>
                    <select
                      id={`slot-${index}-${option.name}`}
                      value={options[option.name] ?? ""}
                      onChange={(e) =>
                        setOptions((prev) => ({ ...prev, [option.name]: e.target.value }))
                      }
                      className="h-11 w-full rounded-[8px] border border-foreground/15 bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="">Maak een keuze</option>
                      {option.values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

              <div aria-live="polite" className="text-sm">
                {variant ? (
                  variant.availableForSale ? (
                    <p className="tabular-nums text-foreground">
                      <span className="font-semibold">{formatEuro(parseFloat(variant.price.amount))}</span>
                      <span className="ml-2 text-glow">Op voorraad</span>
                    </p>
                  ) : (
                    <p className="text-destructive">Niet op voorraad, kies een andere maat of kleur.</p>
                  )
                ) : (
                  <p className="text-foreground/50">Kies alle opties om de prijs te zien.</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={confirm}
                  disabled={!variant || !variant.availableForSale}
                  className="rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                  Bevestig keuze
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPickedHandle(null);
                    setOptions({});
                  }}
                  className="rounded-[6px] text-foreground/60"
                >
                  Ander product
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
