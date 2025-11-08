import lifestyle1 from "@/assets/lifestyle-1.png";
import lifestyle2 from "@/assets/lifestyle-2.png";
import lifestyle3 from "@/assets/lifestyle-3.png";
import lifestyle4 from "@/assets/lifestyle-4.png";
import lifestyle5 from "@/assets/lifestyle-5.png";
import lifestyle6 from "@/assets/lifestyle-6.png";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Emma V.",
    rating: 5,
    text: "Perfect voor onze gang. Gaat automatisch aan en geeft precies genoeg licht.",
  },
  {
    name: "Lars K.",
    rating: 5,
    text: "Mooi design en werkt perfect. Geen kabels nodig, gewoon plakken en klaar.",
  },
  {
    name: "Sophie M.",
    rating: 5,
    text: "Echt een aanrader! De warme gloed maakt het 's nachts heel aangenaam.",
  },
];

const lifestyleImages = [
  lifestyle1,
  lifestyle2,
  lifestyle3,
  lifestyle4,
  lifestyle5,
  lifestyle6,
];

export const LifestyleSection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Praktisch & Sfeervol</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ontdek hoe SenseGlow jouw huis veiliger en mooier maakt
          </p>
        </div>

        {/* Lifestyle Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-20">
          {lifestyleImages.map((img, idx) => (
            <div
              key={idx}
              className="aspect-square overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300"
            >
              <img
                src={img}
                alt={`SenseGlow lifestyle ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Wat klanten zeggen
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="bg-card border rounded-lg p-6 hover:shadow-lg hover:shadow-glow/5 transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-glow text-glow" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "{review.text}"
                </p>
                <p className="font-semibold">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
