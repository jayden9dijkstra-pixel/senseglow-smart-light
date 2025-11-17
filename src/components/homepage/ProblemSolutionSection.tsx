import { Card } from "@/components/ui/card";

const problems = [
  {
    icon: "⚠️",
    title: "Struikelgevaar",
    description: "Trapranden, hoeken en drempels verdwijnen volledig in het donker."
  },
  {
    icon: "😴",
    title: "Slaapverstoring",
    description: "Het grote licht zorgt voor adrenalinepieken midden in de nacht."
  },
  {
    icon: "👶",
    title: "Onzekerheid bij kinderen",
    description: "Zonder licht voelt iedere gang eindeloos lang."
  }
];

export const ProblemSolutionSection = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Het gevaar zit in de duisternis — niet in de trap.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {problems.map((problem, index) => (
              <Card key={index} className="p-8 bg-background border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="text-5xl">{problem.icon}</div>
                  <h3 className="text-xl font-bold text-foreground">{problem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-2xl md:text-3xl font-semibold text-brand-orange">
              Daarom creëerden we SenseGlow™.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
