import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
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
      <UseCaseGrid products={products} />

      {/* Editorial separator */}
      <div className="container">
        <div className="max-w-6xl mx-auto border-t border-foreground/6" />
      </div>

      {/* 3. WhatTheyShare */}
      <WhatTheyShare />

      {/* Curved transition into Storytelling */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      <div className="bg-background-secondary relative z-10">
        {/* 4. Storytelling */}
        <StorytellingSection />
      </div>

      {/* Curved transition back */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      {/* 5. QuizIntro */}
      <div className="bg-background-secondary">
        <QuizIntroSection />
      </div>

      {/* Curved transition back */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      {/* 7. Onze collectie */}
      <section id="products" className="py-24 md:py-32 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-4">
                  Collectie
                </p>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Onze collectie</h2>
                <p className="text-base text-foreground/60 max-w-md">
                  Vijf lampen die werken zoals jij leeft.
                </p>
              </div>
              <a
                href="/producten"
                className="text-[11px] uppercase tracking-[0.25em] text-glow hover:text-glow/80 transition-colors duration-500"
              >
                Bekijk alle producten →
              </a>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-5 h-5 animate-spin text-foreground/30" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/6 overflow-hidden">
                {products.map((product) => (
                  <div key={product.node.id} className="bg-background p-10">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : failed ? (
              <div className="py-20">
                <p className="text-foreground/70 mb-3">
                  De collectie kon nu niet geladen worden. Dit is een tijdelijke storing.
                </p>
                <button
                  type="button"
                  onClick={() => setAttempt((a) => a + 1)}
                  className="text-[11px] uppercase tracking-[0.25em] text-glow hover:text-glow/80 transition-colors"
                >
                  Opnieuw proberen →
                </button>
              </div>
            ) : (
              <div className="py-20">
                <p className="text-foreground/60 mb-2">
                  Er zijn op dit moment geen producten beschikbaar.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      <div id="faq" className="bg-background-secondary">
        <FAQSection />
      </div>

      {/* 9. VoetCTA */}
      <VoetCTA />

      <ScrollToTop />

      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
      </div>
    </PageLayout>
  );
};

export default Index;
