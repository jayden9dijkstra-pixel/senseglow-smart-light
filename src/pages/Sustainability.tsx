import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Leaf, Package, Zap } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const Sustainability = () => {
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
              Duurzaamheid
            </h1>
            <p className="text-lg text-foreground/60 leading-relaxed">
              SenseGlow kiest bewust voor een duurzame aanpak.
            </p>
          </div>

          <Card className="border-foreground/10 bg-background">
            <CardContent className="p-8">
              <p className="text-lg text-foreground/60 leading-relaxed mb-6">
                Onze LED-technologie is energiezuinig, onze productie gebeurt in kleine batches om overschotten te voorkomen, en onze verpakkingen zijn minimalistisch met zo min mogelijk afval.
              </p>
              <p className="text-lg font-semibold text-foreground">
                Door te kiezen voor SenseGlow, kies je voor verlichting met een langere levensduur én een lagere impact op het milieu.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <div className="w-16 h-16 mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Energiezuinige LED</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Onze LED-technologie verbruikt tot 80% minder energie dan traditionele verlichting en gaat jaren mee.
                </p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <div className="w-16 h-16 mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Kleine Batches</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  We produceren bewust in kleinere aantallen om overproductie en verspilling te voorkomen.
                </p>
              </CardContent>
            </Card>

            <Card className="border-foreground/10 bg-background">
              <CardContent className="p-6">
                <div className="w-16 h-16 mb-4 bg-glow/10 rounded-full flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-glow" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Minimaal Afval</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Onze verpakkingen zijn minimalistisch ontwerpen met zo min mogelijk materiaal en maximale bescherming.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-glow/20 bg-glow/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Onze belofte</h2>
              <p className="text-foreground/60 leading-relaxed mb-4">
                We blijven zoeken naar manieren om onze impact op het milieu te verkleinen. Van slimme productie tot duurzame materialen — duurzaamheid is onderdeel van alles wat we doen.
              </p>
              <p className="text-foreground/60 leading-relaxed">
                Met SenseGlow kies je niet alleen voor comfort en stijl, maar ook voor een verantwoorde keuze die bijdraagt aan een beter milieu.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Sustainability;
