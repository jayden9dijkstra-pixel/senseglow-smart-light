import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";


import { ProductImageGallery } from "./ProductImageGallery";
import { getBeforeAfterPair } from "@/lib/beforeAfterImages";
import { VariantPicker } from "./VariantPicker";
import { Check, RotateCcw, Shield, Star, CreditCard } from "lucide-react";
import { getProductVideoUrl } from "@/lib/videos";

interface HeroContent {
  h1: string;
  subtitle: string;
  bundleCta: string;
  bullets: string[];
}

interface ProductHeroSectionProps {
  product: ShopifyProduct;
  selectedVariant?: ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null;
  onVariantChange?: (
    variant: ShopifyProduct["node"]["variants"]["edges"][0]["node"]
  ) => void;
  heroContent?: HeroContent;
}

export const ProductHeroSection = ({
  product,
  selectedVariant: propVariant,
  onVariantChange,
  heroContent,
}: ProductHeroSectionProps) => {
  const defaultContent: HeroContent = {
    h1: "Veilig licht. Precies wanneer jij beweegt.",
    subtitle: "Zachte nachtverlichting die je begeleidt zonder iemand wakker te maken.",
    bundleCta: "Voordeliger met bundels",
    bullets: [
      "Automatische bewegingssensor",
      "Warm licht (2700K), slaapvriendelijk",
      "Installatie zonder gereedschap",
    ],
  };
  const content = heroContent || defaultContent;
  const [searchParams] = useSearchParams();
  const [localVariant, setLocalVariant] = useState(
    product.node.variants.edges[0]?.node
  );
  const selectedVariant = propVariant ?? localVariant;
  const addItem = useCartStore((state) => state.addItem);
  const [priceKey, setPriceKey] = useState(0);

  // Handle URL params for variant selection (from quiz or bundle links)
  useEffect(() => {
    const sizeParam = searchParams.get("size");
    const colorParam = searchParams.get("color");

    if (sizeParam || colorParam) {
      const matchingVariant = product.node.variants.edges.find((variant) => {
        let sizeMatch = !sizeParam;
        let colorMatch = !colorParam;

        variant.node.selectedOptions.forEach((option) => {
          const name = option.name.toLowerCase();
          const value = option.value.toLowerCase();

          if (
            sizeParam &&
            (name === "maat" || name === "size" || name === "lengte")
          ) {
            sizeMatch = value.includes(sizeParam.toLowerCase().replace("cm", ""));
          }
          if (
            colorParam &&
            (name === "kleur" || name === "color" || name === "colour")
          ) {
            colorMatch = value.toLowerCase() === colorParam.toLowerCase();
          }
        });

        return sizeMatch && colorMatch;
      });

      if (matchingVariant) {
        handleVariantChange(matchingVariant.node);
      }
    }
  }, [searchParams, product]);

  const handleVariantChange = (
    variant: ShopifyProduct["node"]["variants"]["edges"][0]["node"]
  ) => {
    setLocalVariant(variant);
    onVariantChange?.(variant);
    setPriceKey((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: {
        amount: selectedVariant.price.amount,
        currencyCode: selectedVariant.price.currencyCode,
      },
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const beforeAfterPair = getBeforeAfterPair(product.node.handle);
  const productImages = [
    ...(product.node.images?.edges?.map((edge) => ({
      url: edge.node.url,
      altText: edge.node.altText,
    })) || []),
    ...(beforeAfterPair
      ? [{ url: beforeAfterPair.on, altText: beforeAfterPair.alt }]
      : []),
  ];

  const displayPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount).toFixed(2)
    : "0.00";

  return (
    <section id="product-hero" className="w-full overflow-hidden bg-background py-16 md:py-24 lg:py-32 animate-fade-in-slow">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div>
          <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] gap-0">
            {/* Left - Product Image Gallery */}
            <div className="relative md:border-r border-foreground/10 md:pr-8 pb-6 md:pb-0 md:max-h-[730px]">
              <ProductImageGallery
                images={productImages}
                productTitle={product.node.title}
                videoUrl={getProductVideoUrl(product.node.handle)}
              />
            </div>

            {/* Right - Product Info */}
            <div className="space-y-4 md:pl-8 pt-6 md:pt-0 border-t md:border-t-0 border-foreground/10 text-left">
              <div className="space-y-1.5">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-[1.08]">
                  {content.h1}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {content.subtitle}
                </p>
              </div>

              <a href="#reviews" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <span className="flex" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 text-muted-foreground/50" />
                  ))}
                </span>
                <span>Nog geen reviews, wees de eerste.</span>
              </a>

              {/* Price with animation */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-4">
                  <span
                    key={priceKey}
                    className="text-3xl font-bold text-primary animate-fade-in"
                    style={{ animation: "fade-in 0.4s ease-out" }}
                  >
                    €{displayPrice}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                  <Check className="h-4 w-4" />
                  <span>Gratis bezorgd, binnen 7-14 werkdagen na verwerking</span>
                </div>
              </div>

              {/* Premium Variant Picker */}
              {product.node.variants.edges.length > 1 && (
                <VariantPicker
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                />
              )}

              {/* 3 Bullets */}
              <div className="space-y-1.5 py-3 border-y border-foreground/10">
                {content.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-glow flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{bullet}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                disabled={!selectedVariant?.availableForSale}
                className="w-full min-h-12 text-sm px-10 py-4 h-auto font-medium tracking-wide rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500"
              >
                {selectedVariant?.availableForSale ? "In winkelwagen" : "Uitverkocht"}
              </Button>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground sm:grid-cols-3">
                <span className="flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5 text-primary" />30 dagen retour</span>
                <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" />1 jaar garantie</span>
                <span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-primary" />iDEAL / PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
