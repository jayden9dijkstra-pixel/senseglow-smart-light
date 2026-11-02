import { Check } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import type { Angle } from "@/lib/angles";

type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];

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
