/**
 * Margeberekening per verkoop.
 *
 * Inkoopprijzen zijn de werkelijke bedragen van de leverancier, inclusief
 * verzending. Er wordt nooit een prijs geschat: staat een variant er niet bij,
 * dan is de marge voor die regel niet beschikbaar.
 */

export const VAT_DIVISOR = 1.21;
export const TRANSACTION_RATE = 0.025;
export const RETURNS_BUFFER = 0.07;

/** Inkoopprijs per stuk, per variant (inclusief verzending). */
const PURCHASE_PRICES: Array<{ match: RegExp; price: number }> = [
  { match: /ambient.*20\s?cm/i, price: 8.05 },
  { match: /ambient.*30\s?cm/i, price: 8.80 },
  { match: /ambient.*40\s?cm/i, price: 9.78 },
  { match: /wave.*30\s?cm/i, price: 7.65 },
  { match: /wave.*50\s?cm/i, price: 8.25 },
  { match: /wall\s?lamp/i, price: 9.50 },
  { match: /solar|lantern|lantaarn/i, price: 10.40 },
  { match: /flex/i, price: 18.00 },
];

/** Inkoopprijs voor een besteld artikel, op basis van titel plus variant. */
export function purchasePrice(title: string, variant?: string | null): number | null {
  const label = `${title} ${variant ?? ""}`;
  for (const entry of PURCHASE_PRICES) {
    if (entry.match.test(label)) return entry.price;
  }
  return null;
}

/**
 * Dekkingsbijdrage per verkocht stuk:
 * (verkoopprijs / 1,21) x (1 - 2,5% - 7%) - inkoopprijs
 */
export function contributionMargin(
  salePrice: number,
  title: string,
  variant?: string | null,
): number | null {
  const purchase = purchasePrice(title, variant);
  if (purchase === null) return null;
  const net = (salePrice / VAT_DIVISOR) * (1 - TRANSACTION_RATE - RETURNS_BUFFER);
  return net - purchase;
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateNl(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
