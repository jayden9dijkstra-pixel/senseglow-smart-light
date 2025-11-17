import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const useCases = [
  {
    icon: "🪜",
    title: "Trap",
    description: "Meest gekozen voor veiligheid",
    badge: "Meest gekozen"
  },
  {
    icon: "🚪",
    title: "Gang & Hal",
    description: "Oriëntatie zonder te storen"
  },
  {
    icon: "🛏️",
    title: "Kinderkamer",
    description: "Geeft kinderen vertrouwen in het donker"
  },
  {
    icon: "🚿",
    title: "Badkamer & Keuken",
    description: "Nachtelijke bezoeken zonder fel licht"
  }
];

export const UseCaseSection = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Perfect voor elke donkere plek
            </h2>
            <p className="text-lg text-muted-foreground">
              Ontdek waar SenseGlow™ het verschil maakt in jouw huis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-6 bg-background border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
                {useCase.badge && (
                  <Badge className="absolute top-4 right-4 bg-brand-orange text-white">
                    {useCase.badge}
                  </Badge>
                )}
                
                <div className="space-y-4">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {useCase.description}
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
