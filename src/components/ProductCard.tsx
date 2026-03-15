import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState(product.node.variants.edges[0]?.node);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
  };

  const imageUrl = product.node.images?.edges?.[0]?.node?.url;
  const price = selectedVariant?.price || product.node.priceRange.minVariantPrice;

  return (
    <Card className="overflow-hidden glass hover:shadow-lg hover:shadow-glow/5 transition-all duration-500 hover:-translate-y-1 group">
      <Link to={`/product/${product.node.handle}`}>
        <div className="aspect-square bg-muted/10 overflow-hidden cursor-pointer">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.node.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Geen afbeelding
          </div>
        )}
        </div>
      </Link>
      <CardContent className="p-5">
        <Link to={`/product/${product.node.handle}`}>
          <h3 className="font-bold text-base mb-2 hover:text-glow transition-colors duration-300 uppercase tracking-[0.15em]">
            {product.node.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-glow text-sm">★</span>
          ))}
          <span className="text-xs text-muted-foreground ml-1">4.7/5</span>
        </div>
        <p className="text-xl font-bold text-foreground mb-4">
          €{parseFloat(price.amount).toFixed(2)}
        </p>
        
        {product.node.variants.edges.length > 1 && (
          <div className="mb-3">
            <select
              className="w-full p-2 border border-border rounded-lg text-sm bg-background/50"
              value={selectedVariant?.id}
              onChange={(e) => {
                const variant = product.node.variants.edges.find(v => v.node.id === e.target.value)?.node;
                if (variant) setSelectedVariant(variant);
              }}
            >
              {product.node.variants.edges.map(({ node: variant }) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title} - €{parseFloat(variant.price.amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium uppercase text-sm tracking-[0.15em] rounded-full hover:shadow-[0_0_20px_-5px_hsl(var(--glow)/0.3)] transition-all duration-500"
          disabled={!selectedVariant?.availableForSale}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {selectedVariant?.availableForSale ? 'Voeg toe' : 'Uitverkocht'}
        </Button>
      </CardFooter>
    </Card>
  );
};
