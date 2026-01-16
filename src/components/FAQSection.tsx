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
  { icon: Shield, text: "1 jaar garantie" },
  { icon: Truck, text: "Gratis verzending" },
  { icon: CreditCard, text: "Veilig betalen" },
];

export const FAQSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background-secondary">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Centered header */}
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Veelgestelde vragen</h2>
            <p className="text-base text-muted-foreground">
              Alles wat je moet weten over SenseGlow
            </p>
          </div>

          {/* Accordion - left aligned content */}
          <Accordion type="single" collapsible className="mb-14">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-foreground/8">
                <AccordionTrigger className="text-left text-base font-medium py-5 hover:text-glow hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Trust Icons - centered */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-foreground/8">
            {trustIcons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-glow/80" />
                  <span className="text-sm text-foreground/70">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};