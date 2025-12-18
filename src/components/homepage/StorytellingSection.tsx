import storytellingImage from "@/assets/storytelling-glow.jpg";

export const StorytellingSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Waarom we SenseGlow™ maakten
            </h2>
          </div>

          <div className="space-y-8 text-lg leading-relaxed text-muted-foreground text-center">
            <p>
              Mensen struikelen verrassend vaak in donkere gangen en trappen.
            </p>
            
            <p>
              Kinderen durven niet alleen naar de wc in het donker.
            </p>
            
            <p>
              Felle lampen verstoren slaapcycli en maken gezinnen wakker.
            </p>
            
            <div className="pt-8 border-t border-border">
              <p className="text-xl font-medium text-foreground">
                En dan:
              </p>
              <p className="mt-4 text-lg">
                "We wilden één simpel product dat dit oplost zonder verbouwing, zonder gedoe, en zonder felle lichten — alleen een warme, veilige glow die reageert op jouw beweging."
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl aspect-video max-w-2xl mx-auto">
            <img 
              src={storytellingImage} 
              alt="SenseGlow LED strip die warm oplicht in het donker" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
