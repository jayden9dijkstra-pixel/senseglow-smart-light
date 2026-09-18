/**
 * Prijsweergave per taal. Nederlands en Frans gebruiken een komma,
 * Engels een punt. Zo ziet de bezoeker altijd een vertrouwd bedrag.
 */

type Amount = number | string;

function activeLocale(): "nl" | "en" | "fr" {
  if (typeof document === "undefined") return "nl";
  const lang = document.documentElement.lang;
  return lang === "en" || lang === "fr" ? lang : "nl";
}

const FORMATS: Record<"nl" | "en" | "fr", string> = {
  nl: "nl-NL",
  en: "en-IE",
  fr: "fr-FR",
};

export function formatPrice(amount: Amount): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(value)) return "";
  try {
    return new Intl.NumberFormat(FORMATS[activeLocale()], {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `€${value.toFixed(2)}`;
  }
}
