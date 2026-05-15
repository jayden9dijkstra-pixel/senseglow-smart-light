/**
 * Product registry — single place for variant parsing + key building.
 * Used by VariantPicker, BundlesSection and the checkout discount-code mapper.
 */
import { ProductKey, HANDLE_TO_KEY } from "./productConfig";

export function getProductKeyFromHandle(handle: string): ProductKey | null {
  return HANDLE_TO_KEY[handle] || null;
}

interface SelectedOption { name: string; value: string }

/**
 * Build a stable variantKey per product. Used to look up Shopify discount codes.
 * Examples: "20", "30", "40", "B6W", "W6W", "B12W", "8SET", "4SET", "REMOTE", "STD".
 */
export function buildVariantKey(productKey: ProductKey, opts: SelectedOption[]): string {
  const join = opts.map((o) => o.value).join(" ").toLowerCase();

  switch (productKey) {
    case "ambient":
    case "wave": {
      if (join.includes("20cm") || join.includes("20 ")) return "20";
      if (join.includes("30cm") || join.includes("30 ")) return "30";
      if (join.includes("40cm") || join.includes("40 ")) return "40";
      if (join.includes("50cm") || join.includes("50 ")) return "50";
      return "";
    }
    case "arc": {
      const isWhite = join.includes("white");
      const isBlack = join.includes("black");
      const c = isWhite ? "W" : isBlack ? "B" : "";
      // Wattage is fixed at 12W now; legacy 6W still recognized.
      const w = join.includes("6w") ? "6W" : "12W";
      return c ? `${c}${w}` : "";
    }
    case "lantern": {
      // No size — single tier on color-agnostic discount.
      return "ALL";
    }
    case "sconce": {
      if (join.includes("8-delige") || join.includes("8 ")) return "8SET";
      if (join.includes("4-delige") || join.includes("4 ")) return "4SET";
      return "";
    }
    case "flex": {
      if (join.includes("remote")) return "REMOTE";
      if (join.includes("black")) return "B";
      return "W";
    }
    default:
      return "";
  }
}

export interface ParsedLabel {
  /** Short user-facing label of this variant (e.g. "30cm", "Black 6W", "Wit", "8-delige set") */
  label: string;
  size?: string;
  color?: string;
  wattage?: string;
  setSize?: string;
  type?: string;
}

export function parseVariantLabel(productKey: ProductKey, opts: SelectedOption[]): ParsedLabel {
  const join = opts.map((o) => o.value).join(" / ");
  const lower = join.toLowerCase();

  switch (productKey) {
    case "ambient":
    case "wave": {
      const sizeMatch = lower.match(/(\d{2})\s?cm/);
      const size = sizeMatch ? `${sizeMatch[1]}cm` : "";
      let color = "";
      if (lower.includes("silver")) color = "Zilver";
      else if (lower.includes("white")) color = "Wit";
      else if (lower.includes("black")) color = "Zwart";
      return { label: [size, color].filter(Boolean).join(" • "), size, color };
    }
    case "arc": {
      const isWhite = lower.includes("white");
      const isBlack = lower.includes("black");
      const color = isWhite ? "Wit" : isBlack ? "Zwart" : "";
      const wattage = lower.includes("6w") ? "6W" : "12W";
      return { label: [wattage, color].filter(Boolean).join(" • "), color, wattage };
    }
    case "lantern": {
      let color = "";
      if (lower.includes("white")) color = "Wit";
      else if (lower.includes("black")) color = "Zwart";
      return { label: color, color };
    }
    case "sconce": {
      const setSize = lower.includes("8") ? "8-delige set" : lower.includes("4") ? "4-delige set" : "";
      let color = "";
      if (lower.includes("wit")) color = "Wit";
      else if (lower.includes("zwart")) color = "Zwart";
      return { label: [setSize, color].filter(Boolean).join(" • "), setSize, color };
    }
    case "flex": {
      const type = lower.includes("remote") ? "Met afstandsbediening" : "Standaard";
      return { label: type, type };
    }
    default:
      return { label: "" };
  }
}
