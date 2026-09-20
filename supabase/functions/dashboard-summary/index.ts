/**
 * Intern dashboard: bundelt Shopify, Google Ads en de eigen bezoekmeting.
 *
 * Alleen bereikbaar voor een ingelogde beheerder. Elk paneel geeft zijn eigen
 * bron, tijdstip en eventuele reden waarom er niets beschikbaar is. Er worden
 * nooit getallen geschat of verzonnen.
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SHOPIFY_STORE_DOMAIN =
  Deno.env.get("SHOPIFY_STORE_DOMAIN") ?? "senseglow-smart-light-5jjoq.myshopify.com";
const SHOPIFY_ADMIN_TOKEN =
  Deno.env.get("SHOPIFY_ADMIN_TOKEN") ?? Deno.env.get("SHOPIFY_ACCESS_TOKEN") ?? "";
const SHOPIFY_API_VERSION = "2025-07";

type Panel<T> = {
  data: T | null;
  source: string;
  fetchedAt: string | null;
  error: string | null;
};

function ok<T>(data: T, source: string): Panel<T> {
  return { data, source, fetchedAt: new Date().toISOString(), error: null };
}

function fail<T>(source: string, error: string): Panel<T> {
  return { data: null, source, fetchedAt: null, error };
}

type ShopifyLineItem = {
  title: string;
  variant_title: string | null;
  quantity: number;
  price: string;
  sku: string | null;
};

type ShopifyOrder = {
  id: number;
  name: string;
  created_at: string;
  total_price: string;
  currency: string;
  financial_status: string | null;
  cart_token: string | null;
  checkout_token: string | null;
  line_items: ShopifyLineItem[];
};

async function fetchShopifyOrders(): Promise<ShopifyOrder[]> {
  if (!SHOPIFY_ADMIN_TOKEN) {
    throw new Error("Geen Shopify-toegang beschikbaar in de backend.");
  }
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const url =
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/orders.json` +
    `?status=any&limit=250&created_at_min=${encodeURIComponent(since)}`;

  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Shopify orders failed [${response.status}]: ${body}`);
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "Shopify weigert de bestaande toegang (herauthenticatie nodig in Shopify).",
      );
    }
    throw new Error(`Shopify gaf status ${response.status}.`);
  }

  const payload = await response.json();
  return (payload?.orders ?? []) as ShopifyOrder[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Niet ingelogd" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ??
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData?.user) return json({ error: "Niet ingelogd" }, 401);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: roles } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id);
  if (!roles?.some((r: { role: string }) => r.role === "admin")) {
    return json({ error: "Geen toegang" }, 403);
  }

  /* ------------------------------------------------ Shopify: bestellingen */

  let ordersPanel: Panel<unknown[]>;
  try {
    const orders = await fetchShopifyOrders();

    const tokens = orders
      .map((o) => o.cart_token || o.checkout_token)
      .filter((t): t is string => Boolean(t));

    const attributionByToken = new Map<string, Record<string, string | null>>();
    if (tokens.length > 0) {
      const { data: attribution } = await admin
        .from("checkout_attribution")
        .select("*")
        .in("cart_token", tokens);
      for (const row of attribution ?? []) {
        attributionByToken.set(row.cart_token, row);
      }
    }

    const rows = orders.map((order) => {
      const token = order.cart_token || order.checkout_token || null;
      const attr = token ? attributionByToken.get(token) : undefined;
      return {
        shopify_order_id: order.id,
        order_number: order.name,
        ordered_at: order.created_at,
        total: Number(order.total_price) || 0,
        currency: order.currency || "EUR",
        financial_status: order.financial_status,
        line_items: order.line_items.map((li) => ({
          title: li.title,
          variant_title: li.variant_title,
          quantity: li.quantity,
          price: Number(li.price) || 0,
          sku: li.sku,
        })),
        cart_token: token,
        gclid: attr?.gclid ?? null,
        utm_source: attr?.utm_source ?? null,
        utm_medium: attr?.utm_medium ?? null,
        utm_campaign: attr?.utm_campaign ?? null,
        utm_term: attr?.utm_term ?? null,
        utm_content: attr?.utm_content ?? null,
        landing_path: attr?.landing_path ?? null,
        synced_at: new Date().toISOString(),
      };
    });

    if (rows.length > 0) {
      const { error: upsertError } = await admin
        .from("shop_orders")
        .upsert(rows, { onConflict: "shopify_order_id" });
      if (upsertError) console.error("shop_orders upsert:", upsertError.message);
    }

    ordersPanel = ok(rows, "Shopify Admin API");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Val terug op wat eerder al opgeslagen is, met een eerlijk tijdstip.
    const { data: cached } = await admin
      .from("shop_orders")
      .select("*")
      .order("ordered_at", { ascending: false })
      .limit(250);
    if (cached && cached.length > 0) {
      ordersPanel = {
        data: cached,
        source: "Shopify (eerder opgeslagen)",
        fetchedAt: cached[0].synced_at ?? null,
        error: `Live ophalen lukte niet: ${message}`,
      };
    } else {
      ordersPanel = fail("Shopify Admin API", message);
    }
  }

  /* --------------------------------------------------------- Google Ads */

  let adsPanel: Panel<unknown[]>;
  {
    const { data: ads, error } = await admin
      .from("ads_daily_stats")
      .select("*")
      .order("stat_date", { ascending: false })
      .limit(2000);
    if (error) {
      adsPanel = fail("Google Ads", error.message);
    } else if (!ads || ads.length === 0) {
      adsPanel = fail(
        "Google Ads",
        "Nog geen advertentiecijfers opgeslagen. Ververs de Google Ads-gegevens.",
      );
    } else {
      const latest = ads.reduce(
        (acc: string | null, row: { synced_at: string }) =>
          !acc || row.synced_at > acc ? row.synced_at : acc,
        null,
      );
      adsPanel = { data: ads, source: "Google Ads", fetchedAt: latest, error: null };
    }
  }

  /* ---------------------------------------------------- Eigen bezoekmeting */

  let analyticsPanel: Panel<unknown[]>;
  {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: events, error } = await admin
      .from("site_events")
      .select("created_at, session_id, event_type, path, item_name, value, internal")
      .eq("internal", false)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20000);
    analyticsPanel = error
      ? fail("Eigen bezoekmeting", error.message)
      : ok(events ?? [], "Eigen bezoekmeting");
  }

  return json({
    orders: ordersPanel,
    ads: adsPanel,
    analytics: analyticsPanel,
    generatedAt: new Date().toISOString(),
  });
});
