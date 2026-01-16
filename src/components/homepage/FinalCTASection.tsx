import { Button } from "@/components/ui/button";

export const FinalCTASection = () => {
  return (
    <section className="py-20 md:py-28 bg-background-secondary animate-fade-in">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            Ontdek SenseGlow
          </h2>
          
          <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
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
            className="text-sm font-medium tracking-wide"
          >
            Bekijk SenseGlow
          </Button>
        </div>
      </div>
    </section>
  );
};
