import stairsSafetyGlow from "@/assets/stairs-safety-glow.png";

export const SafetySection = () => {
  const stats = [
    "27% van nachtelijke valpartijen gebeurt in trappen/gangen.",
    "Donker + slaperige ogen = slechte diepte-inschatting.",
    "SenseGlow™ geeft jouw lichaam de context die het nodig heeft.",
    "Automatisch. Zonder nadenken. Zonder knoppen."
  ];

  return (
    <section className="py-20 md:py-32 bg-background animate-fade-in">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image - Left side */}
            <div className="relative order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden">
                <img 
                  src={stairsSafetyGlow}
                  alt="Voeten op trap met warme SenseGlow LED verlichting"
                  className="w-full h-auto"
                />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-glow/20 blur-3xl -z-10 scale-90" />
            </div>

            {/* Content - Right side */}
            <div className="space-y-8 order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Veiligheid is geen luxe. Het is basis.
              </h2>
              
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-5 bg-muted/50 rounded-2xl transition-colors duration-300"
                  >
                    <span className="text-glow font-bold text-xl flex-shrink-0">
                      {index === stats.length - 1 ? "✓" : "•"}
                    </span>
                    <p className="text-lg text-foreground leading-relaxed">
                      {stat}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
