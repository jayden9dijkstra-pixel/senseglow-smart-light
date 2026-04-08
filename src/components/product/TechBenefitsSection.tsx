import { Card } from "@/components/ui/card";

interface TechBenefit {
  icon: string;
  tech: string;
  benefit: string;
}

interface TechBenefitsSectionProps {
  headline?: string;
  benefits?: TechBenefit[];
}

const defaultBenefits: TechBenefit[] = [
  { icon: "🌡️", tech: "2700K warm licht", benefit: "Beter voor melatonine productie en slaapkwaliteit" },
  { icon: "📡", tech: "3–5 meter sensorbereik", benefit: "Reageert precies op jou, niet op huisdieren" },
  { icon: "⚡", tech: "30 seconden installatie", benefit: "3M tape + magnetisch bevestigingssysteem" },
  { icon: "🔋", tech: "USB-C oplaadbaar", benefit: "Duurzaam, geen batterijen nodig" },
  { icon: "⏱️", tech: "Tot 60 dagen gebruik", benefit: "Zuinig sensor ontwerp bespaart energie" },
];

export const TechBenefitsSection = ({
  headline = "Smart technologie die werkt voor jou",
  benefits = defaultBenefits,
}: TechBenefitsSectionProps) => {
  return (
    <section className="py-20 md:py-32 bg-muted/20">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{headline}</h2>
          </div>
          <div className="space-y-6">
            {benefits.map((item, index) => (
              <Card key={index} className="p-6 md:p-8 bg-background border-border hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="text-5xl flex-shrink-0">{item.icon}</div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{item.tech}</h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{item.benefit}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
