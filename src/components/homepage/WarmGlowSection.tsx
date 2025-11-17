export const WarmGlowSection = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-brand-orange/5">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Warm licht dat je lichaam rust geeft.
              </h2>
              
              <div className="space-y-6 text-lg text-muted-foreground">
                <p className="flex items-start gap-3">
                  <span className="text-brand-orange font-bold text-xl">✗</span>
                  <span>Geen koel wit licht</span>
                </p>
                
                <p className="flex items-start gap-3">
                  <span className="text-brand-orange font-bold text-xl">✗</span>
                  <span>Geen felle spots</span>
                </p>
                
                <p className="flex items-start gap-3">
                  <span className="text-brand-orange font-bold text-2xl">✓</span>
                  <span className="font-medium text-foreground">Maar zacht kastanjebruin warm licht dat rust en veiligheid uitstraalt</span>
                </p>
                
                <p className="pt-6 text-base italic border-t border-border">
                  Geïnspireerd door hotelgangen en high-end interieurdesign
                </p>
              </div>
            </div>

            {/* Right - Placeholder voor luxe glow foto */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-square bg-gradient-to-br from-brand-orange/30 via-brand-orange/20 to-background flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl">✨</div>
                  <p className="text-sm text-muted-foreground">
                    [Luxe warme glow foto]
                  </p>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand-orange/20 blur-3xl -z-10 scale-90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
