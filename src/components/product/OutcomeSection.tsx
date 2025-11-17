import { Card } from "@/components/ui/card";

const outcomes = [
  {
    icon: "🌙",
    title: "Rustige nachtelijke bewegingen",
    description: "Geen felle lampen meer. Geen slaapinterrupties."
  },
  {
    icon: "🛡️",
    title: "Veiligheid in donkere ruimtes",
    description: "Trap & gang zichtbaar zonder fel licht."
  },
  {
    icon: "👶",
    title: "Kinderen die zelf durven",
    description: "Een warme glow geeft vertrouwen."
  }
];

export const OutcomeSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Je koopt geen lamp — je koopt veiligheid in het donker.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {outcomes.map((outcome, index) => (
              <Card key={index} className="p-8 bg-muted/50 border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="space-y-4 text-center">
                  <div className="text-6xl mb-4">{outcome.icon}</div>
                  <h3 className="text-xl font-bold text-foreground">{outcome.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {outcome.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
