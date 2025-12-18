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
    <section className="py-20 md:py-32 bg-brand-orange text-white">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 text-center md:text-left">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  Welke SenseGlow™ heb jij nodig?
                </h2>
                
                <p className="text-xl text-white/90">
                  Elke woning is anders. Ontdek in 15 seconden welke combinatie bij jouw donkere plekken past.
                </p>
              </div>

              {/* Location icons */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:mx-0">
                {locations.map((location, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <span className="text-3xl">{location.icon}</span>
                    <span className="font-medium text-sm">{location.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center md:justify-start">
                <Button
                  onClick={() => navigate("/quiz")}
                  size="lg"
                  className="bg-white text-brand-orange hover:bg-white/90 text-lg px-12 py-7 h-auto rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Start mijn 15-seconden Lichtadvies
                </Button>
              </div>
            </div>

            {/* Smartphone Image */}
            <div className="relative flex justify-center">
              <div className="rounded-3xl overflow-hidden shadow-2xl max-w-sm">
                <img 
                  src={quizSmartphone}
                  alt="Smartphone met SenseGlow quiz interface"
                  className="w-full h-auto"
                />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/20 blur-3xl -z-10 scale-75" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
