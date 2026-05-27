import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStorefrontCheckout, ShopifyProduct } from '@/lib/shopify';
import { toast } from 'sonner';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  // Bundle info (now: variantId IS the Shopify bundle variant, quantity is always 1)
  isBundle?: boolean;
  bundleName?: string;
  bundleSize?: string;          // e.g. "30cm + 50cm"
  bundleUnitCount?: number;     // 2, 3, 12, 16 — display only
  bundleIncVatTotal?: string;   // total price the user pays for the bundle
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;

  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<void>;
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

        // Bundle: variantId is the real Shopify bundle variant.
        // Stack quantities on the same bundle line if the user adds it twice.
        if (item.isBundle) {
          const existing = items.find((i) => i.isBundle && i.variantId === item.variantId);
          if (existing) {
            set({
              items: items.map((i) =>
                i.isBundle && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            });
          } else {
            set({ items: [...items, { ...item, quantity: 1 }] });
          }
          toast.success('Bundel toegevoegd aan winkelwagen', {
            description: `${item.bundleName}${item.bundleSize ? ` — ${item.bundleSize}` : ''}`,
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
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
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
          const checkoutItems = items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          }));
          const checkoutUrl = await createStorefrontCheckout(checkoutItems);
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
