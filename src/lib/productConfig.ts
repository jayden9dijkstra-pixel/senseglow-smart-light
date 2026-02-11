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

// The only active product handle (SenseGlow™ Ambient Motion Bar)
export const PRODUCT_HANDLE = "senseglow-ambient-motion-bar-1";

// Available sizes
export type SizeVariant = "20cm" | "30cm" | "40cm";

// Shopify ex-VAT prices per size (as stored in Shopify)
export const shopifyExVatPrices: Record<SizeVariant, number> = {
  "20cm": 37.15,
  "30cm": 41.28,
  "40cm": 49.55,
};

// Customer-facing inc-VAT prices per size
export const incVatPrices: Record<SizeVariant, string> = {
  "20cm": "44.95",
  "30cm": "49.95",
  "40cm": "59.95",
};

/**
 * Convert a Shopify ex-VAT price to inc-VAT display price.
 * Uses the known inc-VAT prices for accuracy (avoids rounding drift).
 */
export function getIncVatPrice(shopifyAmount: string): string {
  const exVat = parseFloat(shopifyAmount);
  // Match to known size by checking proximity to known ex-VAT prices
  for (const [size, exVatPrice] of Object.entries(shopifyExVatPrices)) {
    if (Math.abs(exVat - exVatPrice) < 0.50) {
      return incVatPrices[size as SizeVariant];
    }
  }
  // Fallback: calculate manually
  return (exVat * (1 + VAT_RATE)).toFixed(2);
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
    }
    // Handle combined values like "Silver-20cm TYPE-C"
    const match = value.match(/(\d+)cm/);
    if (match) {
      const num = match[1];
      if (num === "20") return "20cm";
      if (num === "30") return "30cm";
      if (num === "40") return "40cm";
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
export const bundlePricing = {
  "20cm": {
    basePrice: "39.95",
    two: { price: "74.95", originalPrice: "79.90", discount: "6%" },
    three: { price: "109.95", originalPrice: "119.85", discount: "8%" },
    five: { price: "169.95", originalPrice: "199.75", discount: "15%" },
  },
  "30cm": {
    basePrice: "49.95",
    two: { price: "94.95", originalPrice: "99.90", discount: "5%" },
    three: { price: "139.95", originalPrice: "149.85", discount: "7%" },
    five: { price: "219.95", originalPrice: "249.75", discount: "12%" },
  },
  "40cm": {
    basePrice: "59.95",
    two: { price: "114.95", originalPrice: "119.90", discount: "4%" },
    three: { price: "169.95", originalPrice: "179.85", discount: "6%" },
    five: { price: "269.95", originalPrice: "299.75", discount: "10%" },
  },
} as const;

// Bundle names for cart display
export const bundleNames: Record<number, string> = {
  2: "Night Safety Pack",
  3: "Home Glow Pack",
  5: "Whole Home Security Pack",
};

/**
 * Compute the ex-VAT unit price needed for a bundle so that
 * Shopify's checkout total (after adding 21% VAT) equals the bundle inc-VAT price.
 * 
 * targetExVatTotal = bundleIncVatPrice / 1.21
 * perUnitExVat = targetExVatTotal / quantity
 */
export function getBundleExVatUnitPrice(size: SizeVariant, quantity: 2 | 3 | 5): number {
  const tier = quantity === 2 ? "two" : quantity === 3 ? "three" : "five";
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
