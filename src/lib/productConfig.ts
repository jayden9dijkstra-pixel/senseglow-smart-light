/**
 * Product configuration & per-product bundle tiers
 *
 * Bundle pricing model:
 * - User picks a single variant (color + size) and a pack size (2, 3 or 4)
 * - Cart line = N × variantId of that single variant
 * - At checkout a Shopify discount code is applied that gives the
 *   standardized % off (8 / 12 / 15 for 2 / 3 / 4 pack)
 */

export const VAT_RATE = 0.21;

// ─── Product handles ───────────────────────────────────
export const PRODUCT_HANDLE = "senseglow_ambient_motion_bar";
export const WAVE_PRODUCT_HANDLE = "senseglow_wave";
export const ARC_PRODUCT_HANDLE = "aluminium-led-wall-lamp-ip65-waterproof-8w-12w-outdoor-garden-lighting2026-02-20-02-48-52";
export const FLEX_PRODUCT_HANDLE = "senseglow_flex";
export const LANTERN_PRODUCT_HANDLE = "senseglow_solar_lantern";
export const SOLAR_PRODUCT_HANDLE = LANTERN_PRODUCT_HANDLE;
export const STEP_PRODUCT_HANDLE = "senseglow_wall_lamp";
export const SCONCE_PRODUCT_HANDLE = STEP_PRODUCT_HANDLE;

export const ENABLED_PRODUCT_HANDLES: string[] = [
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
];

// ─── Product key ───────────────────────────────────────
export type ProductKey = "ambient" | "arc" | "flex" | "lantern" | "wave" | "sconce";

export const HANDLE_TO_KEY: Record<string, ProductKey> = {
  [PRODUCT_HANDLE]: "ambient",
  [ARC_PRODUCT_HANDLE]: "arc",
  [FLEX_PRODUCT_HANDLE]: "flex",
  [LANTERN_PRODUCT_HANDLE]: "lantern",
  [WAVE_PRODUCT_HANDLE]: "wave",
  [SCONCE_PRODUCT_HANDLE]: "sconce",
};

// ─── Standardized bundle tiers (same for every product) ──
export type PackSize = 2 | 3 | 4;
export const PACK_RATE: Record<PackSize, number> = {
  2: 0.10,
  3: 0.20,
  4: 0.30,
};
export const PACK_LABEL: Record<PackSize, string> = {
  2: "Duopak",
  3: "Familiepak",
  4: "Voordeelpak",
};
export const PACK_SUBTITLE: Record<PackSize, string> = {
  2: "Ideaal om te starten",
  3: "Voor het hele huis",
  4: "Maximale besparing",
};

// ─── Per-product configuration ─────────────────────────
export interface ProductBundleConfig {
  packSizes: PackSize[];
}

export const BUNDLE_CONFIG: Record<ProductKey, ProductBundleConfig> = {
  ambient: { packSizes: [2, 3, 4] },
  wave: { packSizes: [2, 3, 4] },
  lantern: { packSizes: [2, 3] },
  sconce: { packSizes: [2, 3, 4] },
  flex: { packSizes: [2, 3] },
  arc: { packSizes: [] },
};

export function getBundleConfig(productKey: ProductKey | null): ProductBundleConfig {
  return productKey ? BUNDLE_CONFIG[productKey] : { packSizes: [] };
}

// ─── Discount-code mapping ─────────────────────────────
// Codes already exist in Shopify and are standardized at 8/12/15%.
// variantKey comes from productRegistry.buildVariantKey(productKey, opts).
export function getBundleDiscountCode(
  productKey: ProductKey,
  packSize: PackSize,
  variantKey: string
): string | null {
  // Universal pack-size discount codes - work on total cart quantity.
  // 2+ items → 10%, 3+ items → 20%, 4+ items → 30%.
  // Cross-product bundles (e.g. Ambient + Wave + Flex) automatically qualify.
  return `SG-PACK-${packSize}`;
}

// ─── Bundle quote helper ───────────────────────────────
export interface BundleQuote {
  packSize: PackSize;
  rate: number;
  label: string;        // "Duopak"
  subtitle: string;     // marketing subtitle
  discountLabel: string; // "-8%"
  unitPrice: number;
  originalTotal: number;
  total: number;        // discounted
  save: number;
}

export function buildBundleQuote(packSize: PackSize, unitPrice: number): BundleQuote {
  const rate = PACK_RATE[packSize];
  const originalTotal = +(unitPrice * packSize).toFixed(2);
  const total = +(originalTotal * (1 - rate)).toFixed(2);
  return {
    packSize,
    rate,
    label: PACK_LABEL[packSize],
    subtitle: PACK_SUBTITLE[packSize],
    discountLabel: `-${Math.round(rate * 100)}%`,
    unitPrice,
    originalTotal,
    total,
    save: +(originalTotal - total).toFixed(2),
  };
}

// ─── Legacy Ambient Bar size helpers (still used by quiz) ──
export type SizeVariant = "20cm" | "30cm" | "40cm";

export const incVatPrices: Record<SizeVariant, string> = {
  "20cm": "24.95",
  "30cm": "29.95",
  "40cm": "39.95",
};

export const shopifyExVatPrices: Record<SizeVariant, number> = {
  "20cm": 24.95,
  "30cm": 29.95,
  "40cm": 39.95,
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

// Backwards-compat re-export for Quiz.tsx (Ambient bundle preview)
export const bundlePricing: Record<SizeVariant, {
  basePrice: string;
  two: { price: string; originalPrice: string; save: string; discount: string };
  three: { price: string; originalPrice: string; save: string; discount: string };
  four: { price: string; originalPrice: string; save: string; discount: string };
}> = (() => {
  const build = (size: SizeVariant) => {
    const unit = parseFloat(incVatPrices[size]);
    const wrap = (q: BundleQuote) => ({
      price: q.total.toFixed(2),
      originalPrice: q.originalTotal.toFixed(2),
      save: q.save.toFixed(2),
      discount: q.discountLabel,
    });
    return {
      basePrice: incVatPrices[size],
      two: wrap(buildBundleQuote(2, unit)),
      three: wrap(buildBundleQuote(3, unit)),
      four: wrap(buildBundleQuote(4, unit)),
    };
  };
  return {
    "20cm": build("20cm"),
    "30cm": build("30cm"),
    "40cm": build("40cm"),
  };
})();

export const bundleNames: Record<number, string> = {
  2: "Duopak",
  3: "Familiepak",
  4: "Voordeelpak",
};

export function getProductUrl(size?: SizeVariant, color?: string): string {
  const params = new URLSearchParams();
  if (size) params.set("size", size);
  if (color) params.set("color", color);
  const qs = params.toString();
  return `/product/${PRODUCT_HANDLE}${qs ? `?${qs}` : ""}`;
}

// Legacy alias used by other product config files (kept harmless)
export function computeBundlePricing(unitPrice: number) {
  const wrap = (q: BundleQuote) => ({
    price: q.total.toFixed(2),
    originalPrice: q.originalTotal.toFixed(2),
    save: q.save.toFixed(2),
    discount: q.discountLabel,
  });
  return {
    basePrice: unitPrice.toFixed(2),
    two: wrap(buildBundleQuote(2, unitPrice)),
    three: wrap(buildBundleQuote(3, unitPrice)),
    four: wrap(buildBundleQuote(4, unitPrice)),
  };
}
