/**
 * Single product configuration
 * This app is a single-product store with 3 size variants
 */

// The only active product handle (SenseGlow™ Ambient Motion Bar)
export const PRODUCT_HANDLE = "senseglow-ambient-motion-bar-1";

// Available sizes
export type SizeVariant = "20cm" | "30cm" | "40cm";

// Size recommendations based on room type
export const sizeRecommendations = {
  small: "20cm" as SizeVariant,   // Small/narrow spaces
  medium: "30cm" as SizeVariant,  // Medium spaces (hallways, kitchens, stairs, bedside)
  large: "40cm" as SizeVariant,   // Wide or long areas
} as const;

// Bundle pricing configuration
export const bundlePricing = {
  "20cm": {
    basePrice: "34.95",
    two: { price: "66.95", originalPrice: "69.90", discount: "5%" },
    three: { price: "94.95", originalPrice: "104.85", discount: "10%" },
    five: { price: "149.95", originalPrice: "174.75", discount: "15%" }
  },
  "30cm": {
    basePrice: "44.95",
    two: { price: "81.00", originalPrice: "89.90", discount: "10%" },
    three: { price: "115.00", originalPrice: "134.85", discount: "15%" },
    five: { price: "180.00", originalPrice: "224.75", discount: "20%" }
  },
  "40cm": {
    basePrice: "54.95",
    two: { price: "99.95", originalPrice: "109.90", discount: "10%" },
    three: { price: "139.95", originalPrice: "164.85", discount: "15%" },
    five: { price: "219.95", originalPrice: "274.75", discount: "20%" }
  }
} as const;

// Helper to get product URL with variant selection
export function getProductUrl(size?: SizeVariant, color?: string): string {
  const params = new URLSearchParams();
  if (size) params.set("size", size);
  if (color) params.set("color", color);
  const queryString = params.toString();
  return `/product/${PRODUCT_HANDLE}${queryString ? `?${queryString}` : ""}`;
}
