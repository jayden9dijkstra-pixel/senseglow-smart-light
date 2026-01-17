import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Shield, Eye } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Privacy = () => {
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
              Privacybeleid
            </h1>
            <p className="text-lg text-foreground/60 leading-relaxed">
              Wij gaan zorgvuldig om met jouw persoonsgegevens.
            </p>
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8">
              <p className="text-lg text-foreground/60 leading-relaxed mb-6">
                SenseGlow gebruikt alleen de gegevens die nodig zijn om je bestelling veilig te verwerken, te verzenden en te ondersteunen.
              </p>
              <p className="text-lg font-semibold text-foreground">
                Je informatie wordt beschermd, veilig opgeslagen en nooit verkocht aan derden.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <div className="w-16 h-16 mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Lock className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Veilig Opgeslagen</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Alle gegevens worden versleuteld en veilig bewaard volgens de hoogste beveiligingsstandaarden.
                </p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <div className="w-16 h-16 mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Beschermd</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  We nemen strikte maatregelen om jouw persoonsgegevens te beschermen tegen ongeautoriseerde toegang.
                </p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <div className="w-16 h-16 mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Transparant</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Je hebt altijd inzage in welke gegevens we van je bewaren en kunt deze aanpassen of verwijderen.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Welke gegevens verzamelen wij?</h2>
                <ul className="space-y-2 text-foreground/60">
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Contactgegevens (naam, e-mailadres, telefoonnummer)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Bezorgadres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Bestelgegevens en ordergeschiedenis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Betalingsinformatie (via beveiligde betalingsproviders)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Waarvoor gebruiken wij deze gegevens?</h2>
                <ul className="space-y-2 text-foreground/60">
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Het verwerken en verzenden van je bestelling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Communicatie over je bestelling en klantenservice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Het verbeteren van onze dienstverlening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Nieuwsbrieven (alleen met jouw toestemming)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Jouw rechten</h2>
                <p className="text-foreground/60 mb-4">
                  Je hebt het recht om:
                </p>
                <ul className="space-y-2 text-foreground/60">
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Inzage te vragen in je persoonsgegevens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Je gegevens te laten wijzigen of verwijderen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Bezwaar te maken tegen het gebruik van je gegevens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-glow mt-1">•</span>
                    <span>Je toestemming in te trekken</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-glow/20 bg-glow/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Vragen over privacy?</h2>
              <p className="text-foreground/60 mb-4">
                Bekijk ons volledige privacybeleid voor meer details over hoe wij jouw gegevens beschermen, of neem contact met ons op via <a href="mailto:support@senseglow.nl" className="text-glow hover:underline font-semibold">support@senseglow.nl</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Privacy;
