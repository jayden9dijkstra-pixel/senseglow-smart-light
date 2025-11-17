import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-brand-orange/10">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Klaar om jouw huis veiliger te maken?
          </h2>
          
          <Button
            onClick={() => {
              const productsSection = document.getElementById('products');
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            size="lg"
            className="bg-brand-orange hover:bg-brand-orange/90 text-white text-lg px-12 py-7 h-auto rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Bekijk SenseGlow™ producten
          </Button>
        </div>
      </div>
    </section>
  );
};
