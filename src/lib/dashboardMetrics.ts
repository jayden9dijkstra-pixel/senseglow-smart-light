/**
 * Pure rekenregels voor het interne dashboard (en herbruikbaar in de MCP-tools).
 * Geen schattingen: ontbreekt een inkoopprijs, dan is het resultaat `null`.
 */

export const VAT_RATE = 0.21;
export const VAT_DIVISOR = 1 + VAT_RATE;

export type LevyTier = { min: number; levy: number };
export type Settings = {
  levy_tiers: LevyTier[];
  transaction_rate: number;
  other_rate: number;
  tax_reserve_pct: number;
  tax_reserve_enabled: boolean;
};
export const DEFAULT_SETTINGS: Settings = {
  levy_tiers: [
    { min: 0, levy: 3 },
    { min: 15, levy: 2.5 },
    { min: 25, levy: 1.5 },
    { min: 50, levy: 0 },
  ],
  transaction_rate: 0.025,
  other_rate: 0.07,
  tax_reserve_pct: 0,
  tax_reserve_enabled: false,
};

export type CostRow = { variant_key: string; product: string; variant: string; match_pattern: string; cost_excl_vat: number };
export type Line = { title: string; variant_title: string | null; quantity: number; price: number };
export type Order = {
  order_number: string;
  ordered_at: string;
  total: number;
  financial_status: string | null;
  line_items: Line[];
  gclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country_code: string | null;
};

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function vatSplit(inclVat: number) {
  const excl = inclVat / VAT_DIVISOR;
  return { incl: inclVat, excl, vat: inclVat - excl };
}

/** Heffing per zending: hoogste staffel waarvan `min` <= totale inkoop. */
export function importLevy(totalPurchase: number, tiers: LevyTier[]): number {
  const sorted = [...tiers].sort((a, b) => a.min - b.min);
  let levy = sorted[0]?.levy ?? 0;
  for (const t of sorted) if (totalPurchase >= t.min) levy = t.levy;
  return levy;
}

/** Zoek de inkoopprijs; specifiekere patronen (langer) eerst. */
export function findCost(costs: CostRow[], title: string, variant: string | null): CostRow | null {
  const label = `${title} ${variant ?? ""}`;
  const sorted = [...costs].sort((a, b) => b.match_pattern.length - a.match_pattern.length);
  for (const c of sorted) {
    try {
      if (new RegExp(c.match_pattern, "i").test(label)) return c;
    } catch {
      /* ongeldig patroon: overslaan */
    }
  }
  return null;
}

export type OrderEconomics = {
  revenueIncl: number;
  revenueExcl: number;
  vat: number;
  purchase: number | null;
  levy: number | null;
  fees: number;
  contribution: number | null;
  missingCost: string[];
};

/** Dekkingsbijdrage = omzet excl. btw x (1 - transactie - overig) - inkoop - heffing. */
export function orderEconomics(order: Order, costs: CostRow[], s: Settings): OrderEconomics {
  const { excl, vat } = vatSplit(order.total);
  const missing: string[] = [];
  let purchase = 0;
  for (const li of order.line_items) {
    const c = findCost(costs, li.title, li.variant_title);
    if (!c) missing.push(`${li.title} ${li.variant_title ?? ""}`.trim());
    else purchase += c.cost_excl_vat * li.quantity;
  }
  const fees = excl * (s.transaction_rate + s.other_rate);
  if (missing.length) {
    return { revenueIncl: order.total, revenueExcl: excl, vat, purchase: null, levy: null, fees, contribution: null, missingCost: missing };
  }
  const levy = importLevy(purchase, s.levy_tiers);
  return {
    revenueIncl: order.total,
    revenueExcl: excl,
    vat,
    purchase,
    levy,
    fees,
    contribution: excl - fees - purchase - levy,
    missingCost: [],
  };
}

/** Break-even CPA per stuk, verkocht als losse bestelling. */
export function unitBreakEvenCpa(priceIncl: number, cost: number, s: Settings): number {
  const excl = priceIncl / VAT_DIVISOR;
  return excl * (1 - s.transaction_rate - s.other_rate) - cost - importLevy(cost, s.levy_tiers);
}

export function breakEvenRoas(revenueExcl: number, contribution: number): number | null {
  return contribution > 0 ? revenueExcl / contribution : null;
}

export const safeDiv = (a: number, b: number): number | null => (b ? a / b : null);

export function pctChange(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function maskClickId(id: string): string {
  if (id.length <= 8) return "••••";
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

/** Datum (YYYY-MM-DD) in Europe/Amsterdam. */
export function amsDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(d);
}

export const TEST_ORDER_NUMBERS = new Set(["#1003", "#1004", "#1006"]);
export const isCountedOrder = (o: Pick<Order, "order_number" | "financial_status">) =>
  !TEST_ORDER_NUMBERS.has(o.order_number.trim()) && o.financial_status !== "refunded" && o.financial_status !== "voided";
