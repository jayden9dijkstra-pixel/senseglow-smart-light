import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";

const Why = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <section className="py-24 md:py-32 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              Waarom SenseGlow
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Licht dat werkt zonder gedoe
            </h1>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
              Onze lampen hangen binnen een minuut. Geen boren, geen kabels, geen elektricien.
              Je plakt of magneet ze op hun plek en ze gaan aan bij beweging.
            </p>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
              Vragen? Je krijgt Nederlandse klantenservice, meestal binnen één werkdag antwoord.
              Op elke lamp zit 1 jaar garantie en je hebt 30 dagen retourrecht.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button onClick={() => navigate("/producten")} className="rounded-full px-8">
                Bekijk de collectie
              </Button>
              <Button variant="ghost" onClick={() => navigate("/over")} className="rounded-full px-6">
                Lees ons verhaal
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Why;
