import { Link } from "react-router-dom";
import { Footprints, ChefHat, Baby, Sun, Lamp } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/price";
import { HOME_TILES, HOME_TILES_HEADING, HOME_TILES_SUBTITLE } from "@/lib/homeContent";

const icons = [Footprints, ChefHat, Baby, Sun, Lamp];
const tiles = HOME_TILES.map((tile, i) => ({ ...tile, icon: icons[i] ?? Lamp }));

interface UseCaseGridProps {
  products?: ShopifyProduct[];
}

export const UseCaseGrid = ({ products = [] }: UseCaseGridProps) => {
  const productsByHandle = new Map(products.map((product) => [product.node.handle, product]));

  return (
    <section className="w-full bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div>
          <div className="text-center mb-16 animate-fade-in-slow">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-5">
              Onze producten
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight mb-4">
              {HOME_TILES_HEADING}
            </h2>
            <p className="text-base text-foreground/60">
              {HOME_TILES_SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tiles.map(({ icon: Icon, title, body, href }, i) => {
              const handle = href.replace("/product/", "");
              const product = productsByHandle.get(handle);
              // Zelfde eerste foto als productpagina en /producten.
              const image = product?.node.featuredImage ?? product?.node.images?.edges?.[0]?.node;
              const fromPrice = product?.node.priceRange?.minVariantPrice?.amount;

              return (
                <Link
                  key={href}
                  id={i === 0 ? "first-product" : undefined}
                  to={href}
                  className={`group text-left overflow-hidden rounded-sm border border-foreground/8 bg-background-secondary/40 backdrop-blur-sm hover:border-glow/40 hover:bg-background-secondary/70 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_hsl(var(--glow)/0.3)] transition-all duration-500 animate-fade-in-slow${i === 0 ? " scroll-mt-24" : ""}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                   <div className="relative aspect-square overflow-hidden bg-muted/10">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.altText || product?.node.title || title}
                         className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-glow/60" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 p-3 rounded-sm bg-background/80 text-glow backdrop-blur-sm">
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
                    {fromPrice && (
                      <p className="text-sm font-semibold text-foreground mb-4">
                        Vanaf {formatPrice(fromPrice)}
                      </p>
                    )}
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
