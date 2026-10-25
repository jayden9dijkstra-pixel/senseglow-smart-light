/**
 * Geplande synchronisatie (elke 5 minuten) van Shopify-bestellingen naar shop_orders.
 * Geeft alleen een aantal terug, nooit ordergegevens. Hooguit één run per minuut.
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { exportConversions, syncOrders } from "../_shared/shopify-orders.ts";
import { serviceAccountEmail } from "../_shared/google-sheets.ts";

let lastRun = 0;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const token = req.headers.get("x-cron-token") ?? "";
  const { data: ok } = await admin.rpc("verify_cron_token", { _name: "shopify-orders-sync", _token: token });
  let isAdmin = false;
  if (ok !== true) {
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: u } = jwt ? await admin.auth.getUser(jwt) : { data: { user: null } };
    if (u?.user) {
      const { data: r } = await admin.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      isAdmin = !!r;
    }
    if (!isAdmin) return json({ error: "unauthorized" }, 401);
  }
  const body = await req.json().catch(() => ({}));
  if (isAdmin && body?.mode === "backfill") {
    try {
      await syncOrders(admin, 90);
      return json({ written: await exportConversions(admin), service_account: serviceAccountEmail() });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("backfill failed:", msg);
      return json({ error: "backfill_failed", details: msg, service_account: (() => { try { return serviceAccountEmail(); } catch { return null; } })() }, 502);
    }
  }
  if (!isAdmin && Date.now() - lastRun < 60_000) return json({ skipped: true });
  lastRun = Date.now();
  try {
    const synced = await syncOrders(admin, 90);
    let exported = 0;
    try { exported = await exportConversions(admin); } catch (e) {
      console.error("conversion export failed:", e instanceof Error ? e.message : e);
    }
    return json({ synced, exported });
  } catch (e) {
    console.error("sync failed:", e instanceof Error ? e.message : e);
    return json({ error: "sync_failed" }, 502);
  }
});
