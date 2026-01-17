import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, RefreshCw, Mail, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Returns = () => {
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
              Retourneren & Ruilen
            </h1>
            <p className="text-lg text-foreground/60">
              Wij willen dat je volledig tevreden bent met je aankoop.
            </p>
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Retourvoorwaarden</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-glow flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">30 dagen bedenktijd</h3>
                    <p className="text-foreground/60">Je hebt 30 dagen de tijd om te beslissen of je het product wilt behouden.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="h-6 w-6 text-glow flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Product moet ongebruikt zijn</h3>
                    <p className="text-foreground/60">Het product moet in originele staat zijn, met alle originele verpakkingen en labels.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RefreshCw className="h-6 w-6 text-glow flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Retourkosten</h3>
                    <p className="text-foreground/60">Retourkosten zijn voor de klant. Wij adviseren track & trace verzending.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-glow flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Ruilen of terugbetaling</h3>
                    <p className="text-foreground/60">Je kunt kiezen voor een ander product of volledige terugbetaling.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-glow/20 bg-glow/5">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-glow/10 rounded-lg">
                  <Mail className="h-6 w-6 text-glow" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Hoe retourneren?</h2>
                  <p className="text-foreground/60">
                    Stuur een e-mail naar <a href="mailto:support@senseglow.nl" className="text-glow hover:underline font-semibold">support@senseglow.nl</a>
                  </p>
                </div>
              </div>
              
              <div className="bg-background/50 p-6 rounded-lg">
                <p className="text-foreground/60 mb-4">
                  Ons team stuurt je het juiste retouradres op basis van je fulfilmentlocatie.
                </p>
                <p className="text-sm text-foreground/60">
                  <strong className="text-foreground">Tip:</strong> Vermeld je ordernummer in de e-mail voor een snelle afhandeling.
                </p>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-3xl font-bold mb-6">Veel gestelde vragen over retourneren</h2>
            <div className="space-y-4">
              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Hoe lang duurt het voordat ik mijn geld terugkrijg?</h3>
                  <p className="text-foreground/60">
                    Zodra we je retour hebben ontvangen en gecontroleerd, verwerken we de terugbetaling binnen 5–7 werkdagen.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Kan ik mijn product ruilen voor een ander formaat?</h3>
                  <p className="text-foreground/60">
                    Ja, dat is mogelijk. Vermeld dit in je retour-e-mail en we helpen je graag verder.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Wat als mijn product defect is?</h3>
                  <p className="text-foreground/60">
                    Bij een defect product vallen de retourkosten voor ons. Neem contact op via support@senseglow.nl met foto's of een video van het defect.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Moet ik de originele verpakking gebruiken?</h3>
                  <p className="text-foreground/60">
                    Wij adviseren de originele verpakking te gebruiken om schade tijdens transport te voorkomen, maar dit is niet verplicht. Zorg wel voor stevige verpakking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Returns;
