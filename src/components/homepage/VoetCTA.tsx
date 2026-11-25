import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const VoetCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-background-secondary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in-slow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Klaar om te beginnen?
          </h2>
          <p className="text-base text-foreground/75 max-w-md mx-auto">
            Vijf producten. Eén plek. Gratis verzending, 30 dagen retour.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => navigate("/producten")}
              size="lg"
              className="text-sm font-medium tracking-wide rounded-sm px-8 py-6 bg-cta text-cta-foreground hover:bg-cta-hover focus-visible:ring-cta transition-all duration-500"
            >
              Bekijk alle producten
            </Button>
            <Link
              to="/contact"
              className="text-sm text-foreground/75 hover:text-accent-ink transition-colors duration-500"
            >
              Nog vragen? Neem contact op →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
