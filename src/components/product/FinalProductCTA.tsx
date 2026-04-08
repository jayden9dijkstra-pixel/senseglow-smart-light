import { Button } from "@/components/ui/button";

interface FinalProductCTAProps {
  headline?: string;
  subtext?: string;
  ctaLabel?: string;
}

export const FinalProductCTA = ({
  headline = "Ontdek SenseGlow™",
  subtext = "Gratis verzending • 30 dagen retourrecht",
  ctaLabel = "Bekijk SenseGlow",
}: FinalProductCTAProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-32 bg-background-secondary animate-fade-in">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            {headline}
          </h2>
          
          <p className="text-xl text-muted-foreground">{subtext}</p>
          
          <Button
            onClick={scrollToTop}
            size="lg"
            className="text-xl px-16 py-8 h-auto rounded-full font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.4)] transition-all duration-500"
          >
            {ctaLabel}
          </Button>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-glow text-xl">✓</span>
              <span>Veilig betalen</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-glow text-xl">✓</span>
              <span>30 dagen retourrecht</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-glow text-xl">✓</span>
              <span>Nederlandse klantenservice</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
