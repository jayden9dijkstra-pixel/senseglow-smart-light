import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { extractBundleVariants, BundleVariant } from "@/lib/bundleVariants";

interface BundlesSectionProps {
  product?: ShopifyProduct;
  selectedVariant?: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    selectedOptions: Array<{ name: string; value: string }>;
  };
  headlineOverride?: string;
}

export const BundlesSection = ({ product, headlineOverride }: BundlesSectionProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  const bundles: BundleVariant[] = useMemo(
    () => (product ? extractBundleVariants(product) : []),
    [product]
  );

  // Auto-highlight the popular bundle
  useEffect(() => {
    const popularIdx = bundles.findIndex((b) => b.popular);
    setSelectedIdx(popularIdx >= 0 ? popularIdx : 0);
  }, [bundles.length]);

  if (!product || bundles.length === 0) return null;

  const handleAdd = (b: BundleVariant) => {
    addItem({
      product,
      variantId: b.variantId,
      variantTitle: b.variantTitle,
      price: { amount: b.price.toFixed(2), currencyCode: "EUR" },
      quantity: 1,
      selectedOptions: b.selectedOptions,
      isBundle: true,
      bundleName: b.niceLabel,
      bundleSize: b.contents,
      bundleUnitCount: b.quantity,
      bundleIncVatTotal: b.price.toFixed(2),
    });
  };

  const headline = headlineOverride || "Meer kiezen, meer besparen";

  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              Bundels
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {headline}
            </h2>
            <p className="text-sm md:text-base text-foreground/60 max-w-2xl mx-auto">
              90% van onze klanten kiest voor meer dan één lamp.
            </p>
          </div>

          <div
            className={`grid gap-6 ${
              bundles.length === 1
                ? "max-w-md mx-auto"
                : bundles.length === 2
                ? "md:grid-cols-2 max-w-3xl mx-auto"
                : "md:grid-cols-3"
            }`}
          >
            {bundles.map((b, idx) => {
              const isHighlighted = selectedIdx === idx;
              const badge = b.popular
                ? "⭐ Meest gekozen"
                : b.quantity >= 4
                ? "Maximaal voordeel"
                : null;

              return (
                <Card
                  key={b.variantId}
                  onClick={() => setSelectedIdx(idx)}
                  className={`
                    relative p-7 cursor-pointer transition-all duration-500 ease-out
                    ${
                      isHighlighted
                        ? "border-glow shadow-[0_0_40px_-10px_hsl(var(--glow)/0.4)] -translate-y-1 bg-card"
                        : "border-foreground/10 hover:border-foreground/25 hover:-translate-y-0.5"
                    }
                  `}
                >
                  {badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-glow text-background border-0 px-3 py-1 text-[11px] uppercase tracking-wider font-medium">
                      {badge}
                    </Badge>
                  )}

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <h3 className="text-2xl font-bold text-foreground">{b.niceLabel}</h3>
                      {b.contents && (
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                          {b.contents}
                        </p>
                      )}
                      {b.subtitle && (
                        <p className="text-sm text-foreground/55">{b.subtitle}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-foreground">
                          €{b.price.toFixed(2)}
                        </span>
                        {b.discountLabel && (
                          <span className="px-2 py-0.5 rounded-full bg-glow/10 text-glow text-xs font-semibold">
                            {b.discountLabel}
                          </span>
                        )}
                      </div>
                      {b.comparePrice && (
                        <p className="text-sm text-foreground/40 line-through">
                          Was €{b.comparePrice.toFixed(2)}
                        </p>
                      )}
                      {b.savings > 0 && (
                        <p className="text-sm text-glow font-medium">
                          Je bespaart €{b.savings.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4 text-glow mt-0.5 flex-shrink-0" />
                        <span>
                          {b.quantity}× {product.node.title}
                          {b.contents ? ` — ${b.contents}` : ""}
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4 text-glow mt-0.5 flex-shrink-0" />
                        <span>Gratis verzending boven €50</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4 text-glow mt-0.5 flex-shrink-0" />
                        <span>1 jaar garantie</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4 text-glow mt-0.5 flex-shrink-0" />
                        <span>30 dagen retourrecht</span>
                      </li>
                    </ul>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdd(b);
                      }}
                      className={`w-full rounded-full transition-all duration-500 ${
                        isHighlighted
                          ? "bg-glow text-background hover:bg-glow/90"
                          : "bg-foreground/5 text-foreground hover:bg-foreground/10"
                      }`}
                      size="lg"
                    >
                      In winkelwagen
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
