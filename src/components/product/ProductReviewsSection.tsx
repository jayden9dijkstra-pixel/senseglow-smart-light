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
  { name: "Sarah M.", role: "Moeder van 2", rating: 5, image: "👩",
    text: "Mijn dochter van 5 durft nu eindelijk zelf naar de wc 's nachts. Het warme licht geeft haar vertrouwen. Beste aankoop dit jaar!" },
  { name: "Jan P.", role: "Senior, 68 jaar", rating: 5, image: "👴",
    text: "Na een val op de trap vorig jaar wilde ik iets veranderen. Simpel, werkt perfect, en geeft mij rust." },
  { name: "Lisa K.", role: "Student", rating: 5, image: "👩‍🎓",
    text: "Perfect voor mijn studentenkamer. Geen gedoe met schakelaars als ik naar de gedeelde keuken ga." },
  { name: "Mark V.", role: "Vader", rating: 5, image: "👨",
    text: "Geen discussies meer over het grote licht aan 's nachts. De baby blijft slapen, wij kunnen veilig bewegen." },
  { name: "Emma R.", role: "Huiseigenaar", rating: 5, image: "👩‍💼",
    text: "Geïnstalleerd in gang, trap en badkamer. Voelt alsof ik in een high-end hotel woon." },
  { name: "Tom B.", role: "Senior, 72 jaar", rating: 5, image: "👨‍🦳",
    text: "Mijn kleinkinderen hebben dit voor mij geïnstalleerd. Wat een verschil!" },
];

export const ProductReviewsSection = ({ reviews = defaultReviews }: ProductReviewsSectionProps) => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Wat onze klanten zeggen
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-brand-orange text-2xl">⭐</span>
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">
                Gebaseerd op 1000+ reviews
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="p-6 bg-background border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{review.image}</div>
                    <div>
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      <p className="text-sm text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-brand-orange text-lg">⭐</span>
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

