import {
  type CostRow, type Order, type Settings, DEFAULT_SETTINGS, VAT_DIVISOR, breakEvenRoas, findCost, isCountedOrder,
  orderEconomics, safeDiv, unitBreakEvenCpa,
} from "@/lib/dashboardMetrics";

export type AdRow = {
  date: string; campaign_id: string; campaign: string; status: string | null;
  spend: number; clicks: number; impressions: number; conversions: number; conversion_value: number | null;
};
export type DashOrder = Order & { day: string; has_gclid: boolean; gclid_masked: string | null };
export type RangeData = {
  orders: DashOrder[];
  ads: AdRow[];
  adsSource: string;
  events: { perDay: Record<string, Record<string, number>>; sessions: number; funnel: Record<string, Record<string, number>>; total: number };
};
export type Summary = {
  range: { from: string; to: string; days: number; previous: { from: string; to: string } | null };
  excludeInternal: boolean;
  current: RangeData;
  previous: RangeData | null;
  costs: (CostRow & { updated_at: string })[];
  settings: Settings | null;
  sources: {
    orders: { source: string; updatedAt: string | null; error: string | null };
    adsScript: { source: string; updatedAt: string | null };
    adsLegacy: { source: string; updatedAt: string | null };
    events: { source: string; updatedAt: string | null };
  };
  recentClickIds: { masked: string; utm_campaign: string | null; at: string }[];
  generatedAt: string;
};
export type Filters = { campaign: string; variant: string; adInclVat: boolean };

const lineMatches = (o: Order, v: string) =>
  !v || o.line_items.some((l) => `${l.title} ${l.variant_title ?? ""}`.toLowerCase().includes(v.toLowerCase()));

export function filterRange(r: RangeData, f: Filters) {
  const orders = r.orders.filter((o) => isCountedOrder(o) && lineMatches(o, f.variant) && (!f.campaign || o.utm_campaign === f.campaign));
  const ads = r.ads.filter((a) => !f.campaign || a.campaign === f.campaign);
  return { orders, ads };
}

export function computeStats(r: RangeData, costs: CostRow[], settings: Settings | null, f: Filters) {
  const s = settings ?? DEFAULT_SETTINGS;
  const { orders, ads } = filterRange(r, f);
  const vatF = f.adInclVat ? VAT_DIVISOR : 1;
  let revenueIncl = 0, revenueExcl = 0, vat = 0, contribution = 0, purchase = 0, levy = 0;
  const missing = new Set<string>();
  for (const o of orders) {
    const e = orderEconomics(o, costs, s);
    revenueIncl += e.revenueIncl; revenueExcl += e.revenueExcl; vat += e.vat;
    if (e.contribution === null) e.missingCost.forEach((m) => missing.add(m));
    else { contribution += e.contribution; purchase += e.purchase ?? 0; levy += e.levy ?? 0; }
  }
  const hasAds = ads.length > 0;
  const spend = hasAds ? ads.reduce((a, b) => a + b.spend, 0) / vatF : null;
  const clicks = hasAds ? ads.reduce((a, b) => a + b.clicks, 0) : null;
  const impressions = hasAds ? ads.reduce((a, b) => a + b.impressions, 0) : null;
  const adConversions = hasAds ? ads.reduce((a, b) => a + b.conversions, 0) : null;
  const complete = missing.size === 0;
  const netProfit = complete && spend !== null ? contribution - spend : null;
  const taxReserve = s.tax_reserve_enabled && netProfit !== null && netProfit > 0 ? netProfit * (s.tax_reserve_pct / 100) : 0;
  return {
    orders: orders.length,
    revenueIncl, revenueExcl, vat,
    aov: safeDiv(revenueIncl, orders.length),
    spend, clicks, impressions, adConversions,
    ctr: clicks !== null && impressions ? (clicks / impressions) * 100 : null,
    cpc: spend !== null && clicks ? spend / clicks : null,
    roas: spend ? revenueIncl / spend : null,
    cpa: spend !== null && orders.length ? spend / orders.length : null,
    conversionRate: r.events.sessions ? (orders.length / r.events.sessions) * 100 : null,
    visitors: r.events.total ? r.events.sessions : null,
    contribution: complete ? contribution : null,
    purchase: complete ? purchase : null,
    levy: complete ? levy : null,
    netProfit,
    profitPerOrder: netProfit !== null && orders.length ? netProfit / orders.length : null,
    profitMargin: netProfit !== null && revenueExcl ? (netProfit / revenueExcl) * 100 : null,
    breakEvenRoas: complete ? breakEvenRoas(revenueExcl, contribution) : null,
    breakEvenCpa: complete && orders.length ? contribution / orders.length : null,
    taxReserve,
    missingCost: [...missing],
    ordersList: orders,
    ads,
  };
}

export function perDaySeries(r: RangeData, from: string, to: string, f: Filters) {
  const { orders, ads } = filterRange(r, f);
  const vatF = f.adInclVat ? VAT_DIVISOR : 1;
  const out: { day: string; revenue: number; spend: number | null; orders: number; gclidOrders: number; adConversions: number | null; events: Record<string, number> }[] = [];
  for (let d = from; d <= to; d = new Date(Date.parse(d) + 86_400_000).toISOString().slice(0, 10)) {
    const dayAds = ads.filter((a) => a.date === d);
    const dayOrders = orders.filter((o) => o.day === d);
    out.push({
      day: d,
      revenue: dayOrders.reduce((a, b) => a + b.total, 0),
      spend: dayAds.length ? dayAds.reduce((a, b) => a + b.spend, 0) / vatF : null,
      orders: dayOrders.length,
      gclidOrders: dayOrders.filter((o) => o.has_gclid).length,
      adConversions: dayAds.length ? dayAds.reduce((a, b) => a + b.conversions, 0) : null,
      events: r.events.perDay[d] ?? {},
    });
  }
  return out;
}

export function perVariant(orders: Order[], costs: CostRow[], settings: Settings | null) {
  const s = settings ?? DEFAULT_SETTINGS;
  const map = new Map<string, { label: string; units: number; revenue: number; cost: number | null; unitPrice: number }>();
  for (const o of orders) for (const l of o.line_items) {
    const label = `${l.title}${l.variant_title ? ` · ${l.variant_title}` : ""}`;
    const c = findCost(costs, l.title, l.variant_title);
    const e = map.get(label) ?? { label, units: 0, revenue: 0, cost: c ? c.cost_excl_vat : null, unitPrice: l.price };
    e.units += l.quantity; e.revenue += l.price * l.quantity;
    map.set(label, e);
  }
  return [...map.values()].map((v) => {
    const marginPerUnit = v.cost === null ? null : unitBreakEvenCpa(v.unitPrice, v.cost, s);
    return {
      ...v,
      marginPerUnit,
      totalMargin: marginPerUnit === null ? null : marginPerUnit * v.units,
      breakEvenCpa: marginPerUnit,
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export function adsByCampaign(ads: AdRow[], adInclVat: boolean) {
  const vatF = adInclVat ? VAT_DIVISOR : 1;
  const map = new Map<string, AdRow>();
  for (const a of ads) {
    const k = a.campaign;
    const e = map.get(k) ?? { ...a, spend: 0, clicks: 0, impressions: 0, conversions: 0, conversion_value: a.conversion_value === null ? null : 0 };
    e.spend += a.spend / vatF; e.clicks += a.clicks; e.impressions += a.impressions; e.conversions += a.conversions;
    e.conversion_value = e.conversion_value === null || a.conversion_value === null ? null : e.conversion_value + a.conversion_value;
    if (a.date >= e.date) { e.status = a.status; e.date = a.date; }
    map.set(k, e);
  }
  return [...map.values()];
}
