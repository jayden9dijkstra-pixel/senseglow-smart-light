import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface InfoSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Alle verdiepende info ingeklapt, zodat de koopsectie kort blijft. */
export function InfoAccordion({ sections }: { sections: InfoSection[] }) {
  return (
    <Accordion type="multiple" className="divide-y divide-foreground/10 border-y border-foreground/10">
      {sections.map((s) => (
        <AccordionItem key={s.id} value={s.id} className="border-0">
          <AccordionTrigger className="py-4 text-left text-base font-semibold hover:no-underline">{s.title}</AccordionTrigger>
          <AccordionContent className="pb-4 text-sm leading-relaxed text-foreground/75">{s.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function BeforeAfterRows({ rows, beforeLabel = "Zonder SenseGlow", afterLabel = "Met SenseGlow" }: { rows: { before: string; after: string }[]; beforeLabel?: string; afterLabel?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-foreground/50">{beforeLabel}</p>
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.before} className="flex gap-2"><X className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground/30" />{r.before}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">{afterLabel}</p>
        <ul className="space-y-1.5">
          {rows.map((r) => (
            <li key={r.after} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />{r.after}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PlainList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><span>{it}</span></li>
      ))}
    </ul>
  );
}

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <dl className="space-y-3">
      {faqs.map((f) => (
        <div key={f.question}>
          <dt className="font-medium text-foreground">{f.question}</dt>
          <dd>{f.answer}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Benefits({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.slice(0, 3).map((b) => (
        <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
