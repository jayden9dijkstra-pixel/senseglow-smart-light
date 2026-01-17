import stairsSafetyGlow from "@/assets/stairs-safety-glow.png";

export const SafetySection = () => {
  const stats = [
    "27% van nachtelijke valpartijen gebeurt in trappen en gangen.",
    "Donker + slaperige ogen = slechte diepte-inschatting.",
    "SenseGlow™ geeft jouw lichaam de context die het nodig heeft.",
    "Automatisch. Zonder nadenken. Zonder knoppen."
  ];

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Content - Left side, left-aligned */}
            <div className="space-y-10 order-2 md:order-1 animate-fade-in-slow">
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
                  Veiligheid
                </p>
                
                <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight">
                  Veiligheid is geen luxe. <br className="hidden md:block" />Het is basis.
                </h2>
              </div>
              
              <div className="space-y-5">
                {stats.map((stat, index) => (
                  <p 
                    key={index} 
                    className={`text-base leading-relaxed flex items-start gap-4 ${
                      index === stats.length - 1 
                        ? 'text-foreground font-medium' 
                        : 'text-foreground/60'
                    }`}
                  >
                    <span className={`flex-shrink-0 mt-0.5 ${index === stats.length - 1 ? 'text-glow' : 'text-foreground/20'}`}>
                      {index === stats.length - 1 ? "✓" : "—"}
                    </span>
                    {stat}
                  </p>
                ))}
              </div>
            </div>

            {/* Image - Right side */}
            <div className="relative order-1 md:order-2 animate-fade-in-slow">
              <div className="aspect-[4/5] overflow-hidden rounded-3xl">
                <img 
                  src={stairsSafetyGlow}
                  alt="Voeten op trap met warme SenseGlow LED verlichting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
