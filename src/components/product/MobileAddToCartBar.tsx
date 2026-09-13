import { useEffect, useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

type ProductVariant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];

interface MobileAddToCartBarProps {
  product: ShopifyProduct;
  selectedVariant: ProductVariant | null;
}

export function MobileAddToCartBar({ product, selectedVariant }: MobileAddToCartBarProps) {
  const [visible, setVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const image = product.node.images.edges[0]?.node;

  useEffect(() => {
    const hero = document.getElementById("product-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const handleAdd = () => {
    if (!selectedVariant?.availableForSale) return;
    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  if (!selectedVariant) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-lg backdrop-blur-xl transition-transform duration-300 md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="h-12 w-12 flex-none overflow-hidden rounded-md bg-muted">
          {image && <img src={image.url} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{product.node.title}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="font-semibold text-primary">€{parseFloat(selectedVariant.price.amount).toFixed(2)}</span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" /> Nog geen reviews
            </span>
          </div>
        </div>
        <Button
          onClick={handleAdd}
          disabled={!selectedVariant.availableForSale}
          size="icon"
          className="h-12 w-12 flex-none rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          aria-label="In winkelwagen"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}