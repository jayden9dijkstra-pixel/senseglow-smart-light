import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const locations = [
  { icon: "🪜", label: "Trap" },
  { icon: "🚪", label: "Gang" },
  { icon: "🛏️", label: "Slaapkamer" },
  { icon: "🚿", label: "Badkamer" }
];

export const QuizIntroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-brand-orange text-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Welke SenseGlow™ heb jij nodig?
                </h2>
                
                <p className="text-xl text-white/90">
                  Elke woning is anders. Ontdek in 15 seconden welke combinatie bij jouw donkere plekken past.
                </p>
              </div>

              {/* Location icons */}
              <div className="grid grid-cols-2 gap-4">
                {locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-3xl">{location.icon}</span>
                    <span className="font-medium">{location.label}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => navigate("/quiz")}
                size="lg"
                className="bg-white text-brand-orange hover:bg-white/90 text-lg px-12 py-7 h-auto rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Start mijn 15-seconden Lichtadvies
              </Button>
            </div>

            {/* Right - Placeholder voor smartphone mockup */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[9/16] max-w-sm mx-auto bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl">📱</div>
                  <p className="text-sm text-white/70">
                    [Smartphone met quiz-vraag mockup]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
