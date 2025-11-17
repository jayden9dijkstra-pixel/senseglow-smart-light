export const StorytellingSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Waarom we SenseGlow™ maakten
            </h2>
          </div>

          <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
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

          {/* Placeholder voor close-up foto */}
          <div className="mt-16 rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gradient-to-br from-brand-orange/20 to-muted flex items-center justify-center">
            <div className="text-center space-y-2 p-8">
              <div className="text-4xl">💡</div>
              <p className="text-sm text-muted-foreground">
                [Close-up foto: lichtstrip die oplicht vanuit duisternis]
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
