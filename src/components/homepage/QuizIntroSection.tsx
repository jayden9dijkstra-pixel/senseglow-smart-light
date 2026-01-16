import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import quizSmartphone from "@/assets/quiz-smartphone.png";

const locations = [
  { icon: "🪜", label: "Trap" },
  { icon: "🚪", label: "Gang" },
  { icon: "🛏️", label: "Slaapkamer" },
  { icon: "🚿", label: "Badkamer" }
];

export const QuizIntroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-background-secondary animate-fade-in">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Smartphone Image - Left */}
            <div className="relative flex justify-center md:justify-start order-1">
              <div className="max-w-xs overflow-hidden">
                <img 
                  src={quizSmartphone}
                  alt="Smartphone met SenseGlow quiz interface"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Content - Right side, right-aligned on desktop */}
            <div className="space-y-7 order-2 md:text-right">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                Welke SenseGlow™ heb jij nodig?
              </h2>
              
              <p className="text-base text-muted-foreground leading-relaxed max-w-md md:ml-auto">
                Elke woning is anders. Ontdek in 15 seconden welke combinatie bij jouw donkere plekken past. Geen verplichtingen, gewoon eerlijk advies.
              </p>

              {/* Location icons - aligned right on desktop */}
              <div className="flex gap-3 justify-start md:justify-end">
                {locations.map((location, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center gap-1.5 border border-foreground/10 px-4 py-3 rounded-lg"
                  >
                    <span className="text-xl">{location.icon}</span>
                    <span className="text-xs text-foreground/60">{location.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-start md:justify-end pt-2">
                <Button
                  onClick={() => navigate("/quiz")}
                  size="lg"
                  className="text-sm font-medium tracking-wide"
                >
                  Start mijn Lichtadvies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
