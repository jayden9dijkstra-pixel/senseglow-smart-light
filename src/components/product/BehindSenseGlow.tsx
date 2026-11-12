import { BUSINESS_INFO } from "@/lib/businessInfo";

/** Shared with prerender; the existing public SG logo needs no bundled asset import. */
export function BehindSenseGlow() {
  return (
    <section aria-labelledby="behind-senseglow" className="space-y-4 border-t border-border py-8 text-foreground">
      <div className="flex items-center gap-4">
        <img src="/favicon-96.png" alt="SG-logo" width={64} height={64} className="h-16 w-16 rounded-lg" loading="lazy" />
        <h2 id="behind-senseglow" className="text-2xl font-semibold">Wie zit erachter</h2>
      </div>
      <p className="text-lg leading-relaxed">
        SenseGlow is een klein Nederlands bedrijf uit Kimswerd (Friesland). Handelsnaam van Jayden Ecom, KvK {BUSINESS_INFO.kvk}. Vragen? Mail ons, je krijgt persoonlijk antwoord.
      </p>
      <a href={`mailto:${BUSINESS_INFO.email}`} className="inline-flex min-h-12 items-center text-lg font-medium text-primary underline underline-offset-4">{BUSINESS_INFO.email}</a>
      <p className="text-lg">J. Dijkstra</p>
    </section>
  );
}