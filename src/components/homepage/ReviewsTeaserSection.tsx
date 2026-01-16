import { Card } from "@/components/ui/card";
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
    <section className="py-20 md:py-32 bg-background-secondary animate-fade-in">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Wat SenseGlow™ verandert in huizen zoals dat van jou:
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {reviews.map((review, index) => (
              <Card key={index} className="p-8 bg-background border-border transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-glow text-xl">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-lg font-medium text-foreground leading-relaxed">
                    "{review.text}"
                  </p>
                  
                  <p className="text-sm text-muted-foreground">
                    — {review.author}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="border-glow text-glow hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Zie alle ervaringen →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
