import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { isBundleVariant } from "@/lib/bundleVariants";
import {
  buildBundleQuote,
  getBundleConfig,
  getBundleDiscountCode,
  PackSize,
} from "@/lib/productConfig";
import { buildVariantKey, getProductKeyFromHandle, parseVariantLabel } from "@/lib/productRegistry";

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

type SingleVariant = ShopifyProduct["node"]["variants"]["edges"][number]["node"];

export const BundlesSection = ({ product, selectedVariant, headlineOverride }: BundlesSectionProps) => {
  const addItem = useCartStore((s) => s.addItem);

  const productKey = product ? getProductKeyFromHandle(product.node.handle) : null;
  const config = getBundleConfig(productKey);

  // Single (non-bundle) variants available for picking inside a bundle
  const singleVariants: SingleVariant[] = useMemo(
    () => (product ? product.node.variants.edges.map((e) => e.node).filter((v) => !isBundleVariant(v)) : []),
    [product]
  );

  // Track which single variant is currently selected for the bundle picker
  const [pickedVariantId, setPickedVariantId] = useState<string | null>(null);
  const [highlightedPack, setHighlightedPack] = useState<PackSize | null>(null);

  useEffect(() => {
    if (selectedVariant && !isBundleVariant(selectedVariant)) {
      setPickedVariantId(selectedVariant.id);
    } else if (singleVariants.length > 0 && !pickedVariantId) {
      setPickedVariantId(singleVariants[0].id);
    }
    // Auto-highlight 3-pack if offered, else the largest
    if (config.packSizes.length > 0) {
      const popular = config.packSizes.includes(3) ? 3 : config.packSizes[config.packSizes.length - 1];
      setHighlightedPack(popular);
    }
  }, [selectedVariant?.id, singleVariants.length, config.packSizes.join(",")]);

  if (!product || !productKey || config.packSizes.length === 0 || singleVariants.length === 0) {
    return null;
  }

  const pickedVariant = singleVariants.find((v) => v.id === pickedVariantId) || singleVariants[0];
  const unitPrice = parseFloat(pickedVariant.price.amount);
  const variantKey = buildVariantKey(productKey, pickedVariant.selectedOptions);
  const variantLabel = parseVariantLabel(productKey, pickedVariant.selectedOptions).label;

  const handleAdd = (pack: PackSize) => {
    const quote = buildBundleQuote(pack, unitPrice);
    const code = getBundleDiscountCode(productKey, pack, variantKey);
    addItem({
      product,
      variantId: pickedVariant.id,
      variantTitle: pickedVariant.title,
      price: { amount: unitPrice.toFixed(2), currencyCode: "EUR" },
      quantity: pack,
      selectedOptions: pickedVariant.selectedOptions,
      isBundle: true,
      bundleName: quote.label,
      bundleVariantLabel: variantLabel,
      bundlePackSize: pack,
      bundleRate: quote.rate,
      bundleDiscountCode: code || undefined,
    });
  };

  const headline = headlineOverride || "Meer kiezen, meer besparen";

  // Group variant options by name for cleaner pickers (e.g. Color, Size)
  // Build pickers from product.options, skipping bundle-only values
  const pickerOptions = product.node.options.map((opt) => {
    const seen = new Set<string>();
    const values: Array<{ value: string; variantId: string }> = [];
    for (const v of singleVariants) {
      const optVal = v.selectedOptions.find((o) => o.name === opt.name)?.value;
      if (!optVal || seen.has(optVal)) continue;
      // Skip placeholder option values
      if (/3 colors in one lamp/i.test(optVal)) continue;
      seen.add(optVal);
      values.push({ value: optVal, variantId: v.id });
    }
    return { name: opt.name, values };
  }).filter((o) => o.values.length > 1);

  const updatePicked = (optionName: string, newValue: string) => {
    const currentOpts = pickedVariant.selectedOptions.map((o) =>
      o.name === optionName ? { ...o, value: newValue } : o
    );
    const match = singleVariants.find((v) =>
      currentOpts.every((o) => v.selectedOptions.find((vo) => vo.name === o.name)?.value === o.value)
    );
    if (match) setPickedVariantId(match.id);
  };

  // Pretty option label maps
  const prettifyValue = (raw: string): string => {
    const v = raw.toLowerCase();
    if (v.includes("silver")) return "Zilver";
    if (v.includes("white") || v === "wit") return "Wit";
    if (v.includes("black") || v === "zwart") return "Zwart";
    const sz = v.match(/(\d{2,3})\s?cm/);
    if (sz) return `${sz[1]}cm`;
    if (v.includes("4-delige")) return "4-set";
    if (v.includes("8-delige")) return "8-set";
    return raw;
  };

  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 space-y-4">
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

          {/* Variant pickers for the whole bundle group */}
          {pickerOptions.length > 0 && (
            <div className="max-w-2xl mx-auto mb-10 space-y-4">
              {pickerOptions.map((opt) => {
                const currentVal = pickedVariant.selectedOptions.find((o) => o.name === opt.name)?.value;
                return (
                  <div key={opt.name} className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50 font-medium">
                      {/Emitting Color|Color|Kleur/i.test(opt.name) && opt.values.some(v => /cm/i.test(v.value)) ? "Maat & kleur" : opt.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map(({ value }) => {
                        const active = value === currentVal;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => updatePicked(opt.name, value)}
                            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                              active
                                ? "bg-glow text-background border-glow shadow-[0_0_20px_-8px_hsl(var(--glow)/0.6)]"
                                : "bg-card border-foreground/10 hover:border-foreground/30 text-foreground/80"
                            }`}
                          >
                            {prettifyValue(value)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div
            className={`grid gap-6 ${
              config.packSizes.length === 1
                ? "max-w-md mx-auto"
                : config.packSizes.length === 2
                ? "md:grid-cols-2 max-w-3xl mx-auto"
                : "md:grid-cols-3"
            }`}
          >
            {config.packSizes.map((pack) => {
              const quote = buildBundleQuote(pack, unitPrice);
              const isHighlighted = highlightedPack === pack;
              const badge = pack === 3 ? "⭐ Meest gekozen" : pack === 4 ? "Maximaal voordeel" : null;

              return (
                <Card
                  key={pack}
                  onClick={() => setHighlightedPack(pack)}
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
                      <h3 className="text-2xl font-bold text-foreground">{quote.label}</h3>
                      <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                        {pack}× {variantLabel || pickedVariant.title}
                      </p>
                      <p className="text-sm text-foreground/55">{quote.subtitle}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-foreground">
                          €{quote.total.toFixed(2)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-glow/10 text-glow text-xs font-semibold">
                          {quote.discountLabel}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/40 line-through">
                        Was €{quote.originalTotal.toFixed(2)}
                      </p>
                      <p className="text-sm text-glow font-medium">
                        Je bespaart €{quote.save.toFixed(2)}
                      </p>
                    </div>

                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2 text-sm text-foreground/70">
                        <Check className="w-4 h-4 text-glow mt-0.5 flex-shrink-0" />
                        <span>
                          {pack}× {product.node.title}
                          {variantLabel ? ` — ${variantLabel}` : ""}
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
                        handleAdd(pack);
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
