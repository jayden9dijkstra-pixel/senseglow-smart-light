import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Clock, Globe } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Contact = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <div className="container py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar home
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Contact & Support
            </h1>
            <p className="text-lg text-foreground/60">
              Bij SenseGlow staat klanttevredenheid centraal. Ons supportteam helpt je graag met al je vragen over bestellingen, garantie of technische ondersteuning.
            </p>
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-glow/10 rounded-lg">
                  <Mail className="h-6 w-6 text-glow" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">E-mail</h3>
                  <a href="mailto:support@senseglow.nl" className="text-glow hover:underline">support@senseglow.shop</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-glow/10 rounded-lg">
                  <Clock className="h-6 w-6 text-glow" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Reactietijd</h3>
                  <p className="text-foreground/60">Binnen 24 uur (ma–vr)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-glow/10 rounded-lg">
                  <Globe className="h-6 w-6 text-glow" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Taal</h3>
                  <p className="text-foreground/60">Nederlands & Engels</p>
                </div>
              </div>

              <div className="pt-4 border-t border-foreground/10">
                <p className="text-sm text-foreground/60">
                  <strong className="text-foreground">Tip:</strong> Vermeld je ordernummer voor een snelle afhandeling.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Veelgestelde vragen</h2>
            <div className="space-y-4">
              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Hoe snel wordt mijn bestelling verzonden?</h3>
                  <p className="text-foreground/60">Binnen 24–48 uur verwerkt. Levertijd 5–10 werkdagen.</p>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Moet ik verzendkosten betalen?</h3>
                  <p className="text-foreground/60">Nee. Bij SenseGlow is verzending altijd gratis.</p>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Krijg ik een Track & Trace?</h3>
                  <p className="text-foreground/60">Ja, automatisch na verwerking van je bestelling.</p>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Mijn lamp werkt niet goed. Wat kan ik doen?</h3>
                  <p className="text-foreground/60">Neem contact met ons op met een korte video. Je valt onder onze 1 jaar garantie.</p>
                </CardContent>
              </Card>

              <Card className="border-foreground/10 bg-background">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Kan ik retourneren?</h3>
                  <p className="text-foreground/60">Ja, binnen 30 dagen, mits het product ongebruikt is.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
