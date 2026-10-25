export interface ProductFaq {
  question: string;
  answer: string;
}

export const purchaseFaqs: ProductFaq[] = [
  {
    question: "Werkt de bewegingssensor door glas?",
    answer: "Nee, een PIR-sensor werkt meestal niet betrouwbaar door glas. Plaats de lamp daarom aan dezelfde kant van het glas als de beweging die je wilt detecteren.",
  },
  {
    question: "Hoe lang gaat de accu mee?",
    answer: "De gebruiksduur hangt af van de gekozen stand en hoe vaak de lamp aangaat. Je laadt de lamp eenvoudig opnieuw op met de meegeleverde USB-kabel.",
  },
  {
    question: "Kan ik de lamp monteren zonder te boren?",
    answer: "De meeste SenseGlow-lampen bevestig je met een plakstrip of magnetische houder. Bij buitenmodellen kunnen schroeven nodig zijn voor een stevige en veilige montage.",
  },
  {
    question: "Wat als mijn lamp kapotgaat?",
    answer: "Je krijgt 1 jaar functionele garantie. Mail support@senseglow.shop met je bestelnummer en een korte uitleg, dan zoeken we een passende oplossing.",
  },
  {
    question: "Kan ik mijn bestelling retourneren?",
    answer: "Je kunt je bestelling binnen 30 dagen aanmelden voor retour. Bekijk de retourpagina voor de voorwaarden en stuur ons eerst een bericht, zodat we je de juiste instructies geven.",
  },
];

/** Verzend- en retourinfo op elke productpagina (ook in de vooraf gerenderde HTML). */
export const SHIPPING_RETURNS = [
  "Gratis bezorgd, binnen 7-14 werkdagen na verwerking",
  "1 jaar garantie op alle onderdelen en 30 dagen retour. Retourkosten zijn voor ons.",
];
