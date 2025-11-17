import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-lifestyle.png";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-b from-background to-muted/20 py-16 md:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-wider text-brand-orange font-medium">
                Premium bewegingssensor verlichting voor elk huis
              </p>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Veilig licht precies wanneer jij beweegt.
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Van diepe duisternis naar een zachte, warme glow die jou veilig begeleidt – zonder iemand wakker te maken.
              </p>
            </div>

            <div className="space-y-6">
              <Button
                onClick={() => navigate("/quiz")}
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white text-lg px-12 py-7 h-auto rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Ontdek jouw ideale SenseGlow™ setup
              </Button>

              {/* Microtrust */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-brand-orange text-lg">⭐</span>
                  <span>+11.000 veilige nachtbewegingen gefaciliteerd</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-orange text-lg">✓</span>
                  <span>97% van klanten voelt zich veiliger in huis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
              <img 
                src={heroImage}
                alt="SenseGlow LED lamp met warme glow in donkere ruimte"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay voor extra warmte */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-orange/20 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Glow effect achter image */}
            <div className="absolute inset-0 bg-brand-orange/10 blur-3xl -z-10 scale-95" />
          </div>
        </div>
      </div>
    </section>
  );
};
