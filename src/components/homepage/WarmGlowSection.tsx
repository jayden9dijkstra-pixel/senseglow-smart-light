import hallwayImage from "@/assets/hallway-warm-glow.png";

export const WarmGlowSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Centered text - transition moment */}
          <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in-slow">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
              Het SenseGlow DNA
            </p>
            
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight mb-8">
              Warm licht dat je lichaam rust geeft.
            </h2>
            
            <div className="space-y-4 text-base text-foreground/60">
              <p className="flex items-center justify-center gap-4">
                <span className="text-foreground/20">✗</span>
                <span>Geen koel wit licht dat je wakker maakt</span>
              </p>
              
              <p className="flex items-center justify-center gap-4">
                <span className="text-foreground/20">✗</span>
                <span>Geen felle spots die in je ogen schijnen</span>
              </p>
              
              <p className="flex items-center justify-center gap-4 text-foreground font-medium">
                <span className="text-glow">✓</span>
                <span>Zacht kastanjebruin warm licht dat rust en veiligheid uitstraalt</span>
              </p>
            </div>
          </div>
          
          {/* Horizontal lifestyle image - visual break */}
          <div className="mb-6 animate-fade-in-slow">
            <div className="overflow-hidden rounded-2xl">
              <img 
                src={hallwayImage}
                alt="Warme gang verlicht door SenseGlow"
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <p className="text-center text-[11px] text-foreground/30 tracking-wide">
            Geïnspireerd door hotelgangen en high-end interieurdesign
          </p>
        </div>
      </div>
    </section>
  );
};
