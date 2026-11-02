import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStorefrontCheckout, fetchVariantPrices, ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';
import { trackAdsEvent, numericVariantId } from '@/lib/adsTracking';
import { trackSiteEvent } from '@/lib/siteAnalytics';
import { translateStatic as tr } from '@/i18n/I18nProvider';
import { isOfferProduct, offerRate } from '@/lib/quantityOffer';

/** Zet cart-regels om naar het items-formaat dat Google Ads verwacht. */
function toAdsItems(items: CartItem[]) {
  return items.map((i) => ({
    item_id: numericVariantId(i.variantId),
    item_name: i.product.node.title,
    item_variant: i.variantTitle,
    price: parseFloat(i.price.amount),
    quantity: i.quantity,
  }));
}


/** Lampen die meedoen aan 'Meer lampen' (alles behalve Wall Lamp). */
export function offerLampCount(items: CartItem[]): number {
  return items.filter((i) => isOfferProduct(i.product.node.handle)).reduce((n, i) => n + i.quantity, 0);
}

/** Waarde incl. btw met dezelfde 'Meer lampen'-regel die Shopify toepast. */
function adsValue(items: CartItem[], cart: CartItem[] = items): number {
  const rate = offerRate(offerLampCount(cart));
  const total = items.reduce((sum, i) => {
    const gross = parseFloat(i.price.amount) * i.quantity;
    return sum + (isOfferProduct(i.product.node.handle) ? gross * (1 - rate) : gross);
  }, 0);
  return Math.round(total * 100) / 100;
}

/** Eén regel per variant, met opgetelde aantallen (zoals Shopify ze krijgt). */
export function mergeCheckoutLines(items: CartItem[]) {
  const variantQty = new Map<string, number>();
  for (const i of items) variantQty.set(i.variantId, (variantQty.get(i.variantId) || 0) + i.quantity);
  return Array.from(variantQty.entries()).map(([variantId, quantity]) => ({ variantId, quantity }));
}

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  /** Inc-VAT *unit* price of the underlying single Shopify variant. */
  price: {
    amount: string;
    currencyCode: string;
  };
  /** Quantity sent to Shopify. */
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  /** Telt op bij elke toevoeging, zodat de winkelwagen zichtbaar opengaat. */
  lastAddedAt: number;

  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  consumeCartOpenRequest: () => void;
  createCheckout: () => Promise<void>;
  /** Re-sync every line's unit price with the live Shopify variant price. */
  refreshPrices: () => Promise<void>;
}


export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      lastAddedAt: 0,

      refreshPrices: async () => {
        const { items } = get();
        if (items.length === 0) return;
        const prices = await fetchVariantPrices(items.map((i) => i.variantId));
        if (Object.keys(prices).length === 0) return;
        set({
          items: get().items.map((i) => {
            const live = prices[i.variantId];
            return live ? { ...i, price: { amount: live.amount, currencyCode: live.currencyCode } } : i;
          }),
        });
      },


      addItem: (item) => {
        const { items } = get();
        set({ lastAddedAt: Date.now() });
        trackAdsEvent('add_to_cart', {
          value: adsValue([item], [...items, item]),
          currency: 'EUR',
          items: toAdsItems([item]),
        });
        void trackSiteEvent('add_to_cart', {
          itemName: item.product.node.title,
          value: adsValue([item], [...items, item]),
        });


        // Eén regel per variant
        const existingItem = items.find((i) => i.variantId === item.variantId);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
          toast.success(tr('Toegevoegd aan winkelwagen'), {
            description: `${item.product.node.title} (${existingItem.quantity + item.quantity}x)`,
          });
        } else {
          set({ items: [...items, item] });
          toast.success(tr('Toegevoegd aan winkelwagen'), {
            description: item.product.node.title,
          });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        });
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((item) => item.variantId !== variantId) });
        toast.info(tr('Verwijderd uit winkelwagen'));
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),
      consumeCartOpenRequest: () => set({ lastAddedAt: 0 }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return;

        trackAdsEvent('begin_checkout', {
          value: adsValue(items),
          currency: 'EUR',
          items: toAdsItems(items),
        });
        void trackSiteEvent('begin_checkout', { value: adsValue(items) });


        setLoading(true);
        try {
          const variantQty = new Map<string, number>();
          for (const i of items) {
            variantQty.set(i.variantId, (variantQty.get(i.variantId) || 0) + i.quantity);
          }
          const checkoutItems = Array.from(variantQty.entries()).map(([variantId, quantity]) => ({
            variantId,
            quantity,
          }));

          // Geen kortingscodes: Shopify past 'Meer lampen' automatisch toe.
          const checkoutUrl = await createStorefrontCheckout(checkoutItems, []);
          setCheckoutUrl(checkoutUrl);

          // Succes-event: pas hier staat vast dat Shopify een afrekenlink gaf.
          // 'begin_checkout' hierboven blijft de intentie meten (de klik zelf).
          // Het verschil tussen beide events is het aantal mislukte pogingen.
          trackAdsEvent('checkout_reached', {
            value: adsValue(items),
            currency: 'EUR',
            items: toAdsItems(items),
          });
          void trackSiteEvent('checkout_reached', { value: adsValue(items) });
        } catch (error) {
          console.error('Checkout failed', {
            variantIds: items.map((i) => i.variantId),
            error,
          });
          toast.error(tr('Checkout mislukt'), {
            description: tr('Probeer het opnieuw.'),
          });
          throw new Error('Checkout failed');
        } finally {
          setLoading(false);
        }

      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      // v1: oude bundelregels worden gewone regels, één per variant.
      version: 1,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as { items?: CartItem[]; cartId?: string | null };
        const merged = new Map<string, CartItem>();
        for (const raw of state.items ?? []) {
          const { isBundle, bundleName, bundleVariantLabel, bundlePackSize, bundleRate, bundleDiscountCode, ...item } =
            raw as CartItem & Record<string, unknown>;
          void isBundle; void bundleName; void bundleVariantLabel; void bundlePackSize; void bundleRate; void bundleDiscountCode;
          const prev = merged.get(item.variantId);
          merged.set(item.variantId, prev ? { ...prev, quantity: prev.quantity + item.quantity } : (item as CartItem));
        }
        return { items: Array.from(merged.values()), cartId: state.cartId ?? null } as unknown as CartStore;
      },
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        // checkoutUrl bewust niet bewaren: een oude link mist de herkomstgegevens.
      }),
    }
  )
);
