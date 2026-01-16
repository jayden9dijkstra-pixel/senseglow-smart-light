import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-lifestyle.png";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-background py-20 md:py-28 animate-fade-in-slow">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Content - Left side, left-aligned */}
            <div className="space-y-8 order-2 md:order-1">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/40 font-medium">
                  Nachtverlichting met bewegingssensor
                </p>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.12] text-foreground">
                  Veilig licht. Precies wanneer jij beweegt.
                </h1>
                
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Zachte nachtverlichting die je begeleidt zonder iemand wakker te maken. De bewegingssensor activeert alleen wanneer nodig — stil, veilig en intelligent.
                </p>
              </div>

              <div className="space-y-6">
                <Button
                  onClick={() => navigate("/quiz")}
                  size="lg"
                  className="text-sm font-medium tracking-wide"
                >
                  Ontdek SenseGlow
                </Button>

                {/* Trust Icons - subtle inline flow */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground/70">
                  <span className="flex items-center gap-1.5">
                    <span className="text-glow/70">✓</span> Gratis verzending
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-glow/70">✓</span> 30 dagen retour
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-glow/70">✓</span> 1 jaar garantie
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image - Right side */}
            <div className="relative order-1 md:order-2">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
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
