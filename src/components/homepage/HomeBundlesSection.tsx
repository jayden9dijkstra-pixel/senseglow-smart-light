import type { ShopifyProduct } from "@/lib/shopify";
import { BundleShowcase } from "@/components/bundles/BundleShowcase";

type HomeBundlesSectionProps = {
  products: ShopifyProduct[];
  loading: boolean;
  failed: boolean;
};

export function HomeBundlesSection({ products, loading, failed }: HomeBundlesSectionProps) {
  return (
    <section className="w-full bg-background-secondary py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-foreground/40">Slim combineren</p>
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">Meer sfeer, minder betalen</h2>
          <p className="mt-4 text-base text-foreground/60 md:text-lg">Combineer 2 of meer lampen en bespaar tot 10%.</p>
        </div>
        <BundleShowcase products={products} loading={loading} failed={failed} />
      </div>
    </section>
  );
}