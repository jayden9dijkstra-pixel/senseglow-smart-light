import { responsiveImg, shopifySized } from "@/lib/shopifyImage";
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
import { ShoppingCart, Minus, Plus, Trash2, Lock, Loader2, Check, RotateCcw, Shield, Truck, Lightbulb } from "lucide-react";
import { IdealIcon, PaypalIcon, KlarnaIcon, BancontactIcon } from "@/components/layout/PaymentIcons";
import { useCartStore, mergeCheckoutLines, offerLampCount } from "@/stores/cartStore";
import { cartUpsell } from "@/lib/quantityOffer";
import { previewCart, type CartPreview } from "@/lib/shopify";
import { formatVariantLabel } from "@/lib/productRegistry";
import { toast } from "sonner";
import { trackViewCart, numericVariantId, appendClickIdsToUrl } from "@/lib/adsTracking";
import { formatPrice } from "@/lib/price";
import { BLACK_FRIDAY_CART, BLACK_FRIDAY_DELIVERY, isBlackFriday } from "@/lib/blackFriday";
import { useOfferDate } from "@/hooks/useOfferDate";

export function CartDrawer() {
  const now = useOfferDate();
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    items,
    isLoading,
    updateQuantity,
    removeItem,
    createCheckout,
    refreshPrices,
    consumeCartOpenRequest
  } = useCartStore();
  const lastAddedAt = useCartStore(state => state.lastAddedAt);

  // Keep line prices in sync with the live Shopify variant prices so the
  // drawer total always matches the checkout subtotal.
  React.useEffect(() => {
    if (isOpen) refreshPrices();
  }, [isOpen, refreshPrices]);

  // Zichtbare bevestiging: de winkelwagen schuift open zodra er iets bij komt.
  React.useEffect(() => {
    if (lastAddedAt <= 0) return;
    setIsOpen(true);
    consumeCartOpenRequest();
  }, [lastAddedAt, consumeCartOpenRequest]);

  // Meet het openen van de winkelwagen.
  React.useEffect(() => {
    if (!isOpen || items.length === 0) return;
    trackViewCart(
      items.map((i) => ({
        item_id: numericVariantId(i.variantId),
        item_name: i.product.node.title,
        item_variant: i.variantTitle,
        price: parseFloat(i.price.amount),
        quantity: i.quantity,
      }))
    );
    // alleen bij openen meten
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);




  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotaal zonder korting; de korting toont Shopify zelf hieronder.
  const totalPrice = React.useMemo(
    () => Math.round(items.reduce((t, i) => t + parseFloat(i.price.amount) * i.quantity, 0) * 100) / 100,
    [items],
  );
  const lamps = offerLampCount(items);
  const blackFriday = isBlackFriday(now) && lamps > 0;
  const upsell = blackFriday ? BLACK_FRIDAY_CART : cartUpsell(lamps);

  // Shopify rekent de automatische korting 'Meer lampen' zelf uit; toon die
  // regels zodra de winkelwagen open staat.
  const [preview, setPreview] = React.useState<CartPreview | null>(null);
  React.useEffect(() => {
    if (!isOpen || items.length === 0) { setPreview(null); return; }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await previewCart(mergeCheckoutLines(items), []);
      if (!cancelled) setPreview(result);
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [isOpen, items]);
  const shopifyDiscounts = preview?.discounts.length ? preview.discounts : null;
  const shownTotal = shopifyDiscounts && preview ? preview.total : totalPrice;

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const created = useCartStore.getState().checkoutUrl;
      if (!created) return;
      // Behoud dezelfde herkomstgegevens; alleen de bestemming is dit tabblad.
      const checkoutUrl = await appendClickIdsToUrl(created);
      setIsOpen(false);
      window.location.assign(checkoutUrl);
    } catch {
      // De centrale winkelwagenlogica toont de fout; blijf hier om opnieuw te proberen.
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

      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Winkelwagen</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? (
              <span>Je winkelwagen is leeg</span>
            ) : (
              <>
                {totalItems}{" "}
                <span>{totalItems === 1 ? "artikel in je winkelwagen" : "artikelen in je winkelwagen"}</span>
              </>
            )}
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
                    const key = `${item.variantId}-${idx}`;
                    return (
                      <div key={key} className="flex gap-4 p-3 rounded-lg border border-border/50">
                        <div className="w-16 h-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img
                              src={shopifySized(item.product.node.images.edges[0].node.url, 200)}
                              alt={item.product.node.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          {(
                            <>
                              <h4 className="font-medium truncate">{item.product.node.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatVariantLabel(item.product.node.handle, item.selectedOptions)}
                              </p>
                              <p className="font-semibold">
                                {formatPrice(lineGross)}
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

                          {(
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
                {upsell && (
                  <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-sm text-foreground">
                    <Lightbulb className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{upsell}</span>
                  </div>
                )}
                {blackFriday && <p className="text-sm text-foreground" data-no-translate>{BLACK_FRIDAY_DELIVERY}</p>}
                <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                  <Check className="h-4 w-4" />
                  <span>Gratis bezorgd. Levering in 7-14 werkdagen</span>
                </div>
                {shopifyDiscounts?.map((d) => (
                  <div key={d.title} className="flex justify-between items-center text-sm text-glow">
                    <span data-no-translate>{d.title}</span>
                    <span>−{formatPrice(d.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Verzending</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Totaal</span>
                  <span className="text-xl font-bold">
                    {formatPrice(shownTotal)}
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
                  <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" />Naast je wettelijke garantie: 1 jaar extra functionele garantie van SenseGlow</span>
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
