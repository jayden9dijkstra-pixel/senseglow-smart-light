import { Activity, BatteryCharging, Droplets, Hand, Lightbulb, Magnet, StickyNote, Sun } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Benefit, BenefitIcon, Faq } from "@/lib/productBlueprint";

const ICONS: Record<BenefitIcon, typeof Sun> = {
  motion: Activity, usb: BatteryCharging, magnet: Magnet, stick: StickyNote, touch: Hand, sun: Sun, water: Droplets, light: Lightbulb,
};

/** Drie voordelen met icoon, direct onder titel en claim. */
export function IconBenefits({ items }: { items: Benefit[] }) {
  return (
    <ul className="space-y-2">
      {items.slice(0, 3).map((b) => {
        const Icon = ICONS[b.icon];
        return (
          <li key={b.text} className="flex items-center gap-3 text-base text-foreground">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/15 text-primary">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            {b.text}
          </li>
        );
      })}
    </ul>
  );
}

/** Ankernavigatie onder de galerij. */
export function AnchorNav({ links }: { links: { id: string; label: string }[] }) {
  return (
    <nav aria-label="Op deze pagina" className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
      <ul className="flex w-max gap-2">
        {links.map((l) => (
          <li key={l.id}>
            <a href={`#${l.id}`} className="inline-flex min-h-11 items-center rounded-full border border-foreground/15 px-4 text-base text-foreground hover:border-primary">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Specificaties als tegels in 2 kolommen. */
export function SpecTiles({ rows, id = "specificaties", title = "Specificaties" }: { rows: [string, string][]; id?: string; title?: string }) {
  if (rows.length === 0) return null;
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <dl className="grid grid-cols-2 gap-2">
        {rows.map(([k, v]) => (
          <div key={k + v} className="rounded-2xl bg-secondary/60 p-3">
            <dt className="text-sm font-medium text-foreground/80">{k}</dt>
            <dd className="text-base font-semibold text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Veelgestelde vragen als accordeon met grote letters. */
export function FaqAccordion({ faqs, id = "vragen" }: { faqs: Faq[]; id?: string }) {
  if (faqs.length === 0) return null;
  return (
    <section id={id} className="scroll-mt-24 space-y-2">
      <h2 className="text-xl font-semibold text-foreground">Veelgestelde vragen</h2>
      <Accordion type="multiple" className="divide-y divide-foreground/10 border-y border-foreground/10">
        {faqs.map((f) => (
          <AccordionItem key={f.question} value={f.question} className="border-0">
            <AccordionTrigger className="min-h-12 py-4 text-left text-lg font-semibold hover:no-underline">{f.question}</AccordionTrigger>
            <AccordionContent className="pb-4 text-[17px] leading-relaxed text-foreground">{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
