import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, Package } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { getSizeFromVariant, incVatPrices, SizeVariant } from "@/lib/productConfig";
import { calcSizeDiscount } from "@/lib/shopify";

export function CartDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { 
    items, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    createCheckout 
  } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total using greedy discount algorithm (matches checkout)
  const totalPrice = React.useMemo(() => {
    // Sum quantities per size across ALL items (bundles + singles)
    const sizeQuantities: Record<string, number> = {};
    let baseTotal = 0;

    for (const item of items) {
      const size = getSizeFromVariant(item.selectedOptions);
      if (size) {
        const sizeCm = size.replace("cm", "");
        sizeQuantities[sizeCm] = (sizeQuantities[sizeCm] || 0) + item.quantity;
        // Use inc-VAT price for base total
        baseTotal += parseFloat(incVatPrices[size]) * item.quantity;
      } else {
        // Fallback for items without recognizable size
        baseTotal += parseFloat(item.price.amount) * item.quantity;
      }
    }

    // Apply greedy discount per size
    let totalDiscount = 0;
    for (const [sizeCm, qty] of Object.entries(sizeQuantities)) {
      totalDiscount += calcSizeDiscount(sizeCm, qty);
    }

    return Math.round((baseTotal - totalDiscount) * 100) / 100;
  }, [items]);

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
        setIsOpen(false);
      }
    } catch {
      // Error already handled by cart store with toast notification
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-primary hover:text-primary/80 hover:bg-transparent h-10 w-10">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full glass-strong">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Winkelwagen</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Je winkelwagen is leeg" : `${totalItems} artikel${totalItems !== 1 ? 'en' : ''} in je winkelwagen`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Je winkelwagen is leeg</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-3 rounded-lg border border-border/50">
                      {/* Product image */}
                      <div className="w-16 h-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Bundle header */}
                        {item.isBundle ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <Package className="w-3.5 h-3.5 text-glow" />
                              <Badge variant="outline" className="text-[10px] border-glow/30 text-glow px-1.5 py-0">
                                Bundel
                              </Badge>
                            </div>
                            <h4 className="font-medium text-sm">
                              {item.bundleName} — {item.quantity}x {item.bundleSize}
                            </h4>
                            <p className="font-semibold text-foreground">
                              €{parseFloat(item.bundleIncVatTotal || "0").toFixed(2)}
                            </p>
                            
                          </>
                        ) : (
                          <>
                            <h4 className="font-medium truncate">{item.product.node.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.selectedOptions.map(option => option.value).join(' • ')}
                            </p>
                            <p className="font-semibold">
                              €{(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                            </p>
                            
                          </>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        {/* Only show +/- for non-bundle items */}
                        {!item.isBundle && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-shrink-0 space-y-4 pt-4 border-t bg-background">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold">Totaal</span>
                    
                  </div>
                  <span className="text-xl font-bold">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                  size="lg"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checkout aanmaken...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Afrekenen
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
