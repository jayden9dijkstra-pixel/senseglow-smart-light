import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Truck, CreditCard } from "lucide-react";

const faqs = [
  {
    question: "Hoe monteer ik de SenseGlow?",
    answer:
      "De SenseGlow heeft een zelfklevende achterkant. Verwijder de beschermfolie en plak de lamp op een schoon, droog oppervlak. Geen schroeven of gereedschap nodig.",
  },
  {
    question: "Hoe lang gaat de batterij mee?",
    answer:
      "Afhankelijk van gebruik gaat de batterij 6-12 maanden mee. Je krijgt een melding wanneer de batterij bijna leeg is.",
  },
  {
    question: "Welke maat heb ik nodig?",
    answer:
      "15cm voor kleine ruimtes (toilet, traptreden), 30cm voor gangen en kamers, 45cm voor grote ruimtes of extra licht.",
  },
  {
    question: "Kan ik de SenseGlow overal gebruiken?",
    answer:
      "Ja! De lamp is spatwaterdicht en geschikt voor binnen. Perfect voor gangen, slaapkamers, badkamers, keukens en trappenhuizen.",
  },
  {
    question: "Wat als ik niet tevreden ben?",
    answer:
      "Je hebt 30 dagen bedenktijd. Niet tevreden? Stuur het product terug voor een volledige terugbetaling.",
  },
];

const trustIcons = [
  {
    icon: Shield,
    text: "2 jaar garantie",
  },
  {
    icon: Truck,
    text: "Gratis verzending",
  },
  {
    icon: CreditCard,
    text: "Veilig betalen",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Veelgestelde vragen</h2>
          <p className="text-xl text-muted-foreground">
            Alles wat je moet weten over SenseGlow
          </p>
        </div>

        <Accordion type="single" collapsible className="mb-16">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Trust Icons */}
        <div className="grid md:grid-cols-3 gap-8">
          {trustIcons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center justify-center gap-3">
                <Icon className="w-6 h-6 text-glow" />
                <span className="font-medium">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
