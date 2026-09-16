import { Link } from "react-router-dom";
import { MoonStar, ChefHat, Footprints, DoorOpen, Lamp } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import wallLampHomepageAsset from "@/assets/wall-lamp-homepage-square.png.asset.json";
import waveHomepageAsset from "@/assets/wave-homepage-square.png.asset.json";
import ambientHomepageAsset from "@/assets/ambient-homepage-square.png.asset.json";
import flexHomepageImage from "@/assets/ba/flex-on.jpg";
import lanternHomepageImage from "@/assets/ba/lantern-on.jpg";
import { useI18n } from "@/i18n/I18nProvider";

const homepageImages: Record<string, { url: string; altText: string }> = {
  senseglow_wall_lamp: {
    url: wallLampHomepageAsset.url,
    altText: "SenseGlow Wall Lamp naast een bed",
  },
  senseglow_wave: {
    url: waveHomepageAsset.url,
    altText: "SenseGlow Wave onder een wandplank",
  },
  senseglow_ambient_motion_bar: {
    url: ambientHomepageAsset.url,
    altText: "SenseGlow Ambient Bar boven een wastafel",
  },
  senseglow_solar_lantern: {
    url: lanternHomepageImage,
    altText: "SenseGlow Solar Lantern met warm licht buiten",
  },
  senseglow_flex: {
    url: flexHomepageImage,
    altText: "SenseGlow Flex met warm licht op een bureau",
  },
};

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
  const { t, localizePath } = useI18n();
  const productsByHandle = new Map(products.map((product) => [product.node.handle, product]));

  return (
    <section className="w-full bg-background py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div>
          <div className="text-center mb-8 md:mb-10 animate-fade-in-slow">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-3">
              {t("Onze producten")}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2.35rem] font-bold text-foreground leading-tight mb-2">
              {t("Voor elke kamer een ander licht")}
            </h2>
            <p className="text-sm md:text-base text-foreground/60">
              {t("Vijf producten. Vijf concrete problemen opgelost.")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 gap-2.5 md:gap-3 lg:h-[31rem]">
            {tiles.map(({ icon: Icon, title, body, href }, i) => {
              const handle = href.replace("/product/", "");
              const product = productsByHandle.get(handle);
              const image = homepageImages[handle] || product?.node.images?.edges?.[0]?.node;
              const price = product?.node.priceRange.minVariantPrice.amount;
              const desktopPlacement = i === 0
                ? "lg:col-span-8"
                : i === 1
                  ? "lg:col-span-4"
                  : "lg:col-span-4";

              return (
                <Link
                  key={href}
                  to={localizePath(href)}
                  className={`group relative overflow-hidden rounded-sm border border-border bg-background-secondary transition-colors duration-500 animate-fade-in-slow ${desktopPlacement} ${i === 0 ? "col-span-2 h-[14rem] sm:h-[17rem] lg:h-auto" : "col-span-1 h-[12rem] sm:h-[15rem] lg:h-auto"}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="absolute inset-0 overflow-hidden bg-muted/10">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.altText || product?.node.title || title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-glow/60" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/10 to-transparent transition-colors duration-500 group-hover:from-primary" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 text-primary-foreground">
                    <div className="mb-1.5 flex items-center gap-2 text-accent">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {price && (
                        <span className="text-[10px] uppercase tracking-[0.16em] text-primary-foreground/75">
                          {t("Vanaf")} €{parseFloat(price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[15px] sm:text-lg leading-snug">
                      {t(title)}
                    </h3>
                    <p className={`mt-1 text-xs leading-snug text-primary-foreground/75 ${i === 0 ? "line-clamp-2" : "hidden sm:line-clamp-2"}`}>
                      {t(body)}
                    </p>
                    <span className="mt-2 inline-block text-[9px] uppercase tracking-[0.18em] text-primary-foreground/85 group-hover:text-accent transition-colors duration-300">
                      {t("Bekijken")} →
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
