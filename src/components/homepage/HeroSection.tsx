import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";
import { HOME_HERO, HOME_HERO_PRODUCT } from "@/lib/homeContent";
import { OFFER_TEXT } from "@/lib/quantityOffer";
import { formatPrice } from "@/lib/price";

export const HeroSection = ({ products = [] }: { products?: ShopifyProduct[] }) => {
  const navigate = useNavigate();
  const product = products.find((p) => p.node.handle === HOME_HERO_PRODUCT)?.node;
  const image = product?.featuredImage ?? product?.images?.edges?.[0]?.node;
  const price = product?.priceRange?.minVariantPrice?.amount;

  const scrollToProducts = () => {
    const el = document.getElementById("first-product") || document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate("/producten");
  };

  return (
    <section className="relative isolate overflow-hidden hero-gradient">
      <div className="absolute inset-0 -z-10 hero-gradient-overlay" />
      <div className="container">
        <div className="grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-28 animate-fade-in-slow">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-hero-foreground/50 font-medium mb-6">
              {HOME_HERO.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-hero-foreground">
              {HOME_HERO.h1}
            </h1>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-hero-foreground/70 max-w-xl">
              {HOME_HERO.subtitle}
            </p>
            <p className="mt-4 text-sm font-medium text-hero-foreground">{OFFER_TEXT}</p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="text-sm font-medium tracking-wide rounded-sm px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 w-full sm:w-auto"
              >
                Bekijk de collectie
              </Button>
              <button
                onClick={() => navigate("/waarom-senseglow")}
                className="text-sm text-hero-foreground/80 underline underline-offset-4 hover:text-hero-foreground transition-colors duration-300 self-start sm:self-auto"
              >
                Waarom SenseGlow
              </button>
            </div>
          </div>

          <Link
            to={`/product/${HOME_HERO_PRODUCT}`}
            className="group block rounded-3xl border border-foreground/10 bg-background/80 p-5 shadow-lg backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1"
          >
            <div className="aspect-square w-full overflow-hidden rounded-2xl">
              {image ? (
                <img
                  src={image.url}
                  alt={image.altText || product?.title || ""}
                  loading="eager"
                  {...{ fetchpriority: "high" }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full animate-pulse" />
              )}
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <p className="font-semibold text-foreground">{product?.title ?? "\u00a0"}</p>
              {price && <p className="whitespace-nowrap text-sm text-foreground/70">Vanaf <span className="font-semibold text-primary">{formatPrice(price)}</span></p>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">2 lampen 10%, 4+ lampen 15% korting</p>
          </Link>
        </div>
      </div>
    </section>
  );
};
