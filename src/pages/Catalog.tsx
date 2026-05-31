import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { PageLayout } from "@/components/layout/PageLayout";
import { ScrollToTop } from "@/components/ScrollToTop";

const Catalog = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Onze collectie, SenseGlow";
    (async () => {
      setLoading(true);
      const list = await fetchProducts(50);
      setProducts(list);
      setLoading(false);
    })();
  }, []);

  return (
    <PageLayout>
      <section className="bg-background pt-20 md:pt-28 pb-12">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-4">
              Onze collectie
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
              Verlichting die denkt.
              <br />
              Jij hoeft alleen maar te bewegen.
            </h1>
            <p className="text-base md:text-lg text-foreground/60 max-w-2xl">
              Zeven slimme lichten, elk ontworpen voor een specifieke ruimte of moment.
              Kies wat past bij jouw huis.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background pb-32">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <Loader2 className="w-6 h-6 animate-spin text-foreground/30" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-foreground/60">Geen producten gevonden.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/6 overflow-hidden rounded-2xl">
                {products.map((p) => {
                  const img = p.node.images?.edges?.[0]?.node;
                  const price = p.node.priceRange.minVariantPrice;
                  return (
                    <Link
                      key={p.node.id}
                      to={`/product/${p.node.handle}`}
                      className="group bg-background p-8 flex flex-col gap-6 transition-all duration-500 hover:bg-foreground/[0.02]"
                    >
                      <div className="aspect-square overflow-hidden rounded-xl bg-muted/10 glass">
                        {img?.url ? (
                          <img
                            src={img.url}
                            alt={img.altText || p.node.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/30">
                            Geen afbeelding
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-base font-semibold tracking-tight text-foreground group-hover:text-glow transition-colors duration-500">
                          {p.node.title}
                        </h2>
                        <p className="text-sm text-foreground/50">
                          Vanaf €{parseFloat(price.amount).toFixed(2)}
                        </p>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-glow mt-auto">
                        Bekijk product →
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <ScrollToTop />
    </PageLayout>
  );
};

export default Catalog;
