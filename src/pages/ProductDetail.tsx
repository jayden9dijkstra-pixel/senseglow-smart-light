import { pickDefaultVariant } from "@/lib/defaultVariant";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { trackViewItem, numericVariantId } from "@/lib/adsTracking";
import { trackSiteEvent } from "@/lib/siteAnalytics";


import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { ShopifyProduct, fetchProductByHandle } from "@/lib/shopify";
import { ProductHeroSection } from "@/components/product/ProductHeroSection";

import { ProductRelatedSection } from "@/components/product/ProductRelatedSection";
import { getProductFaqs } from "@/lib/productFaqs";
import { getBeforeAfterPair } from "@/lib/beforeAfterImages";
import { ARC_PRODUCT_HANDLE } from "@/lib/productConfig";
import { BeforeAfterBlock } from "@/components/product/BeforeAfterBlock";
import { SpecTiles, FaqAccordion } from "@/components/product/Blueprint";
import { blueprintFor, specsFromDescription } from "@/lib/productBlueprint";
import { reviewsFor } from "@/data/reviews";
import { TRADE_NAME_LINE } from "@/lib/businessInfo";
import { HowItWorksSteps } from "@/components/product/HowItWorksSteps";
import { AskUs } from "@/components/product/AskUs";
import { CustomerReviews } from "@/components/CustomerReviews";
import { getAngle, getStoredAngle, variantIn } from "@/lib/angles";
import { parseQty, type OfferQty } from "@/lib/quantityOffer";
import { getProductContent } from "@/lib/productContent";
import { buildPlaceholderContent } from "@/lib/placeholderContent";
import { getProductSeo, DEFAULT_SEO } from "@/lib/seoContent";
import { productSchema, breadcrumbSchema } from "@/lib/structuredData";


const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const variantParam = searchParams.get("variant");
  const viewedRef = useRef<string | null>(null);
  const addRef = useRef<(() => void) | null>(null);
  const angle = getAngle(handle, searchParams.get("a") ?? getStoredAngle());
  const [qty, setQty] = useState<OfferQty>(
    () => parseQty(searchParams.get("qty")) ?? angle?.preselect?.qty ?? 1,
  );

  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<
    ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null
  >(null);


  const content = getProductContent(handle);
  const fallback = product ? buildPlaceholderContent(product.node.title) : undefined;

  const hero = content?.hero ?? fallback?.hero;
  // techBenefits/steps/beforeAfter hebben ieder een eigen hardcoded standaard
  // (USB-C, batterijduur, "magneet erop, geen boren") die klopt voor de
  // magnetische/oplaadbare producten maar niet voor bijvoorbeeld Arc
  // (netstroom, geen accu). Zonder eigen content-item moet dit dus terugvallen
  // op de zichtbare placeholder, niet stilzwijgend op andermans specifieke
  // claims — vandaar hier wél de fallback, net als bij hero.
  const techBenefits = content?.techBenefits ?? fallback?.techBenefits;
  const stepsHeadline = content?.stepsHeadline ?? fallback?.stepsHeadline;
  const steps = content?.steps ?? fallback?.steps;
  // Headline/labels zijn generiek genoeg ("Voor / Na", "Zonder SenseGlow") om
  // veilig op de eigen component-standaard terug te vallen; alleen de rijen
  // zelf bevatten een specifieke installatieclaim.
  const beforeLabel = content?.beforeLabel;
  const afterLabel = content?.afterLabel;
  const beforeAfter = content?.beforeAfter ?? fallback?.beforeAfter;

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) { setLoading(false); return; }
      try {
        const found = await fetchProductByHandle(handle);
        setProduct(found);
        if (found) {
          // Advertentie- of feedlink met een specifieke variant gaat voor.
          const wanted = variantParam ? numericVariantId(variantParam) : null;
          const fromUrl = wanted
            ? found.node.variants.edges.find((v) => numericVariantId(v.node.id) === wanted)
            : undefined;

          if (fromUrl) {
            setSelectedVariant(fromUrl.node);
          } else if (handle === ARC_PRODUCT_HANDLE) {
            const def = found.node.variants.edges.find((v) =>
              v.node.selectedOptions.some((o) => o.value.includes("6W") && o.value.includes("Black")) &&
              v.node.selectedOptions.some((o) => o.value.toLowerCase().includes("warm"))
            );
            setSelectedVariant(def?.node || found.node.variants.edges[0]?.node || null);
          } else {
            const def = pickDefaultVariant(found);
            const size = angle?.preselect?.sizeCm;
            setSelectedVariant(
              size ? variantIn({ sizeCm: size }, def, found.node.variants.edges.map((e) => e.node)) ?? def : def,
            );
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Product laden mislukt:", handle, error);
        setLoading(false);
      }
    };
    loadProduct();
  }, [handle, variantParam]);

  // Meet de productweergave één keer per product/variant-combinatie.
  useEffect(() => {
    if (!product || !selectedVariant) return;
    const key = `${product.node.handle}::${selectedVariant.id}`;
    if (viewedRef.current === key) return;
    viewedRef.current = key;
    trackViewItem([
      {
        item_id: numericVariantId(selectedVariant.id),
        item_name: product.node.title,
        item_variant: selectedVariant.title,
        price: parseFloat(selectedVariant.price.amount),
        quantity: 1,
      },
    ]);
    void trackSiteEvent("view_item", {
      path: `/product/${product.node.handle}`,
      itemName: product.node.title,
      value: parseFloat(selectedVariant.price.amount),
    });
  }, [product, selectedVariant]);



  const path = `/product/${handle ?? ""}`;
  const seoEntry = getProductSeo(handle);
  const seoTitle =
    seoEntry?.title ?? (product ? `${product.node.title} | SenseGlow` : DEFAULT_SEO.title);
  const seoDescription =
    seoEntry?.description ??
    (product?.node.description
      ? product.node.description.slice(0, 158)
      : DEFAULT_SEO.description);

  const jsonLd = product
    ? [
        productSchema(product, { path, description: seoDescription }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Producten", path: "/producten" },
          { name: product.node.title, path },
        ]),
      ]
    : undefined;

  const seo = {
    title: seoTitle,
    description: seoDescription,
    path,
    jsonLd,
    noindex: !loading && !product,
  };

  if (loading) {
    return (
      <PageLayout seo={seo}>
        <div className="min-h-[60vh] flex items-center justify-center bg-background">
          <p className="text-base text-muted-foreground">Product laden...</p>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout seo={seo}>
        <div className="min-h-[60vh] flex items-center justify-center bg-background">
          <div className="text-left">
            <p className="text-base text-muted-foreground mb-4">Product niet gevonden</p>
            <Button onClick={() => navigate("/")}>Terug naar home</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const pair = handle ? getBeforeAfterPair(handle) : undefined;
  const slider = pair && <BeforeAfterBlock pair={pair} />;

  const blueprint = blueprintFor(handle);
  const specs = specsFromDescription(product.node.description);
  const faqs = blueprint?.faqs ?? getProductFaqs(content?.faqs);
  const hasReviews = reviewsFor(handle).length > 0;
  const anchorLinks = [
    { id: "kopen", label: "Kopen" },
    { id: "zo-werkt-het", label: "Zo werkt het" },
    ...(hasReviews ? [{ id: "reviews", label: "Reviews" }] : []),
    ...(specs.length ? [{ id: "specificaties", label: "Specificaties" }] : []),
    { id: "vragen", label: "Vragen" },
  ];

  return (
    <PageLayout seo={seo}>
      <div className="w-full overflow-hidden">
        <ProductHeroSection
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          heroContent={hero}
          qty={qty}
          onQtyChange={setQty}
          anchorLinks={anchorLinks}
          onAddRef={(fn) => (addRef.current = fn)}
        />

        <div className="mx-auto max-w-3xl space-y-10 px-6 pb-12 md:px-8">
          <div id="zo-werkt-het" className="scroll-mt-24 space-y-6">
            {handle && <HowItWorksSteps handle={handle} />}
            {slider}
          </div>
          <div id="reviews" className="scroll-mt-24"><CustomerReviews handle={handle} /></div>
          <SpecTiles rows={specs} />
          <FaqAccordion faqs={faqs} />
          <div className="space-y-3">
            <AskUs />
            <p className="text-base text-foreground/80">{TRADE_NAME_LINE}</p>
          </div>
          <Button
            onClick={() => addRef.current?.()}
            disabled={!selectedVariant?.availableForSale}
            className="h-12 w-full rounded-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
          >
            {selectedVariant?.availableForSale ? "In winkelwagen" : "Uitverkocht"}
          </Button>
        </div>

        {handle && <ProductRelatedSection currentHandle={handle} />}
      </div>
    </PageLayout>
  );
};

export default ProductDetail;
