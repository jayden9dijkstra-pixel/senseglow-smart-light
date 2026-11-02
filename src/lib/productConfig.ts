/**
 * Product configuration. Kortingen regelt Shopify automatisch ('Meer lampen',
 * zie src/lib/quantityOffer.ts); de site past geen kortingscodes toe.
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

export function getProductUrl(size?: SizeVariant, color?: string): string {
  const params = new URLSearchParams();
  if (size) params.set("size", size);
  if (color) params.set("color", color);
  const qs = params.toString();
  return `/product/${PRODUCT_HANDLE}${qs ? `?${qs}` : ""}`;
}
