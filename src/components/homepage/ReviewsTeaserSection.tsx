import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    name: "Sarah M.",
    product: "Ambient Motion Bar",
    handle: "senseglow_ambient_motion_bar",
    text: "Mijn dochter (5) durft eindelijk zelf naar de wc 's nachts. Het warme licht geeft haar vertrouwen.",
  },
  {
    name: "Lieke V.",
    product: "Wave",
    handle: "senseglow_wave",
    text: "Mijn keuken voelt eindelijk áf. Dat ene puzzelstukje dat ik niet wist dat het miste.",
  },
  {
    name: "Marieke H.",
    product: "Wall Lamp",
    handle: "senseglow_wall_lamp",
    text: "Voor mijn moeder van 76. Ze gebruikt ze elke nacht. Mijn beste cadeau dit jaar.",
  },
  {
    name: "Robert J.",
    product: "Solar Lantern",
    handle: "senseglow_solar_lantern",
    text: "Een aan de voordeur, een aan de achterdeur. Mijn vrouw voelt zich eindelijk veilig als ze 's avonds laat thuiskomt.",
  },
  {
    name: "Mila R.",
    product: "Flex",
    handle: "senseglow_flex",
    text: "Mijn bureau ziet er eindelijk niet meer uit als een studentenkamer. Late-night essay schrijven is veel chiller met dim-licht.",
  },
];

export const ReviewsTeaserSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-slow">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
              Ervaringen
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight max-w-2xl mx-auto">
              Wat klanten zeggen, per product
            </h2>
          </div>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {reviews.map((review) => (
                <CarouselItem
                  key={review.name}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full p-7 rounded-2xl border border-foreground/8 bg-background-secondary/40 backdrop-blur-sm flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-glow/70 text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-base font-medium text-foreground leading-relaxed mb-5 flex-1">
                      "{review.text}"
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-foreground/70">, {review.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/40">
                        SenseGlow {review.product}
                      </p>
                      <button
                        onClick={() => navigate(`/product/${review.handle}`)}
                        className="text-[11px] uppercase tracking-[0.18em] text-glow hover:text-glow/80 transition-colors pt-1"
                      >
                        Lees meer reviews →
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
