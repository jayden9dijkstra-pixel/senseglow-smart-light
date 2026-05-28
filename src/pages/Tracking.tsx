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
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Terug naar home
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Volg je bestelling</h1>
            <p className="text-lg text-foreground/60">
              Voer je track-code in om de status van je pakket live te zien.
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
                <h2 className="text-2xl font-bold">Volg via 17TRACK</h2>
                <p className="text-foreground/60 max-w-md mx-auto">
                  Klik op de knop hieronder om je pakket live te volgen in een nieuw tabblad.
                </p>
              </div>
              <Button
                size="lg"
                className="text-sm font-medium tracking-wide rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500"
                onClick={() => window.open("https://t.17track.net", "_blank", "noopener,noreferrer")}
              >
                Volg via 17TRACK
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {[
            {
              title: "Wat is mijn track-code?",
              body: "Je vindt 'm in de tweede mail die je van ons kreeg — die hebben we gestuurd zodra je pakket bij DHL lag. Onderwerp: 'Je SenseGlow bestelling is onderweg'. Kun je 'm niet vinden? Check ook je spam-folder.",
            },
            {
              title: "Hoe lang nog?",
              body: "Tussen 7 en 14 werkdagen vanaf het moment dat je de mail kreeg. De 17TRACK-status laat zien wáár het pakket nu is.",
            },
            {
              title: "Mijn track-code werkt niet?",
              body: "Track-codes worden soms pas na 24-48 uur actief in het DHL-systeem. Als je 'm na 3 dagen nog steeds niet kunt volgen, mail support@senseglow.shop met je bestelnummer — we lossen het op.",
            },
          ].map(({ title, body }) => (
            <Card key={title} className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-foreground/60 leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Tracking;
