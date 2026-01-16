import { Button } from "@/components/ui/button";

const reviews = [
  {
    text: "Mijn dochter durft eindelijk zelf naar de wc. Ze is niet meer bang in het donker.",
    author: "Sarah, moeder van 2"
  },
  {
    text: "Geen ruzie meer over felle lichten midden in de nacht. Iedereen slaapt door.",
    author: "Mark, vader"
  },
  {
    text: "Mijn ouders voelen zich 10× veiliger op de trap. Dat geeft mij rust.",
    author: "Lisa, dochter"
  }
];

export const ReviewsTeaserSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background animate-fade-in">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Centered headline */}
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight max-w-2xl mx-auto">
              Wat SenseGlow™ verandert in huizen zoals dat van jou
            </h2>
          </div>

          {/* Reviews grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="border-t border-foreground/10 pt-6 space-y-4"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-glow/80 text-sm">⭐</span>
                  ))}
                </div>
                
                <p className="text-base font-medium text-foreground leading-relaxed">
                  "{review.text}"
                </p>
                
                <p className="text-xs text-muted-foreground">
                  — {review.author}
                </p>
              </div>
            ))}
          </div>

          {/* CTA centered */}
          <div className="text-center">
            <Button 
              variant="outline" 
              size="default"
              className="text-xs uppercase tracking-[0.15em]"
            >
              Zie alle ervaringen →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
