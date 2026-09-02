import { Link } from "react-router-dom";
import { MoonStar, ChefHat, Footprints, DoorOpen, Lamp } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";

const tiles = [
  {
    icon: MoonStar,
    title: "Nooit meer struikelen 's nachts",
    body: "Bewegingssensor-balk voor gang, slaapkamer en badkamer, zacht licht dat partners niet wakker maakt.",
    href: "/product/senseglow_ambient_motion_bar",
  },
  {
    icon: ChefHat,
    title: "Een keuken die eindelijk áf voelt",
    body: "Sfeerverlichting met golfeffect, reageert als je langsloopt, geen elektricien nodig.",
    href: "/product/senseglow_wave",
  },
  {
    icon: Footprints,
    title: "Veilig de trap op zelfs 's nachts",
    body: "Traplampen met sensor, zelfklevend gemonteerd. Voor (groot)ouders én voor kleine voetjes.",
    href: "/product/senseglow_wall_lamp",
  },
  {
    icon: DoorOpen,
    title: "Voordeur verlicht zonder kabel",
    body: "Solar buitenlamp met sensor, IP65, twee schroeven en klaar.",
    href: "/product/senseglow_solar_lantern",
  },
  {
    icon: Lamp,
    title: "Bureau dat niet als studentenkamer aanvoelt",
    body: "Touch-dimbare lamp voor late studie-sessies, magnetisch, verhuist mee.",
    href: "/product/senseglow_flex",
  },
];

interface UseCaseGridProps {
  products?: ShopifyProduct[];
}

export const UseCaseGrid = ({ products = [] }: UseCaseGridProps) => {
  const productsByHandle = new Map(products.map((product) => [product.node.handle, product]));

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
            {tiles.map(({ icon: Icon, title, body, href }, i) => {
              const handle = href.replace("/product/", "");
              const product = productsByHandle.get(handle);
              const image = product?.node.images?.edges?.[0]?.node;

              return (
                <Link
                  key={href}
                  to={href}
                  className="group text-left overflow-hidden rounded-2xl border border-foreground/8 bg-background-secondary/40 backdrop-blur-sm hover:border-glow/40 hover:bg-background-secondary/70 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_hsl(var(--glow)/0.3)] transition-all duration-500 animate-fade-in-slow"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="relative aspect-video overflow-hidden bg-muted/10">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.altText || product?.node.title || title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-glow/60" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 p-3 rounded-xl bg-background/80 text-glow backdrop-blur-sm">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="font-semibold text-lg text-foreground mb-3 leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-foreground/60 leading-relaxed mb-5">
                      {body}
                    </p>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-glow group-hover:translate-x-1 inline-block transition-transform duration-500">
                      Bekijken →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
