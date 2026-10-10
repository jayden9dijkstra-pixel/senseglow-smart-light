// Alleen-lezen toegang tot interne cijfers voor de MCP-tools.
// Elke query loopt met het OAuth-token van de ingelogde gebruiker, dus de
// databaseregels (alleen beheerders mogen lezen) blijven de echte grens.
// Er worden nooit namen, e-mailadressen, adressen of telefoonnummers opgevraagd.
import { z } from "zod";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://unset.supabase.co";
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

export const MAX_DAYS = 90;
export const MAX_ROWS = 250;

export const rangeSchema = {
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Startdatum YYYY-MM-DD"),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Einddatum YYYY-MM-DD (inclusief), max 90 dagen na start"),
};

export function parseRange(from: string, to: string) {
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) throw new UserError("Ongeldige datum.");
  if (end < start) throw new UserError("date_to ligt voor date_from.");
  const days = (end.getTime() - start.getTime()) / 86_400_000 + 1;
  if (days > MAX_DAYS) throw new UserError(`Maximaal ${MAX_DAYS} dagen per verzoek.`);
  const endExclusive = new Date(end.getTime() + 86_400_000);
  return { fromIso: start.toISOString(), toIso: endExclusive.toISOString(), fromDate: from, toDate: to };
}

export class UserError extends Error {}

type Ctx = { isAuthenticated(): boolean; getToken(): string | undefined; getUserId(): string | undefined };

async function rest(token: string, path: string): Promise<any[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (res.status === 401 || res.status === 403) throw new UserError("Niet ingelogd of sessie verlopen.");
  if (!res.ok) throw new Error(`query failed ${res.status}`);
  return (await res.json()) as any[];
}

/** Controleert login + beheerdersrol en geeft een lees-functie terug. */
export async function requireAdmin(ctx: Ctx) {
  const token = ctx.getToken();
  const uid = ctx.getUserId();
  if (!ctx.isAuthenticated() || !token || !uid) throw new UserError("Niet ingelogd.");
  const roles = await rest(token, `user_roles?select=role&user_id=eq.${encodeURIComponent(uid)}`);
  if (!roles.some((r) => r.role === "admin")) throw new UserError("Geen toegang: alleen de beheerder.");
  return (path: string) => rest(token, path);
}

export function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }], structuredContent: data as Record<string, unknown> };
}

export function fail(err: unknown) {
  const msg = err instanceof UserError ? err.message : "Gegevens konden niet worden opgehaald.";
  return { content: [{ type: "text" as const, text: msg }], isError: true };
}

const TEST_ORDERS = ["#1003", "#1004", "#1006"]; // door de eigenaar aangewezen testbestellingen

export async function loadOrders(read: (p: string) => Promise<any[]>, fromIso: string, toIso: string, limit = MAX_ROWS) {
  const rows = await read(
    `shop_orders?select=order_number,ordered_at,total,currency,financial_status,line_items,cart_token,gclid,utm_source,utm_medium,utm_campaign` +
      `&ordered_at=gte.${encodeURIComponent(fromIso)}&ordered_at=lt.${encodeURIComponent(toIso)}&order=ordered_at.desc&limit=${limit}`,
  );
  const tokens = rows.map((r) => r.cart_token).filter(Boolean);
  const attr = new Map<string, any>();
  if (tokens.length) {
    const list = tokens.map((t: string) => `"${t.replace(/"/g, "")}"`).join(",");
    for (const a of await read(`checkout_attribution?select=cart_token,gclid,gbraid,wbraid,utm_source,utm_medium,utm_campaign&cart_token=in.(${encodeURIComponent(list)})`)) {
      attr.set(a.cart_token, a);
    }
  }
  return rows.map((r) => {
    const a = attr.get(r.cart_token) ?? {};
    return {
      order_number: r.order_number,
      ordered_at: r.ordered_at,
      total: Number(r.total),
      currency: r.currency,
      status: r.financial_status,
      is_test: TEST_ORDERS.includes(r.order_number),
      country: null as string | null, // niet opgeslagen
      line_items: (r.line_items ?? []).map((li: any) => ({
        product: li.title, variant: li.variant_title, quantity: li.quantity, price: Number(li.price),
      })),
      attribution: {
        has_gclid: Boolean(r.gclid || a.gclid || a.gbraid || a.wbraid),
        utm_source: r.utm_source ?? a.utm_source ?? null,
        utm_medium: r.utm_medium ?? a.utm_medium ?? null,
        utm_campaign: r.utm_campaign ?? a.utm_campaign ?? null,
      },
    };
  });
}
