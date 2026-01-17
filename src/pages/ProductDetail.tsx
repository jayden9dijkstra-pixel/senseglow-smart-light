import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { ShopifyProduct, fetchProducts } from "@/lib/shopify";
import { ProductHeroSection } from "@/components/product/ProductHeroSection";
import { OutcomeSection } from "@/components/product/OutcomeSection";
import { ProblemSolutionProductSection } from "@/components/product/ProblemSolutionProductSection";
import { UseCaseSection } from "@/components/product/UseCaseSection";
import { BundlesSection } from "@/components/product/BundlesSection";
import { TechBenefitsSection } from "@/components/product/TechBenefitsSection";
import { ProductFAQSection } from "@/components/product/ProductFAQSection";
import { ProductReviewsSection } from "@/components/product/ProductReviewsSection";
import { FinalProductCTA } from "@/components/product/FinalProductCTA";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null
  >(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(50);
        const found = products.find((p) => p.node.handle === handle);
        setProduct(found || null);

        if (found) {
          setSelectedVariant(found.node.variants.edges[0]?.node || null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
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
      {/* Product Sections with curved transitions */}
      <ProductHeroSection
        product={product}
        selectedVariant={selectedVariant}
        onVariantChange={setSelectedVariant}
      />

      {/* Curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <BundlesSection product={product} selectedVariant={selectedVariant || undefined} />
      </div>

      {/* Curved transition back */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <ProductReviewsSection />

      <div className="border-t border-foreground/8" />

      <OutcomeSection />

      {/* Curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <ProblemSolutionProductSection />
      </div>

      {/* Curved transition back */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <UseCaseSection />

      <div className="border-t border-foreground/8" />

      <TechBenefitsSection />

      {/* Curved transition */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background-secondary rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <div className="bg-background-secondary">
        <ProductFAQSection />
      </div>

      {/* Curved transition back */}
      <div className="relative h-12 md:h-20">
        <div className="absolute inset-x-0 top-0 h-full bg-background-secondary" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-background rounded-t-[40px] md:rounded-t-[60px]" />
      </div>

      <FinalProductCTA />
    </PageLayout>
  );
};

export default ProductDetail;
