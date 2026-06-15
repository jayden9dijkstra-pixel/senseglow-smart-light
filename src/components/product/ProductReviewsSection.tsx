import { Card } from "@/components/ui/card";

interface Review {
  name: string;
  role: string;
  rating: number;
  text: string;
  image: string;
}

interface ProductReviewsSectionProps {
  reviews?: Review[];
}

const defaultReviews: Review[] = [
  { name: "Sarah M.", role: "Pre-launch testklant", rating: 5, image: "SM",
    text: "Mijn dochter van 5 durft nu eindelijk zelf naar de wc 's nachts. Het warme licht geeft haar vertrouwen." },
  { name: "Jan P.", role: "Pre-launch testklant", rating: 5, image: "JP",
    text: "Na een val op de trap vorig jaar wilde ik iets veranderen. Simpel, werkt perfect, en geeft mij rust." },
  { name: "Lisa K.", role: "Pre-launch testklant", rating: 5, image: "LK",
    text: "Perfect voor mijn studentenkamer. Geen gedoe met schakelaars als ik naar de gedeelde keuken ga." },
];

export const ProductReviewsSection = ({ reviews = defaultReviews }: ProductReviewsSectionProps) => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Wat onze testklanten zeggen
            </h2>
            <p className="text-base text-foreground/60">
              SenseGlow is net van start. Deze reviews zijn van vrienden en familie die onze producten als eerste hebben getest.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="p-6 bg-background border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-glow/10 text-glow flex items-center justify-center font-semibold text-sm tracking-wider">
                      {review.image}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      <p className="text-sm text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-brand-orange text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed">"{review.text}"</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

