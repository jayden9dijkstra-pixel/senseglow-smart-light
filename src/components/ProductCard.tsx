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
    toast.success('Added to cart', {
      description: `${product.node.title} has been added to your cart.`,
    });
  };

  const imageUrl = product.node.images?.edges?.[0]?.node?.url;
  const price = selectedVariant?.price || product.node.priceRange.minVariantPrice;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.node.handle}`}>
        <div className="aspect-square bg-secondary/20 overflow-hidden cursor-pointer">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.node.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.node.title}</h3>
        {product.node.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.node.description}
          </p>
        )}
        <p className="text-2xl font-bold text-primary">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
        
        {product.node.variants.edges.length > 1 && (
          <div className="mt-3">
            <select
              className="w-full p-2 border rounded-md"
              value={selectedVariant?.id}
              onChange={(e) => {
                const variant = product.node.variants.edges.find(v => v.node.id === e.target.value)?.node;
                if (variant) setSelectedVariant(variant);
              }}
            >
              {product.node.variants.edges.map(({ node: variant }) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title} - {variant.price.currencyCode} {parseFloat(variant.price.amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full"
          disabled={!selectedVariant?.availableForSale}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};
