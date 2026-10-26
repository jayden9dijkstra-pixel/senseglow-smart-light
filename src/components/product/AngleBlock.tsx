import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { kitVariant, PRODUCT_KITS, KITS_HEADING, type Angle, type Kit } from "@/lib/angles";

export { useAddKit };

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
    </div>
  );
}

/**
 * 'Voordeliger per set'. Met een invalshoek (?a=) staat de bijbehorende kit
 * bovenaan en voorgeselecteerd; de andere kits staan eronder.
 */
export function KitOffers({
  product,
  selectedVariant,
  preselectedKitId,
}: {
  product: ShopifyProduct;
  selectedVariant: Variant | null | undefined;
  preselectedKitId?: string;
}) {
  const addKit = useAddKit(product, selectedVariant);
  const all = PRODUCT_KITS[product.node.handle] ?? [];
  const kits = preselectedKitId
    ? [...all.filter((k) => k.id === preselectedKitId), ...all.filter((k) => k.id !== preselectedKitId)]
    : all;
  if (!kits.length) return null;
  return (
    <div className="space-y-2 rounded-2xl border border-foreground/10 p-4">
      <p className="text-sm font-semibold text-foreground">{KITS_HEADING}</p>
      <ul className="space-y-2">
        {kits.map((kit) => {
          const chosen = kit.id === preselectedKitId;
          return (
            <li
              key={kit.id}
              aria-current={chosen ? "true" : undefined}
              className={`flex flex-col gap-2 rounded-xl p-2 sm:flex-row sm:items-center sm:justify-between ${chosen ? "border border-primary bg-primary/5" : ""}`}
            >
              <span className="flex items-start gap-2 text-sm text-foreground/80">
                {chosen && <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />}
                {kit.label}
              </span>
              <Button
                variant={chosen ? "default" : "outline"}
                size="sm"
                onClick={() => addKit(kit)}
                className={`flex-shrink-0 rounded-full ${chosen ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border-primary/40 text-primary hover:bg-primary/10"}`}
              >
                {chosen ? `${kit.name} in winkelwagen` : `${kit.name} toevoegen`}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
