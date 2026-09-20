/**
 * Haalt de Google Ads-cijfers op en bewaart ze in ads_daily_stats.
 *
 * Alleen voor een ingelogde beheerder. Lukt het ophalen niet, dan wordt dat
 * eerlijk teruggegeven en blijven de eerder bewaarde cijfers staan.
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev";
const CUSTOMER_ID = "1487660156";

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
  const { data: userData } = await userClient.auth.getUser();
  if (!userData?.user) return json({ error: "Niet ingelogd" }, 401);

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: roles } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id);
  if (!roles?.some((r: { role: string }) => r.role === "admin")) {
    return json({ error: "Geen toegang" }, 403);
  }

  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const adsKey = Deno.env.get("GOOGLE_ADS_API_KEY");
  if (!lovableKey || !adsKey) {
    return json({ error: "Google Ads-koppeling ontbreekt in de backend." }, 200);
  }

  const query = `
    SELECT segments.date, campaign.id, campaign.name,
           metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
  `;

  try {
    const response = await fetch(
      `${GATEWAY_URL}/google_ads/v21/customers/${CUSTOMER_ID}/googleAds:search`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": adsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      console.error(`Google Ads gateway [${response.status}]: ${body}`);
      return json({
        error: `Google Ads gaf status ${response.status}.`,
        details: body.slice(0, 500),
      });
    }

    const payload = await response.json();
    const results = (payload?.results ?? []) as Array<Record<string, any>>;
    const rows = results.map((row) => ({
      stat_date: row.segments?.date,
      campaign_id: String(row.campaign?.id ?? ""),
      campaign_name: row.campaign?.name ?? null,
      product_title: null,
      product_handle: null,
      cost: Number(row.metrics?.costMicros ?? 0) / 1_000_000,
      impressions: Number(row.metrics?.impressions ?? 0),
      clicks: Number(row.metrics?.clicks ?? 0),
      conversions: Number(row.metrics?.conversions ?? 0),
      synced_at: new Date().toISOString(),
    })).filter((r) => r.stat_date);

    if (rows.length > 0) {
      const { error } = await admin.from("ads_daily_stats").upsert(rows, {
        onConflict: "stat_date,campaign_id,product_title",
      });
      if (error) return json({ error: error.message }, 500);
    }

    return json({ stored: rows.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("google-ads-report failed:", message);
    return json({ error: message });
  }
});
