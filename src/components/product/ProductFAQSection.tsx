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

export { purchaseFaqs } from "@/lib/productFaqs";
import { purchaseFaqs } from "@/lib/productFaqs";

export const ProductFAQSection = ({
  headline = "Veelgestelde vragen",
  subtitle = "Alles wat je moet weten over SenseGlow™",
  faqs = purchaseFaqs,
}: ProductFAQSectionProps) => {
  return (
    <section className="w-full overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
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
