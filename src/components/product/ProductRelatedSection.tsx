import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import stairsImg from "@/assets/stairs-safety-glow.png";
import lifestyle2 from "@/assets/lifestyle-2.png";
import lifestyle4 from "@/assets/lifestyle-4.png";
import lifestyle5 from "@/assets/lifestyle-5.png";
import ambient30 from "@/assets/senseglow-30cm.jpg";

type RelatedProduct = {
  handle: string;
  name: string;
  tagline: string;
  priceFrom: string;
  image: string;
};

const RELATED_MAP: Record<string, RelatedProduct[]> = {
  senseglow_ambient_motion_bar: [
    {
      handle: "senseglow_wall_lamp",
      name: "Wall Lamp",
      tagline: "Voor de trap en gang",
      priceFrom: "€34,95",
      image: stairsImg,
    },
    {
      handle: "senseglow_wave",
      name: "Wave",
      tagline: "Sfeer voor keuken & woonkamer",
      priceFrom: "€24,95",
      image: lifestyle2,
    },
  ],
  senseglow_wave: [
    {
      handle: "senseglow_ambient_motion_bar",
      name: "Ambient Motion Bar",
      tagline: "Functioneel sensorlicht voor de gang",
      priceFrom: "€24,95",
      image: ambient30,
    },
    {
      handle: "senseglow_flex",
      name: "Flex",
      tagline: "Touch-dimbare accentwandlamp",
      priceFrom: "€59,95",
      image: lifestyle5,
    },
  ],
  senseglow_wall_lamp: [
    {
      handle: "senseglow_ambient_motion_bar",
      name: "Ambient Motion Bar",
      tagline: "Voor de gang of slaapkamer",
      priceFrom: "€24,95",
      image: ambient30,
    },
    {
      handle: "senseglow_solar_lantern",
      name: "Solar Lantern",
      tagline: "Buiten-veiligheid, geen bekabeling",
      priceFrom: "€39,95",
      image: lifestyle4,
    },
  ],
  senseglow_solar_lantern: [
    {
      handle: "senseglow_wall_lamp",
      name: "Wall Lamp",
      tagline: "Veiligheid binnen op de trap",
      priceFrom: "€34,95",
      image: stairsImg,
    },
    {
      handle: "senseglow_ambient_motion_bar",
      name: "Ambient Motion Bar",
      tagline: "Voor de gang of slaapkamer",
      priceFrom: "€24,95",
      image: ambient30,
    },
  ],
  senseglow_flex: [
    {
      handle: "senseglow_wave",
      name: "Wave",
      tagline: "Sfeer-accent voor de wand",
      priceFrom: "€24,95",
      image: lifestyle2,
    },
    {
      handle: "senseglow_ambient_motion_bar",
      name: "Ambient Motion Bar",
      tagline: "Functioneel sensorlicht erbij",
      priceFrom: "€24,95",
      image: ambient30,
    },
  ],
};

type Props = {
  currentHandle: string;
};

export function ProductRelatedSection({ currentHandle }: Props) {
  const related = RELATED_MAP[currentHandle] ?? [];
  if (related.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container max-w-6xl">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-4">
            Vaak gekocht ernaast
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight mb-5">
            Maak je verlichting compleet
          </h2>
          <p className="text-base leading-relaxed text-foreground/60">
            Combineer met 1 of meer producten en je krijgt automatisch 10% korting vanaf 2 stuks, 20% vanaf 3, 30% vanaf 4 — over alle producten heen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {related.map((item) => (
            <Link
              key={item.handle}
              to={`/product/${item.handle}`}
              className="group block rounded-3xl overflow-hidden bg-background-secondary border border-foreground/8 hover:border-foreground/20 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:p-8 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-3">{item.tagline}</p>
                  <p className="text-sm font-medium text-foreground/80">
                    Vanaf {item.priceFrom}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
