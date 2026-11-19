import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { placementGuideFaqs } from "@/lib/landingPages";

function StairsIllustration() {
  const steps = Array.from({ length: 12 }, (_, index) => index);
  const lamps = [2, 5, 8, 11];
  return (
    <svg
      viewBox="0 0 420 250"
      role="img"
      aria-labelledby="stairs-guide-title stairs-guide-description"
      className="mt-4 h-auto w-full rounded-lg border border-border/70 bg-background-secondary p-3"
    >
      <title id="stairs-guide-title">Twaalf treden met vier lampen</title>
      <desc id="stairs-guide-description">Een trap met twaalf treden en een lamp op de muur bij elke derde trede.</desc>
      {steps.map((step) => {
        const x = 24 + step * 28;
        const y = 220 - step * 14;
        return (
          <path
            key={step}
            data-guide-step={step + 1}
            d={`M ${x} ${y} h 28 v -14`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
      {lamps.map((step, index) => {
        const x = 24 + step * 28 + 14;
        const y = 220 - step * 14 - 34;
        return (
          <g key={step} data-guide-lamp={index + 1} className="text-primary">
            <rect x={x - 11} y={y - 5} width="22" height="10" rx="3" fill="currentColor" />
            <path d={`M ${x - 15} ${y - 10} l -4 -5 M ${x} ${y - 12} v -7 M ${x + 15} ${y - 10} l 4 -5`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

const steps = [
  {
    title: "Tel je treden",
    body: "12 treden = 4 lampen (4-delige set). Bij 13 of meer treden of een trap met overloop kies je de 8-delige set.",
  },
  {
    title: "Laad de lampen op via USB-C",
    body: "Laad de Wall Lamps op via USB-C voordat je ze plaatst.",
  },
  {
    title: "Bepaal de plekken",
    body: "Plak de lampen op de muur langs de trap, net boven de treden, ongeveer om de 3 treden.",
    illustration: true,
  },
  {
    title: "Plak de lampen op de muur",
    body: "Zorg dat de muur schoon en droog is. Haal de strip eraf en druk de lamp stevig aan. Klaar: het licht gaat vanzelf aan bij beweging.",
  },
];

export function PlacementGuideContent() {
  const faqs = placementGuideFaqs();
  return (
    <div className="placement-guide container max-w-3xl space-y-8 py-10 text-[17px] leading-relaxed text-foreground md:py-14">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">Plaatsingsgids: trapverlichting in 4 stappen</h1>
        <p>Met deze gids plaats je je Wall Lamps goed op je trap.</p>
        <Button type="button" variant="outline" onClick={() => window.print()} className="print-hidden min-h-12 rounded-full px-6 text-base">
          <Printer aria-hidden className="mr-2 h-5 w-5" />
          Print of bewaar als PDF
        </Button>
      </div>

      <ol className="space-y-5">
        {steps.map((step, index) => (
          <li key={step.title} className="placement-guide-step rounded-2xl border border-border/70 bg-background-secondary/40 p-5 md:p-6">
            <h2 className="text-2xl font-semibold">{index + 1}. {step.title}</h2>
            <p className="mt-2">{step.body}</p>
            {step.illustration && <StairsIllustration />}
          </li>
        ))}
      </ol>

      <section aria-labelledby="placement-guide-faq" className="space-y-4">
        <h2 id="placement-guide-faq" className="text-2xl font-semibold">Veelgestelde vragen</h2>
        {faqs.map((faq) => (
          <div key={faq.question} className="placement-guide-step border-t border-border/70 pt-4">
            <h3 className="text-xl font-semibold">{faq.question}</h3>
            <p className="mt-2">{faq.answer}</p>
          </div>
        ))}
      </section>

      <div className="print-hidden">
        <a
          href="/trapverlichting"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-cta px-7 py-3 text-base font-medium text-cta-foreground hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
        >
          Bekijk de trapverlichting
        </a>
      </div>
    </div>
  );
}
