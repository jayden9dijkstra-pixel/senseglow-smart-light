import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-lifestyle.png";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-background py-12 md:py-20 animate-fade-in-slow">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Content - Left aligned */}
            <div className="space-y-6 text-left order-2 md:order-1">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-medium">
                  Nachtverlichting met bewegingssensor
                </p>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                  Veilig licht. Precies wanneer jij beweegt.
                </h1>
                
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Zachte nachtverlichting die je begeleidt zonder iemand wakker te maken. Bewegingssensor activeert alleen wanneer nodig, met warm licht dat je slaapritme respecteert.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => navigate("/quiz")}
                  size="lg"
                  className="text-sm px-10 py-6 h-auto font-medium tracking-wide"
                >
                  Ontdek SenseGlow
                </Button>

                {/* Trust Icons */}
                <div className="flex flex-wrap gap-6 text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-glow">✓</span>
                    <span>Gratis verzending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-glow">✓</span>
                    <span>30 dagen retour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-glow">✓</span>
                    <span>1 jaar garantie</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image - Right side */}
            <div className="relative order-1 md:order-2">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={heroImage}
                  alt="SenseGlow LED lamp met warme glow in donkere ruimte"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};