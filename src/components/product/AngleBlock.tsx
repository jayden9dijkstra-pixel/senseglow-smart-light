import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { kitVariant, PRODUCT_KITS, KITS_HEADING, type Angle, type Kit } from "@/lib/angles";

type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];

function useAddKit(product: ShopifyProduct, selected: Variant | null | undefined) {
  const addItem = useCartStore((s) => s.addItem);
  return (kit: Kit) => {
    const variant = kitVariant(kit, selected, product.node.variants.edges.map((e) => e.node));
    if (!variant) return;
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: { amount: variant.price.amount, currencyCode: variant.price.currencyCode },
      quantity: kit.quantity,
      selectedOptions: variant.selectedOptions,
    });
  };
}

/** Hoekblok direct onder de titel. Zonder geldige ?a= de neutrale tekst. */
export function AngleBlock({
  angle,
  neutral,
  product,
  selectedVariant,
}: {
  angle: Angle | null;
  neutral: string;
  product: ShopifyProduct;
  selectedVariant: Variant | null | undefined;
}) {
  const addKit = useAddKit(product, selectedVariant);
  if (!angle) {
    return <p className="text-base text-muted-foreground leading-relaxed">{neutral}</p>;
  }
  return (
    <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 md:p-5">
      <p className="text-lg md:text-xl font-semibold text-foreground leading-snug">{angle.heading}</p>
      <ul className="space-y-1.5">
        {angle.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {angle.kit && (
        <div className="space-y-2 border-t border-primary/15 pt-3">
          <p className="text-sm font-medium text-foreground">{angle.kit.label}</p>
          <Button
            onClick={() => addKit(angle.kit!)}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {angle.kit.name} in winkelwagen
          </Button>
        </div>
      )}
    </div>
  );
}

/** 'Voordeliger per set': altijd zichtbaar op Ambient Motion Bar en Solar Lantern. */
export function KitOffers({
  product,
  selectedVariant,
  excludeKitId,
}: {
  product: ShopifyProduct;
  selectedVariant: Variant | null | undefined;
  excludeKitId?: string;
}) {
  const addKit = useAddKit(product, selectedVariant);
  const kits = (PRODUCT_KITS[product.node.handle] ?? []).filter((k) => k.id !== excludeKitId);
  if (!kits.length) return null;
  return (
    <div className="space-y-2 rounded-2xl border border-foreground/10 p-4">
      <p className="text-sm font-semibold text-foreground">{KITS_HEADING}</p>
      <ul className="space-y-2">
        {kits.map((kit) => (
          <li key={kit.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-foreground/80">{kit.label}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addKit(kit)}
              className="flex-shrink-0 rounded-full border-primary/40 text-primary hover:bg-primary/10"
            >
              {kit.name} toevoegen
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
