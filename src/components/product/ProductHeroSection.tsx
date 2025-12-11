import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShopifyProduct } from "@/lib/shopify";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { ProductImageGallery } from "./ProductImageGallery";

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
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left - Product Image Gallery */}
          <div className="relative">
            <ProductImageGallery 
              images={productImages} 
              productTitle={product.node.title}
            />
          </div>

          {/* Right - Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {product.node.title} – Automatisch licht waar jij beweegt.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                Warm, veilig, energiezuinig. Voor trappen, gangen en slaapkamers.
              </p>
            </div>

            {/* Price & Variants */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-foreground">
                  €{parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
                </span>
                {product.node.variants.edges.length > 1 && (
                  <Badge variant="secondary">Meerdere opties beschikbaar</Badge>
                )}
              </div>

              {/* Variant selector */}
              {product.node.variants.edges.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kies maat:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.node.variants.edges.map((variant) => (
                      <Button
                        key={variant.node.id}
                        variant={selectedVariant?.id === variant.node.id ? "default" : "outline"}
                        onClick={() => handleVariantChange(variant.node)}
                        className={selectedVariant?.id === variant.node.id ? "bg-brand-orange hover:bg-brand-orange/90" : ""}
                      >
                        {variant.node.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3 Bullets */}
            <div className="space-y-3">
              {[
                "✓ Automatische sensor",
                "✓ Warm licht (2700K)",
                "✓ Installatie zonder gereedschap"
              ].map((bullet, i) => (
                <div key={i} className="flex items-center gap-3 text-lg">
                  <span className="text-brand-orange font-bold">{bullet.split(' ')[0]}</span>
                  <span className="text-foreground">{bullet.substring(2)}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white text-lg px-12 py-7 h-auto rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Voeg toe aan winkelmand
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
