/**
 * Product configuration & per-product bundle tiers
 *
 * - Shopify is the source of truth for variant pricing.
 * - Bundle discount % per product (see BUNDLE_TIERS below).
 */

export const VAT_RATE = 0.21;

// ─── Product handles ───────────────────────────────────
export const PRODUCT_HANDLE = "senseglow_ambient_motion_bar";
export const WAVE_PRODUCT_HANDLE = "senseglow_wave";
export const ARC_PRODUCT_HANDLE = "aluminium-led-wall-lamp-ip65-waterproof-8w-12w-outdoor-garden-lighting2026-02-20-02-48-52";
export const FLEX_PRODUCT_HANDLE = "senseglow_flex";
export const LANTERN_PRODUCT_HANDLE = "senseglow_solar_lantern";
export const SOLAR_PRODUCT_HANDLE = LANTERN_PRODUCT_HANDLE;
// "Step" product is now sold as the SenseGlow Wall Lamp™ (4-set / 8-set)
export const STEP_PRODUCT_HANDLE = "senseglow_wall_lamp";
export const SCONCE_PRODUCT_HANDLE = STEP_PRODUCT_HANDLE;

export const ENABLED_PRODUCT_HANDLES: string[] = [
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
];

// ─── Product key (used for tier lookups + discount codes) ──
export type ProductKey = "ambient" | "arc" | "flex" | "lantern" | "wave" | "sconce";

export const HANDLE_TO_KEY: Record<string, ProductKey> = {
  [PRODUCT_HANDLE]: "ambient",
  [ARC_PRODUCT_HANDLE]: "arc",
  [FLEX_PRODUCT_HANDLE]: "flex",
  [LANTERN_PRODUCT_HANDLE]: "lantern",
  [WAVE_PRODUCT_HANDLE]: "wave",
  [SCONCE_PRODUCT_HANDLE]: "sconce",
};

// ─── Per-product bundle tier configuration ─────────────
// Tier value = decimal discount (0.07 = 7%). Missing tiers are not offered.
export type BundleTierKey = "two" | "three" | "four" | "eight";

export interface BundleTierConfig {
  qty: number;
  rate: number;
  label: string; // % shown to user
}

export type BundleTiers = Partial<Record<BundleTierKey, BundleTierConfig>>;

export const BUNDLE_TIERS: Record<ProductKey, BundleTiers> = {
  ambient: {
    two:   { qty: 2, rate: 0.07, label: "7%" },
    three: { qty: 3, rate: 0.12, label: "12%" },
    four:  { qty: 4, rate: 0.15, label: "15%" },
  },
  arc: {
    two:   { qty: 2, rate: 0.10, label: "10%" },
    three: { qty: 3, rate: 0.15, label: "15%" },
  },
  lantern: {
    // No bundles for Lantern — section hidden on product page.
  },
  wave: {
    two:   { qty: 2, rate: 0.08, label: "8%" },
    three: { qty: 3, rate: 0.12, label: "12%" },
    four:  { qty: 4, rate: 0.15, label: "15%" },
  },
  sconce: {
    // No bundles for Solar Wall Lamp — section hidden on product page.
  },
  flex: {
    // No bundles for Flex — section hidden on product page.
  },
};

export interface BundleQuote {
  tierKey: BundleTierKey;
  qty: number;
  rate: number;
  label: string;
  price: string;          // discounted total inc-VAT
  originalPrice: string;  // qty * unit
  save: string;           // money saved
  discount: string;       // alias of label, kept for backwards compat
}

export function quoteBundle(
  productKey: ProductKey,
  tierKey: BundleTierKey,
  unitIncVatPrice: number
): BundleQuote | null {
  const tier = BUNDLE_TIERS[productKey]?.[tierKey];
  if (!tier) return null;
  const original = unitIncVatPrice * tier.qty;
  const price = original * (1 - tier.rate);
  return {
    tierKey,
    qty: tier.qty,
    rate: tier.rate,
    label: tier.label,
    price: price.toFixed(2),
    originalPrice: original.toFixed(2),
    save: (original - price).toFixed(2),
    discount: tier.label,
  };
}

export function getProductTierKeys(productKey: ProductKey): BundleTierKey[] {
  return Object.keys(BUNDLE_TIERS[productKey] || {}) as BundleTierKey[];
}

// ─── Legacy Ambient Bar size helpers (still used by quiz / cart drawer) ──
export type SizeVariant = "20cm" | "30cm" | "40cm";

export const incVatPrices: Record<SizeVariant, string> = {
  "20cm": "27.95",
  "30cm": "32.95",
  "40cm": "37.95",
};

export const shopifyExVatPrices: Record<SizeVariant, number> = {
  "20cm": 27.95,
  "30cm": 32.95,
  "40cm": 37.95,
};

export function getIncVatPrice(shopifyAmount: string): string {
  return parseFloat(shopifyAmount).toFixed(2);
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
    }
  }
  return null;
}

export const sizeRecommendations = {
  small: "20cm" as SizeVariant,
  medium: "30cm" as SizeVariant,
  large: "40cm" as SizeVariant,
} as const;

// Backwards-compat re-export — Ambient Bar bundle pricing (size based)
export const bundlePricing: Record<SizeVariant, {
  basePrice: string;
  two: BundleQuote;
  three: BundleQuote;
  four: BundleQuote;
}> = {
  "20cm": {
    basePrice: incVatPrices["20cm"],
    two: quoteBundle("ambient", "two", parseFloat(incVatPrices["20cm"]))!,
    three: quoteBundle("ambient", "three", parseFloat(incVatPrices["20cm"]))!,
    four: quoteBundle("ambient", "four", parseFloat(incVatPrices["20cm"]))!,
  },
  "30cm": {
    basePrice: incVatPrices["30cm"],
    two: quoteBundle("ambient", "two", parseFloat(incVatPrices["30cm"]))!,
    three: quoteBundle("ambient", "three", parseFloat(incVatPrices["30cm"]))!,
    four: quoteBundle("ambient", "four", parseFloat(incVatPrices["30cm"]))!,
  },
  "40cm": {
    basePrice: incVatPrices["40cm"],
    two: quoteBundle("ambient", "two", parseFloat(incVatPrices["40cm"]))!,
    three: quoteBundle("ambient", "three", parseFloat(incVatPrices["40cm"]))!,
    four: quoteBundle("ambient", "four", parseFloat(incVatPrices["40cm"]))!,
  },
};

export const bundleNames: Record<number, string> = {
  2: "Duopak",
  3: "Familiepak",
  4: "Voordeelpak",
  8: "Voordeelset",
};

export function getBundleExVatUnitPrice(size: SizeVariant, quantity: 2 | 3 | 4): number {
  const tierKey: BundleTierKey = quantity === 2 ? "two" : quantity === 3 ? "three" : "four";
  const tier = BUNDLE_TIERS.ambient[tierKey]!;
  const targetIncVat = parseFloat(incVatPrices[size]) * tier.qty * (1 - tier.rate);
  const targetExVat = targetIncVat / (1 + VAT_RATE);
  return targetExVat / quantity;
}

export function getProductUrl(size?: SizeVariant, color?: string): string {
  const params = new URLSearchParams();
  if (size) params.set("size", size);
  if (color) params.set("color", color);
  const qs = params.toString();
  return `/product/${PRODUCT_HANDLE}${qs ? `?${qs}` : ""}`;
}

// Legacy alias kept for older code paths
export function computeBundlePricing(unitPrice: number) {
  return {
    basePrice: unitPrice.toFixed(2),
    two: quoteBundle("ambient", "two", unitPrice)!,
    three: quoteBundle("ambient", "three", unitPrice)!,
    four: quoteBundle("ambient", "four", unitPrice)!,
  };
}
