import { Button } from "@/components/ui/button";

const reviews = [
  {
    text: "Mijn dochter durft eindelijk zelf naar de wc.",
    author: "Sarah, moeder van 2"
  },
  {
    text: "Geen ruzie meer over felle lichten midden in de nacht.",
    author: "Mark, vader"
  },
  {
    text: "Mijn ouders voelen zich 10× veiliger op de trap.",
    author: "Lisa, dochter"
  }
];

export const ReviewsTeaserSection = () => {
  return (
    <section className="py-12 md:py-20 bg-background animate-fade-in">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="text-left mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Wat SenseGlow™ verandert in huizen zoals dat van jou:
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-foreground/10 mb-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-background p-6 space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-glow text-sm">⭐</span>
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

          <div className="text-left">
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