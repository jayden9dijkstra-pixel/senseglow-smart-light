import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";
import { HOME_HERO, HOME_HERO_PRODUCT } from "@/lib/homeContent";
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
        <div className="grid items-center gap-5 pb-10 pt-4 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:py-28 animate-fade-in-slow">
          <div className="order-2 max-w-2xl md:order-1">
            <p className="text-[11px] uppercase tracking-[0.3em] text-hero-foreground/50 font-medium mb-6 hidden md:block">
              {HOME_HERO.eyebrow}
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-hero-foreground">
              {HOME_HERO.h1}
            </h1>
            <p className="mt-3 text-base md:mt-6 md:text-lg leading-relaxed text-hero-foreground/70 max-w-xl">
              {HOME_HERO.subtitle.split(". ")[0].replace(/\.?$/, ".")}
            </p>

            <div className="mt-5 md:mt-8 flex flex-col sm:flex-row sm:items-center gap-5">
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="text-sm font-medium tracking-wide rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 w-full sm:w-auto"
              >
                Bekijk de lampen
              </Button>
              <button
                onClick={() => navigate("/waarom-senseglow")}
                className="text-sm text-hero-foreground/80 underline underline-offset-4 hover:text-hero-foreground transition-colors duration-300 self-start sm:self-auto hidden md:inline"
              >
                Waarom SenseGlow
              </button>
            </div>
          </div>

          <Link
            to={`/product/${HOME_HERO_PRODUCT}`}
            className="group order-1 -mx-6 block overflow-hidden md:order-2 md:mx-0 md:md:border md:border-foreground/10 bg-background/80 shadow-lg backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1"
          >
            <div className="aspect-[4/3] w-full overflow-hidden md:aspect-square">
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
            <div className="flex items-baseline justify-between gap-3 px-6 py-3 md:px-5 md:pb-5 md:pt-4">
              <p className="font-semibold text-foreground">{product?.title ?? "\u00a0"}</p>
              {price && <p className="whitespace-nowrap text-sm text-foreground/70">Vanaf <span className="font-semibold text-primary">{formatPrice(price)}</span></p>}
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
