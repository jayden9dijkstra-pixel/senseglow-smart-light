import { useEffect, useState } from "react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/homepage/HeroSection";
import { StorytellingSection } from "@/components/homepage/StorytellingSection";
import { ProblemSolutionSection } from "@/components/homepage/ProblemSolutionSection";
import { WarmGlowSection } from "@/components/homepage/WarmGlowSection";
import { QuizIntroSection } from "@/components/homepage/QuizIntroSection";
import { SafetySection } from "@/components/homepage/SafetySection";
import { ReviewsTeaserSection } from "@/components/homepage/ReviewsTeaserSection";
import { FinalCTASection } from "@/components/homepage/FinalCTASection";
import { FAQSection } from "@/components/FAQSection";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const fetchedProducts = await fetchProducts(50);
      setProducts(fetchedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <PageLayout>
      {/* Hero Section with overlap into next */}
      <HeroSection />

      {/* Soft curved transition into Storytelling */}
      <div className="relative h-16 md:h-24 -mt-8 md:-mt-12">
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      <div className="bg-background-secondary relative z-10">
        <StorytellingSection />
      </div>

      {/* Curved transition back */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      <ProblemSolutionSection />

      {/* Editorial line separator */}
      <div className="container">
        <div className="max-w-6xl mx-auto border-t border-foreground/6" />
      </div>

      <WarmGlowSection />

      {/* Curved transition to secondary */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      <div className="bg-background-secondary">
        <QuizIntroSection />
      </div>

      {/* Curved transition back */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      <SafetySection />

      {/* Editorial line separator */}
      <div className="container">
        <div className="max-w-6xl mx-auto border-t border-foreground/6" />
      </div>

      <ReviewsTeaserSection />

      {/* Curved transition to final CTA */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      <div className="bg-background-secondary">
        <FinalCTASection />
      </div>

      {/* Curved transition to products */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      {/* Products Section */}
      <section id="products" className="py-24 md:py-32 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium mb-4">
                Collectie
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Onze Producten</h2>
              <p className="text-base text-foreground/60 max-w-md">
                Kies de juiste maat voor jouw ruimte
              </p>
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
            ) : (
              <div className="py-20">
                <p className="text-foreground/60 mb-2">Geen producten gevonden</p>
                <p className="text-sm text-foreground/40">
                  Voeg producten toe via de Shopify Storefront API.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section with curved transition */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[60px] md:rounded-t-[80px]" />
      </div>

      <div id="faq" className="bg-background-secondary">
        <FAQSection />
      </div>

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Curve into global footer */}
      <div className="relative h-16 md:h-24">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[60px] md:rounded-t-[80px]" />
      </div>
    </PageLayout>
  );
};

export default Index;
