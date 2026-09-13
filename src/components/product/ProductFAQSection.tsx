import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQSectionProps {
  headline?: string;
  subtitle?: string;
  faqs?: FAQ[];
}

export const purchaseFaqs: FAQ[] = [
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

export const ProductFAQSection = ({
  headline = "Veelgestelde vragen",
  subtitle = "Alles wat je moet weten over SenseGlow™",
  faqs = purchaseFaqs,
}: ProductFAQSectionProps) => {
  return (
    <section className="overflow-hidden bg-background py-16 md:py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{headline}</h2>
            <p className="text-base text-muted-foreground">{subtitle}</p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border rounded-md px-5 hover:shadow-sm transition-all"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
