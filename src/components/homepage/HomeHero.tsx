import { Link } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";
import { STEP_PRODUCT_HANDLE } from "@/lib/productConfig";
import { formatPrice } from "@/lib/price";
import { responsiveImg } from "@/lib/shopifyImage";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Homepage-hero: één product, één belofte. Nachtfoto van de trap als beeld, prijs uit Shopify
 * (compare-at alleen als Shopify er een heeft), één knop naar de trappagina.
 */
export function HomeHero({ products }: { products: ShopifyProduct[] }) {
  const { localizePath } = useI18n();
  const wall = products.find((p) => p.node.handle === STEP_PRODUCT_HANDLE);
  const variants = wall?.node.variants.edges.map((e) => e.node) ?? [];
  const cheapest = variants.reduce<(typeof variants)[number] | null>((m, v) => (!m || parseFloat(v.price.amount) < parseFloat(m.price.amount) ? v : m), null);
  const price = cheapest ? parseFloat(cheapest.price.amount) : null;
  const was = cheapest?.compareAtPrice ? parseFloat(cheapest.compareAtPrice.amount) : null;
  const images = wall?.node.images?.edges?.map((e) => e.node) ?? [];
  const hero = images.find((im) => /trap/i.test(im.altText ?? "")) ?? images[0];

  return (
    <section className="night-glow relative overflow-hidden text-[#FFF8EF]">
      <div className="container grid max-w-6xl gap-6 py-6 md:grid-cols-2 md:items-center md:gap-12 md:py-16">
        <div className="order-2 space-y-4 md:order-1">
          <h1 className="text-[38px] font-extrabold leading-[1.02] md:text-7xl">Nooit meer in het donker de trap op</h1>
          <p className="max-w-md text-lg text-[#FFF8EF]/80">Trapverlichting met sensor die je zelf plakt. Geen boren, geen stroomkabel, opladen via USB-C.</p>
          {price != null && (
            <p className="flex flex-wrap items-baseline gap-3">
              <span className="text-base text-[#FFF8EF]/70">4 lampen</span>
              {was != null && was > price && <s className="text-lg text-[#FFF8EF]/50">{formatPrice(was)}</s>}
              <span className="text-3xl font-extrabold text-[#FFD89C]">{formatPrice(price)}</span>
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={localizePath(`/product/${STEP_PRODUCT_HANDLE}`)}
              className="btn-glow inline-flex h-14 items-center justify-center rounded-full px-8 text-lg font-extrabold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Bekijk de Wall Lamp-set
            </Link>
            <a href="#products" className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/30 px-8 text-base font-bold text-[#FFF8EF] hover:border-white">
              Alle producten
            </a>
          </div>
          <p className="text-sm font-semibold text-[#FFF8EF]/70">Gratis verzending in NL en BE · 30 dagen geld terug · Achteraf betalen met Klarna</p>
        </div>
        <div className="order-1 md:order-2">
          {hero ? (
            <img
              {...responsiveImg(hero.url, "(min-width: 768px) 50vw, 100vw")}
              alt={hero.altText ?? "SenseGlow trapverlichting"}
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_30px_80px_-20px_rgba(255,150,40,0.55)] md:aspect-square"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-white/10 md:aspect-square" />
          )}
        </div>
      </div>
    </section>
  );
}
