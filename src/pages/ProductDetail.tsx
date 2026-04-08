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
import { WAVE_PRODUCT_HANDLE, ARC_PRODUCT_HANDLE } from "@/lib/productConfig";
import {
  WAVE_HERO_CONTENT, WAVE_OUTCOMES, WAVE_OUTCOME_HEADLINE,
  WAVE_PROBLEM_SOLUTION, WAVE_USE_CASES, WAVE_TECH_BENEFITS,
  WAVE_FAQS, WAVE_BUNDLE_HEADLINE, WAVE_FINAL_CTA,
} from "@/lib/waveProductConfig";
import {
  ARC_HERO_CONTENT, ARC_OUTCOMES, ARC_OUTCOME_HEADLINE,
  ARC_PROBLEM_SOLUTION, ARC_USE_CASES, ARC_TECH_BENEFITS,
  ARC_FAQS, ARC_BUNDLE_HEADLINE, ARC_FINAL_CTA,
} from "@/lib/arcProductConfig";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null
  >(null);

  const isWave = handle === WAVE_PRODUCT_HANDLE;
  const isArc = handle === ARC_PRODUCT_HANDLE;

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) { setLoading(false); return; }
      try {
        const found = await fetchProductByHandle(handle);
        setProduct(found);
        if (found) {
          if (isArc) {
            // Default to 6W Black Warm for Arc
            const defaultVariant = found.node.variants.edges.find((v) =>
              v.node.selectedOptions.some((opt) =>
                opt.value.includes("6W") && opt.value.includes("Black")
              ) &&
              v.node.selectedOptions.some((opt) =>
                opt.value.toLowerCase().includes("warm")
              )
            );
            setSelectedVariant(defaultVariant?.node || found.node.variants.edges[0]?.node || null);
          } else {
            // Default to 30cm variant
            const variant30cm = found.node.variants.edges.find((v) =>
              v.node.selectedOptions.some((opt) =>
                opt.value.includes("30") || opt.value.toLowerCase().includes("30cm")
              )
            );
            setSelectedVariant(variant30cm?.node || found.node.variants.edges[0]?.node || null);
          }
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
            <p className="text-base text-muted-foreground mb-4">Product niet gevonden</p>
            <Button onClick={() => navigate("/")}>Terug naar home</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Resolve content per product
  const heroContent = isWave ? WAVE_HERO_CONTENT : isArc ? ARC_HERO_CONTENT : undefined;
  const outcomeHeadline = isWave ? WAVE_OUTCOME_HEADLINE : isArc ? ARC_OUTCOME_HEADLINE : undefined;
  const outcomes = isWave ? WAVE_OUTCOMES : isArc ? ARC_OUTCOMES : undefined;
  const problemSolution = isWave ? WAVE_PROBLEM_SOLUTION : isArc ? ARC_PROBLEM_SOLUTION : undefined;
  const useCaseHeadline = isWave ? "Perfect voor elke ruimte" : isArc ? "Perfect voor binnen & buiten" : undefined;
  const useCaseSubtitle = isWave ? "Ontdek waar SenseGlow Wave™ het verschil maakt" : isArc ? "Ontdek waar SenseGlow Arc™ het verschil maakt" : undefined;
  const useCases = isWave ? WAVE_USE_CASES : isArc ? ARC_USE_CASES : undefined;
  const techHeadline = isWave ? "Technologie die indruk maakt" : isArc ? "Gebouwd voor binnen & buiten" : undefined;
  const techBenefits = isWave ? WAVE_TECH_BENEFITS : isArc ? ARC_TECH_BENEFITS : undefined;
  const faqSubtitle = isWave ? "Alles wat je moet weten over SenseGlow Wave™" : isArc ? "Alles wat je moet weten over SenseGlow Arc™" : undefined;
  const faqs = isWave ? WAVE_FAQS : isArc ? ARC_FAQS : undefined;
  const bundleHeadline = isWave ? WAVE_BUNDLE_HEADLINE : isArc ? ARC_BUNDLE_HEADLINE : undefined;
  const finalCta = isWave ? WAVE_FINAL_CTA : isArc ? ARC_FINAL_CTA : undefined;

  return (
    <PageLayout>
      <ProductHeroSection
        product={product}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        heroContent={heroContent}
      />

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <BundlesSection
          product={product}
          selectedVariant={selectedVariant || undefined}
          headlineOverride={bundleHeadline}
        />
      </div>

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <ProductReviewsSection />
      <div className="border-t border-foreground/8" />

      <OutcomeSection headline={outcomeHeadline} outcomes={outcomes} />

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <ProblemSolutionProductSection
          headline={problemSolution?.headline}
          problems={problemSolution?.problems}
          solutionTitle={problemSolution?.solutionTitle}
          solutionText={problemSolution?.solutionText}
        />
      </div>

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <UseCaseSection headline={useCaseHeadline} subtitle={useCaseSubtitle} useCases={useCases} />
      <div className="border-t border-foreground/8" />

      <TechBenefitsSection headline={techHeadline} benefits={techBenefits} />

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <ProductFAQSection subtitle={faqSubtitle} faqs={faqs} />
      </div>

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <FinalProductCTA
        headline={finalCta?.headline}
        subtext={finalCta?.subtext}
        ctaLabel={finalCta?.cta}
      />
    </PageLayout>
  );
};

export default ProductDetail;
