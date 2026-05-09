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
import { ARC_PRODUCT_HANDLE } from "@/lib/productConfig";
import { buildPlaceholderContent } from "@/lib/placeholderContent";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null
  >(null);

  const content = product ? buildPlaceholderContent(product.node.title) : undefined;

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
