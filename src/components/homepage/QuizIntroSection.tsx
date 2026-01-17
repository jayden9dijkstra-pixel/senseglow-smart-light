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
    <section className="py-24 md:py-32 bg-background-secondary">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Smartphone Image - Left */}
            <div className="relative flex justify-center md:justify-start order-1 animate-fade-in-slow">
              <div className="max-w-xs overflow-hidden">
                <img 
                  src={quizSmartphone}
                  alt="Smartphone met SenseGlow quiz interface"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Content - Right side, right-aligned on desktop */}
            <div className="space-y-8 order-2 md:text-right animate-fade-in-slow px-1">
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
                Persoonlijk advies
              </p>
              
              <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight">
                Welke SenseGlow™ heb jij nodig?
              </h2>
              
              <p className="text-base text-foreground/60 leading-relaxed md:max-w-md md:ml-auto">
                Elke woning is anders. Ontdek in 15 seconden welke combinatie bij jouw donkere plekken past. Geen verplichtingen, gewoon eerlijk advies.
              </p>

              {/* Location icons - aligned right on desktop */}
              <div className="flex gap-4 justify-start md:justify-end">
                {locations.map((location, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center gap-2 border border-foreground/8 px-5 py-4 rounded-xl"
                  >
                    <span className="text-xl">{location.icon}</span>
                    <span className="text-[11px] text-foreground/50 tracking-wide">{location.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-start md:justify-end pt-2">
                <Button
                  onClick={() => navigate("/quiz")}
                  size="lg"
                  className="text-sm font-medium tracking-wide rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500"
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
