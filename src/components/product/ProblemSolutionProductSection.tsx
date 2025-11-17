export const ProblemSolutionProductSection = () => {
  const problems = [
    "95% van mensen schat diepte slecht in in het donker.",
    "Het grote licht triggert wakker-word hormonen.",
    "Donkere gangen creëren stress."
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Problems */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Het probleem is reëel.
              </h2>
              
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-6 bg-background rounded-2xl border border-border"
                  >
                    <span className="text-brand-orange font-bold text-xl flex-shrink-0">⚠</span>
                    <p className="text-lg text-foreground">{problem}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-border">
                <h3 className="text-2xl font-bold text-brand-orange mb-4">
                  De oplossing:
                </h3>
                <p className="text-lg text-foreground leading-relaxed">
                  SenseGlow™ springt automatisch aan, geeft warm licht, en begeleidt je lichaam kalm door de nacht.
                </p>
              </div>
            </div>

            {/* Right - Image placeholder */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-gradient-to-br from-brand-orange/20 to-muted flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl">🏠</div>
                  <p className="text-sm text-muted-foreground">
                    [Foto: trap, gang, slaapkamer met SenseGlow]
                  </p>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-brand-orange/10 blur-3xl -z-10 scale-90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
