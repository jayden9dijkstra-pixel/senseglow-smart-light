export const SafetySection = () => {
  const stats = [
    "27% van nachtelijke valpartijen gebeurt in trappen/gangen.",
    "Donker + slaperige ogen = slechte diepte-inschatting.",
    "SenseGlow™ geeft jouw lichaam de context die het nodig heeft.",
    "Automatisch. Zonder nadenken. Zonder knoppen."
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Placeholder voor voeten op trap foto */}
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] bg-gradient-to-br from-muted to-brand-orange/10 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl">👣</div>
                  <p className="text-sm text-muted-foreground">
                    [Foto: voeten op trap met warme glow]
                  </p>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-brand-orange/10 blur-3xl -z-10 scale-90" />
            </div>

            {/* Right - Content */}
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Veiligheid is geen luxe. Het is basis.
              </h2>
              
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-6 bg-muted/50 rounded-2xl hover:bg-muted transition-colors"
                  >
                    <span className="text-brand-orange font-bold text-xl flex-shrink-0">
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
