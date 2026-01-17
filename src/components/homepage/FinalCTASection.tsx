import { Button } from "@/components/ui/button";

export const FinalCTASection = () => {
  return (
    <section className="py-24 md:py-32 bg-background-secondary">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-slow">
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
            Ontdek
          </p>
          
          <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight">
            Ontdek SenseGlow
          </h2>
          
          <p className="text-base text-foreground/60 max-w-lg mx-auto leading-relaxed">
            Bekijk onze producten en vind de perfecte oplossing voor jouw ruimte. Geen gedoe, geen verbouwing — alleen veilig licht precies waar je het nodig hebt.
          </p>
          
          <Button
            onClick={() => {
              const productsSection = document.getElementById('products');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            size="lg"
            variant="outline"
            className="text-sm font-medium tracking-wide rounded-full px-8 py-6 border-foreground/20 bg-foreground/5 hover:bg-glow/10 hover:border-glow/30 hover:shadow-[0_0_30px_-5px_hsl(var(--glow)/0.3)] transition-all duration-500"
          >
            Bekijk SenseGlow
          </Button>
        </div>
      </div>
    </section>
  );
};
