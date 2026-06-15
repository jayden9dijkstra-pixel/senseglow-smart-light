import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const criteria = [
  {
    title: "Geen installateur nodig",
    body: "Alle producten werken via USB-C, batterij of solar. Plakken, ophangen of plaatsen — geen boren in muren, geen kabels door wanden, geen elektricien-rekening.",
  },
  {
    title: "Geen app, geen wifi",
    body: "Smart-home klinkt slim, maar elke app-bediening is ook één extra punt waar het fout kan gaan. Onze lampen werken met fysieke sensoren of touch. Eén keer instellen, dan zelfstandig.",
  },
  {
    title: "Onder de €60 per stuk",
    body: "We selecteren bewust binnen een prijsklasse die toegankelijk blijft. Geen premium-tax, geen €200 wandlamp die hetzelfde doet als een €40 alternatief.",
  },
  {
    title: "14 dagen retour, zonder vragen",
    body: "Past hij niet bij je gang? Geeft het licht een andere kleur dan verwacht? Stuur terug binnen 14 dagen, dan krijg je je geld retour. Geen rare procedures.",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="container py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar home
        </Button>

        <div className="space-y-16 md:space-y-20">
          {/* Hero */}
          <section className="space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              Achter SenseGlow
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Slimme verlichting,<br />zonder de gewone hindernissen
            </h1>
            <p className="text-lg text-foreground/60 leading-relaxed max-w-2xl">
              SenseGlow brengt sensorverlichting naar Nederlandse huizen die werkt zonder elektricien, zonder app en zonder bekabeling. Vijf producten, vijf concrete problemen opgelost.
            </p>
          </section>

          {/* Wat we doen */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Wat we doen</h2>
            <div className="space-y-5 text-base md:text-lg text-foreground/60 leading-relaxed">
              <p>
                Wij verkopen geen lampen — wij verkopen opgeloste problemen. Een trap die 's nachts niet meer onveilig voelt. Een keuken die sfeer krijgt zonder smart-home installatie. Een gang waar je niet meer over je tenen struikelt op zoek naar het lichtknopje.
              </p>
              <p>
                Onze rol in die keten is selectie. De wereld is overvol met slimme verlichting, maar veruit het meeste daarvan is ontworpen voor andere markten — andere stopcontacten, andere afmetingen, andere gebruiksverwachtingen. Wij filteren op wat in een Nederlands huis werkt.
              </p>
            </div>
          </section>

          {/* Onze criteria */}
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Onze criteria</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {criteria.map((c) => (
                <div
                  key={c.title}
                  className="p-6 md:p-8 rounded-2xl border border-foreground/10 bg-background-secondary"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {c.title}
                  </h3>
                  <p className="text-foreground/60 leading-relaxed text-sm md:text-base">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Wie */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Wie</h2>
            <div className="space-y-5 text-base md:text-lg text-foreground/60 leading-relaxed">
              <p>
                SenseGlow is een handelsnaam van Jayden Ecom, een Nederlandse eenmanszaak gevestigd in Kimswerd, Friesland. Geregistreerd bij de Kamer van Koophandel onder nummer 99634929.
              </p>
              <p>
                Bestellingen worden afgehandeld via een logistiek partner in Europa. Klantcontact, advies en garantie-afhandeling lopen rechtstreeks vanuit Nederland — geen overzeese helpdesk, geen vertraging.
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="space-y-6 p-8 md:p-12 rounded-3xl bg-background-secondary border border-foreground/10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Vragen vóór je iets bestelt?
            </h2>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed max-w-2xl">
              Of advies welke lamp bij jouw situatie past — stuur een mail of een bericht via de contactpagina. We reageren meestal binnen één werkdag.
            </p>
            <Button onClick={() => navigate("/contact")} className="rounded-full">
              Naar contact
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </section>

          {/* Handtekening */}
          <section className="pt-4 border-t border-foreground/10">
            <p className="text-sm text-foreground/50 italic">
              — J. Dijkstra<br />
              Eigenaar, Jayden Ecom (SenseGlow™)
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
