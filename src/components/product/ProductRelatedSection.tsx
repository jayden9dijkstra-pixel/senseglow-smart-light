import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/price";

interface ProductRelatedSectionProps {
  currentHandle: string;
}

export function ProductRelatedSection({ currentHandle }: ProductRelatedSectionProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProducts(50)
      .then((catalog) => {
        if (active) setProducts(catalog.filter((item) => item.node.handle !== currentHandle).slice(0, 3));
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [currentHandle]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full overflow-hidden bg-background-secondary py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-foreground/40">
            Vaak samen gekocht
          </p>
          <h2 className="text-2xl font-bold leading-tight text-foreground md:text-3xl">
            Licht voor de rest van je huis
          </h2>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const image = product.node.images.edges[0]?.node;
              const price = formatPrice(product.node.priceRange.minVariantPrice.amount);
              return (
                <Link
                  key={product.node.id}
                  to={`/product/${product.node.handle}`}
                  className="group overflow-hidden rounded-md border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {image && (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-foreground">{product.node.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Vanaf {price}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 flex-none text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}