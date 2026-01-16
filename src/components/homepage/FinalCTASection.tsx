import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-background-secondary animate-fade-in">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Ontdek SenseGlow
          </h2>
          
          <div className="flex justify-center">
            <Button
              onClick={() => {
                const productsSection = document.getElementById('products');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              size="lg"
              className="bg-secondary text-secondary-foreground text-lg px-12 py-7 h-auto rounded-full font-semibold shadow-xl hover:shadow-[0_0_30px_hsl(var(--glow)/0.4)] transition-all duration-300"
            >
              Bekijk SenseGlow
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
