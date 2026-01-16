import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ProductImageGallery } from "./ProductImageGallery";
import { Check } from "lucide-react";

interface ProductHeroSectionProps {
  product: ShopifyProduct;
  selectedVariant?: ShopifyProduct['node']['variants']['edges'][0]['node'] | null;
  onVariantChange?: (variant: ShopifyProduct['node']['variants']['edges'][0]['node']) => void;
}

export const ProductHeroSection = ({ product, selectedVariant: propVariant, onVariantChange }: ProductHeroSectionProps) => {
  const [localVariant, setLocalVariant] = useState(product.node.variants.edges[0]?.node);
  const selectedVariant = propVariant ?? localVariant;
  const addItem = useCartStore((state) => state.addItem);

  const handleVariantChange = (variant: ShopifyProduct['node']['variants']['edges'][0]['node']) => {
    setLocalVariant(variant);
    onVariantChange?.(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success("Toegevoegd aan winkelwagen!", {
      description: `${product.node.title} - ${selectedVariant.title}`,
      position: "top-center",
    });
  };

  const productImages = product.node.images?.edges?.map(edge => ({
    url: edge.node.url,
    altText: edge.node.altText
  })) || [];

  return (
    <section className="py-12 md:py-20 bg-background animate-fade-in-slow">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left - Product Image Gallery - breathes in page space */}
          <div className="relative px-4 md:px-8 lg:px-12">
            <ProductImageGallery 
              images={productImages} 
              productTitle={product.node.title}
            />
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Veilig licht. Precies wanneer jij beweegt.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                Zachte nachtverlichting die je begeleidt zonder iemand wakker te maken.
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-foreground">
                €{parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
              </span>
            </div>

            {/* Visual Variant Selector - Architectural tiles */}
            {product.node.variants.edges.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground tracking-wide">Kies je variant:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.node.variants.edges.map((variant, index) => {
                    const isSelected = selectedVariant?.id === variant.node.id;
                    const microcopy = index === 0 ? "Meest gekozen" : index === 1 ? "Beste waarde" : "Voor grotere ruimtes";
                    
                    return (
                      <div
                        key={variant.node.id}
                        onClick={() => handleVariantChange(variant.node)}
                        className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-300 bg-secondary ${
                          isSelected 
                            ? 'border-glow' 
                            : 'border-border hover:border-glow/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">{variant.node.title}</p>
                          <p className="text-sm text-muted-foreground">{microcopy}</p>
                          <p className="text-lg font-medium text-foreground">
                            €{parseFloat(variant.node.price.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3 Bullets */}
            <div className="space-y-2">
              {[
                "Automatische bewegingssensor",
                "Warm licht (2700K) - slaapvriendelijk",
                "Installatie zonder gereedschap"
              ].map((bullet, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-glow flex-shrink-0" />
                  <span className="text-foreground">{bullet}</span>
                </div>
              ))}
            </div>

            {/* Trust Guarantees before CTA */}
            <div className="flex flex-wrap gap-4 py-3 border-y border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-glow">✓</span>
                <span>Gratis verzending</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-glow">✓</span>
                <span>30 dagen retour</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-glow">✓</span>
                <span>1 jaar garantie</span>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full text-lg px-12 py-7 h-auto rounded-full font-semibold"
            >
              Ervaar het licht
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
