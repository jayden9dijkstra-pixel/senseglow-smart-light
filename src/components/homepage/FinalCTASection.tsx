import { Button } from "@/components/ui/button";

export const FinalCTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-background animate-fade-in">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            Ontdek SenseGlow
          </h2>
          
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Bekijk onze producten en vind de perfecte oplossing voor jouw ruimte.
          </p>
          
          <Button
            onClick={() => {
              const productsSection = document.getElementById('products');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            size="lg"
            className="text-sm px-10 py-6 h-auto font-medium tracking-wide"
          >
            Bekijk SenseGlow
          </Button>
        </div>
      </div>
    </section>
  );
};