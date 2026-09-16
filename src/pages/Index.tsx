import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/homepage/HeroSection";
import { TrustBar } from "@/components/homepage/TrustBar";
import { UseCaseGrid } from "@/components/homepage/UseCaseGrid";

import { WhatTheyShare } from "@/components/homepage/WhatTheyShare";
import { StorytellingSection } from "@/components/homepage/StorytellingSection";
import { QuizIntroSection } from "@/components/homepage/QuizIntroSection";
import { VoetCTA } from "@/components/homepage/VoetCTA";
import { FAQSection } from "@/components/FAQSection";

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
      <HeroSection />

      {/* Trust bar */}
      <TrustBar />

      {/* 2. UseCaseGrid, 5 products */}
      <div id="products" className="scroll-mt-24">
        <UseCaseGrid products={products} />
      </div>

      

      {/* 3. WhatTheyShare */}
      <WhatTheyShare />

      <div className="w-full bg-background-secondary">
        {/* 4. Storytelling */}
        <StorytellingSection />
      </div>

      {/* 5. QuizIntro */}
      <div className="w-full bg-background-secondary">
        <QuizIntroSection />
      </div>

      {/* 7. Naar de volledige collectie */}
      <section className="w-full bg-background py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center">
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-foreground/30" />
              </div>
            ) : failed ? (
              <div>
                <p className="text-foreground/70 mb-3">
                  De collectie kon nu niet geladen worden. Dit is een tijdelijke storing.
                </p>
                <Button
                  variant="link"
                  type="button"
                  onClick={() => setAttempt((a) => a + 1)}
                  className="text-[11px] uppercase tracking-[0.25em] text-glow"
                >
                  Opnieuw proberen →
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Alles op een rij</h2>
                <p className="text-base text-foreground/60 mb-8">
                  Bekijk alle lampen met prijzen, maten en kleuren.
                </p>
                <Button asChild variant="link" className="text-[11px] uppercase tracking-[0.25em] text-glow">
                  <a href="/producten">Bekijk alle producten →</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>


      {/* 8. FAQ */}
      <div id="faq" className="w-full bg-background-secondary">
        <FAQSection />
      </div>

      {/* 9. VoetCTA */}
      <VoetCTA />

      <ScrollToTop />

    </PageLayout>
  );
};

export default Index;
