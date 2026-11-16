/**
 * Splitst de trechter per landingspagina, verwijzer, land en apparaat.
 * Per sessie telt de eerste gebeurtenis (oudste) voor pagina, verwijzer, land en apparaat.
 * Geen persoonsgegevens: alleen pad, hostnaam van de verwijzer, landcode en apparaattype.
 */
export interface FunnelEvent {
  session_id: string;
  event_type: string;
  path?: string | null;
  referrer?: string | null;
  country?: string | null;
  device?: string | null;
}

export interface FunnelRow {
  key: string;
  sessions: number;
  view_item: number;
  add_to_cart: number;
  begin_checkout: number;
}

const STEPS = ["view_item", "add_to_cart", "begin_checkout"] as const;

function group(sessions: Map<string, { key: string; steps: Set<string> }>, limit: number): FunnelRow[] {
  const rows = new Map<string, FunnelRow>();
  for (const s of sessions.values()) {
    const row = rows.get(s.key) ?? { key: s.key, sessions: 0, view_item: 0, add_to_cart: 0, begin_checkout: 0 };
    row.sessions++;
    for (const step of STEPS) if (s.steps.has(step)) row[step]++;
    rows.set(s.key, row);
  }
  return [...rows.values()].sort((a, b) => b.sessions - a.sessions || a.key.localeCompare(b.key)).slice(0, limit);
}

/** `events` moet oplopend op tijd gesorteerd zijn. */
export function funnelBreakdown(events: FunnelEvent[], limit = 12) {
  const dims = {
    landing_page: new Map<string, { key: string; steps: Set<string> }>(),
    referrer: new Map<string, { key: string; steps: Set<string> }>(),
    country: new Map<string, { key: string; steps: Set<string> }>(),
    device: new Map<string, { key: string; steps: Set<string> }>(),
  };
  for (const ev of events) {
    const first = {
      landing_page: ev.path || "(onbekend)",
      referrer: ev.referrer || "(direct)",
      country: ev.country || "(onbekend)",
      device: ev.device || "(onbekend)",
    };
    for (const dim of Object.keys(dims) as (keyof typeof dims)[]) {
      let s = dims[dim].get(ev.session_id);
      if (!s) { s = { key: first[dim], steps: new Set() }; dims[dim].set(ev.session_id, s); }
      s.steps.add(ev.event_type);
    }
  }
  return {
    by_landing_page: group(dims.landing_page, limit),
    by_referrer: group(dims.referrer, limit),
    by_country: group(dims.country, limit),
    by_device: group(dims.device, limit),
  };
}
