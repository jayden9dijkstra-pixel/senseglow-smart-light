import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Truck, RotateCcw } from "lucide-react";

const faqs = [
  {
    question: "Hoe zit het met installatie?",
    answer:
      "Niet één van onze producten heeft een elektricien nodig. Vier producten zijn magnetisch of zelfklevend, alleen de Solar Lantern krijgt twee schroeven mee. Gemiddelde montagetijd: 30 seconden tot 5 minuten.",
  },
  {
    question: "Hoe lang gaat de batterij mee?",
    answer:
      "Tussen de 3 weken (Ambient bij intensief nachtgebruik) en 8 weken (Flex bij studie-gebruik). De Solar Lantern hoef je niet op te laden, die doet het zonnepaneel zelf.",
  },
  {
    question: "Kan ik bundels combineren?",
    answer:
      "Ja. Op de productpagina vind je per product de beschikbare 2-, 3- of 4-packs met kortingen tot 15%. Bundle-korting wordt automatisch in je winkelwagen verrekend.",
  },
  {
    question: "Wat is de garantie?",
    answer:
      "Eén jaar volledige functionele garantie op alle producten. Werkt iets niet zoals beloofd? Mail support@senseglow.shop, we sturen een vervanger of geven je geld terug. Bovenop je wettelijke rechten.",
  },
  {
    question: "Hoe snel wordt mijn bestelling geleverd?",
    answer:
      "Tussen de 7 en 14 dagen in totaal, inclusief verwerking. Je krijgt een track-code per mail zodra het pakket onderweg is. Track via senseglow.shop/volg-je-bestelling.",
  },
  {
    question: "Mag ik retourneren als het niet bevalt?",
    answer:
      "Ja, 30 dagen lang, zonder opgaaf van reden. De retourkosten zijn voor onze rekening. Stuur het product in originele staat terug naar Tolheksleane 4A, 8821 MD Kimswerd (post- en retouradres) en je hebt binnen 14 dagen je geld retour.",
  },
];

const trustIcons = [
  { icon: Shield, text: "1 jaar garantie" },
  { icon: Truck, text: "Gratis verzending" },
  { icon: RotateCcw, text: "30 dagen gratis retour" },
];

export const FAQSection = () => {
  return (
    <section className="w-full bg-background-secondary py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="max-w-5xl mx-auto animate-fade-in-slow">
          <div className="text-center mb-14 md:mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/55 font-medium mb-5">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Veelgestelde vragen
            </h2>
            <p className="text-base md:text-lg text-foreground/65">
              Alles wat je moet weten over SenseGlow
            </p>
          </div>

          <Accordion type="single" collapsible className="mb-16">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-b border-foreground/10"
              >
                <AccordionTrigger className="text-left text-lg md:text-xl font-medium py-6 md:py-7 hover:text-glow hover:no-underline transition-colors duration-500">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base md:text-lg text-foreground/65 leading-relaxed pb-7 pr-8">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex flex-wrap justify-center gap-10 pt-10 border-t border-foreground/6">
            {trustIcons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                   <Icon className="w-5 h-5 text-glow/75" />
                   <span className="text-base text-foreground/60">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
