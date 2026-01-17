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
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Centered headline */}
          <div className="text-center mb-16 animate-fade-in-slow">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
              Ervaringen
            </p>
            
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight max-w-2xl mx-auto">
              Wat SenseGlow™ verandert in huizen zoals dat van jou
            </h2>
          </div>

          {/* Reviews grid */}
          <div className="grid md:grid-cols-3 gap-10 mb-14">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="border-t border-foreground/8 pt-8 space-y-5 animate-fade-in-slow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-glow/70 text-sm">★</span>
                  ))}
                </div>
                
                <p className="text-base font-medium text-foreground leading-relaxed">
                  "{review.text}"
                </p>
                
                <p className="text-[11px] text-foreground/40 tracking-wide">
                  — {review.author}
                </p>
              </div>
            ))}
          </div>

          {/* CTA centered */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="default"
              className="text-[11px] uppercase tracking-[0.2em] text-foreground/50 hover:text-glow transition-colors duration-500"
            >
              Zie alle ervaringen →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
