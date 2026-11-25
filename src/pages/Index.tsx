import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLayout } from "@/components/layout/PageLayout";
import { HomeHero } from "@/components/homepage/HomeHero";
import { TrustBar } from "@/components/homepage/TrustBar";
import { UseCaseGrid } from "@/components/homepage/UseCaseGrid";

import { VoetCTA } from "@/components/homepage/VoetCTA";
import { FAQSection } from "@/components/FAQSection";
import { CustomerReviews } from "@/components/CustomerReviews";
import { GoogleHomeReview } from "@/components/GoogleBrandReview";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const fetchedProducts = await fetchProducts(50);
        if (!active) return;
        setProducts(fetchedProducts);
      } catch {
        if (!active) return;
        setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <PageLayout>
      {/* 1. Hero */}
      <HomeHero products={products} />

      {/* Trust bar */}
      <TrustBar />

      <GoogleHomeReview />

      {/* 2. Productgrid met link naar alle producten */}
      <div id="products" className="scroll-mt-24 bg-background-secondary">
        <UseCaseGrid products={products} />
        <div className="-mt-8 pb-16 text-center md:-mt-12 md:pb-24">
          {loading ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-foreground/75" />
          ) : failed ? (
            <div>
              <p className="mb-3 text-foreground/70">
                De collectie kon nu niet geladen worden. Dit is een tijdelijke storing.
              </p>
              <Button variant="link" type="button" onClick={() => setAttempt((a) => a + 1)} className="text-base text-accent-ink">
                Opnieuw proberen →
              </Button>
            </div>
          ) : (
            <a href="/producten" className="inline-flex min-h-11 items-center text-base font-semibold text-accent-ink hover:underline">
              Alle producten →
            </a>
          )}
        </div>
      </div>

      {/* 3. Reviews + FAQ */}
      <div id="faq" className="w-full bg-background">
        <CustomerReviews className="container max-w-5xl pt-16 md:pt-24" />
        <FAQSection showTrust={false} />
      </div>

      {/* 9. VoetCTA */}
      <VoetCTA />

      <ScrollToTop />

    </PageLayout>
  );
};

export default Index;
