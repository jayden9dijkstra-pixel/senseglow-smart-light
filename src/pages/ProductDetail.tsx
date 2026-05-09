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
import { WAVE_PRODUCT_HANDLE, ARC_PRODUCT_HANDLE, FLEX_PRODUCT_HANDLE, LANTERN_PRODUCT_HANDLE, STEP_PRODUCT_HANDLE, SCONCE_PRODUCT_HANDLE } from "@/lib/productConfig";
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
import {
  FLEX_HERO_CONTENT, FLEX_OUTCOMES, FLEX_OUTCOME_HEADLINE,
  FLEX_PROBLEM_SOLUTION, FLEX_USE_CASES, FLEX_TECH_BENEFITS,
  FLEX_FAQS, FLEX_BUNDLE_HEADLINE, FLEX_FINAL_CTA,
} from "@/lib/flexProductConfig";
import {
  LANTERN_HERO_CONTENT, LANTERN_OUTCOMES, LANTERN_OUTCOME_HEADLINE,
  LANTERN_PROBLEM_SOLUTION, LANTERN_USE_CASES, LANTERN_TECH_BENEFITS,
  LANTERN_FAQS, LANTERN_BUNDLE_HEADLINE, LANTERN_FINAL_CTA,
} from "@/lib/lanternProductConfig";
import {
  STEP_HERO_CONTENT, STEP_OUTCOMES, STEP_OUTCOME_HEADLINE,
  STEP_PROBLEM_SOLUTION, STEP_USE_CASES, STEP_TECH_BENEFITS,
  STEP_FAQS, STEP_BUNDLE_HEADLINE, STEP_FINAL_CTA,
} from "@/lib/stepProductConfig";
import {
  SCONCE_HERO_CONTENT, SCONCE_OUTCOMES, SCONCE_OUTCOME_HEADLINE,
  SCONCE_PROBLEM_SOLUTION, SCONCE_USE_CASES, SCONCE_TECH_BENEFITS,
  SCONCE_FAQS, SCONCE_BUNDLE_HEADLINE, SCONCE_FINAL_CTA,
} from "@/lib/sconceProductConfig";

// Content lookup per handle
const CONTENT_MAP: Record<string, {
  hero: typeof WAVE_HERO_CONTENT;
  outcomeHeadline: string;
  outcomes: typeof WAVE_OUTCOMES;
  problemSolution: typeof WAVE_PROBLEM_SOLUTION;
  useCaseHeadline: string;
  useCaseSubtitle: string;
  useCases: typeof WAVE_USE_CASES;
  techHeadline: string;
  techBenefits: typeof WAVE_TECH_BENEFITS;
  faqSubtitle: string;
  faqs: typeof WAVE_FAQS;
  bundleHeadline: string;
  finalCta: typeof WAVE_FINAL_CTA;
}> = {
  [WAVE_PRODUCT_HANDLE]: {
    hero: WAVE_HERO_CONTENT,
    outcomeHeadline: WAVE_OUTCOME_HEADLINE,
    outcomes: WAVE_OUTCOMES,
    problemSolution: WAVE_PROBLEM_SOLUTION,
    useCaseHeadline: "Perfect voor elke ruimte",
    useCaseSubtitle: "Ontdek waar SenseGlow Wave™ het verschil maakt",
    useCases: WAVE_USE_CASES,
    techHeadline: "Technologie die indruk maakt",
    techBenefits: WAVE_TECH_BENEFITS,
    faqSubtitle: "Alles wat je moet weten over SenseGlow Wave™",
    faqs: WAVE_FAQS,
    bundleHeadline: WAVE_BUNDLE_HEADLINE,
    finalCta: WAVE_FINAL_CTA,
  },
  [ARC_PRODUCT_HANDLE]: {
    hero: ARC_HERO_CONTENT,
    outcomeHeadline: ARC_OUTCOME_HEADLINE,
    outcomes: ARC_OUTCOMES,
    problemSolution: ARC_PROBLEM_SOLUTION,
    useCaseHeadline: "Perfect voor binnen & buiten",
    useCaseSubtitle: "Ontdek waar SenseGlow Arc™ het verschil maakt",
    useCases: ARC_USE_CASES,
    techHeadline: "Gebouwd voor binnen & buiten",
    techBenefits: ARC_TECH_BENEFITS,
    faqSubtitle: "Alles wat je moet weten over SenseGlow Arc™",
    faqs: ARC_FAQS,
    bundleHeadline: ARC_BUNDLE_HEADLINE,
    finalCta: ARC_FINAL_CTA,
  },
  [FLEX_PRODUCT_HANDLE]: {
    hero: FLEX_HERO_CONTENT,
    outcomeHeadline: FLEX_OUTCOME_HEADLINE,
    outcomes: FLEX_OUTCOMES,
    problemSolution: FLEX_PROBLEM_SOLUTION,
    useCaseHeadline: "Overal inzetbaar",
    useCaseSubtitle: "Ontdek waar SenseGlow Flex™ het verschil maakt",
    useCases: FLEX_USE_CASES,
    techHeadline: "Slim ontworpen, tot in detail",
    techBenefits: FLEX_TECH_BENEFITS,
    faqSubtitle: "Alles wat je moet weten over SenseGlow Flex™",
    faqs: FLEX_FAQS,
    bundleHeadline: FLEX_BUNDLE_HEADLINE,
    finalCta: FLEX_FINAL_CTA,
  },
  [LANTERN_PRODUCT_HANDLE]: {
    hero: LANTERN_HERO_CONTENT,
    outcomeHeadline: LANTERN_OUTCOME_HEADLINE,
    outcomes: LANTERN_OUTCOMES,
    problemSolution: LANTERN_PROBLEM_SOLUTION,
    useCaseHeadline: "Overal buiten inzetbaar",
    useCaseSubtitle: "Ontdek waar SenseGlow Solar™ het verschil maakt",
    useCases: LANTERN_USE_CASES,
    techHeadline: "Slim & duurzaam ontworpen",
    techBenefits: LANTERN_TECH_BENEFITS,
    faqSubtitle: "Alles wat je moet weten over SenseGlow Solar™",
    faqs: LANTERN_FAQS,
    bundleHeadline: LANTERN_BUNDLE_HEADLINE,
    finalCta: LANTERN_FINAL_CTA,
  },
  [STEP_PRODUCT_HANDLE]: {
    hero: STEP_HERO_CONTENT,
    outcomeHeadline: STEP_OUTCOME_HEADLINE,
    outcomes: STEP_OUTCOMES,
    problemSolution: STEP_PROBLEM_SOLUTION,
    useCaseHeadline: "Voor trap, gang & meer",
    useCaseSubtitle: "Ontdek waar SenseGlow Step™ het verschil maakt",
    useCases: STEP_USE_CASES,
    techHeadline: "Slim ontworpen voor veiligheid",
    techBenefits: STEP_TECH_BENEFITS,
    faqSubtitle: "Alles wat je moet weten over SenseGlow Step™",
    faqs: STEP_FAQS,
    bundleHeadline: STEP_BUNDLE_HEADLINE,
    finalCta: STEP_FINAL_CTA,
  },
  // SCONCE_PRODUCT_HANDLE === STEP_PRODUCT_HANDLE — same Shopify product
};

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null
  >(null);

  const content = handle ? CONTENT_MAP[handle] : undefined;

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) { setLoading(false); return; }
      try {
        const found = await fetchProductByHandle(handle);
        setProduct(found);
        if (found) {
          // Default variant selection logic per product type
          if (handle === ARC_PRODUCT_HANDLE) {
            const def = found.node.variants.edges.find((v) =>
              v.node.selectedOptions.some((o) => o.value.includes("6W") && o.value.includes("Black")) &&
              v.node.selectedOptions.some((o) => o.value.toLowerCase().includes("warm"))
            );
            setSelectedVariant(def?.node || found.node.variants.edges[0]?.node || null);
          } else {
            // Default to 30cm or first variant
            const v30 = found.node.variants.edges.find((v) =>
              v.node.selectedOptions.some((o) => o.value.includes("30"))
            );
            setSelectedVariant(v30?.node || found.node.variants.edges[0]?.node || null);
          }
        }
        setLoading(false);
      } catch { setLoading(false); }
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

  return (
    <PageLayout>
      <ProductHeroSection
        product={product}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
        heroContent={content?.hero}
      />

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <BundlesSection
          product={product}
          selectedVariant={selectedVariant || undefined}
          headlineOverride={content?.bundleHeadline}
        />
      </div>

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <ProductReviewsSection />
      <div className="border-t border-foreground/8" />

      <OutcomeSection headline={content?.outcomeHeadline} outcomes={content?.outcomes} />

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <ProblemSolutionProductSection
          headline={content?.problemSolution?.headline}
          problems={content?.problemSolution?.problems}
          solutionTitle={content?.problemSolution?.solutionTitle}
          solutionText={content?.problemSolution?.solutionText}
        />
      </div>

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <UseCaseSection headline={content?.useCaseHeadline} subtitle={content?.useCaseSubtitle} useCases={content?.useCases} />
      <div className="border-t border-foreground/8" />

      <TechBenefitsSection headline={content?.techHeadline} benefits={content?.techBenefits} />

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <ProductFAQSection subtitle={content?.faqSubtitle} faqs={content?.faqs} />
      </div>

      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <FinalProductCTA
        headline={content?.finalCta?.headline}
        subtext={content?.finalCta?.subtext}
        ctaLabel={content?.finalCta?.cta}
      />
    </PageLayout>
  );
};

export default ProductDetail;
