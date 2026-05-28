import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { ShopifyProduct, fetchProductByHandle } from "@/lib/shopify";
import { ProductHeroSection } from "@/components/product/ProductHeroSection";
import { BundlesSection } from "@/components/product/BundlesSection";
import { TechBenefitsSection } from "@/components/product/TechBenefitsSection";
import { ProductFAQSection } from "@/components/product/ProductFAQSection";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { FinalProductCTA } from "@/components/product/FinalProductCTA";
import { HowItWorksSection } from "@/components/product/HowItWorksSection";
import { BeforeAfterSection } from "@/components/product/BeforeAfterSection";
import { ARC_PRODUCT_HANDLE } from "@/lib/productConfig";
import { getProductContent } from "@/lib/productContent";
import { buildPlaceholderContent } from "@/lib/placeholderContent";

const Curve = ({ from, to }: { from: string; to: string }) => (
  <div className="relative h-12 md:h-20">
    <div className={`absolute inset-x-0 top-0 h-full ${from}`} />
    <div className={`absolute inset-x-0 bottom-0 h-full ${to} rounded-t-[40px] md:rounded-t-[60px]`} />
  </div>
);

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null
  >(null);

  const content = getProductContent(handle);
  const fallback = product ? buildPlaceholderContent(product.node.title) : undefined;

  const hero = content?.hero ?? fallback?.hero;
  const reviews = content?.reviews;
  const techHeadline = content?.techHeadline;
  const techBenefits = content?.techBenefits;
  const stepsHeadline = content?.stepsHeadline;
  const steps = content?.steps;
  const beforeAfterHeadline = content?.beforeAfterHeadline;
  const beforeLabel = content?.beforeLabel;
  const afterLabel = content?.afterLabel;
  const beforeAfter = content?.beforeAfter;
  const faqSubtitle = content?.faqSubtitle ?? fallback?.faqSubtitle;
  const faqs = content?.faqs ?? fallback?.faqs;
  const bundleHeadline = content?.bundleHeadline ?? fallback?.bundleHeadline;
  const finalCta = content?.finalCta ?? fallback?.finalCta;

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) { setLoading(false); return; }
      try {
        const found = await fetchProductByHandle(handle);
        setProduct(found);
        if (found) {
          if (handle === ARC_PRODUCT_HANDLE) {
            const def = found.node.variants.edges.find((v) =>
              v.node.selectedOptions.some((o) => o.value.includes("6W") && o.value.includes("Black")) &&
              v.node.selectedOptions.some((o) => o.value.toLowerCase().includes("warm"))
            );
            setSelectedVariant(def?.node || found.node.variants.edges[0]?.node || null);
          } else {
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
        heroContent={hero}
      />

      <Curve from="bg-background" to="bg-background-secondary" />

      <div className="bg-background-secondary">
        <BundlesSection
          product={product}
          selectedVariant={selectedVariant || undefined}
          headlineOverride={bundleHeadline}
        />
      </div>

      <Curve from="bg-background-secondary" to="bg-background" />

      <ProductReviewsSection reviews={reviews} />
      <div className="border-t border-foreground/8" />

      <TechBenefitsSection headline={techHeadline} benefits={techBenefits} />

      <Curve from="bg-muted/20" to="bg-background" />

      <HowItWorksSection headline={stepsHeadline} steps={steps} />

      <div className="border-t border-foreground/8" />

      <BeforeAfterSection
        headline={beforeAfterHeadline}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
        rows={beforeAfter}
      />

      <Curve from="bg-background" to="bg-background-secondary" />

      <div className="bg-background-secondary">
        <ProductFAQSection subtitle={faqSubtitle} faqs={faqs} />
      </div>

      <Curve from="bg-background-secondary" to="bg-background" />

      <FinalProductCTA
        headline={finalCta?.headline}
        subtext={finalCta?.subtext}
        ctaLabel={finalCta?.cta}
      />
    </PageLayout>
  );
};

export default ProductDetail;
