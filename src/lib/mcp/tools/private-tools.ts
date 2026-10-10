import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fail, loadOrders, MAX_ROWS, ok, parseRange, rangeSchema, requireAdmin } from "../private-data";

const RO = { readOnlyHint: true, idempotentHint: true, openWorldHint: false } as const;

export const getOrders = defineTool({
  name: "get_orders",
  title: "Get orders (admin)",
  description: "Orders in a date range: number, time, total, line items, status, attribution (gclid yes/no, utm). No personal data. Country is not stored and returns null. Admin only.",
  inputSchema: { ...rangeSchema, limit: z.number().int().min(1).max(MAX_ROWS).default(50) },
  annotations: RO,
  handler: async ({ date_from, date_to, limit }, ctx) => {
    try {
      const read = await requireAdmin(ctx);
      const r = parseRange(date_from, date_to);
      const orders = await loadOrders(read, r.fromIso, r.toIso, limit);
      return ok({ range: r, count: orders.length, orders });
    } catch (e) { return fail(e); }
  },
});

export const getSalesSummary = defineTool({
  name: "get_sales_summary",
  title: "Sales summary (admin)",
  description: "Revenue, order count, average order value, per product and per day. Test orders are excluded. Admin only.",
  inputSchema: rangeSchema,
  annotations: RO,
  handler: async ({ date_from, date_to }, ctx) => {
    try {
      const read = await requireAdmin(ctx);
      const r = parseRange(date_from, date_to);
      const orders = (await loadOrders(read, r.fromIso, r.toIso)).filter((o) => !o.is_test && o.status !== "refunded");
      const revenue = orders.reduce((s, o) => s + o.total, 0);
      const perDay: Record<string, { orders: number; revenue: number }> = {};
      const perProduct: Record<string, { quantity: number; revenue: number }> = {};
      for (const o of orders) {
        const d = o.ordered_at.slice(0, 10);
        perDay[d] ??= { orders: 0, revenue: 0 };
        perDay[d].orders++; perDay[d].revenue += o.total;
        for (const li of o.line_items) {
          perProduct[li.product] ??= { quantity: 0, revenue: 0 };
          perProduct[li.product].quantity += li.quantity;
          perProduct[li.product].revenue += li.price * li.quantity;
        }
      }
      return ok({
        range: r, currency: "EUR", orders: orders.length,
        revenue: Math.round(revenue * 100) / 100,
        average_order_value: orders.length ? Math.round((revenue / orders.length) * 100) / 100 : null,
        per_day: perDay, per_product_gross_line_value: perProduct,
      });
    } catch (e) { return fail(e); }
  },
});

export const getFunnel = defineTool({
  name: "get_funnel",
  title: "Funnel (admin)",
  description: "Sessions, view_item, add_to_cart, begin_checkout from own site events (internal traffic excluded) and purchases from Shopify orders. Abandoned carts = add_to_cart sessions without begin_checkout. Admin only.",
  inputSchema: rangeSchema,
  annotations: RO,
  handler: async ({ date_from, date_to }, ctx) => {
    try {
      const read = await requireAdmin(ctx);
      const r = parseRange(date_from, date_to);
      const events: any[] = [];
      for (let offset = 0; offset < 50_000; offset += 1000) {
        const page = await read(
          `site_events?select=session_id,event_type&internal=eq.false&created_at=gte.${encodeURIComponent(r.fromIso)}&created_at=lt.${encodeURIComponent(r.toIso)}&order=created_at.asc&limit=1000&offset=${offset}`,
        );
        events.push(...page);
        if (page.length < 1000) break;
      }
      const sessions = new Set<string>();
      const by: Record<string, Set<string>> = { view_item: new Set(), add_to_cart: new Set(), begin_checkout: new Set() };
      const counts: Record<string, number> = { view_item: 0, add_to_cart: 0, begin_checkout: 0 };
      for (const ev of events) {
        sessions.add(ev.session_id);
        if (ev.event_type in by) { by[ev.event_type].add(ev.session_id); counts[ev.event_type]++; }
      }
      const abandoned = [...by.add_to_cart].filter((s) => !by.begin_checkout.has(s)).length;
      const purchases = (await loadOrders(read, r.fromIso, r.toIso)).filter((o) => !o.is_test).length;
      return ok({
        range: r, internal_traffic_excluded: true,
        sessions: sessions.size,
        events: counts,
        sessions_with: { view_item: by.view_item.size, add_to_cart: by.add_to_cart.size, begin_checkout: by.begin_checkout.size },
        purchases,
        abandoned_carts: abandoned,
        note: "Abandoned carts are sessions that added to cart but never started checkout. Checkout abandonment inside Shopify is not stored.",
      });
    } catch (e) { return fail(e); }
  },
});

export const getAttribution = defineTool({
  name: "get_attribution",
  title: "Attribution (admin)",
  description: "Orders and revenue per utm_campaign and per source, based on stored gclid/utm. Test orders excluded. Admin only.",
  inputSchema: rangeSchema,
  annotations: RO,
  handler: async ({ date_from, date_to }, ctx) => {
    try {
      const read = await requireAdmin(ctx);
      const r = parseRange(date_from, date_to);
      const orders = (await loadOrders(read, r.fromIso, r.toIso)).filter((o) => !o.is_test && o.status !== "refunded");
      const group = (key: (o: (typeof orders)[number]) => string) => {
        const out: Record<string, { orders: number; revenue: number }> = {};
        for (const o of orders) {
          const k = key(o);
          out[k] ??= { orders: 0, revenue: 0 };
          out[k].orders++; out[k].revenue = Math.round((out[k].revenue + o.total) * 100) / 100;
        }
        return out;
      };
      return ok({
        range: r,
        per_campaign: group((o) => o.attribution.utm_campaign ?? "(none)"),
        per_source: group((o) => o.attribution.has_gclid ? "google_ads (gclid)" : o.attribution.utm_source ?? "(unknown)"),
      });
    } catch (e) { return fail(e); }
  },
});

export const getAdsDaily = defineTool({
  name: "get_ads_daily",
  title: "Google Ads daily (admin)",
  description: "Daily Google Ads cost per campaign from table ads_daily (filled by your Google Ads Script). Admin only.",
  inputSchema: rangeSchema,
  annotations: RO,
  handler: async ({ date_from, date_to }, ctx) => {
    try {
      const read = await requireAdmin(ctx);
      const r = parseRange(date_from, date_to);
      const rows = await read(
        `ads_daily?select=date,campaign_id,campaign,status,spend,clicks,impressions,conversions,conversion_value&date=gte.${r.fromDate}&date=lte.${r.toDate}&order=date.asc&limit=${MAX_ROWS * 4}`,
      );
      return ok({ range: r, rows, note: rows.length ? undefined : "No rows yet: ads_daily is empty until the Google Ads Script writes to it." });
    } catch (e) { return fail(e); }
  },
});
