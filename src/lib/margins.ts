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

/**
 * Inkoop bij Nova per variant voor 1, 2, 3 en 4 stuks in één bestelling
 * (quote-sheet 10 okt 2026, inclusief verzending, exclusief importheffing).
 * Boven de 4 stuks rekenen we met de prijs per stuk van de 4-stuksregel.
 */
type PriceTier = [number, number, number, number];
const PURCHASE_PRICES: Array<{ match: RegExp; prices: PriceTier }> = [
  { match: /ambient.*20\s?cm/i, prices: [8.05, 12.1, 16.5, 20.9] },
  { match: /ambient.*30\s?cm/i, prices: [8.8, 14.3, 19.8, 25.3] },
  { match: /ambient.*40\s?cm/i, prices: [9.78, 15.4, 20.9, 26.4] },
  { match: /wave.*30\s?cm/i, prices: [7.65, 11.65, 15.65, 19.65] },
  { match: /wave.*50\s?cm/i, prices: [8.25, 13.25, 18.25, 23.25] },
  // Wall Lamp: 8-delige set = 2 x de 4-delige set (Nova, bevestigd door Jay).
  { match: /wall\s?lamp.*\b8\b|\b8\b.*wall\s?lamp/i, prices: [19, 33.8, 46.8, 59.8] },
  { match: /wall\s?lamp.*\b4\b|\b4\b.*wall\s?lamp/i, prices: [9.5, 16.9, 23.4, 29.9] },
  { match: /solar|lantern|lantaarn/i, prices: [10.4, 17.9, 24.4, 30.9] },
  { match: /flex/i, prices: [18, 33.6, 49.2, 64.8] },
];

/** Importheffing per zending, op basis van de totale inkoop (Nova, vanaf 1 juli 2026). */
export function importLevy(purchaseTotal: number): number {
  if (purchaseTotal < 15) return 3;
  if (purchaseTotal < 25) return 2.5;
  if (purchaseTotal < 50) return 1.5;
  return 0;
}

/** Inkoop voor een besteld artikel (titel plus variant), of null als de variant onbekend is. */
export function purchaseCost(title: string, variant: string | null | undefined, quantity: number): number | null {
  const label = `${title} ${variant ?? ""}`;
  for (const entry of PURCHASE_PRICES) {
    if (!entry.match.test(label)) continue;
    if (quantity < 1) return 0;
    if (quantity <= 4) return entry.prices[quantity - 1];
    return (entry.prices[3] / 4) * quantity;
  }
  return null;
}

export type MarginLine = {
  price: number;
  title: string;
  variant_title: string | null;
  quantity: number;
};

/**
 * Dekkingsbijdrage per orderregel, na de importheffing van de zending.
 * Formule per regel: (verkoopprijs x aantal / 1,21) x (1 - 2,5% - 7%) - inkoop - aandeel in de heffing.
 * De heffing (een keer per zending, staffel op totale inkoop) wordt verdeeld naar rato van de inkoop.
 * Is van een regel de inkoop onbekend, dan is de hele bestelling "niet beschikbaar" (null per regel).
 */
export function orderLineMargins(lines: MarginLine[]): Array<number | null> {
  const costs = lines.map((l) => purchaseCost(l.title, l.variant_title, l.quantity));
  if (costs.some((c) => c === null)) return lines.map(() => null);
  const known = costs as number[];
  const total = known.reduce((a, b) => a + b, 0);
  const levy = importLevy(total);
  return lines.map((l, i) => {
    const net = ((l.price * l.quantity) / VAT_DIVISOR) * (1 - TRANSACTION_RATE - RETURNS_BUFFER);
    const share = total > 0 ? (known[i] / total) * levy : 0;
    return net - known[i] - share;
  });
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
