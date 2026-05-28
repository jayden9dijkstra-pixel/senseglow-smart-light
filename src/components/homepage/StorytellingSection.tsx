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
                  alt="SenseGlow LED licht in een warme woonruimte"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content - Right side */}
            <div className="space-y-8 md:text-right animate-fade-in-slow">
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
                Ons verhaal
              </p>

              <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight">
                Waarom we SenseGlow™ maakten
              </h2>

              <div className="space-y-5 text-base leading-relaxed text-foreground/60">
                <p>
                  We begonnen met één vraag: waarom moet verlichting altijd gedoe zijn?
                </p>
                <p>
                  Boren, kabels, schakelaars die je in het donker niet vindt. Elektriciens die je nooit op tijd kunt bereiken.
                </p>
                <p className="text-foreground font-medium">
                  SenseGlow is ons antwoord — lampen die werken zoals jij leeft. Sensor of touch, binnen of buiten, klein of groot. Eén ding gemeen: je hangt 'm op, en hij doet de rest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
