import { STEP_PRODUCT_HANDLE } from "./productConfig";

export const PLACEMENT_GUIDE_PATH = "/plaatsingsgids-trap";
export const PLACEMENT_GUIDE_BONUS = "Gratis plaatsingsgids: zo plaats je ze op je trap";

/** Alleen Wall Lamp-aanbiedingen tonen de bonus bij de koopknop. */
export const hasPlacementGuideBonus = (productHandle: string) => productHandle === STEP_PRODUCT_HANDLE;
