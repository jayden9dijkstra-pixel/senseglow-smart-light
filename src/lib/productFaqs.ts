export interface ProductFaq {
  question: string;
  answer: string;
}

export const WARRANTY_TEXT = "Naast je wettelijke garantie: 1 jaar extra functionele garantie van SenseGlow";

/** Algemene koopvragen die voor elk product kloppen. */
export const purchaseFaqs: ProductFaq[] = [
  {
    question: "Wat als mijn lamp kapotgaat?",
    answer: "Naast je wettelijke garantie krijg je 1 jaar extra functionele garantie van SenseGlow. Mail support@senseglow.shop met je bestelnummer en een korte uitleg, dan zoeken we een passende oplossing.",
  },
  {
    question: "Kan ik mijn bestelling retourneren?",
    answer: "Ja. Je hebt het wettelijke herroepingsrecht van 14 dagen, en bij ons kun je binnen 30 dagen retour aanmelden. Het modelformulier staat op senseglow.shop/herroepingsformulier.",
  },
];

/**
 * FAQ per product: de productspecifieke vragen plus de algemene koopvragen.
 * Productvragen over garantie vallen weg, die staat al in de algemene set.
 */
export function getProductFaqs(productFaqs: ProductFaq[] | undefined): ProductFaq[] {
  const own = (productFaqs ?? []).filter((f) => !/^garantie\?$|kapot/i.test(f.question));
  return [...own, ...purchaseFaqs];
}

/** Verzend- en retourinfo op elke productpagina (ook in de vooraf gerenderde HTML). */
export const SHIPPING_RETURNS = [
  "Gratis bezorgd. Levering in 7-14 werkdagen",
  "Naast je wettelijke garantie: 1 jaar extra functionele garantie van SenseGlow. 30 dagen retour, retourkosten zijn voor ons. Je wettelijke herroepingsrecht van 14 dagen blijft gelden.",
];
