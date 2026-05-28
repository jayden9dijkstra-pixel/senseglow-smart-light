import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import quizSmartphone from "@/assets/quiz-smartphone.png";

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

            {/* Content - Right side */}
            <div className="space-y-8 order-2 md:text-right animate-fade-in-slow px-1">
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
                Lichtadvies
              </p>

              <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight break-words">
                Niet zeker welk product?
              </h2>

              <p className="text-base text-foreground/60 leading-relaxed md:max-w-md md:ml-auto">
                Beantwoord 3 vragen. We vertellen je welke SenseGlow bij jouw situatie past.
              </p>

              <div className="flex justify-start md:justify-end pt-2">
                <Button
                  onClick={() => navigate("/quiz")}
                  size="lg"
                  className="text-sm font-medium tracking-wide rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500"
                >
                  Start mijn lichtadvies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
