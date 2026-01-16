import stairsSafetyGlow from "@/assets/stairs-safety-glow.png";

export const SafetySection = () => {
  const stats = [
    "27% van nachtelijke valpartijen gebeurt in trappen/gangen.",
    "Donker + slaperige ogen = slechte diepte-inschatting.",
    "SenseGlow™ geeft jouw lichaam de context die het nodig heeft.",
    "Automatisch. Zonder nadenken. Zonder knoppen."
  ];

  return (
    <section className="py-12 md:py-20 bg-background animate-fade-in">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image - Left side */}
            <div className="relative order-2 md:order-1">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={stairsSafetyGlow}
                  alt="Voeten op trap met warme SenseGlow LED verlichting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content - Right side, left aligned */}
            <div className="space-y-6 order-1 md:order-2 text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Veiligheid is geen luxe. Het is basis.
              </h2>
              
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 text-base"
                  >
                    <span className="text-glow flex-shrink-0 mt-1">
                      {index === stats.length - 1 ? "✓" : "•"}
                    </span>
                    <p className="text-foreground/80 leading-relaxed">
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