import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BundleSlot } from "@/components/bundle-builder/BundleSlot";
import { fetchProducts } from "@/lib/shopify";
import { PackSize } from "@/lib/productConfig";
import {
  BundleSlotSelection,
  PACK_OPTIONS,
  calcTotals,
  clearDraft,
  formatEuro,
  loadDraft,
  packDiscountCode,
  saveDraft,
  trackBundleEvent,
} from "@/lib/bundleBuilder";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

const BundleBuilder = () => {
  const [packSize, setPackSize] = useState<PackSize | null>(null);
  const [slots, setSlots] = useState<Array<BundleSlotSelection | null>>([]);
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [pendingPack, setPendingPack] = useState<PackSize | null>(null);
  const addBundleItems = useCartStore((s) => s.addBundleItems);

  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["bundle-products"],
    queryFn: () => fetchProducts(50),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setPackSize(draft.packSize);
      setSlots(draft.slots);
    }
  }, []);

  useEffect(() => {
    if (packSize) saveDraft(packSize, slots);
  }, [packSize, slots]);

  const pack = PACK_OPTIONS.find((p) => p.size === packSize) ?? null;
  const totals = useMemo(
    () => calcTotals(slots, pack?.rate ?? 0),
    [slots, pack?.rate]
  );
  const filled = slots.filter(Boolean).length;
  const complete = packSize !== null && filled === packSize;

  const selectPack = (size: PackSize) => {
    if (packSize && packSize !== size && filled > 0) {
      setPendingPack(size);
      return;
    }
    applyPack(size);
  };

  const applyPack = (size: PackSize) => {
    setPackSize(size);
    setSlots(Array.from({ length: size }, () => null));
    setOpenSlot(0);
    trackBundleEvent("bundle_pack_selected", { pack_size: size });
  };

  const confirmSlot = (index: number, selection: BundleSlotSelection) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? selection : s)));
    setOpenSlot((prev) => {
      const next = slots.findIndex((s, i) => i !== index && !s);
      return next === -1 ? null : next;
    });
    trackBundleEvent("bundle_slot_filled", {
      slot: index + 1,
      product_handle: selection.handle,
      variant_id: selection.variantId,
    });
  };

  const addToCart = () => {
    if (!packSize || !pack || !complete) return;
    const productByHandle = new Map<string, ShopifyProduct>(
      products.map((p) => [p.node.handle, p])
    );

    const items = slots.flatMap((slot) => {
      if (!slot) return [];
      const product = productByHandle.get(slot.handle);
      if (!product) return [];
      return [
        {
          product,
          variantId: slot.variantId,
          variantTitle: slot.variantTitle,
          price: { amount: slot.price.toFixed(2), currencyCode: slot.currencyCode },
          quantity: 1,
          selectedOptions: slot.selectedOptions,
          isBundle: true,
          bundleName: `${packSize}-pack`,
          bundleVariantLabel: slot.selectedOptions.map((o) => o.value).join(" · "),
          bundlePackSize: packSize,
          bundleRate: pack.rate,
          bundleDiscountCode: packDiscountCode(packSize),
        },
      ];
    });

    addBundleItems(
      items,
      `Bundel toegevoegd, ${Math.round(pack.rate * 100)}% korting wordt automatisch verrekend`
    );
    trackBundleEvent("bundle_added_to_cart", {
      pack_size: packSize,
      total_amount: totals.total,
      discount_amount: totals.discount,
      variant_ids: items.map((i) => i.variantId),
    });
    clearDraft();
    setPackSize(null);
    setSlots([]);
    setOpenSlot(null);
  };

  return (
    <PageLayout>
      <div className="w-full overflow-hidden">
        {/* Hero en pakketkeuze */}
        <section className="w-full bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="max-w-2xl">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-foreground/40">
                Slim combineren
              </p>
              <h1 className="text-3xl font-bold text-foreground md:text-5xl">
                Stel je eigen bundel samen
              </h1>
              <p className="mt-4 text-base text-foreground/60 md:text-lg">
                Meer producten, meer korting. Kies de maat en kleur die bij jou passen.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
              {PACK_OPTIONS.map((option) => {
                const active = packSize === option.size;
                return (
                  <button
                    key={option.size}
                    type="button"
                    onClick={() => selectPack(option.size)}
                    aria-pressed={active}
                    className={`group rounded-[10px] border p-6 text-left transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active
                        ? "border-primary bg-background-secondary"
                        : "border-foreground/10 bg-background-secondary/60 hover:border-primary/50"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      -{Math.round(option.rate * 100)}%
                    </span>
                    <p className="mt-4 text-2xl font-bold text-foreground">{option.title}</p>
                    <p className="mt-2 text-sm text-foreground/60">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bundel vullen */}
        {packSize && pack && (
          <section className="w-full bg-background-secondary/40 py-16 md:py-24">
            <div className="mx-auto max-w-4xl px-6 md:px-8">
              <div className="sticky top-24 z-30 mb-8 rounded-[10px] border border-foreground/10 bg-background/95 p-4 backdrop-blur md:flex md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Jouw {pack.title}</p>
                  <p className="text-xs text-foreground/50" aria-live="polite">
                    {filled} van {packSize} producten gekozen
                  </p>
                </div>
                <div className="mt-3 text-left md:mt-0 md:text-right">
                  <p className="text-sm tabular-nums text-foreground/40 line-through">
                    {formatEuro(totals.subtotal)}
                  </p>
                  <p className="text-xl font-bold tabular-nums text-glow">{formatEuro(totals.total)}</p>
                  {totals.discount > 0 && (
                    <p className="text-xs tabular-nums text-foreground/60">
                      Je bespaart {formatEuro(totals.discount)}
                    </p>
                  )}
                </div>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-5 w-5 animate-spin text-foreground/30" />
                </div>
              )}

              {isError && (
                <p className="py-10 text-center text-sm text-foreground/60">
                  De producten konden even niet geladen worden. Ververs de pagina.
                </p>
              )}

              {!isLoading && !isError && (
                <div className="space-y-4">
                  {slots.map((slot, index) => (
                    <BundleSlot
                      key={index}
                      index={index}
                      selection={slot}
                      products={products}
                      open={openSlot === index}
                      onOpenChange={(open) => setOpenSlot(open ? index : null)}
                      onConfirm={(selection) => confirmSlot(index, selection)}
                    />
                  ))}
                </div>
              )}

              {complete && (
                <div className="mt-8 rounded-[10px] border border-primary/30 bg-background p-6">
                  <h2 className="text-lg font-semibold text-foreground">Jouw bundel</h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    {slots.map((slot, index) =>
                      slot ? (
                        <li key={index} className="flex justify-between gap-4 text-foreground/70">
                          <span className="truncate">
                            {slot.productTitle}
                            {slot.selectedOptions.length > 0 && (
                              <span className="text-foreground/40">
                                {" "}
                                · {slot.selectedOptions.map((o) => o.value).join(" · ")}
                              </span>
                            )}
                          </span>
                          <span className="tabular-nums">{formatEuro(slot.price)}</span>
                        </li>
                      ) : null
                    )}
                  </ul>
                  <div className="mt-4 space-y-1 border-t border-foreground/10 pt-4 text-sm">
                    <div className="flex justify-between text-foreground/60">
                      <span>Subtotaal</span>
                      <span className="tabular-nums">{formatEuro(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-glow">
                      <span>Bundelkorting {Math.round(pack.rate * 100)}%</span>
                      <span className="tabular-nums">-{formatEuro(totals.discount)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-base font-bold text-foreground">
                      <span>Jouw prijs</span>
                      <span className="tabular-nums">{formatEuro(totals.total)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={addToCart}
                    className="mt-6 h-12 w-full rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Voeg toe aan winkelmandje
                  </Button>
                </div>
              )}
            </div>

            {/* Vaste balk op mobiel */}
            {complete && (
              <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/10 bg-background/95 p-4 backdrop-blur md:hidden">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-bold tabular-nums text-glow">{formatEuro(totals.total)}</p>
                    <p className="text-[11px] tabular-nums text-foreground/50">
                      Je bespaart {formatEuro(totals.discount)}
                    </p>
                  </div>
                  <Button
                    onClick={addToCart}
                    className="h-11 flex-1 rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    In winkelmandje
                  </Button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <AlertDialog open={pendingPack !== null} onOpenChange={(open) => !open && setPendingPack(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Je huidige selectie wordt gewist</AlertDialogTitle>
            <AlertDialogDescription>
              Je wisselt van pakketgrootte. De producten die je al koos verdwijnen. Doorgaan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingPack) applyPack(pendingPack);
                setPendingPack(null);
              }}
            >
              Doorgaan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default BundleBuilder;
