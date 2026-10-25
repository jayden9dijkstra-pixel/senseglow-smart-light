/**
 * Haalt Shopify-bestellingen op met de bestaande backend-toegang en bewaart
 * ze zonder persoonsgegevens in shop_orders (alleen landcode van het adres).
 */
// deno-lint-ignore-file no-explicit-any
const DOMAIN = Deno.env.get("SHOPIFY_STORE_DOMAIN") ?? "senseglow-smart-light-5jjoq.myshopify.com";
const TOKEN = Deno.env.get("SHOPIFY_ADMIN_TOKEN") ?? Deno.env.get("SHOPIFY_ACCESS_TOKEN") ?? "";
const VERSION = "2025-07";
const FIELDS = "id,name,test,source_name,current_subtotal_price,subtotal_price,created_at,total_price,currency,financial_status,cart_token,checkout_token,line_items,shipping_address,billing_address";

export async function fetchShopifyOrders(sinceDays: number): Promise<any[]> {
  if (!TOKEN) throw new Error("Geen Shopify-toegang beschikbaar in de backend.");
  const since = new Date(Date.now() - sinceDays * 86_400_000).toISOString();
  let url: string | null =
    `https://${DOMAIN}/admin/api/${VERSION}/orders.json?status=any&limit=250&fields=${FIELDS}&created_at_min=${encodeURIComponent(since)}`;
  const out: any[] = [];
  for (let page = 0; url && page < 10; page++) {
    const res: Response = await fetch(url, { headers: { "X-Shopify-Access-Token": TOKEN } });
    if (!res.ok) {
      await res.text();
      if (res.status === 401 || res.status === 403) throw new Error("Shopify weigert de bestaande toegang (herauthenticatie nodig).");
      throw new Error(`Shopify gaf status ${res.status}.`);
    }
    const body = await res.json();
    out.push(...(body.orders ?? []));
    const link = res.headers.get("link") ?? "";
    url = link.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
  }
  return out;
}

import { type OrderForExport, orderNumber, rowsToWrite } from "./conversion-row.ts";
import { appendRows, existingOrderIds } from "./google-sheets.ts";

let lastCandidates: OrderForExport[] = [];

export async function syncOrders(admin: any, sinceDays = 90): Promise<number> {
  const orders = await fetchShopifyOrders(sinceDays);
  const tokens = orders.map((o) => o.cart_token || o.checkout_token).filter(Boolean);
  const attr = new Map<string, any>();
  for (let i = 0; i < tokens.length; i += 200) {
    const { data } = await admin.from("checkout_attribution").select("*").in("cart_token", tokens.slice(i, i + 200));
    for (const a of data ?? []) attr.set(a.cart_token, a);
  }
  // Bestaande herkomst nooit overschrijven met leeg.
  const existing = new Map<number, any>();
  const ids = orders.map((o) => o.id);
  for (let i = 0; i < ids.length; i += 200) {
    const { data } = await admin.from("shop_orders")
      .select("shopify_order_id,gclid,ad_consent,utm_source,utm_medium,utm_campaign,utm_term,utm_content,landing_path")
      .in("shopify_order_id", ids.slice(i, i + 200));
    for (const e of data ?? []) existing.set(Number(e.shopify_order_id), e);
  }
  const rows = orders.map((o) => {
    const token = o.cart_token || o.checkout_token || null;
    const found = token ? attr.get(token) : undefined;
    const prev = existing.get(Number(o.id)) ?? {};
    const a = {
      gclid: found?.gclid ?? found?.gbraid ?? found?.wbraid ?? prev.gclid ?? null,
      utm_source: found?.utm_source ?? prev.utm_source ?? null,
      utm_medium: found?.utm_medium ?? prev.utm_medium ?? null,
      utm_campaign: found?.utm_campaign ?? prev.utm_campaign ?? null,
      utm_term: found?.utm_term ?? prev.utm_term ?? null,
      utm_content: found?.utm_content ?? prev.utm_content ?? null,
      landing_path: found?.landing_path ?? prev.landing_path ?? null,
      ad_consent: found?.ad_consent ?? prev.ad_consent ?? null,
    };
    return {
      shopify_order_id: o.id,
      order_number: o.name,
      ordered_at: o.created_at,
      total: Number(o.total_price) || 0,
      currency: o.currency || "EUR",
      financial_status: o.financial_status,
      country_code: o.shipping_address?.country_code ?? o.billing_address?.country_code ?? null,
      line_items: (o.line_items ?? []).map((li: any) => ({
        title: li.title, variant_title: li.variant_title, quantity: li.quantity, price: Number(li.price) || 0, sku: li.sku,
      })),
      cart_token: token,
      gclid: a.gclid,
      utm_source: a?.utm_source ?? null,
      utm_medium: a?.utm_medium ?? null,
      utm_campaign: a?.utm_campaign ?? null,
      utm_term: a?.utm_term ?? null,
      utm_content: a?.utm_content ?? null,
      landing_path: a?.landing_path ?? null,
      ad_consent: a.ad_consent,
      synced_at: new Date().toISOString(),
    };
  });
  lastCandidates = orders.map((o) => {
    const token = o.cart_token || o.checkout_token || null;
    const found = token ? attr.get(token) : undefined;
    const prev = existing.get(Number(o.id)) ?? {};
    return {
      order_number: o.name,
      ordered_at: o.created_at,
      subtotal: Number(o.current_subtotal_price ?? o.subtotal_price) || 0,
      financial_status: o.financial_status,
      // alleen echte gclid; gbraid/wbraid passen niet in deze import
      gclid: found?.gclid ?? (found ? null : prev.gclid) ?? null,
      ad_consent: found?.ad_consent ?? prev.ad_consent ?? null,
      is_test: o.test === true,
      is_draft: o.source_name === "shopify_draft_order",
    };
  });
  if (rows.length) {
    const { error } = await admin.from("shop_orders").upsert(rows, { onConflict: "shopify_order_id" });
    if (error) throw new Error("Opslaan van bestellingen mislukte.");
  }
  return rows.length;
}

/** Schrijft nieuwe betaalde orders met gclid naar de Google Ads-importsheet. */
export async function exportConversions(admin: any): Promise<number> {
  if (!Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON") || !Deno.env.get("ADS_IMPORT_SHEET_ID")) return 0;
  const { data: done } = await admin.from("ads_conversion_exports").select("order_number");
  const written = new Set<string>((done ?? []).map((d: any) => d.order_number));
  const pending = lastCandidates.filter((o) => !written.has(orderNumber(o.order_number)));
  if (!rowsToWrite(pending, new Set()).length) return 0;
  const { ids, token } = await existingOrderIds();
  for (const id of ids) written.add(id);
  const rows = rowsToWrite(lastCandidates, written);
  await appendRows(rows, token);
  if (rows.length) {
    await admin.from("ads_conversion_exports").upsert(rows.map((r) => ({ order_number: r[5], status: "written" })), { onConflict: "order_number" });
  }
  return rows.length;
}
