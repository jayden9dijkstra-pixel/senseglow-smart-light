/** Presentatie uit de actuele Shopify-setprijs, zonder eigen kortingsregels. */
export function setUnitPrice(price: number | null, lamps: number): number | null {
  if (price == null || !Number.isFinite(price) || lamps <= 0) return null;
  return Math.round((price / lamps + Number.EPSILON) * 100) / 100;
}