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
export const ProductHeroSection = ({
  product,
  selectedVariant: propVariant,
  onVariantChange
}: ProductHeroSectionProps) => {
  const [localVariant, setLocalVariant] = useState(product.node.variants.edges[0]?.node);
  const selectedVariant = propVariant ?? localVariant;
  const addItem = useCartStore(state => state.addItem);
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
      selectedOptions: selectedVariant.selectedOptions
    });
    toast.success("Toegevoegd aan winkelwagen!", {
      description: `${product.node.title} - ${selectedVariant.title}`,
      position: "top-center"
    });
  };
  const productImages = product.node.images?.edges?.map(edge => ({
    url: edge.node.url,
    altText: edge.node.altText
  })) || [];
  return <section className="py-10 md:py-16 bg-background animate-fade-in-slow">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Editorial grid with line separator */}
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left - Product Image Gallery */}
            <div className="relative lg:border-r border-foreground/10 lg:pr-10 pb-8 lg:pb-0">
              <ProductImageGallery images={productImages} productTitle={product.node.title} />
            </div>

            {/* Right - Product Info */}
            <div className="space-y-5 lg:pl-10 pt-8 lg:pt-0 border-t lg:border-t-0 border-foreground/10 text-left">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Veilig licht. Precies wanneer jij beweegt.
                </h1>
                
                <p className="text-base text-muted-foreground leading-relaxed">
                  Zachte nachtverlichting die je begeleidt zonder iemand wakker te maken.
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-bold text-foreground">
                  €{parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
                </span>
              </div>

              {/* Visual Variant Selector - Architectural tiles */}
              {product.node.variants.edges.length > 1 && <div className="space-y-3">
                  <label className="text-xs font-medium text-foreground/70 uppercase tracking-[0.15em]">Kies je variant:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.node.variants.edges.map((variant, index) => {
                  const isSelected = selectedVariant?.id === variant.node.id;
                  const microcopy = index === 0 ? "Meest gekozen" : index === 1 ? "Beste waarde" : "Voor grotere ruimtes";
                  return <div key={variant.node.id} onClick={() => handleVariantChange(variant.node)} className={`relative p-4 border cursor-pointer transition-all duration-300 ${isSelected ? 'border-glow' : 'border-foreground/10 hover:border-foreground/30'}`}>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{variant.node.title}</p>
                            
                            <p className="text-base font-medium text-foreground">
                              €{parseFloat(variant.node.price.amount).toFixed(2)}
                            </p>
                          </div>
                        </div>;
                })}
                  </div>
                </div>}

              {/* 3 Bullets */}
              <div className="space-y-2 py-4 border-y border-foreground/10">
                {["Automatische bewegingssensor", "Warm licht (2700K) - slaapvriendelijk", "Installatie zonder gereedschap"].map((bullet, i) => <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-glow flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{bullet}</span>
                  </div>)}
              </div>

              {/* Trust Guarantees */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-glow">✓</span>
                  <span>Gratis verzending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-glow">✓</span>
                  <span>30 dagen retour</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-glow">✓</span>
                  <span>1 jaar garantie</span>
                </div>
              </div>

              {/* CTA */}
              <Button onClick={handleAddToCart} size="lg" className="w-full text-sm px-10 py-6 h-auto font-medium tracking-wide rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500">
                Ervaar het licht
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};