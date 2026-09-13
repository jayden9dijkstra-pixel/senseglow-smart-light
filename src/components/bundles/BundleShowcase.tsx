import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShopifyProduct } from "@/lib/shopify";
import { BUNDLES, BundleDefinition, formatBundlePrice } from "@/lib/bundles";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

type BundleShowcaseProps = {
  products: ShopifyProduct[];
  loading?: boolean;
  failed?: boolean;
  immersive?: boolean;
};

const getBundleProducts = (bundle: BundleDefinition, byHandle: Map<string, ShopifyProduct>) =>
  bundle.handles.map((handle) => byHandle.get(handle)).filter((product): product is ShopifyProduct => Boolean(product));

export function BundleShowcase({ products, loading, failed, immersive = false }: BundleShowcaseProps) {
  const addItem = useCartStore((state) => state.addItem);
  const byHandle = new Map(products.map((product) => [product.node.handle, product]));

  const addBundle = (bundle: BundleDefinition) => {
    const picked = getBundleProducts(bundle, byHandle);
    if (picked.length !== bundle.handles.length) return;

    picked.forEach((product) => {
      const variant = product.node.variants.edges[0]?.node;
      if (!variant) return;
      addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
        isBundle: true,
        bundleName: bundle.name,
        bundleVariantLabel: product.node.title,
        bundlePackSize: bundle.packSize,
        bundleRate: bundle.rate,
        bundleDiscountCode: bundle.code,
      });
    });
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (failed) {
    return <p className="py-12 text-center text-muted-foreground">De bundels konden nu niet geladen worden. Probeer het later opnieuw.</p>;
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6", immersive ? "xl:grid-cols-3" : "lg:grid-cols-3")}>
      {BUNDLES.map((bundle, index) => {
        const picked = getBundleProducts(bundle, byHandle);
        const available = picked.length === bundle.handles.length;
        const fullPrice = picked.reduce((sum, product) => sum + Number(product.node.priceRange.minVariantPrice.amount), 0);
        const bundlePrice = fullPrice * (1 - bundle.rate);
        const savings = fullPrice - bundlePrice;
        const images = picked.map((product) => product.node.images.edges[0]?.node).filter(Boolean);

        return (
          <article
            key={bundle.id}
            className={cn(
              "group relative isolate flex min-h-[34rem] overflow-hidden rounded-lg border border-primary/20 bg-secondary shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_55px_-18px_hsl(var(--glow)/0.3)] motion-safe:animate-bundle-rise",
              immersive && "min-h-[40rem]"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 -z-20 grid grid-cols-2 bg-gradient-to-br from-secondary via-background-secondary to-primary/20">
              {images.slice(0, 4).map((image, imageIndex) => image && (
                <img
                  key={`${image.url}-${imageIndex}`}
                  src={image.url}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "h-full w-full object-cover opacity-75 drop-shadow-xl transition-all duration-700 group-hover:scale-105 group-hover:opacity-90",
                    images.length === 2 && "col-span-1",
                    images.length === 1 && "col-span-2"
                  )}
                />
              ))}
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/85 to-background/10" />

            <div className="flex w-full flex-col justify-end p-6 md:p-8">
              <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold uppercase text-primary-foreground shadow-lg">
                <Sparkles className="h-3.5 w-3.5" /> Bespaar {Math.round(bundle.rate * 100)}%
              </span>

              <div className="mb-5 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="flex flex-wrap items-center gap-2">
                  {picked.map((product, productIndex) => (
                    <div key={product.node.handle} className="contents">
                      {productIndex > 0 && <span className="font-bold text-primary">+</span>}
                      <Link to={`/product/${product.node.handle}`} className="rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm hover:text-primary">
                        {product.node.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <p className="mb-2 text-sm text-foreground/70">{bundle.tagline}</p>
              <h3 className="text-3xl font-bold text-foreground">{bundle.name}</h3>

              {available && (
                <div className="mt-5 rounded-md border border-foreground/10 bg-background/75 p-4 backdrop-blur-md">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-sm text-muted-foreground line-through">Los: {formatBundlePrice(fullPrice)}</span>
                    <span className="text-2xl font-bold text-primary">Samen: {formatBundlePrice(bundlePrice)}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-green-700 dark:text-green-400">
                    Je bespaart {formatBundlePrice(savings)} ({Math.round(bundle.rate * 100)}%)
                  </p>
                </div>
              )}

              <Button
                onClick={() => addBundle(bundle)}
                disabled={!available}
                size="lg"
                className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Voeg toe{available ? ` voor ${formatBundlePrice(bundlePrice)}` : ""}
              </Button>
            </div>
          </article>
        );
      })}
      {!immersive && (
        <Button asChild variant="link" className="lg:col-span-3 mx-auto mt-2">
          <Link to="/bundels">Bekijk alle bundels <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      )}
    </div>
  );
}