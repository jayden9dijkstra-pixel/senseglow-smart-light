/**
 * Eigen, lichte bezoekmeting naast de Google-tag.
 * Registreert paginaweergaves en winkelwagenstappen in de eigen backend,
 * zodat de cijferpagina laat zien wat er echt gebeurt. Faalt altijd stil.
 */
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "sg_session_id";

export type SiteEventType =
  | "page_view"
  | "view_item"
  | "add_to_cart"
  | "begin_checkout"
  | "checkout_reached";

function sessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return "anon";
  }
}

function device(): string {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

let countryPromise: Promise<string | null> | undefined;

function country(): Promise<string | null> {
  return (countryPromise ??= (async () => {
    try {
      const res = await fetch("/cdn-cgi/trace", { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return (await res.text()).match(/^loc=([A-Z0-9]{2})$/m)?.[1] ?? null;
    } catch {
      return null;
    }
  })());
}

/** Eigen bezoeken worden gemarkeerd zodat ze niet in de cijfers meetellen. */
export function isInternalVisitor(): boolean {
  if (typeof document === "undefined") return false;
  return /(?:^|;\s*)sg_internal=1/.test(document.cookie);
}

export async function trackSiteEvent(
  eventType: SiteEventType,
  extra: { path?: string; itemName?: string; value?: number } = {}
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const loc = await country();
    await supabase.from("site_events").insert({
      session_id: sessionId(),
      event_type: eventType,
      path: extra.path ?? window.location.pathname,
      referrer: document.referrer ? new URL(document.referrer).hostname : null,
      device: device(),
      country: loc,
      locale: document.documentElement.lang || "nl",
      item_name: extra.itemName ?? null,
      value: extra.value ?? null,
      internal: isInternalVisitor(),
    });
  } catch {
    // meting mag de winkel nooit blokkeren
  }
}
