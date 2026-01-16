import stairsSafetyGlow from "@/assets/stairs-safety-glow.png";

export const SafetySection = () => {
  const stats = [
    "27% van nachtelijke valpartijen gebeurt in trappen en gangen.",
    "Donker + slaperige ogen = slechte diepte-inschatting.",
    "SenseGlow™ geeft jouw lichaam de context die het nodig heeft.",
    "Automatisch. Zonder nadenken. Zonder knoppen."
  ];

  return (
    <section className="py-16 md:py-24 bg-background animate-fade-in">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Content - Left side */}
            <div className="space-y-8 order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Veiligheid is geen luxe. <br className="hidden md:block" />Het is basis.
              </h2>
              
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <p 
                    key={index} 
                    className={`text-base leading-relaxed flex items-start gap-3 ${
                      index === stats.length - 1 
                        ? 'text-foreground font-medium' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className={`flex-shrink-0 mt-0.5 ${index === stats.length - 1 ? 'text-glow' : 'text-foreground/30'}`}>
                      {index === stats.length - 1 ? "✓" : "—"}
                    </span>
                    {stat}
                  </p>
                ))}
              </div>
            </div>

            {/* Image - Right side */}
            <div className="relative order-1 md:order-2">
              <div className="aspect-[4/5] overflow-hidden">
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