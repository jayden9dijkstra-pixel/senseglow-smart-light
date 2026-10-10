/**
 * Haalt Shopify-bestellingen op met de bestaande backend-toegang en bewaart
 * ze zonder persoonsgegevens in shop_orders (alleen landcode van het adres).
 */
// deno-lint-ignore-file no-explicit-any
const DOMAIN = Deno.env.get("SHOPIFY_STORE_DOMAIN") ?? "senseglow-smart-light-5jjoq.myshopify.com";
const TOKEN = Deno.env.get("SHOPIFY_ADMIN_TOKEN") ?? Deno.env.get("SHOPIFY_ACCESS_TOKEN") ?? "";
const VERSION = "2025-07";
const FIELDS = "id,name,created_at,total_price,currency,financial_status,cart_token,checkout_token,line_items,shipping_address,billing_address";

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

export async function syncOrders(admin: any, sinceDays = 90): Promise<number> {
  const orders = await fetchShopifyOrders(sinceDays);
  const tokens = orders.map((o) => o.cart_token || o.checkout_token).filter(Boolean);
  const attr = new Map<string, any>();
  for (let i = 0; i < tokens.length; i += 200) {
    const { data } = await admin.from("checkout_attribution").select("*").in("cart_token", tokens.slice(i, i + 200));
    for (const a of data ?? []) attr.set(a.cart_token, a);
  }
  const rows = orders.map((o) => {
    const token = o.cart_token || o.checkout_token || null;
    const a = token ? attr.get(token) : undefined;
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
      gclid: a?.gclid ?? a?.gbraid ?? a?.wbraid ?? null,
      utm_source: a?.utm_source ?? null,
      utm_medium: a?.utm_medium ?? null,
      utm_campaign: a?.utm_campaign ?? null,
      utm_term: a?.utm_term ?? null,
      utm_content: a?.utm_content ?? null,
      landing_path: a?.landing_path ?? null,
      synced_at: new Date().toISOString(),
    };
  });
  if (rows.length) {
    const { error } = await admin.from("shop_orders").upsert(rows, { onConflict: "shopify_order_id" });
    if (error) throw new Error("Opslaan van bestellingen mislukte.");
  }
  return rows.length;
}
