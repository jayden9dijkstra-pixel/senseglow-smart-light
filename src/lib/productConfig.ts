/**
 * Product configuration & pricing
 *
 * - Shopify is the source of truth for variant pricing.
 * - Bundle discounts: 11% / 13% / 20% (Duo / Trio / Complete)
 */

export const VAT_RATE = 0.21;

// ─── Product handles ───────────────────────────────────
export const PRODUCT_HANDLE = "motion-sensor-led-night-light-type-c-usb-three-color-lamp-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting2026-01-27-10-33-46";
export const WAVE_PRODUCT_HANDLE = "motion-sensor-light-led-lamp-wireless-ultra-thin-usb-led-for-kitchen-cabinet-bedroom-wardrobe-indoor-lighting-night-light2026-03-08-17-30-58";
export const ARC_PRODUCT_HANDLE = "aluminium-led-wall-lamp-ip65-waterproof-8w-12w-outdoor-garden-lighting2026-02-20-02-48-52";
export const FLEX_PRODUCT_HANDLE = "night-light-led-usb-rechargeable-lamp-hanging-magnetic-desk-lamp-stepless-dimming-cabinet-closet-wardrobe-table-lamp2026-03-08-17-16-36";
// Solar is the rebranded Lantern (same Shopify handle)
export const LANTERN_PRODUCT_HANDLE = "solar-led-wall-lamp-with-motion-sensor-waterproof-tungsten-wire-bulb-for-outdoor-garden-decoration2026-03-08-17-16-37";
export const SOLAR_PRODUCT_HANDLE = LANTERN_PRODUCT_HANDLE;
export const STEP_PRODUCT_HANDLE = "willed-bewegingssensor-trapverlichting-oplaadbare-nachtlampje-draadloze-led-licht-auto-on-off-magnetische-stick-on-lampen-voor-trap-gang-kinderkamer-slaapkamer-badkamer-4-stuks2026-03-08-17-16-41";
export const SCONCE_PRODUCT_HANDLE = "camuucci-battery-operated-wall-sconces-set-of-2-rechargeable-battery-powered-wall-light-with-12000mah-not-hardwired-dimmable-wall-lamp-fixtures-for-bedroom-living-room-black-20-9-inches2026-01-28-07-27-56";

export const ENABLED_PRODUCT_HANDLES: string[] = [
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  ARC_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
  SCONCE_PRODUCT_HANDLE,
];

// ─── Centralized bundle discount tiers ─────────────────
// Single source of truth — used by all product configs and the cart engine.
export const BUNDLE_DISCOUNT_RATES = {
  two: 0.11,    // Duopak
  three: 0.13,  // Familiepak
  four: 0.20,   // Voordeelpak
} as const;

export const BUNDLE_DISCOUNT_LABELS = {
  two: "11%",
  three: "13%",
  four: "20%",
} as const;

/** Compute bundle pricing dynamically from any unit price (inc-VAT). */
export function computeBundlePricing(unitPrice: number) {
  const tier = (qty: 2 | 3 | 4, key: "two" | "three" | "four") => {
    const rate = BUNDLE_DISCOUNT_RATES[key];
    const original = unitPrice * qty;
    const price = original * (1 - rate);
    return {
      price: price.toFixed(2),
      originalPrice: original.toFixed(2),
      discount: BUNDLE_DISCOUNT_LABELS[key],
      save: (original - price).toFixed(2),
    };
  };
  return {
    basePrice: unitPrice.toFixed(2),
    two: tier(2, "two"),
    three: tier(3, "three"),
    four: tier(4, "four"),
  };
}

// ─── Standard size-based config (Original Ambient Bar) ──
export type SizeVariant = "20cm" | "30cm" | "40cm" | "50cm";

// Customer-facing inc-VAT prices per size (Ambient Bar)
export const incVatPrices: Record<SizeVariant, string> = {
  "20cm": "27.50",
  "30cm": "35.00",
  "40cm": "40.00",
  "50cm": "45.00",
};

export const shopifyExVatPrices: Record<SizeVariant, number> = {
  "20cm": 27.50,
  "30cm": 35.00,
  "40cm": 40.00,
  "50cm": 45.00,
};

export function getIncVatPrice(shopifyAmount: string): string {
  const price = parseFloat(shopifyAmount);
  for (const [size, knownPrice] of Object.entries(shopifyExVatPrices)) {
    if (Math.abs(price - knownPrice) < 0.50) return incVatPrices[size as SizeVariant];
  }
  return price.toFixed(2);
}

export function getSizeFromVariant(
  selectedOptions: Array<{ name: string; value: string }>
): SizeVariant | null {
  for (const opt of selectedOptions) {
    const value = opt.value.toLowerCase();
    const match = value.match(/(\d+)cm/) || value.match(/^(\d+)\s/);
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

export const sizeRecommendations = {
  small: "20cm" as SizeVariant,
  medium: "30cm" as SizeVariant,
  large: "40cm" as SizeVariant,
} as const;

// Bundle pricing per size (derived from centralized rates)
export const bundlePricing: Record<SizeVariant, ReturnType<typeof computeBundlePricing>> = {
  "20cm": computeBundlePricing(parseFloat(incVatPrices["20cm"])),
  "30cm": computeBundlePricing(parseFloat(incVatPrices["30cm"])),
  "40cm": computeBundlePricing(parseFloat(incVatPrices["40cm"])),
  "50cm": computeBundlePricing(parseFloat(incVatPrices["50cm"])),
};

export const bundleNames: Record<number, string> = {
  2: "Duopak",
  3: "Familiepak",
  4: "Voordeelpak",
};

export function getBundleExVatUnitPrice(size: SizeVariant, quantity: 2 | 3 | 4): number {
  const tier = quantity === 2 ? "two" : quantity === 3 ? "three" : "four";
  const bundleIncVat = parseFloat(bundlePricing[size][tier].price);
  const targetExVatTotal = bundleIncVat / (1 + VAT_RATE);
  return targetExVatTotal / quantity;
}

export function getProductUrl(size?: SizeVariant, color?: string): string {
  const params = new URLSearchParams();
  if (size) params.set("size", size);
  if (color) params.set("color", color);
  const qs = params.toString();
  return `/product/${PRODUCT_HANDLE}${qs ? `?${qs}` : ""}`;
}
