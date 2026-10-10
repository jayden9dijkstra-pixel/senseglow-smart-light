/**
 * Intern dashboard: levert per periode de ruwe, persoonsgegevensvrije data.
 * Alleen voor een ingelogde beheerder. Elke bron meldt zelf of hij er is en
 * wanneer hij voor het laatst is bijgewerkt. Er wordt nooit iets geschat.
 */
// deno-lint-ignore-file no-explicit-any
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { syncOrders } from "../_shared/shopify-orders.ts";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CACHE_MS = 5 * 60_000;
const cache = new Map<string, { at: number; body: unknown }>();
let lastSyncAt = 0;
let lastSyncError: string | null = null;

type Src<T> = { data: T | null; source: string; updatedAt: string | null; error: string | null };

/** Amsterdam-dag → UTC-grens (rekening houdend met zomertijd). */
function amsStartUtc(day: string): string {
  const guess = new Date(`${day}T00:00:00Z`);
  const offH = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Amsterdam", hour: "2-digit", hour12: false }).format(guess),
  );
  return new Date(guess.getTime() - offH * 3_600_000).toISOString();
}
const addDays = (day: string, n: number) => new Date(new Date(`${day}T00:00:00Z`).getTime() + n * 86_400_000).toISOString().slice(0, 10);
const amsDay = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(new Date(iso));

async function loadRange(admin: any, from: string, to: string, excludeInternal: boolean) {
  const fromIso = amsStartUtc(from), toIso = amsStartUtc(addDays(to, 1));

  // Bestellingen
  const ordersQ = await admin
    .from("shop_orders")
    .select("order_number,ordered_at,total,financial_status,line_items,gclid,utm_source,utm_medium,utm_campaign,country_code,synced_at")
    .gte("ordered_at", fromIso).lt("ordered_at", toIso).order("ordered_at", { ascending: false }).limit(5000);
  const orders = (ordersQ.data ?? []).map((o: any) => ({
    ...o,
    total: Number(o.total),
    line_items: (o.line_items ?? []).map((l: any) => ({ title: l.title, variant_title: l.variant_title, quantity: l.quantity, price: Number(l.price) })),
    gclid_masked: o.gclid ? (o.gclid.length > 8 ? `${o.gclid.slice(0, 4)}…${o.gclid.slice(-4)}` : "••••") : null,
    has_gclid: Boolean(o.gclid),
    gclid: undefined,
    day: amsDay(o.ordered_at),
  }));

  // Advertenties: ads_daily (script) heeft voorrang, anders campagnetotalen uit ads_daily_stats
  const adsQ = await admin.from("ads_daily").select("*").gte("date", from).lte("date", to).limit(20000);
  let ads: any[] = (adsQ.data ?? []).map((r: any) => ({
    date: r.date, campaign_id: r.campaign_id, campaign: r.campaign, status: r.status,
    spend: Number(r.spend), clicks: Number(r.clicks), impressions: Number(r.impressions),
    conversions: Number(r.conversions), conversion_value: Number(r.conversion_value), updated_at: r.updated_at,
  }));
  let adsSource = "Google Ads Script (ads_daily)";
  if (ads.length === 0) {
    const legacy = await admin.from("ads_daily_stats").select("*").is("product_title", null).gte("stat_date", from).lte("stat_date", to).limit(20000);
    ads = (legacy.data ?? []).map((r: any) => ({
      date: r.stat_date, campaign_id: r.campaign_id ?? "", campaign: r.campaign_name ?? "(onbekend)", status: null,
      spend: Number(r.cost), clicks: Number(r.clicks), impressions: Number(r.impressions),
      conversions: Number(r.conversions), conversion_value: null, updated_at: r.synced_at,
    }));
    adsSource = "Google Ads (eerder handmatig opgehaald)";
  }

  // Eigen meting: samengevat per dag/type/apparaat, sessies uniek
  const events: any[] = [];
  for (let off = 0; off < 200_000; off += 1000) {
    let q = admin.from("site_events").select("created_at,session_id,event_type,device").gte("created_at", fromIso).lt("created_at", toIso)
      .order("created_at", { ascending: true }).range(off, off + 999);
    if (excludeInternal) q = q.eq("internal", false);
    const { data, error } = await q;
    if (error) throw new Error("Eigen meting kon niet worden gelezen.");
    events.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  const perDay: Record<string, Record<string, number>> = {};
  const sessionsPerDay: Record<string, Set<string>> = {};
  const funnelSessions: Record<string, Record<string, Set<string>>> = {}; // device → step → sessions
  const allSessions = new Set<string>();
  for (const e of events) {
    const d = amsDay(e.created_at);
    (perDay[d] ??= {})[e.event_type] = (perDay[d][e.event_type] ?? 0) + 1;
    (sessionsPerDay[d] ??= new Set()).add(e.session_id);
    allSessions.add(e.session_id);
    for (const dev of ["all", e.device ?? "unknown"]) {
      ((funnelSessions[dev] ??= {})[e.event_type] ??= new Set()).add(e.session_id);
      (funnelSessions[dev].session ??= new Set()).add(e.session_id);
    }
  }
  const funnel: Record<string, Record<string, number>> = {};
  for (const [dev, steps] of Object.entries(funnelSessions)) {
    funnel[dev] = Object.fromEntries(Object.entries(steps).map(([k, v]) => [k, v.size]));
    const atc = steps.add_to_cart ?? new Set(), bc = steps.begin_checkout ?? new Set();
    funnel[dev].abandoned_carts = [...atc].filter((s) => !bc.has(s)).length;
  }

  return {
    orders,
    ads,
    adsSource,
    events: {
      perDay: Object.fromEntries(Object.entries(perDay).map(([d, v]) => [d, { ...v, sessions: sessionsPerDay[d].size }])),
      sessions: allSessions.size,
      funnel,
      total: events.length,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Niet ingelogd" }, 401);
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const userClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
  const { data: u } = await userClient.auth.getUser();
  if (!u?.user) return json({ error: "Niet ingelogd" }, 401);
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", u.user.id);
  if (!roles?.some((r: any) => r.role === "admin")) return json({ error: "Geen toegang" }, 403);

  let body: any = {};
  try { body = await req.json(); } catch { /* standaardwaarden */ }
  const today = amsDay(new Date().toISOString());
  const from = typeof body.from === "string" && DATE.test(body.from) ? body.from : addDays(today, -6);
  const to = typeof body.to === "string" && DATE.test(body.to) ? body.to : today;
  const days = (Date.parse(to) - Date.parse(from)) / 86_400_000 + 1;
  if (!(days >= 1 && days <= 365)) return json({ error: "Periode moet tussen 1 en 365 dagen liggen." }, 400);
  const compare = body.compare === true;
  const excludeInternal = body.exclude_internal !== false;
  const force = body.force === true;

  // Bestellingen verversen als ze ouder zijn dan 5 minuten (naast de geplande run)
  let ordersSync: Src<null> = { data: null, source: "Shopify Admin API", updatedAt: null, error: null };
  if (force || Date.now() - lastSyncAt > CACHE_MS) {
    try {
      await syncOrders(admin, Math.min(Math.max(days + (compare ? days : 0), 90), 400));
      lastSyncAt = Date.now();
      lastSyncError = null;
    } catch (e) {
      lastSyncError = e instanceof Error ? e.message : "Shopify ophalen mislukte.";
    }
  }
  const { data: lastSynced } = await admin.from("shop_orders").select("synced_at").order("synced_at", { ascending: false }).limit(1);
  ordersSync = { ...ordersSync, updatedAt: lastSynced?.[0]?.synced_at ?? null, error: lastSyncError };

  const key = JSON.stringify({ from, to, compare, excludeInternal });
  const hit = cache.get(key);
  if (!force && hit && Date.now() - hit.at < CACHE_MS) return json(hit.body);

  try {
    const current = await loadRange(admin, from, to, excludeInternal);
    const prevTo = addDays(from, -1), prevFrom = addDays(from, -days);
    const previous = compare ? await loadRange(admin, prevFrom, prevTo, excludeInternal) : null;

    const [{ data: costs }, { data: settings }, { data: adsFresh }, { data: legacyFresh }, { data: recentClicks }, { data: lastEvent }] = await Promise.all([
      admin.from("product_costs").select("variant_key,product,variant,match_pattern,cost_excl_vat,updated_at").order("product"),
      admin.from("dashboard_settings").select("*").eq("id", 1).maybeSingle(),
      admin.from("ads_daily").select("updated_at").order("updated_at", { ascending: false }).limit(1),
      admin.from("ads_daily_stats").select("synced_at").order("synced_at", { ascending: false }).limit(1),
      admin.from("checkout_attribution").select("gclid,utm_campaign,created_at").not("gclid", "is", null).order("created_at", { ascending: false }).limit(10),
      admin.from("site_events").select("created_at").order("created_at", { ascending: false }).limit(1),
    ]);

    const responseBody = {
      range: { from, to, days, previous: compare ? { from: prevFrom, to: prevTo } : null },
      excludeInternal,
      current,
      previous,
      costs: (costs ?? []).map((c: any) => ({ ...c, cost_excl_vat: Number(c.cost_excl_vat) })),
      settings,
      sources: {
        orders: ordersSync,
        adsScript: { source: "Google Ads Script", updatedAt: adsFresh?.[0]?.updated_at ?? null },
        adsLegacy: { source: "Google Ads (handmatig)", updatedAt: legacyFresh?.[0]?.synced_at ?? null },
        events: { source: "Eigen bezoekmeting", updatedAt: lastEvent?.[0]?.created_at ?? null },
      },
      recentClickIds: (recentClicks ?? []).map((r: any) => ({
        masked: r.gclid.length > 8 ? `${r.gclid.slice(0, 4)}…${r.gclid.slice(-4)}` : "••••",
        utm_campaign: r.utm_campaign,
        at: r.created_at,
      })),
      generatedAt: new Date().toISOString(),
    };
    cache.set(key, { at: Date.now(), body: responseBody });
    if (cache.size > 50) cache.delete(cache.keys().next().value!);
    return json(responseBody);
  } catch (e) {
    console.error("dashboard-summary:", e instanceof Error ? e.message : e);
    return json({ error: "De gegevens konden niet worden geladen." }, 500);
  }
});
