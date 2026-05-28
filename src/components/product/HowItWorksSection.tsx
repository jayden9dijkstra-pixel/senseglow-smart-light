interface Step {
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  headline?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { title: "Plak 'm op", description: "Magneet en plakstrip zitten erin, geen schroef nodig." },
  { title: "Laad op via USB-C", description: "Kabel inbegrepen, één keer per paar weken." },
  { title: "Loop er voorbij", description: "Het licht doet de rest." },
];

export const HowItWorksSection = ({
  headline = "Hoe het werkt",
  steps = defaultSteps,
}: HowItWorksSectionProps) => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-4">
              Setup
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              {headline}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {steps.map((step, i) => (
              <div key={i} className="text-left space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-glow/10 border border-glow/30 text-glow flex items-center justify-center text-base font-semibold">
                    {i + 1}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed pl-14">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
