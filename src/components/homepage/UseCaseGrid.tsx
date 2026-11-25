import { responsiveImg } from "@/lib/shopifyImage";
import { Link } from "react-router-dom";
import { Footprints, ChefHat, Moon, Sun, Lamp } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/price";
import { HOME_TILES, HOME_TILES_HEADING, HOME_TILES_SUBTITLE, homeTileImage, tileHandle } from "@/lib/homeContent";

const icons = [Footprints, ChefHat, Moon, Sun, Lamp];
const tiles = HOME_TILES.map((tile, i) => ({ ...tile, icon: icons[i] ?? Lamp }));

interface UseCaseGridProps {
  products?: ShopifyProduct[];
}

export const UseCaseGrid = ({ products = [] }: UseCaseGridProps) => {
  const productsByHandle = new Map(products.map((product) => [product.node.handle, product]));

  return (
    <section className="w-full bg-background-secondary py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div>
          <div className="text-center mb-16 animate-fade-in-slow">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/75 font-medium mb-5">
              Onze producten
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2.5rem] font-bold text-foreground leading-tight mb-4">
              {HOME_TILES_HEADING}
            </h2>
            <p className="text-base text-foreground/75">
              {HOME_TILES_SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
            {tiles.map(({ icon: Icon, productName, title, body, href, ...rest }, i) => {
              const handle = tileHandle({ href, ...rest });
              const product = productsByHandle.get(handle);
              const image = homeTileImage(
                rest,
                product?.node.images?.edges?.map((edge) => edge.node) ?? [],
                product?.node.featuredImage,
              );
              const fromPrice = product?.node.priceRange?.minVariantPrice?.amount;
              const desktopPosition = i === 3 ? " lg:col-start-2" : i === 4 ? " lg:col-start-4" : "";

              return (
                <Link
                  key={href}
                  id={i === 0 ? "first-product" : undefined}
                  to={href}
                  className={`group text-left overflow-hidden rounded-lg border border-border/70 bg-background hover:border-glow/40 hover:-translate-y-1 hover:shadow-[0_10px_40px_-15px_hsl(var(--glow)/0.3)] transition-all duration-500 animate-fade-in-slow lg:col-span-2${desktopPosition}${i === 0 ? " scroll-mt-24" : ""}`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-background-secondary">
                    {image?.url ? (
                      <img
                        {...responsiveImg(image.url, "(min-width: 768px) 33vw, 100vw")}
                        alt={image.altText || product?.node.title || title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-accent-ink" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 p-3 rounded-sm bg-background/80 text-accent-ink backdrop-blur-sm">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="p-7">
                    <p className="mb-2 text-sm font-medium text-accent-ink">{productName}</p>
                    <h3 className="font-semibold text-lg text-foreground mb-3 leading-snug">
                      {title}
                    </h3>
                    <p className="text-sm text-foreground/75 leading-relaxed mb-5">
                      {body}
                    </p>
                    {fromPrice && (
                      <p className="text-sm font-semibold text-foreground mb-4">
                        Vanaf {formatPrice(fromPrice)}
                      </p>
                    )}
                    <span className="text-sm font-medium text-accent-ink group-hover:translate-x-1 inline-block transition-transform duration-500">
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
