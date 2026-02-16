import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Tracking = () => {
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
              Bestelling Volgen
            </h1>
            <p className="text-lg text-foreground/60">
              Volg je SenseGlow bestelling in realtime via ons trackingsysteem.
            </p>
          </div>

          <Card className="border-glow/20 bg-glow/5">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-glow/10 rounded-full">
                  <Package className="h-10 w-10 text-glow" />
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Track & Trace</h2>
                <p className="text-foreground/60 max-w-md mx-auto">
                  Klik op de knop hieronder om je bestelling te volgen. Je hebt je trackingnummer nodig — deze ontvang je per e-mail na verzending.
                </p>
              </div>
              <Button
                size="lg"
                className="text-sm font-medium tracking-wide rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500"
                onClick={() => window.open("https://senseglow-smart-light-5jjoq.myshopify.com/apps/17TRACK", "_blank")}
              >
                Bestelling volgen
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8 space-y-4">
              <h3 className="text-xl font-semibold">Hoe werkt het?</h3>
              <ol className="space-y-3 text-foreground/60 list-decimal list-inside">
                <li>Na verzending ontvang je een e-mail met je trackingnummer</li>
                <li>Klik op "Bestelling volgen" hierboven</li>
                <li>Voer je trackingnummer in op de trackingpagina</li>
                <li>Bekijk de actuele status van je pakket</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Tracking;
