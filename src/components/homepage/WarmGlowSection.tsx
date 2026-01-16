import hallwayImage from "@/assets/hallway-warm-glow.png";

export const WarmGlowSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Centered text - transition moment */}
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-6">
              Warm licht dat je lichaam rust geeft.
            </h2>
            
            <div className="space-y-3 text-base text-muted-foreground">
              <p className="flex items-center justify-center gap-3">
                <span className="text-foreground/30">✗</span>
                <span>Geen koel wit licht dat je wakker maakt</span>
              </p>
              
              <p className="flex items-center justify-center gap-3">
                <span className="text-foreground/30">✗</span>
                <span>Geen felle spots die in je ogen schijnen</span>
              </p>
              
              <p className="flex items-center justify-center gap-3 text-foreground font-medium">
                <span className="text-glow">✓</span>
                <span>Zacht kastanjebruin warm licht dat rust en veiligheid uitstraalt</span>
              </p>
            </div>
          </div>
          
          {/* Horizontal lifestyle image - visual break */}
          <div className="mb-10">
            <div className="overflow-hidden rounded-xl">
              <img 
                src={hallwayImage}
                alt="Warme gang verlicht door SenseGlow"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground/70 italic">
            Geïnspireerd door hotelgangen en high-end interieurdesign
          </p>
        </div>
      </div>
    </section>
  );
};
