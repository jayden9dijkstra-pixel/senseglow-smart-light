import storytellingImage from "@/assets/storytelling-glow.png";

export const StorytellingSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Image - Left side */}
            <div className="relative">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={storytellingImage} 
                  alt="SenseGlow LED strip die warm oplicht in het donker" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            {/* Content - Right side, right-aligned for balance */}
            <div className="space-y-6 md:text-right">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Waarom we SenseGlow™ maakten
              </h2>

              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Mensen struikelen verrassend vaak in donkere gangen en trappen. Kinderen durven niet alleen naar de wc in het donker.
                </p>
                
                <p>
                  Felle lampen verstoren slaapcycli en maken gezinnen wakker. We wilden één simpel product dat dit oplost — zonder verbouwing, zonder gedoe.
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