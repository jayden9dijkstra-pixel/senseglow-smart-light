import { useNavigate } from "react-router-dom";
import { MoonStar, ChefHat, Footprints, DoorOpen, Lamp } from "lucide-react";

const tiles = [
  {
    icon: MoonStar,
    title: "Nooit meer struikelen 's nachts",
    body: "Bewegingssensor-balk voor gang, slaapkamer en badkamer — zacht licht dat partners niet wakker maakt.",
    href: "/product/senseglow_ambient_motion_bar",
  },
  {
    icon: ChefHat,
    title: "Een keuken die eindelijk áf voelt",
    body: "Sfeerverlichting met golfeffect — reageert als je langsloopt, geen elektricien nodig.",
    href: "/product/senseglow_wave",
  },
  {
    icon: Footprints,
    title: "Veilig de trap op — ook 's nachts",
    body: "Traplampen met sensor, zelfklevend gemonteerd. Voor (groot)ouders én voor kleine voetjes.",
    href: "/product/senseglow_wall_lamp",
  },
  {
    icon: DoorOpen,
    title: "Voordeur verlicht zonder kabel",
    body: "Solar buitenlamp met sensor, IP65 — twee schroeven en klaar.",
    href: "/product/senseglow_solar_lantern",
  },
  {
    icon: Lamp,
    title: "Bureau dat niet als studentenkamer aanvoelt",
    body: "Touch-dimbare lamp voor late studie-sessies — magnetisch, verhuist mee.",
    href: "/product/senseglow_flex",
  },
];

export const UseCaseGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-slow">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
              Onze producten
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight mb-4">
              Voor elke kamer een ander licht
            </h2>
            <p className="text-base text-foreground/60">
              Vijf producten. Vijf concrete problemen opgelost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tiles.map(({ icon: Icon, title, body, href }, i) => (
              <button
                key={href}
                onClick={() => navigate(href)}
                className="group text-left p-7 rounded-2xl border border-foreground/8 bg-background-secondary/40 backdrop-blur-sm hover:border-glow/40 hover:bg-background-secondary/70 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_hsl(var(--glow)/0.3)] transition-all duration-500 animate-fade-in-slow"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="p-3 bg-glow/10 rounded-xl w-fit mb-5">
                  <Icon className="h-6 w-6 text-glow" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-3 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed mb-5">
                  {body}
                </p>
                <span className="text-[11px] uppercase tracking-[0.2em] text-glow group-hover:translate-x-1 inline-block transition-transform duration-500">
                  Bekijken →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
