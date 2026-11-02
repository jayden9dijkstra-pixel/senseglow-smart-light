/**
 * 'Waarom SenseGlow'-checklist: alleen feiten die elders op de site al staan.
 * Gedeeld door de product- en landingspagina's en scripts/prerender.ts.
 */
import { DELIVERY_TEXT } from "./delivery";
import { WARRANTY_TEXT } from "./productFaqs";
import { LANTERN_PRODUCT_HANDLE } from "./productConfig";

export const WHY_HEADING = "Waarom SenseGlow";
export const WHY_CONTACT_TEXT = "Nederlandse klantenservice via de contactpagina";

/** Producten die via de zon laden in plaats van via USB-C. */
const NO_USB_C = new Set([LANTERN_PRODUCT_HANDLE]);

export function whyItems(handles: string[]): string[] {
  const usbC = handles.length > 0 && handles.every((h) => !NO_USB_C.has(h));
  return [
    "Gratis verzending naar Nederland en België",
    DELIVERY_TEXT,
    "30 dagen retour",
    WARRANTY_TEXT,
    ...(usbC ? ["Opladen via USB-C"] : []),
    "Kits met korting als je meer lampen samen koopt",
  ];
}
