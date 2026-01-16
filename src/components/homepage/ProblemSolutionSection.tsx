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
    <section className="py-16 md:py-24 bg-background animate-fade-in">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Centered headline */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Het gevaar zit in de duisternis, niet in de trap.
            </h2>
          </div>

          {/* Problems grid with lines */}
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {problems.map((problem, index) => (
              <div 
                key={index} 
                className="border-t border-foreground/10 pt-6 space-y-3"
              >
                <h3 className="text-lg font-semibold text-foreground">{problem.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>

          {/* Solution statement - centered */}
          <div className="text-center mb-10">
            <p className="text-xl md:text-2xl font-medium text-glow">
              Daarom creëerden we SenseGlow™
            </p>
          </div>

          {/* Problem/Solution Image - full width */}
          <div className="mb-8">
            <div className="overflow-hidden">
              <img 
                src={problemSolutionSplit} 
                alt="Links: donkere gang zonder licht, rechts: warme gang met SenseGlow" 
                className="w-full h-auto" 
              />
            </div>
          </div>

          {/* Comparison captions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                "95% van mensen schat diepte slecht in het donker." <br />
                <span className="text-xs">Donkere gangen creëren stress.</span>
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-foreground font-medium">
                "SenseGlow™ springt automatisch aan" <br />
                <span className="text-xs text-muted-foreground">en begeleidt je kalm door de nacht.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};