import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { ShopifyProduct, fetchProductByHandle } from "@/lib/shopify";
import { ProductHeroSection } from "@/components/product/ProductHeroSection";
import { OutcomeSection } from "@/components/product/OutcomeSection";
import { ProblemSolutionProductSection } from "@/components/product/ProblemSolutionProductSection";
import { UseCaseSection } from "@/components/product/UseCaseSection";
import { BundlesSection } from "@/components/product/BundlesSection";
import { TechBenefitsSection } from "@/components/product/TechBenefitsSection";
import { ProductFAQSection } from "@/components/product/ProductFAQSection";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { FinalProductCTA } from "@/components/product/FinalProductCTA";
import { WAVE_PRODUCT_HANDLE } from "@/lib/productConfig";
import {
  WAVE_HERO_CONTENT,
  WAVE_OUTCOMES,
  WAVE_OUTCOME_HEADLINE,
  WAVE_PROBLEM_SOLUTION,
  WAVE_USE_CASES,
  WAVE_TECH_BENEFITS,
  WAVE_FAQS,
  WAVE_BUNDLE_HEADLINE,
  WAVE_FINAL_CTA,
} from "@/lib/waveProductConfig";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null
  >(null);

  // Detect if this is the Wave product
  const isWave = handle === WAVE_PRODUCT_HANDLE;

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) {
        setLoading(false);
        return;
      }
      try {
        const found = await fetchProductByHandle(handle);
        setProduct(found);

        if (found) {
          // Default to 30cm variant explicitly
          const variant30cm = found.node.variants.edges.find((v) =>
            v.node.selectedOptions.some((opt) => 
              opt.value.includes("30") || opt.value.toLowerCase().includes("30cm")
            )
          );
          setSelectedVariant(variant30cm?.node || found.node.variants.edges[0]?.node || null);
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-background">
          <p className="text-base text-muted-foreground">Product laden...</p>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-background">
          <div className="text-left">
            <p className="text-base text-muted-foreground mb-4">
              Product niet gevonden
            </p>
            <Button onClick={() => navigate("/")}>Terug naar home</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Product Hero */}
      <ProductHeroSection
        product={product}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        heroContent={isWave ? WAVE_HERO_CONTENT : undefined}
      />

      {/* Curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <BundlesSection
          product={product}
          selectedVariant={selectedVariant || undefined}
          headlineOverride={isWave ? WAVE_BUNDLE_HEADLINE : undefined}
        />
      </div>

      {/* Curved transition back */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <ProductReviewsSection />

      <div className="border-t border-foreground/8" />

      <OutcomeSection
        headline={isWave ? WAVE_OUTCOME_HEADLINE : undefined}
        outcomes={isWave ? WAVE_OUTCOMES : undefined}
      />

      {/* Curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <ProblemSolutionProductSection
          headline={isWave ? WAVE_PROBLEM_SOLUTION.headline : undefined}
          problems={isWave ? WAVE_PROBLEM_SOLUTION.problems : undefined}
          solutionTitle={isWave ? WAVE_PROBLEM_SOLUTION.solutionTitle : undefined}
          solutionText={isWave ? WAVE_PROBLEM_SOLUTION.solutionText : undefined}
        />
      </div>

      {/* Curved transition back */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <UseCaseSection
        headline={isWave ? "Perfect voor elke ruimte" : undefined}
        subtitle={isWave ? "Ontdek waar SenseGlow Wave™ het verschil maakt" : undefined}
        useCases={isWave ? WAVE_USE_CASES : undefined}
      />

      <div className="border-t border-foreground/8" />

      <TechBenefitsSection
        headline={isWave ? "Technologie die indruk maakt" : undefined}
        benefits={isWave ? WAVE_TECH_BENEFITS : undefined}
      />

      {/* Curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <ProductFAQSection
          subtitle={isWave ? "Alles wat je moet weten over SenseGlow Wave™" : undefined}
          faqs={isWave ? WAVE_FAQS : undefined}
        />
      </div>

      {/* Curved transition back */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <FinalProductCTA
        headline={isWave ? WAVE_FINAL_CTA.headline : undefined}
        subtext={isWave ? WAVE_FINAL_CTA.subtext : undefined}
        ctaLabel={isWave ? WAVE_FINAL_CTA.cta : undefined}
      />
    </PageLayout>
  );
};

export default ProductDetail;
