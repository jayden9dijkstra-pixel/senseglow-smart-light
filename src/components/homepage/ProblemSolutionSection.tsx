import problemSolutionSplit from "@/assets/problem-solution-split.png";

const problems = [
  {
    title: "Struikelgevaar",
    description: "Trapranden, hoeken en drempels verdwijnen volledig in het donker. Jouw ogen kunnen niet inschatten waar de volgende stap is."
  },
  {
    title: "Slaapverstoring",
    description: "Het grote licht zorgt voor adrenalinepieken midden in de nacht. Je brein wordt wakker, ook al wil je slapen."
  },
  {
    title: "Onzekerheid bij kinderen",
    description: "Zonder licht voelt iedere gang eindeloos lang. Kinderen durven niet alleen naar de badkamer."
  }
];

export const ProblemSolutionSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Centered headline - visual pause moment */}
          <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in-slow">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
              Het probleem
            </p>
            
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight mb-5">
              Het gevaar zit in de duisternis, niet in de trap.
            </h2>
            <p className="text-base text-foreground/60">
              De meeste nachtelijke ongelukken gebeuren niet door onhandigheid, maar door gebrek aan context.
            </p>
          </div>

          {/* Problems grid with lines */}
          <div className="grid md:grid-cols-3 gap-10 mb-20">
            {problems.map((problem, index) => (
              <div 
                key={index} 
                className="border-t border-foreground/8 pt-8 space-y-4 animate-fade-in-slow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-foreground">{problem.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>

          {/* Solution statement - centered with amber glow */}
          <div className="text-center mb-14 animate-fade-in-slow">
            <p className="text-xl md:text-2xl font-medium text-foreground">
              Daarom creëerden we <span className="text-glow">SenseGlow™</span>
            </p>
          </div>

          {/* Problem/Solution Image - full width horizontal break */}
          <div className="mb-12 animate-fade-in-slow">
            <div className="overflow-hidden rounded-2xl">
              <img 
                src={problemSolutionSplit} 
                alt="Links: donkere gang zonder licht, rechts: warme gang met SenseGlow" 
                className="w-full h-auto" 
              />
            </div>
          </div>

          {/* Comparison captions - left and right aligned */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="text-left">
              <p className="text-sm text-foreground/50 leading-relaxed">
                "95% van mensen schat diepte slecht in het donker."
                <br />
                <span className="text-xs text-foreground/30">Donkere gangen creëren stress en onzekerheid.</span>
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-foreground font-medium leading-relaxed">
                "SenseGlow™ springt automatisch aan"
                <br />
                <span className="text-xs text-foreground/50">en begeleidt je kalm door de nacht.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
