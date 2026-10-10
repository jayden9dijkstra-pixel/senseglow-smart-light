/**
 * Ontvangt dagcijfers per campagne van het Google Ads Script en zet ze in ads_daily.
 * Beveiligd met de header x-ingest-token (backend-secret ADS_INGEST_TOKEN).
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const Row = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  campaign_id: z.string().min(1).max(32),
  campaign: z.string().min(1).max(255),
  status: z.string().max(32).optional().nullable(),
  spend: z.number().min(0).max(1_000_000),
  clicks: z.number().int().min(0),
  impressions: z.number().int().min(0),
  conversions: z.number().min(0),
  conversion_value: z.number().min(0),
});
const Body = z.object({ rows: z.array(Row).min(1).max(31 * 200) });

function safeEqual(a: string, b: string) {
  const ea = new TextEncoder().encode(a), eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const expected = Deno.env.get("ADS_INGEST_TOKEN") ?? "";
  const given = req.headers.get("x-ingest-token") ?? "";
  if (!expected || expected.length < 16 || !safeEqual(given, expected)) return json({ error: "unauthorized" }, 401);

  let parsed;
  try {
    parsed = Body.safeParse(await req.json());
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  if (!parsed.success) return json({ error: "invalid_body", issues: parsed.error.issues.slice(0, 5).map((i) => i.path.join(".")) }, 400);

  const now = new Date().toISOString();
  const rows = parsed.data.rows.map((r) => ({ ...r, status: r.status ?? null, updated_at: now, synced_at: now }));
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await admin.from("ads_daily").upsert(rows, { onConflict: "date,campaign_id" });
  if (error) {
    console.error("ads_daily upsert:", error.message);
    return json({ error: "store_failed" }, 500);
  }
  return json({ stored: rows.length });
});
