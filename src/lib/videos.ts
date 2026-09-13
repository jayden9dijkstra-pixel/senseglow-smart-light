import {
  FLEX_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  PRODUCT_HANDLE,
  STEP_PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
} from "@/lib/productConfig";

/**
 * Vul hier later de definitieve videobestanden of CDN-URL's in.
 * Een leeg veld laat automatisch de bestaande foto zien.
 */
export const HOMEPAGE_HERO_VIDEO_URL = "";

export const PRODUCT_VIDEO_URLS: Record<string, string> = {
  [PRODUCT_HANDLE]: "",
  [WAVE_PRODUCT_HANDLE]: "",
  [FLEX_PRODUCT_HANDLE]: "",
  [LANTERN_PRODUCT_HANDLE]: "",
  [STEP_PRODUCT_HANDLE]: "",
};

export function getProductVideoUrl(handle: string): string {
  return PRODUCT_VIDEO_URLS[handle] ?? "";
}