import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStorefrontCheckout, fetchVariantPrices, ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';
import { trackAdsEvent, numericVariantId } from '@/lib/adsTracking';
import { trackSiteEvent } from '@/lib/siteAnalytics';
import { translateStatic as tr } from '@/i18n/I18nProvider';

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


function adsValue(items: CartItem[]): number {
  const total = items.reduce((sum, i) => {
    const gross = parseFloat(i.price.amount) * i.quantity;
    return sum + (i.isBundle && i.bundleRate ? gross * (1 - i.bundleRate) : gross);
  }, 0);
  return Math.round(total * 100) / 100;
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
  /** Quantity sent to Shopify. For bundles this equals the pack size. */
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  // ── Bundle metadata ─────────────────────────────────
  isBundle?: boolean;
  bundleName?: string;        // "Duopak"
  bundleVariantLabel?: string; // "30cm • Zwart"
  bundlePackSize?: 2 | 3 | 4 | 5;
  bundleRate?: number;         // 0.08 | 0.12 | 0.15
  bundleDiscountCode?: string; // Shopify code applied at checkout
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  /** Telt op bij elke toevoeging, zodat de winkelwagen zichtbaar opengaat. */
  lastAddedAt: number;

  addItem: (item: CartItem) => void;
  /** Meerdere regels van een zelf samengestelde bundel, met één melding. */
  addBundleItems: (items: CartItem[], message: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string, isBundle?: boolean, packSize?: number) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  consumeCartOpenRequest: () => void;
  createCheckout: () => Promise<void>;
  /** Re-sync every line's unit price with the live Shopify variant price. */
  refreshPrices: () => Promise<void>;
}

function bundleLineKey(item: Pick<CartItem, 'variantId' | 'bundlePackSize'>): string {
  return `${item.variantId}::${item.bundlePackSize}`;
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


      addBundleItems: (newItems, message) => {
        if (newItems.length === 0) return;
        const merged = [...get().items];
        for (const item of newItems) {
          const index = merged.findIndex(
            (i) => i.isBundle && bundleLineKey(i) === bundleLineKey(item)
          );
          if (index >= 0) {
            merged[index] = { ...merged[index], quantity: merged[index].quantity + item.quantity };
          } else {
            merged.push(item);
          }
        }
        set({ items: merged });
        set({ lastAddedAt: Date.now() });
        trackAdsEvent('add_to_cart', {
          value: adsValue(newItems),
          currency: 'EUR',
          items: toAdsItems(newItems),
        });
        void trackSiteEvent('add_to_cart', {
          itemName: newItems[0]?.product.node.title,
          value: adsValue(newItems),
        });
        toast.success(tr(message));
      },


      addItem: (item) => {
        const { items } = get();
        set({ lastAddedAt: Date.now() });
        trackAdsEvent('add_to_cart', {
          value: adsValue([item]),
          currency: 'EUR',
          items: toAdsItems([item]),
        });
        void trackSiteEvent('add_to_cart', {
          itemName: item.product.node.title,
          value: adsValue([item]),
        });


        if (item.isBundle && item.bundlePackSize) {
          // Bundles: stack identical (variant + pack size) lines
          const existing = items.find(
            (i) => i.isBundle && bundleLineKey(i) === bundleLineKey(item)
          );
          if (existing) {
            set({
              items: items.map((i) =>
                i.isBundle && bundleLineKey(i) === bundleLineKey(item)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            });
          } else {
            set({ items: [...items, item] });
          }
          toast.success(tr('Bundel toegevoegd aan winkelwagen'), {
            description: `${item.bundleName}${item.bundleVariantLabel ? `, ${item.bundleVariantLabel}` : ''}`,
          });
          return;
        }

        // Singles: merge by variantId
        const existingItem = items.find((i) => i.variantId === item.variantId && !i.isBundle);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId && !i.isBundle
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
            item.variantId === variantId && !item.isBundle ? { ...item, quantity } : item
          ),
        });
      },

      removeItem: (variantId, isBundle, packSize) => {
        set({
          items: get().items.filter((item) => {
            if (isBundle) {
              return !(item.isBundle && item.variantId === variantId && item.bundlePackSize === packSize);
            }
            return !(item.variantId === variantId && !item.isBundle);
          }),
        });
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
          // Merge identical variants across single + bundle lines so Shopify
          // gets one line per variant with combined quantity.
          const variantQty = new Map<string, number>();
          for (const i of items) {
            variantQty.set(i.variantId, (variantQty.get(i.variantId) || 0) + i.quantity);
          }
          const checkoutItems = Array.from(variantQty.entries()).map(([variantId, quantity]) => ({
            variantId,
            quantity,
          }));

          // Pick best discount code (highest absolute saving) among bundles.
          let bestCode: string | null = null;
          let bestSaving = 0;
          for (const i of items) {
            if (i.isBundle && i.bundleDiscountCode && i.bundleRate) {
              const saving = parseFloat(i.price.amount) * i.quantity * i.bundleRate;
              if (saving > bestSaving) {
                bestSaving = saving;
                bestCode = i.bundleDiscountCode;
              }
            }
          }

          const checkoutUrl = await createStorefrontCheckout(
            checkoutItems,
            bestCode ? [bestCode] : []
          );
          setCheckoutUrl(checkoutUrl);
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
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    }
  )
);
