import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createStorefrontCheckout, ShopifyProduct, CheckoutBundleInfo } from '@/lib/shopify';
import { toast } from 'sonner';
import { bundleNames } from '@/lib/productConfig';

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
  // Bundle info
  isBundle?: boolean;
  bundleName?: string;
  bundleSize?: string;
  bundleIncVatTotal?: string; // The customer-facing inc VAT total for this bundle
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
        
        // For bundle items, always add as a new line (don't merge with existing)
        if (item.isBundle) {
          // Generate a unique key for this bundle entry
          const bundleKey = `${item.variantId}-bundle-${item.quantity}-${Date.now()}`;
          set({ items: [...items, { ...item, variantId: bundleKey, _originalVariantId: item.variantId } as CartItem & { _originalVariantId: string }] });
          toast.success('Bundel toegevoegd aan winkelwagen', {
            description: `${item.bundleName} — ${item.quantity}x ${item.bundleSize}`,
          });
          return;
        }
        
        // For single items, check if already in cart (non-bundle)
        const existingItem = items.find(i => i.variantId === item.variantId && !i.isBundle);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId && !i.isBundle
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
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
        const item = get().items.find(i => i.variantId === variantId);
        // Prevent quantity changes on bundle items
        if (item?.isBundle) return;
        
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
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
          // Convert cart items to checkout items, using original variant IDs for bundles
          const checkoutItems = items.map(item => {
            const originalVariantId = (item as CartItem & { _originalVariantId?: string })._originalVariantId || item.variantId;
            return {
              variantId: originalVariantId,
              quantity: item.quantity,
            };
          });

          // Collect bundle info for discount codes
          const bundleInfos: CheckoutBundleInfo[] = items
            .filter(item => item.isBundle && item.bundleSize)
            .map(item => ({
              bundleSize: item.bundleSize!,
              quantity: item.quantity,
            }));
          
          const checkoutUrl = await createStorefrontCheckout(checkoutItems, bundleInfos);
          setCheckoutUrl(checkoutUrl);
        } catch {
          toast.error('Checkout mislukt', {
            description: 'Probeer het opnieuw.',
          });
          throw new Error('Checkout failed');
        } finally {
          setLoading(false);
        }
      }
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
