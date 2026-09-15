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
import { ShoppingCart, Minus, Plus, Trash2, Lock, Loader2, Package, Check, RotateCcw, Shield, Truck } from "lucide-react";
import { IdealIcon, PaypalIcon, KlarnaIcon, BancontactIcon } from "@/components/layout/PaymentIcons";
import { useCartStore } from "@/stores/cartStore";
import { getProductKeyFromHandle, parseVariantLabel } from "@/lib/productRegistry";

function formatVariantLabel(item: { product: { node: { handle: string } }; selectedOptions: Array<{ name: string; value: string }> }): string {
  const key = getProductKeyFromHandle(item.product.node.handle);
  if (key) {
    const parsed = parseVariantLabel(key, item.selectedOptions);
    if (parsed.label) return parsed.label;
  }
  return item.selectedOptions
    .map(o => o.value)
    .filter(v => {
      const lv = v.toLowerCase();
      return !lv.includes("colors in one") && !lv.includes("lamp") &&
             !lv.includes("type-c") && !lv.includes("waterproof");
    })
    .map(v => v.replace(/\s*type-c\s*/i, "").trim())
    .filter(Boolean)
    .join(" • ");
}

export function CartDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    items,
    isLoading,
    updateQuantity,
    removeItem,
    createCheckout,
    refreshPrices
  } = useCartStore();

  // Keep line prices in sync with the live Shopify variant prices so the
  // drawer total always matches the checkout subtotal.
  React.useEffect(() => {
    if (isOpen) refreshPrices();
  }, [isOpen, refreshPrices]);


  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Total inc-VAT, applying bundle discount per bundle line.
  const totalPrice = React.useMemo(() => {
    let total = 0;
    for (const item of items) {
      const lineGross = parseFloat(item.price.amount) * item.quantity;
      if (item.isBundle && item.bundleRate) {
        total += lineGross * (1 - item.bundleRate);
      } else {
        total += lineGross;
      }
    }
    return Math.round(total * 100) / 100;
  }, [items]);

  const totalSavings = React.useMemo(() => {
    let s = 0;
    for (const item of items) {
      if (item.isBundle && item.bundleRate) {
        s += parseFloat(item.price.amount) * item.quantity * item.bundleRate;
      }
    }
    return Math.round(s * 100) / 100;
  }, [items]);

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const checkoutUrl = useCartStore.getState().checkoutUrl;
      if (checkoutUrl) {
        setIsOpen(false);
        const checkoutWindow = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
        if (!checkoutWindow) {
          toast.error('Checkout kon niet openen', {
            description: 'Sta pop-ups toe en probeer het opnieuw.',
          });
        }
      }
    } catch {
      // handled by store
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Winkelwagen openen" className="relative text-primary hover:text-primary/80 hover:bg-transparent h-10 w-10">
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
                  {items.map((item, idx) => {
                    const lineGross = parseFloat(item.price.amount) * item.quantity;
                    const lineNet = item.isBundle && item.bundleRate ? lineGross * (1 - item.bundleRate) : lineGross;
                    const key = item.isBundle ? `${item.variantId}-bundle-${item.bundlePackSize}-${idx}` : item.variantId;
                    return (
                      <div key={key} className="flex gap-4 p-3 rounded-lg border border-border/50">
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
                          {item.isBundle ? (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <Package className="w-3.5 h-3.5 text-glow" />
                                <Badge variant="outline" className="text-[10px] border-glow/30 text-glow px-1.5 py-0">
                                  Bundel · {Math.round((item.bundleRate || 0) * 100)}%
                                </Badge>
                              </div>
                              <h4 className="font-medium text-sm">
                                {item.bundleName}
                                {item.bundleVariantLabel ? `, ${item.bundleVariantLabel}` : ""}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {item.product.node.title} · {item.quantity}×
                              </p>
                              <div className="flex items-baseline gap-2">
                                <p className="font-semibold text-foreground">€{lineNet.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground line-through">€{lineGross.toFixed(2)}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <h4 className="font-medium truncate">{item.product.node.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatVariantLabel(item)}
                              </p>
                              <p className="font-semibold">
                                €{lineGross.toFixed(2)}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeItem(item.variantId, item.isBundle, item.bundlePackSize)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>

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
                    );
                  })}
                </div>
              </div>

              <div className="flex-shrink-0 space-y-2 pt-4 border-t bg-background">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                  <Check className="h-4 w-4" />
                  <span>Gratis bezorgd, bij je thuis binnen 7-14 werkdagen</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between items-center text-sm text-glow">
                    <span>Bundelkorting</span>
                    <span>−€{totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Verzending</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Totaal</span>
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
                      <Lock className="w-4 h-4 mr-2" />
                      Veilig afrekenen
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-primary" />Gratis NL en BE</span>
                  <span className="flex items-center gap-1.5"><RotateCcw className="h-3.5 w-3.5 text-primary" />30 dagen retour</span>
                  <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" />1 jaar garantie</span>
                </div>
                <div className="flex items-center gap-2 pb-1">
                  <IdealIcon className="h-5 w-auto text-foreground/40" />
                  <BancontactIcon className="h-5 w-auto text-foreground/40" />
                  <PaypalIcon className="h-5 w-auto text-foreground/40" />
                  <KlarnaIcon className="h-5 w-auto text-foreground/40" />
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
