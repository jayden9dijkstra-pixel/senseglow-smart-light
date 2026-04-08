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

const defaultFaqs: FAQ[] = [
  {
    question: "Hoe lang gaat de batterij mee?",
    answer: "Met normaal gebruik (10-15 activeringen per nacht) gaat de batterij tot 60 dagen mee. Je kunt hem eenvoudig opladen via USB-C, wat ongeveer 2-3 uur duurt voor een volledige lading.",
  },
  {
    question: "Hoe werkt de sensor?",
    answer: "SenseGlow™ gebruikt een PIR bewegingssensor met een bereik van 3-5 meter. Deze detecteert lichaamsbeweging en gaat automatisch aan wanneer je in de buurt komt. Na 30 seconden zonder beweging schakelt het licht automatisch weer uit.",
  },
  {
    question: "Wat is het verschil tussen de maten?",
    answer: "We hebben drie maten: 15cm (perfect voor kleine ruimtes en hoeken), 30cm (meest populair voor traptreden en gangwanden), en 45cm (ideaal voor langere gangen en grote ruimtes). Alle maten hebben dezelfde functies en helderheid per centimeter.",
  },
  {
    question: "Schijnt het licht fel?",
    answer: "Nee, absoluut niet. SenseGlow™ gebruikt warm 2700K licht dat speciaal is ontworpen om je niet wakker te maken. Het geeft net genoeg licht om veilig te navigeren, zonder je slaaphormonen te verstoren.",
  },
  {
    question: "Is SenseGlow veilig voor kinderen?",
    answer: "Ja, volledig veilig. SenseGlow™ werkt op lage spanning via USB-C, wordt niet warm, en heeft geen scherpe randen. Het is specifiek ontworpen voor gebruik in gezinswoningen en kinderkamers.",
  },
  {
    question: "Kan ik meerdere strips naast elkaar gebruiken?",
    answer: "Absoluut! Veel klanten gebruiken meerdere strips voor langere trappen of gangen. Elke strip werkt onafhankelijk, dus ze detecteren beweging individueel. Dit geeft een mooi geleide-licht effect.",
  },
];

export const ProductFAQSection = ({
  headline = "Veelgestelde vragen",
  subtitle = "Alles wat je moet weten over SenseGlow™",
  faqs = defaultFaqs,
}: ProductFAQSectionProps) => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{headline}</h2>
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-muted/50 border border-border rounded-2xl px-6 hover:shadow-md transition-all"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-brand-orange">
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
