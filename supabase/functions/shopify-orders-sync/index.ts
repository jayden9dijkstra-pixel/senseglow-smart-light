/**
 * Geplande synchronisatie (elke 5 minuten) van Shopify-bestellingen naar shop_orders.
 * Geeft alleen een aantal terug, nooit ordergegevens. Hooguit één run per minuut.
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { syncOrders } from "../_shared/shopify-orders.ts";

let lastRun = 0;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const token = req.headers.get("x-cron-token") ?? "";
  const { data: ok } = await admin.rpc("verify_cron_token", { _name: "shopify-orders-sync", _token: token });
  if (ok !== true) return json({ error: "unauthorized" }, 401);
  if (Date.now() - lastRun < 60_000) return json({ skipped: true });
  lastRun = Date.now();
  try {
    const synced = await syncOrders(admin, 90);
    return json({ synced });
  } catch (e) {
    console.error("sync failed:", e instanceof Error ? e.message : e);
    return json({ error: "sync_failed" }, 502);
  }
});
