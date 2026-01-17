import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, MapPin, Clock } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Shipping = () => {
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
              Verzending & Levering
            </h1>
            <p className="text-lg text-foreground/60">
              SenseGlow werkt met zorgvuldig geselecteerde fulfilmentpartners om kwaliteit en consistentie te waarborgen.
            </p>
          </div>

          <Card className="border-glow/20 bg-glow/5">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-8 w-8 text-glow" />
                <h2 className="text-2xl font-bold">Gratis verzending op alle bestellingen</h2>
              </div>
              <p className="text-lg text-foreground/60">
                Binnen Nederland & België. Geen verborgen kosten, geen minimale bestelwaarde.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-glow/10 rounded-lg">
                    <Clock className="h-6 w-6 text-glow" />
                  </div>
                  <h3 className="font-semibold text-lg">Verwerking</h3>
                </div>
                <p className="text-foreground/60">24–48 uur</p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-glow/10 rounded-lg">
                    <Truck className="h-6 w-6 text-glow" />
                  </div>
                  <h3 className="font-semibold text-lg">Levertijd</h3>
                </div>
                <p className="text-foreground/60">5–10 werkdagen</p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-glow/10 rounded-lg">
                    <Package className="h-6 w-6 text-glow" />
                  </div>
                  <h3 className="font-semibold text-lg">Track & Trace</h3>
                </div>
                <p className="text-foreground/60">Automatisch per e-mail</p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-glow/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-glow" />
                  </div>
                  <h3 className="font-semibold text-lg">Regio</h3>
                </div>
                <p className="text-foreground/60">Nederland & België</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">Waarom 5–10 dagen?</h3>
              <p className="text-foreground/60 leading-relaxed">
                Wij produceren in kleinere batches zodat je altijd een vers product ontvangt — geen massaproductie, geen verouderde voorraad. Dit garandeert de hoogste kwaliteit en zorgt ervoor dat je het nieuwste en beste product in handen krijgt.
              </p>
            </CardContent>
          </Card>

          {/* Garantie Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Garantie</h2>
            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-8 space-y-6">
                <p className="text-lg">
                  Wij staan achter de kwaliteit van onze producten. <strong>SenseGlow biedt 1 jaar functionele garantie</strong> op alle producten.
                </p>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-glow">Gedekt door de garantie:</h3>
                  <ul className="space-y-2 text-foreground/60">
                    <li className="flex items-start gap-2">
                      <span className="text-glow mt-1">✓</span>
                      <span>Fabricagefouten</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-glow mt-1">✓</span>
                      <span>Defecte sensor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-glow mt-1">✓</span>
                      <span>LED die uitvalt binnen 1 jaar (zonder gebruikersschade)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground/60">Niet gedekt:</h3>
                  <ul className="space-y-2 text-foreground/60">
                    <li className="flex items-start gap-2">
                      <span className="mt-1">✗</span>
                      <span>Val-, stoot- of waterschade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">✗</span>
                      <span>Onjuist gebruik</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">✗</span>
                      <span>Normale slijtage van batterijen of kabels</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-foreground/60 pt-4 border-t border-foreground/10">
                  Onze garantie is gebaseerd op de premium standaard binnen de LED-markt.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 30 Dagen Garantie */}
          <Card className="border-glow/20 bg-glow/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">30 Dagen Risicovrij Proberen</h2>
              <p className="text-lg text-foreground/60 mb-6">
                Wij geloven dat je SenseGlow zult waarderen vanaf het eerste gebruik.
              </p>
              <div className="max-w-2xl mx-auto text-left space-y-4">
                <p className="text-foreground/60">
                  Daarom bieden wij: <strong className="text-foreground">30 dagen risicovrij testen.</strong>
                </p>
                <p className="text-foreground/60">
                  Bevalt je product niet? Stuur het binnen 30 dagen terug — wij verwerken je terugbetaling zodra je retour is ontvangen en gecontroleerd.
                </p>
                <p className="text-foreground/60">
                  Dit geeft je volledige zekerheid zonder verplichtingen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Shipping;
