import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Truck, RotateCcw, Shield } from "lucide-react";
import heroImage from "@/assets/hero-lifestyle.png";
export const HeroSection = () => {
  const navigate = useNavigate();
  return <section className="relative bg-background pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Content - Left side, left-aligned */}
            <div className="space-y-10 order-2 md:order-1 animate-fade-in-slow">
              <div className="space-y-6">
                <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
                  Nachtverlichting met bewegingssensor
                </p>
                
                <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] text-foreground">
                  Veilig licht. Precies wanneer jij beweegt.
                </h1>
                
                <p className="text-base md:text-lg text-foreground/60 leading-relaxed max-w-lg">Zachte nachtverlichting die je begeleidt zonder iemand wakker te maken. De bewegingssensor activeert alleen wanneer nodig stil, veilig en intelligent.</p>
              </div>

              <div className="space-y-8">
                <Button onClick={() => navigate("/quiz")} size="lg" className="text-sm font-medium tracking-wide rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500">
                  Ontdek SenseGlow
                </Button>

                {/* Trust indicators with amber icons */}
                <div className="flex flex-col gap-2 text-[11px] text-foreground/50 tracking-wide">
                  <span className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-glow" />
                    Gratis verzending
                  </span>
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-glow" />
                    30 dagen retour
                  </span>
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-glow" />
                    1 jaar garantie
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image - Right side */}
            <div className="relative order-1 md:order-2 animate-fade-in-slow">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl">
                <img src={heroImage} alt="SenseGlow LED lamp met warme glow in donkere ruimte" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};