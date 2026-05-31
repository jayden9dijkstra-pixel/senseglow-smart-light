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
      "Tussen de 7 en 14 werkdagen, via DHL. Je krijgt een track-code per mail zodra het pakket onderweg is. Track via senseglow.shop/bestelling-volgen of de DHL-app.",
  },
  {
    question: "Mag ik retourneren als het niet bevalt?",
    answer:
      "Ja, 30 dagen lang, zonder opgaaf van reden. Stuur het product (graag in originele staat) terug en je hebt binnen 14 dagen je geld retour.",
  },
];

const trustIcons = [
  { icon: Shield, text: "1 jaar garantie" },
  { icon: Truck, text: "Gratis verzending" },
  { icon: RotateCcw, text: "30 dagen retour" },
];

export const FAQSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background-secondary">
      <div className="container">
        <div className="max-w-4xl mx-auto animate-fade-in-slow">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
              FAQ
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold mb-4">
              Veelgestelde vragen
            </h2>
            <p className="text-base text-foreground/60">
              Alles wat je moet weten over SenseGlow
            </p>
          </div>

          <Accordion type="single" collapsible className="mb-16">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border-b border-foreground/6"
              >
                <AccordionTrigger className="text-left text-base font-medium py-6 hover:text-glow hover:no-underline transition-colors duration-500">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-foreground/60 leading-relaxed pb-6">
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
                  <Icon className="w-4 h-4 text-glow/60" />
                  <span className="text-sm text-foreground/50">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
