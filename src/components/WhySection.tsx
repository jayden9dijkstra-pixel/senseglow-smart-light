import { Shield, Sparkles, Leaf } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Veilig & Vertrouwd",
    description: "Automatisch licht bij elke beweging. Nooit meer struikelen in het donker.",
  },
  {
    icon: Sparkles,
    title: "Premium Design",
    description: "Minimalistische stijl die past bij elk modern interieur.",
  },
  {
    icon: Leaf,
    title: "Duurzaam & Zuinig",
    description: "LED-technologie die jarenlang meegaat en energie bespaart.",
  },
];

export const WhySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Waarom SenseGlow?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meer dan alleen verlichting, een slimme upgrade voor je huis
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="text-center group p-6 rounded-lg hover:bg-muted/20 transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-orange/10 mb-6 group-hover:bg-brand-orange/20 transition-colors">
                  <Icon className="w-8 h-8 text-brand-orange" />
                </div>
                <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
