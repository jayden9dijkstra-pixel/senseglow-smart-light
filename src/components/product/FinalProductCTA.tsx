import { Button } from "@/components/ui/button";

export const FinalProductCTA = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-brand-orange/10">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Maak jouw huis veilig — nog vóór vanavond.
          </h2>
          
          <p className="text-xl text-muted-foreground">
            Gratis verzending • Voor 23:00 besteld, vandaag verstuurd • 30 dagen retourrecht
          </p>
          
          <Button
            onClick={scrollToTop}
            size="lg"
            className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xl px-16 py-8 h-auto rounded-full font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            Bestel SenseGlow™
          </Button>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-brand-orange text-xl">✓</span>
              <span>Veilig betalen</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-orange text-xl">✓</span>
              <span>30 dagen retourrecht</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-orange text-xl">✓</span>
              <span>Nederlandse klantenservice</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
