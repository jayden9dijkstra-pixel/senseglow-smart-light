import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";

const Bundles = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <section className="py-24 md:py-32 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              Bundels
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Meer lampen, minder betalen
            </h1>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
              Combineer twee of meer lampen en de korting komt er automatisch bij in de checkout.
              10% korting vanaf 2 stuks, 20% vanaf 3 en 30% vanaf 4.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button onClick={() => navigate("/producten")} className="rounded-full px-8">
                Bekijk de collectie
              </Button>
              <Button variant="ghost" onClick={() => navigate("/contact")} className="rounded-full px-6">
                Vraag advies
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Bundles;
