import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Shield, Zap } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

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

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Over SenseGlow
            </h1>
            <p className="text-lg text-foreground/60 leading-relaxed">
              SenseGlow is ontwikkeld vanuit één visie: verlichting moet slim, stijlvol en zorgeloos zijn.
            </p>
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8">
              <p className="text-lg text-foreground/60 leading-relaxed mb-6">
                Onze LED-sensorverlichting combineert modern design met betrouwbare technologie, waardoor elke ruimte direct comfortabeler en veiliger aanvoelt.
              </p>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Wij ontwerpen producten die jouw dagelijkse routine ondersteunen, automatisch, energiezuinig en zonder overbodige complexiteit.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Slim Design</h3>
                <p className="text-sm text-foreground/60">
                  Modern en minimalistisch, past in elke ruimte
                </p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Energiezuinig</h3>
                <p className="text-sm text-foreground/60">
                  LED-technologie met lange levensduur
                </p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Betrouwbaar</h3>
                <p className="text-sm text-foreground/60">
                  Kwaliteit waar je op kunt vertrouwen
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;
