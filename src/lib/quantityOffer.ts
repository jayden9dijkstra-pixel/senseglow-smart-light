/**
 * Het enige aanbod van SenseGlow: meer lampen, lagere prijs per lamp.
 * Shopify rekent de automatische korting 'Meer lampen' zelf uit; deze functies
 * tonen alleen dezelfde regel vooraf op de site. Wall Lamp doet niet mee.
 */
import {
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
} from "./productConfig";
import { isBlackFriday } from "./blackFriday";

export const OFFER_HANDLES = new Set([
  PRODUCT_HANDLE,
  WAVE_PRODUCT_HANDLE,
  LANTERN_PRODUCT_HANDLE,
  FLEX_PRODUCT_HANDLE,
]);

export const QTY_OPTIONS = [1, 2, 4] as const;
export type OfferQty = (typeof QTY_OPTIONS)[number];

export const OFFER_TEXT = "Meer lampen, lagere prijs per lamp: 2 lampen 10%, 4+ lampen 15%";
export const MIX_NOTE = "Korting geldt ook als je verschillende SenseGlow-lampen combineert (behalve Wall Lamp).";

export const isOfferProduct = (handle: string | undefined | null) => !!handle && OFFER_HANDLES.has(handle);

/** Kortingspercentage bij een totaal aantal meedoende lampen. */
export function offerRate(lamps: number, displayDate?: Date): number {
  if (displayDate && isBlackFriday(displayDate)) {
    if (lamps >= 4) return 0.2;
    if (lamps >= 2) return 0.15;
    return 0;
  }
  if (lamps >= 4) return 0.15;
  if (lamps >= 2) return 0.1;
  return 0;
}

export function qtyLabel(qty: number, displayDate?: Date): string {
  const base = qty === 1 ? "1 lamp" : `${qty} lampen`;
  const rate = offerRate(qty, displayDate);
  return rate ? `${base} (${Math.round(rate * 100)}% korting)` : base;
}

const round = (n: number) => Math.round(n * 100) / 100;

/** Totaal en prijs per lamp voor een aantal, op basis van de Shopify-prijs van één lamp. */
export function quoteQty(unitPrice: number, qty: number, displayDate?: Date) {
  const rate = offerRate(qty, displayDate);
  const gross = round(unitPrice * qty);
  // Shopify rondt de korting per lamp naar beneden af op hele centen.
  const discount = round((Math.floor(unitPrice * rate * 100 + 1e-6) / 100) * qty);
  const total = round(gross - discount);
  return { qty, rate, total, perLamp: round(total / qty) };
}

/** Eén upsellregel voor de winkelwagen, of null. */
export function cartUpsell(lamps: number): string | null {
  if (lamps === 1) return "Voeg 1 lamp toe: 10% korting op beide";
  if (lamps === 2 || lamps === 3) {
    const left = 4 - lamps;
    return `Nog ${left} ${left === 1 ? "lamp" : "lampen"} tot 15% korting`;
  }
  return null;
}

/** Lees ?qty= (1, 2 of 4) uit de URL. */
export function parseQty(value: string | null | undefined): OfferQty | null {
  const n = Number(value);
  return (QTY_OPTIONS as readonly number[]).includes(n) ? (n as OfferQty) : null;
}
