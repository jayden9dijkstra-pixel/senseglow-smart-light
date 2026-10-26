/** Eén vaste levertijdformulering voor de hele site. */
export const DELIVERY_TEXT = "Levering in 7-14 werkdagen";
export const DELIVERY_MIN_WORKDAYS = 7;
export const DELIVERY_MAX_WORKDAYS = 14;

/** Telt werkdagen (ma-vr) op bij een datum. Feestdagen tellen mee als werkdag. */
export function addWorkdays(from: Date, days: number): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left--;
  }
  return d;
}

export function deliveryWindow(today: Date = new Date()): { from: Date; to: Date } {
  return {
    from: addWorkdays(today, DELIVERY_MIN_WORKDAYS),
    to: addWorkdays(today, DELIVERY_MAX_WORKDAYS),
  };
}

const LOCALE_TAG: Record<string, string> = { nl: "nl-NL", en: "en-GB", fr: "fr-FR" };

export function formatDeliveryDate(d: Date, locale = "nl"): string {
  return d.toLocaleDateString(LOCALE_TAG[locale] ?? "nl-NL", { weekday: "short", day: "numeric", month: "short" });
}
