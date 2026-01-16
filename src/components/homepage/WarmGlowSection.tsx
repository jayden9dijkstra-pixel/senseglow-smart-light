export const WarmGlowSection = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto md:mx-0">
          <div className="text-left space-y-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Warm licht dat je lichaam rust geeft.
            </h2>
            
            <div className="space-y-3 text-base text-muted-foreground">
              <p className="flex items-start gap-3">
                <span className="text-foreground/40 font-medium">✗</span>
                <span>Geen koel wit licht</span>
              </p>
              
              <p className="flex items-start gap-3">
                <span className="text-foreground/40 font-medium">✗</span>
                <span>Geen felle spots</span>
              </p>
              
              <p className="flex items-start gap-3">
                <span className="text-glow font-medium">✓</span>
                <span className="text-foreground">Zacht kastanjebruin warm licht dat rust en veiligheid uitstraalt</span>
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground italic border-l border-foreground/10 pl-4">
              Geïnspireerd door hotelgangen en high-end interieurdesign
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};