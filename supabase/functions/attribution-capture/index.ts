/**
 * Legt vast waar een winkelwagen vandaan komt.
 *
 * Wordt aangeroepen zodra de afrekenlink gemaakt is. Slaat het cart-kenmerk op
 * met de klik-ids en campagnegegevens, zodat een latere Shopify-bestelling
 * alsnog aan de advertentieklik gekoppeld kan worden.
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const FIELDS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "landing_path",
] as const;

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return null;
  return trimmed;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null);
    const cartToken = clean(body?.cart_token);
    if (!cartToken || !/^[A-Za-z0-9_-]{6,120}$/.test(cartToken)) {
      return json({ error: "cart_token ontbreekt of is ongeldig" }, 400);
    }

    const record: Record<string, string | null> = { cart_token: cartToken };
    for (const field of FIELDS) record[field] = clean(body?.[field]);

    // Geen enkele herkomst? Dan valt er niets te bewaren.
    const hasValue = FIELDS.some((f) => f !== "landing_path" && record[f]);
    if (!hasValue && !record.landing_path) return json({ stored: false });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { error } = await supabase
      .from("checkout_attribution")
      .upsert(record, { onConflict: "cart_token" });

    if (error) {
      console.error("attribution insert failed:", error.message);
      return json({ error: error.message }, 500);
    }

    return json({ stored: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("attribution-capture failed:", message);
    return json({ error: message }, 500);
  }
});
