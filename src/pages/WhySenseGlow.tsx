import { Link } from "react-router-dom";
import { Award, Brush, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";

const PILLARS = [
  {
    icon: Award,
    title: "Kwaliteit",
    body: "Getest op dagelijks huishoudelijk gebruik. Batterij kapot binnen de garantie? Wij vervangen hem.",
  },
  {
    icon: ShieldCheck,
    title: "Garantie",
    body: "1 jaar garantie op alle onderdelen en 30 dagen retour. Retourkosten zijn voor ons.",
  },
  {
    icon: MessageCircle,
    title: "Support",
    body: "Persoonlijk antwoord via support@senseglow.shop, meestal binnen 24 uur. Nederlands en Engels.",
  },
  {
    icon: Brush,
    title: "Design",
    body: "Een sensor die niet opvalt en licht dat wel opvalt. Warme tinten, magneetmontage, geen zichtbare kabels.",
  },
];

const WhySenseGlow = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              Sfeer die vanzelf werkt
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Waarom SenseGlow
            </h1>
          </div>
        </div>
      </section>

      {/* Verhaal */}
      <section className="pb-20 md:pb-28 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="space-y-5">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Het begon met een simpele frustratie
              </h2>
              <p className="text-base text-foreground/60 leading-relaxed">
                In elk huis liggen dozen met bedrade lampen en verlengsnoeren. Wij wilden licht
                dat gewoon aangaat wanneer het moet.
              </p>
              <p className="text-base text-foreground/60 leading-relaxed">
                Zonder elektricien. Zonder boren. Je plakt de lamp op zijn plek en hij doet
                de rest.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-glow/25 via-background-secondary to-background border border-foreground/8" />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 md:py-24 bg-background-secondary">
        <div className="container">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-5">
                <div className="shrink-0 p-3 rounded-xl bg-background/70 text-glow h-fit">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bedrijfsinfo */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto rounded-2xl border border-foreground/8 p-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Wie zijn wij</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-foreground/40 mb-1">Bedrijf</dt>
                <dd className="text-foreground/80">SenseGlow (Jayden Ecom)</dd>
              </div>
              <div>
                <dt className="text-foreground/40 mb-1">KVK</dt>
                <dd className="text-foreground/80">94904929</dd>
              </div>
              <div>
                <dt className="text-foreground/40 mb-1">BTW</dt>
                <dd className="text-foreground/80">NL005399692B39</dd>
              </div>
            </dl>
            <p className="text-xs text-foreground/40 mt-6">
              Ons retouradres staat in de footer. Dat is geen bezoekadres.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Meer weten?</h2>
            <p className="text-base text-foreground/60">
              Mail direct met support@senseglow.shop of bekijk de collectie.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="rounded-full px-8">
                <Link to="/producten">Bekijk de collectie</Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full px-6">
                <a href="mailto:support@senseglow.shop">Mail ons</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WhySenseGlow;
