/** Pure helpers voor de Google Ads-importrij (geen persoonsgegevens). */

export const CONVERSION_NAME = "Aankoop - server";

export interface OrderForExport {
  order_number: string; // "#1008" of "1008"
  ordered_at: string; // ISO
  subtotal: number; // na korting, excl. verzending
  financial_status: string | null;
  gclid: string | null;
  ad_consent: string | null;
  is_test: boolean;
  is_draft: boolean;
}

/** ISO 8601 in Europe/Amsterdam met offset, bv. 2026-10-25T14:30:00+01:00 */
export function amsterdamIso(iso: string): string {
  const d = new Date(iso);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Amsterdam",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    }).formatToParts(d).map((p) => [p.type, p.value]),
  );
  const hour = parts.hour === "24" ? "00" : parts.hour;
  const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +hour, +parts.minute, +parts.second);
  const offMin = Math.round((local - Math.floor(d.getTime() / 1000) * 1000) / 60000);
  const sign = offMin >= 0 ? "+" : "-";
  const abs = Math.abs(offMin);
  const off = `${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}${off}`;
}

export function orderNumber(name: string): string {
  return name.replace(/^#/, "").trim();
}

export function isEligible(o: OrderForExport): boolean {
  return o.financial_status === "paid" && !o.is_test && !o.is_draft &&
    !!o.gclid && o.ad_consent === "granted";
}

export function buildRow(o: OrderForExport): string[] {
  return [
    o.gclid ?? "",
    CONVERSION_NAME,
    amsterdamIso(o.ordered_at),
    (Math.round(o.subtotal * 100) / 100).toFixed(2),
    "EUR",
    orderNumber(o.order_number),
    "WEB",
  ];
}

/** Rijen voor orders die nog niet geschreven zijn (dedup op Order ID). */
export function rowsToWrite(orders: OrderForExport[], alreadyWritten: Set<string>): string[][] {
  const seen = new Set(alreadyWritten);
  const out: string[][] = [];
  for (const o of orders) {
    const id = orderNumber(o.order_number);
    if (!isEligible(o) || seen.has(id)) continue;
    seen.add(id);
    out.push(buildRow(o));
  }
  return out;
}
