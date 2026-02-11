import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { getIncVatPrice } from "@/lib/productConfig";

import { ProductImageGallery } from "./ProductImageGallery";
import { VariantPicker } from "./VariantPicker";
import { Check, Truck, RotateCcw, Shield } from "lucide-react";

interface ProductHeroSectionProps {
  product: ShopifyProduct;
  selectedVariant?: ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null;
  onVariantChange?: (
    variant: ShopifyProduct["node"]["variants"]["edges"][0]["node"]
  ) => void;
}

export const ProductHeroSection = ({
  product,
  selectedVariant: propVariant,
  onVariantChange,
}: ProductHeroSectionProps) => {
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
        amount: getIncVatPrice(selectedVariant.price.amount),
        currencyCode: selectedVariant.price.currencyCode,
      },
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const productImages =
    product.node.images?.edges?.map((edge) => ({
      url: edge.node.url,
      altText: edge.node.altText,
    })) || [];

  // Get inc VAT price for display
  const displayPrice = selectedVariant
    ? getIncVatPrice(selectedVariant.price.amount)
    : "0.00";

  return (
    <section className="py-10 md:py-16 bg-background animate-fade-in-slow">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left - Product Image Gallery */}
            <div className="relative lg:border-r border-foreground/10 lg:pr-10 pb-8 lg:pb-0">
              <ProductImageGallery
                images={productImages}
                productTitle={product.node.title}
              />
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6 lg:pl-10 pt-8 lg:pt-0 border-t lg:border-t-0 border-foreground/10 text-left">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Veilig licht. Precies wanneer jij beweegt.
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Zachte nachtverlichting die je begeleidt zonder iemand wakker
                  te maken.
                </p>
              </div>

              {/* Price with animation */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-4">
                  <span
                    key={priceKey}
                    className="text-2xl font-bold text-foreground animate-fade-in"
                    style={{ animation: "fade-in 0.4s ease-out" }}
                  >
                    €{displayPrice}
                  </span>
                </div>
                
              </div>

              {/* Bundle CTA Link */}
              <button
                onClick={() => {
                  const bundlesSection = document.getElementById("bundels");
                  if (bundlesSection) {
                    bundlesSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    setTimeout(() => {
                      bundlesSection.classList.add("bundle-highlight");
                      setTimeout(() => {
                        bundlesSection.classList.remove("bundle-highlight");
                      }, 1000);
                    }, 600);
                  }
                }}
                className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-glow border border-glow/40 rounded-full bg-glow/5 hover:bg-glow/10 hover:border-glow/60 hover:shadow-[0_0_20px_-5px_hsl(var(--glow)/0.4)] transition-all duration-300"
              >
                <span>Voordeliger met bundels</span>
                <span className="group-hover:translate-y-0.5 transition-transform duration-300">↓</span>
              </button>

              {/* Premium Variant Picker */}
              {product.node.variants.edges.length > 1 && (
                <VariantPicker
                  product={product}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                />
              )}

              {/* 3 Bullets */}
              <div className="space-y-2 py-4 border-y border-foreground/10">
                {[
                  "Automatische bewegingssensor",
                  "Warm licht (2700K) - slaapvriendelijk",
                  "Installatie zonder gereedschap",
                ].map((bullet, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-glow flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Trust Guarantees */}
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-glow" />
                  <span>Gratis verzending</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-glow" />
                  <span>30 dagen retour</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-glow" />
                  <span>1 jaar garantie</span>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-sm px-10 py-6 h-auto font-medium tracking-wide rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500"
              >
                In winkelwagen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
