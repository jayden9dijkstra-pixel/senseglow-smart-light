import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStorefrontCheckout, ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

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
  bundlePackSize?: 2 | 3 | 4;
  bundleRate?: number;         // 0.08 | 0.12 | 0.15
  bundleDiscountCode?: string; // Shopify code applied at checkout
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;

  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string, isBundle?: boolean, packSize?: number) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<void>;
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

      addItem: (item) => {
        const { items } = get();

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
          toast.success('Bundel toegevoegd aan winkelwagen', {
            description: `${item.bundleName}${item.bundleVariantLabel ? ` — ${item.bundleVariantLabel}` : ''}`,
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
          toast.success('Toegevoegd aan winkelwagen', {
            description: `${item.product.node.title} (${existingItem.quantity + item.quantity}x)`,
          });
        } else {
          set({ items: [...items, item] });
          toast.success('Toegevoegd aan winkelwagen', {
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
        toast.info('Verwijderd uit winkelwagen');
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return;

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
        } catch {
          toast.error('Checkout mislukt', {
            description: 'Probeer het opnieuw.',
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
    }
  )
);
