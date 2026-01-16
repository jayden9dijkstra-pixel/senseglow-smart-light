import problemSolutionSplit from "@/assets/problem-solution-split.png";

const problems = [
  {
    title: "Struikelgevaar",
    description: "Trapranden, hoeken en drempels verdwijnen volledig in het donker."
  },
  {
    title: "Slaapverstoring",
    description: "Het grote licht zorgt voor adrenalinepieken midden in de nacht."
  },
  {
    title: "Onzekerheid bij kinderen",
    description: "Zonder licht voelt iedere gang eindeloos lang."
  }
];

export const ProblemSolutionSection = () => {
  return (
    <section className="py-12 md:py-20 bg-background animate-fade-in">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-left mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Het gevaar zit in de duisternis, niet in de trap.
            </h2>
          </div>

          {/* Problems as compact list */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {problems.map((problem, index) => (
              <div 
                key={index} 
                className="border-l border-foreground/10 pl-4 space-y-2"
              >
                <h3 className="text-base font-semibold text-foreground">{problem.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-left mb-8">
            <p className="text-lg font-medium text-glow">
              Daarom creëerden we SenseGlow™
            </p>
          </div>

          {/* Problem/Solution Image */}
          <div className="max-w-4xl">
            <div className="overflow-hidden">
              <img 
                src={problemSolutionSplit} 
                alt="Links: donkere gang zonder licht, rechts: warme gang met SenseGlow" 
                className="w-full h-auto" 
              />
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-1 border-l border-foreground/10 pl-4">
                <p className="text-sm font-medium text-muted-foreground">
                  "95% van mensen schat diepte slecht in het donker."
                </p>
                <p className="text-xs text-muted-foreground">
                  Donkere gangen creëren stress.
                </p>
              </div>
              <div className="space-y-1 border-l border-glow/50 pl-4">
                <p className="text-sm font-medium text-foreground">
                  "SenseGlow™ springt automatisch aan"
                </p>
                <p className="text-xs text-muted-foreground">
                  en begeleidt je kalm door de nacht.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};