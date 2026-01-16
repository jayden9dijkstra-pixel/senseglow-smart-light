export const WarmGlowSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-8">
            Warm licht dat je lichaam rust geeft.
          </h2>
          
          <div className="max-w-xl mx-auto space-y-4 text-base text-muted-foreground mb-8">
            <p className="flex items-center justify-center gap-3">
              <span className="text-foreground/30">✗</span>
              <span>Geen koel wit licht</span>
            </p>
            
            <p className="flex items-center justify-center gap-3">
              <span className="text-foreground/30">✗</span>
              <span>Geen felle spots</span>
            </p>
            
            <p className="flex items-center justify-center gap-3 text-foreground font-medium">
              <span className="text-glow">✓</span>
              <span>Zacht kastanjebruin warm licht dat rust en veiligheid uitstraalt</span>
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground/70 italic">
            Geïnspireerd door hotelgangen en high-end interieurdesign
          </p>
        </div>
      </div>
    </section>
  );
};