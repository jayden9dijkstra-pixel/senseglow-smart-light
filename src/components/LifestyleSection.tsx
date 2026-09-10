import lifestyle1 from "@/assets/lifestyle-1.png";
import lifestyle2 from "@/assets/lifestyle-2.png";
import lifestyle3 from "@/assets/lifestyle-3.png";
import lifestyle4 from "@/assets/lifestyle-4.png";
import lifestyle5 from "@/assets/lifestyle-5.png";
import lifestyle6 from "@/assets/lifestyle-6.png";

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
            Zie hoe SenseGlow jouw huis veiliger en mooier maakt
          </p>
        </div>

        {/* Lifestyle Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

      </div>
    </section>
  );
};
