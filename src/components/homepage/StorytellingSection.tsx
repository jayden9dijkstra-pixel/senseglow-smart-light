import { DualImage } from "@/components/ui/DualImage";
import storytellingImage from "@/assets/storytelling-glow.png";

export const StorytellingSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background-secondary">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Image - Left side */}
            <div className="relative animate-fade-in-slow">
              <div className="aspect-square overflow-hidden rounded-3xl">
                <DualImage
                  srcLight={storytellingImage}
                  alt="SenseGlow LED strip die warm oplicht in het donker"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content - Right side, right-aligned for balance */}
            <div className="space-y-8 md:text-right animate-fade-in-slow">
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
                Ons verhaal
              </p>
              
              <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight">
                Waarom we SenseGlow™ maakten
              </h2>

              <div className="space-y-5 text-base leading-relaxed text-foreground/60">
                <p>
                  Mensen struikelen verrassend vaak in donkere gangen en trappen. Kinderen durven niet alleen naar de wc in het donker. Ouderen voelen zich onzeker bij elke stap.
                </p>
                
                <p>
                  Felle lampen verstoren slaapcycli en maken gezinnen wakker. We wilden één simpel product dat dit oplost — zonder verbouwing, zonder gedoe, zonder nadenken.
                </p>
                
                <p className="text-foreground font-medium">
                  Alleen een warme, veilige glow die reageert op jouw beweging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
