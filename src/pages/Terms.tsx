import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Terms = () => {
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

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Algemene Voorwaarden
            </h1>
            <p className="text-lg text-foreground/60 leading-relaxed">
              Onze algemene voorwaarden bieden heldere uitleg over bestellen, betalen, verzenden, retourneren en garantie.
            </p>
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8">
              <p className="text-lg text-foreground/60 leading-relaxed mb-4">
                Ze zijn opgesteld om transparantie te bieden en jouw rechten te beschermen bij elke aankoop.
              </p>
              <p className="text-lg font-semibold text-foreground">
                Lees de volledige voorwaarden om precies te weten waar je aan toe bent bij het bestellen bij SenseGlow.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-glow/10 rounded-lg">
                    <FileText className="h-6 w-6 text-glow" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">1. Toepasselijkheid</h2>
                    <p className="text-foreground/60 leading-relaxed">
                      Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, bestellingen en overeenkomsten tussen SenseGlow en de klant. Door een bestelling te plaatsen, ga je akkoord met deze voorwaarden.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">2. Bestellingen & Betaling</h2>
                <ul className="space-y-3 text-foreground/60">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Alle prijzen zijn inclusief BTW en exclusief eventuele verzendkosten (bij SenseGlow is verzending gratis)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Een overeenkomst komt tot stand na ontvangst van de orderbevestiging per e-mail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Betaling geschiedt via de beschikbare betaalmethoden op onze website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>SenseGlow behoudt zich het recht voor om bestellingen te weigeren of te annuleren</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">3. Levering</h2>
                <ul className="space-y-3 text-foreground/60">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Bestellingen worden binnen 24-48 uur verwerkt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Levertijd is 5-10 werkdagen binnen Nederland en België</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Verzending is altijd gratis binnen Nederland en België</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Het risico voor de producten gaat over op de klant bij fysieke ontvangst</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">4. Herroepingsrecht (30 dagen)</h2>
                <p className="text-foreground/60 leading-relaxed mb-4">
                  Je hebt het recht om binnen 30 dagen na ontvangst van het product de overeenkomst te ontbinden, zonder opgave van redenen.
                </p>
                <ul className="space-y-3 text-foreground/60">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Het product moet ongebruikt en in originele staat zijn</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Retourkosten zijn voor de klant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Terugbetaling vindt plaats binnen 14 dagen na ontvangst van de retourzending</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">5. Garantie</h2>
                <p className="text-foreground/60 leading-relaxed mb-4">
                  SenseGlow biedt 1 jaar garantie op fabricagefouten en defecten die niet het gevolg zijn van normaal gebruik.
                </p>
                <ul className="space-y-3 text-foreground/60">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Garantie dekt fabricagefouten en defecte onderdelen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Garantie dekt geen schade door val, stoot, water of onjuist gebruik</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-glow flex-shrink-0 mt-1" />
                    <span>Voor garantieclaims neem je contact op via support@senseglow.nl</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">6. Aansprakelijkheid</h2>
                <p className="text-foreground/60 leading-relaxed">
                  SenseGlow is niet aansprakelijk voor indirecte schade, gevolgschade of bedrijfsschade die voortvloeit uit het gebruik van onze producten, tenzij er sprake is van opzet of grove schuld.
                </p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">7. Geschillen</h2>
                <p className="text-foreground/60 leading-relaxed">
                  Op alle overeenkomsten tussen SenseGlow en de klant is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Nederland.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-glow/20 bg-glow/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Vragen over de voorwaarden?</h2>
              <p className="text-foreground/60">
                Neem gerust contact met ons op via <a href="mailto:support@senseglow.nl" className="text-glow hover:underline font-semibold">support@senseglow.nl</a> als je vragen hebt over onze algemene voorwaarden.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Terms;
