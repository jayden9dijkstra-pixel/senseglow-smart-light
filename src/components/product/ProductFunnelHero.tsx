import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { blueprintFor } from "@/lib/productBlueprint";
import { isOfferProduct, quoteQty, type OfferQty } from "@/lib/quantityOffer";
import { useOfferDate } from "@/hooks/useOfferDate";
import { STEP_PRODUCT_HANDLE } from "@/lib/productConfig";
import { formatPrice } from "@/lib/price";
import { FunnelGallery, ProductFunnelPanel, findVariant, partsOf, type Variant } from "./FunnelBuy";
import { TrapFunnelPanel } from "@/components/landing/TrapFunnel";

/** Per product de twee dingen die op de foto moeten staan. */
const CHIPS: Record<string, string[]> = {
  senseglow_ambient_motion_bar: ["Gaat aan bij beweging", "Magnetisch, USB-C"],
  senseglow_wave: ["Wave-lichteffect", "3 lichtkleuren"],
  senseglow_flex: ["Tik en dim", "Magnetische houder"],
  senseglow_solar_lantern: ["Laadt op met zonlicht", "IP65 waterdicht"],
  senseglow_wall_lamp: ["Oplaadbaar via USB-C", "Plakken, geen boren"],
};

const cleanTitle = (t: string) => t.replace(/™/g, "").replace(/\s+/g, " ").trim();

export function ProductFunnelHero({
  product, variant, onVariantChange, qty, onQtyChange, onAddRef, subtitle,
}: {
  product: ShopifyProduct; variant: Variant | null; onVariantChange: (v: Variant) => void;
  qty: OfferQty; onQtyChange: (q: OfferQty) => void; onAddRef?: (fn: () => void) => void; subtitle?: string;
}) {
  const [searchParams] = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);
  const handle = product.node.handle;
  const offer = isOfferProduct(handle);
  const variants = product.node.variants.edges.map((e) => e.node);
  const current = variant ?? variants[0];
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const images = product.node.images?.edges?.map((e) => e.node) ?? [];
  const btnRef = useRef<HTMLButtonElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const count = offer ? qty : 1;
  const now = useOfferDate();

  // ?color= en ?size= uit advertenties of de keuzehulp.
  useEffect(() => {
    const c = searchParams.get("color");
    const s = searchParams.get("size");
    if (!c && !s) return;
    const p = partsOf(current);
    const color = c ? (variants.map((v) => partsOf(v).color).find((x) => x.toLowerCase() === c.toLowerCase()) ?? p.color) : p.color;
    const size = s ? (variants.map((v) => partsOf(v).size).find((x) => x.replace(/\s/g, "").toLowerCase().startsWith(s.replace(/cm/i, "").toLowerCase())) ?? p.size) : p.size;
    onVariantChange(findVariant(variants, color, size));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, product]);

  const add = () => {
    if (!current?.availableForSale) return;
    addItem({
      product,
      variantId: current.id,
      variantTitle: current.title,
      price: { amount: current.price.amount, currencyCode: current.price.currencyCode },
      quantity: count,
      selectedOptions: current.selectedOptions,
    });
  };
  onAddRef?.(add);

  useEffect(() => {
    const el = btnRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [product]);

  const unit = parseFloat(current.price.amount);

  return (
    <section id="kopen" className="container max-w-6xl scroll-mt-24 pb-6 pt-4 md:pt-10">
      <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-12">
        <div className="min-w-0 md:sticky md:top-24">
          <FunnelGallery images={images} title={product.node.title} chips={CHIPS[handle] ?? []} activeUrl={pickedImage} />
        </div>
        {handle === STEP_PRODUCT_HANDLE ? (
          <TrapFunnelPanel product={product} title={cleanTitle(product.node.title)} sub={subtitle} buttonRef={btnRef} onVariantImage={setPickedImage} />
        ) : (
          <ProductFunnelPanel
            product={product}
            title={cleanTitle(product.node.title)}
            sub={subtitle}
            highlights={blueprintFor(handle)?.benefits ?? []}
            variant={current}
            onVariantChange={(v) => {
              setPickedImage(v.image?.url ?? null);
              onVariantChange(v);
            }}
            qty={qty}
            onQtyChange={onQtyChange}
            onAdd={add}
            offer={offer}
            buttonRef={btnRef}
          />
        )}
      </div>
      {showSticky && handle !== STEP_PRODUCT_HANDLE && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden" data-print-hidden>
          <button type="button" disabled={!current.availableForSale} onClick={add} className="btn-glow h-12 w-full rounded-full text-base font-extrabold disabled:opacity-50">
            In winkelwagen · {formatPrice(offer ? quoteQty(unit, count, now).total : unit)}
          </button>
        </div>
      )}
    </section>
  );
}
