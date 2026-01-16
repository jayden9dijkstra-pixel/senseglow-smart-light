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
    <section className="py-12 md:py-20 bg-background-secondary animate-fade-in">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Content - Left aligned */}
            <div className="space-y-6 text-left">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  Welke SenseGlow™ heb jij nodig?
                </h2>
                
                <p className="text-base text-muted-foreground leading-relaxed">
                  Elke woning is anders. Ontdek in 15 seconden welke combinatie bij jouw donkere plekken past.
                </p>
              </div>

              {/* Location icons */}
              <div className="grid grid-cols-4 gap-3 max-w-sm">
                {locations.map((location, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center gap-1 border border-foreground/10 p-3"
                  >
                    <span className="text-2xl">{location.icon}</span>
                    <span className="font-medium text-xs text-foreground/70">{location.label}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => navigate("/quiz")}
                size="lg"
                className="text-sm px-10 py-6 h-auto font-medium tracking-wide"
              >
                Start mijn Lichtadvies
              </Button>
            </div>

            {/* Smartphone Image */}
            <div className="relative flex justify-center md:justify-end">
              <div className="max-w-xs overflow-hidden">
                <img 
                  src={quizSmartphone}
                  alt="Smartphone met SenseGlow quiz interface"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};