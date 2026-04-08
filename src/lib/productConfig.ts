/**
 * Single product configuration
 * This app is a single-product store with 3 size variants
 * 
 * PRICING ARCHITECTURE:
 * - Shopify stores prices EXCLUDING VAT (ex VAT)
 * - Frontend displays prices INCLUDING 21% VAT (inc VAT)
 * - Shopify adds 21% VAT at checkout
 * - Bundle discounts are handled by Loveable, not Shopify
 */

export const VAT_RATE = 0.21;

// Active product handles — only products listed here will appear on the site.
// To add a new product: add its Shopify handle to this array AND create its config/page.
export const PRODUCT_HANDLE = "motion-sensor-led-night-light-type-c-usb-three-color-lamp-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting2026-01-27-10-33-46";
export const WAVE_PRODUCT_HANDLE = "motion-sensor-light-led-lamp-wireless-ultra-thin-usb-led-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting-night-light2026-03-08-17-30-58";
export const ARC_PRODUCT_HANDLE = "aluminium-led-wall-lamp-ip65-waterproof-8w-12w-outdoor-garden-lighting2026-02-20-02-48-52";
export const FLEX_PRODUCT_HANDLE = "night-light-led-usb-rechargeable-lamp-hanging-magnetic-desk-lamp-stepless-dimming-cabinet-closet-wardrobe-table-lamp2026-03-08-17-16-36";

/** Whitelist of product handles that are enabled on the website. */
export const ENABLED_PRODUCT_HANDLES: string[] = [
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  ARC_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
];

// Available sizes
export type SizeVariant = "20cm" | "30cm" | "40cm" | "50cm";

// Shopify prices per size (as stored in Shopify — these ARE the customer-facing prices)
export const shopifyExVatPrices: Record<SizeVariant, number> = {
  "20cm": 27.50,
  "30cm": 35.00,
  "40cm": 40.00,
  "50cm": 45.00,
};

// Customer-facing inc-VAT prices per size
export const incVatPrices: Record<SizeVariant, string> = {
  "20cm": "27.50",
  "30cm": "35.00",
  "40cm": "40.00",
  "50cm": "45.00",
};

/**
 * Convert a Shopify price to display price.
 * Shopify prices now match customer-facing prices directly.
 * Uses the known prices for accuracy (avoids rounding drift).
 */
export function getIncVatPrice(shopifyAmount: string): string {
  const price = parseFloat(shopifyAmount);
  // Match to known size by checking proximity to known prices
  for (const [size, knownPrice] of Object.entries(shopifyExVatPrices)) {
    if (Math.abs(price - knownPrice) < 0.50) {
      return incVatPrices[size as SizeVariant];
    }
  }
  // Fallback: return as-is (prices are already customer-facing)
  return price.toFixed(2);
}

/**
 * Get the size from a Shopify variant's selectedOptions
 */
export function getSizeFromVariant(
  selectedOptions: Array<{ name: string; value: string }>
): SizeVariant | null {
  for (const opt of selectedOptions) {
    const name = opt.name.toLowerCase();
    const value = opt.value.toLowerCase();
    if (name === "maat" || name === "size" || name === "lengte") {
      if (value.includes("20")) return "20cm";
      if (value.includes("30")) return "30cm";
      if (value.includes("40")) return "40cm";
      if (value.includes("50")) return "50cm";
    }
    const match = value.match(/(\d+)cm/);
    if (match) {
      const num = match[1];
      if (num === "20") return "20cm";
      if (num === "30") return "30cm";
      if (num === "40") return "40cm";
      if (num === "50") return "50cm";
    }
  }
  return null;
}

// Size recommendations based on room type
export const sizeRecommendations = {
  small: "20cm" as SizeVariant,
  medium: "30cm" as SizeVariant,
  large: "40cm" as SizeVariant,
} as const;

// Bundle pricing configuration (all prices INC VAT, customer-facing)
export const bundlePricing: Record<SizeVariant, {
  basePrice: string;
  two: { price: string; originalPrice: string; discount: string; save: string };
  three: { price: string; originalPrice: string; discount: string; save: string };
  four: { price: string; originalPrice: string; discount: string; save: string };
}> = {
  "20cm": {
    basePrice: "27.50",
    two: { price: "49.50", originalPrice: "55.00", discount: "10%", save: "5.50" },
    three: { price: "66.00", originalPrice: "82.50", discount: "20%", save: "16.50" },
    four: { price: "82.50", originalPrice: "110.00", discount: "25%", save: "27.50" },
  },
  "30cm": {
    basePrice: "35.00",
    two: { price: "63.00", originalPrice: "70.00", discount: "10%", save: "7.00" },
    three: { price: "84.00", originalPrice: "105.00", discount: "20%", save: "21.00" },
    four: { price: "105.00", originalPrice: "140.00", discount: "25%", save: "35.00" },
  },
  "40cm": {
    basePrice: "40.00",
    two: { price: "72.00", originalPrice: "80.00", discount: "10%", save: "8.00" },
    three: { price: "96.00", originalPrice: "120.00", discount: "20%", save: "24.00" },
    four: { price: "120.00", originalPrice: "160.00", discount: "25%", save: "40.00" },
  },
  "50cm": {
    basePrice: "45.00",
    two: { price: "81.00", originalPrice: "90.00", discount: "10%", save: "9.00" },
    three: { price: "108.00", originalPrice: "135.00", discount: "20%", save: "27.00" },
    four: { price: "135.00", originalPrice: "180.00", discount: "25%", save: "45.00" },
  },
} as const;

// Bundle names for cart display
export const bundleNames: Record<number, string> = {
  2: "Duo Set",
  3: "Meest gekozen",
  4: "Complete Set",
};

/**
 * Compute the ex-VAT unit price needed for a bundle so that
 * Shopify's checkout total (after adding 21% VAT) equals the bundle inc-VAT price.
 * 
 * targetExVatTotal = bundleIncVatPrice / 1.21
 * perUnitExVat = targetExVatTotal / quantity
 */
export function getBundleExVatUnitPrice(size: SizeVariant, quantity: 2 | 3 | 4): number {
  const tier = quantity === 2 ? "two" : quantity === 3 ? "three" : "four";
  const bundleIncVat = parseFloat(bundlePricing[size][tier].price);
  const targetExVatTotal = bundleIncVat / (1 + VAT_RATE);
  return targetExVatTotal / quantity;
}

// Helper to get product URL with variant selection
export function getProductUrl(size?: SizeVariant, color?: string): string {
  const params = new URLSearchParams();
  if (size) params.set("size", size);
  if (color) params.set("color", color);
  const queryString = params.toString();
  return `/product/${PRODUCT_HANDLE}${queryString ? `?${queryString}` : ""}`;
}
