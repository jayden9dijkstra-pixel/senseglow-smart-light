/**
 * 'Zo werkt het' in 3 stappen per product, alleen wat in de Shopify-productbeschrijving staat.
 * Flex heeft geen sensor; Solar laadt via het zonnepaneel en wordt geschroefd.
 */
import { PRODUCT_HANDLE, WAVE_PRODUCT_HANDLE, STEP_PRODUCT_HANDLE, FLEX_PRODUCT_HANDLE, LANTERN_PRODUCT_HANDLE } from "./productConfig";

export type StepIcon = "stick" | "usb" | "motion" | "touch" | "sun" | "screw" | "magnet";
export interface HowStep { icon: StepIcon; title: string }

const STICK: HowStep = { icon: "stick", title: "Plakken (geen boren)" };
const USB: HowStep = { icon: "usb", title: "Opladen via USB-C" };
const MOTION: HowStep = { icon: "motion", title: "Gaat vanzelf aan bij beweging" };

export const HOW_IT_WORKS: Record<string, HowStep[]> = {
  [STEP_PRODUCT_HANDLE]: [STICK, USB, MOTION],
  [PRODUCT_HANDLE]: [STICK, USB, MOTION],
  [WAVE_PRODUCT_HANDLE]: [STICK, USB, MOTION],
  [FLEX_PRODUCT_HANDLE]: [
    { icon: "magnet", title: "Aan de magnetische wandbeugel" },
    USB,
    { icon: "touch", title: "Dimmen met een aanraking" },
  ],
  [LANTERN_PRODUCT_HANDLE]: [
    { icon: "screw", title: "Ophangen met twee schroeven" },
    { icon: "sun", title: "Zonnepaneel laadt overdag" },
    { icon: "motion", title: "Gaat in het donker aan bij beweging" },
  ],
};

export const howItWorksFor = (handle: string | undefined) => (handle ? HOW_IT_WORKS[handle] ?? null : null);
