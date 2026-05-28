import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const VoetCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-24 bg-background-secondary">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in-slow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Klaar om te beginnen?
          </h2>
          <p className="text-base text-foreground/60 max-w-md mx-auto">
            Vijf producten. Eén plek. Gratis verzending, 30 dagen retour.
          </p>
          <Button
            onClick={() => navigate("/producten")}
            size="lg"
            className="text-sm font-medium tracking-wide rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500"
          >
            Bekijk alle producten
          </Button>
        </div>
      </div>
    </section>
  );
};
