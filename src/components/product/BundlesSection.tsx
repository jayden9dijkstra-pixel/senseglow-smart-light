import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";
import {
  ProductKey, BundleTierKey, BUNDLE_TIERS, quoteBundle, bundleNames,
  HANDLE_TO_KEY,
} from "@/lib/productConfig";
import {
  buildVariantKey, getProductKeyFromHandle, parseVariantLabel,
} from "@/lib/productRegistry";

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

const TIER_BADGES: Partial<Record<BundleTierKey, { label: string; subtitle: string; popular: boolean; badge: string | null }>> = {
  two:   { label: "Duopak",       subtitle: "Ideaal om te starten",     popular: false, badge: null },
  three: { label: "Familiepak",   subtitle: "Voor het hele huis",        popular: true,  badge: "⭐ Meest gekozen" },
  four:  { label: "Voordeelpak",  subtitle: "Maximale besparing",        popular: false, badge: "Maximaal voordeel" },
  eight: { label: "Voordeelset",  subtitle: "Twee keer zoveel licht",   popular: true,  badge: "⭐ Meest gekozen" },
};

export const BundlesSection = ({ product, selectedVariant, headlineOverride }: BundlesSectionProps) => {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedBundle, setSelectedBundle] = useState<number | null>(0);

  const productKey: ProductKey | null = useMemo(() => {
    if (!product) return null;
    return getProductKeyFromHandle(product.node.handle);
  }, [product]);

  const tierKeys = useMemo<BundleTierKey[]>(() => {
    if (!productKey) return [];
    return Object.keys(BUNDLE_TIERS[productKey] || {}) as BundleTierKey[];
  }, [productKey]);

  // Determine effective unit price + variant for current selection
  const { unitPrice, currentVariant, variantLabel, variantKey } = useMemo(() => {
    if (!product || !productKey) {
      return { unitPrice: 0, currentVariant: null, variantLabel: "", variantKey: "" };
    }
    const v = selectedVariant
      || product.node.variants.edges[0]?.node;
    if (!v) return { unitPrice: 0, currentVariant: null, variantLabel: "", variantKey: "" };
    const parsed = parseVariantLabel(productKey, v.selectedOptions);
    return {
      unitPrice: parseFloat(v.price.amount),
      currentVariant: v,
      variantLabel: parsed.label,
      variantKey: buildVariantKey(productKey, v.selectedOptions),
    };
  }, [product, productKey, selectedVariant]);

  // Build bundle cards from tiers
  const bundles = useMemo(() => {
    if (!productKey) return [];
    return tierKeys.map((tk) => {
      const q = quoteBundle(productKey, tk, unitPrice);
      if (!q) return null;
      const meta = TIER_BADGES[tk]!;
      return {
        tierKey: tk,
        name: bundleNames[q.qty] || meta.label,
        quantity: q.qty,
        sizeLabel: variantLabel,
        label: meta.label,
        subtekst: meta.subtitle,
        price: q.price,
        originalPrice: q.originalPrice,
        discount: q.label,
        save: q.save,
        badge: meta.badge,
        popular: meta.popular,
        features: [
          `${q.qty}× ${product?.node.title || "SenseGlow™"}${variantLabel ? ` — ${variantLabel}` : ""}`,
          "Gratis verzending boven €50",
          `${q.label} korting`,
          "30 dagen retourrecht",
        ],
      };
    }).filter(Boolean) as Array<{
      tierKey: BundleTierKey;
      name: string; quantity: number; sizeLabel: string; label: string; subtekst: string;
      price: string; originalPrice: string; discount: string; save: string;
      badge: string | null; popular: boolean; features: string[];
    }>;
  }, [productKey, tierKeys, unitPrice, variantLabel, product]);

  // Auto-select highlighted bundle
  useEffect(() => {
    const popularIdx = bundles.findIndex((b) => b.popular);
    setSelectedBundle(popularIdx >= 0 ? popularIdx : 0);
  }, [bundles.length]);

  const handleAdd = (idx: number) => {
    if (!product || !currentVariant || !productKey) {
      toast.error("Selecteer eerst een variant");
      return;
    }
    const b = bundles[idx];
    if (!b) return;
    const perUnit = (parseFloat(b.price) / b.quantity).toFixed(2);
    addItem({
      product,
      variantId: currentVariant.id,
      variantTitle: currentVariant.title,
      price: { amount: perUnit, currencyCode: currentVariant.price.currencyCode },
      quantity: b.quantity,
      selectedOptions: currentVariant.selectedOptions,
      isBundle: true,
      bundleName: b.name,
      bundleSize: variantLabel,
      bundleIncVatTotal: b.price,
      productKey,
      variantKey,
      tierKey: b.tierKey,
    });
  };

  // Hide section if no tiers (e.g. Flex)
  if (!productKey || bundles.length === 0) return null;

  const headline = headlineOverride
    || (productKey === "sconce"
      ? "Eén set is genoeg, twee zorgen voor symmetrie"
      : "Meer kiezen, meer besparen");

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

          <div className={`grid gap-6 ${bundles.length === 1 ? "max-w-md mx-auto" : bundles.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "md:grid-cols-3"}`}>
            {bundles.map((b, idx) => {
              const isHighlighted = selectedBundle === idx;
              return (
                <Card
                  key={b.tierKey}
                  onClick={() => setSelectedBundle(idx)}
                  className={`
                    relative p-7 cursor-pointer transition-all duration-500 ease-out
                    ${isHighlighted
                      ? "border-glow shadow-[0_0_40px_-10px_hsl(var(--glow)/0.4)] -translate-y-1 bg-card"
                      : "border-foreground/10 hover:border-foreground/25 hover:-translate-y-0.5"}
                  `}
                >
                  {b.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-glow text-background border-0 px-3 py-1 text-[11px] uppercase tracking-wider font-medium">
                      {b.badge}
                    </Badge>
                  )}

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <h3 className="text-2xl font-bold text-foreground">{b.name}</h3>
                      {b.sizeLabel && (
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                          {b.sizeLabel}
                        </p>
                      )}
                      <p className={`text-sm font-medium ${isHighlighted ? "text-glow" : "text-foreground/70"}`}>
                        {b.label}
                      </p>
                      <p className="text-sm text-foreground/55">{b.subtekst}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-foreground">€{b.price}</span>
                        <span className="px-2 py-0.5 rounded-full bg-glow/10 text-glow text-xs font-semibold">
                          -{b.discount}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/40 line-through">Was €{b.originalPrice}</p>
                      <p className="text-sm text-glow font-medium">Je bespaart €{b.save}</p>
                    </div>

                    <ul className="space-y-2.5">
                      {b.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <Check className="w-4 h-4 text-glow mt-0.5 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={(e) => { e.stopPropagation(); handleAdd(idx); }}
                      className={`w-full rounded-full transition-all duration-500 ${isHighlighted ? "bg-glow text-background hover:bg-glow/90" : "bg-foreground/5 text-foreground hover:bg-foreground/10"}`}
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
