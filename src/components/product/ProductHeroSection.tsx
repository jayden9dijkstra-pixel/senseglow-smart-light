import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ShopifyProduct } from "@/lib/shopify";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";


import { ProductImageGallery } from "./ProductImageGallery";

import { VariantPicker } from "./VariantPicker";
import { PerLampPrice, StickyAddBar, TrustLine } from "./BuyBox";
import { getProductVideoUrl } from "@/lib/videos";
import { QuantityOfferPicker } from "./QuantityOfferPicker";
import { Benefits } from "./InfoAccordion";
import { isOfferProduct, quoteQty, type OfferQty } from "@/lib/quantityOffer";
import { getAngle, getStoredAngle } from "@/lib/angles";
import { blueprintFor, eightSetSaving, lampsInSet } from "@/lib/productBlueprint";
import { AnchorNav, IconBenefits } from "./Blueprint";
import { formatPrice } from "@/lib/price";
import { PurchaseReassurance } from "./PurchaseReassurance";
import { PlacementGuideBonus } from "./PlacementGuideBonus";
import { parseVariantLabel } from "@/lib/productRegistry";
import { STEP_PRODUCT_HANDLE } from "@/lib/productConfig";
import { useOfferDate } from "@/hooks/useOfferDate";

interface HeroContent {
  h1: string;
  subtitle: string;
  bullets: string[];
}

interface ProductHeroSectionProps {
  product: ShopifyProduct;
  selectedVariant?: ShopifyProduct["node"]["variants"]["edges"][0]["node"] | null;
  onVariantChange?: (
    variant: ShopifyProduct["node"]["variants"]["edges"][0]["node"]
  ) => void;
  heroContent?: HeroContent;
  qty?: OfferQty;
  onQtyChange?: (qty: OfferQty) => void;
  /** Sectie direct onder de vertrouwensregels, bijvoorbeeld de voor/na-schuif. */
  afterTrust?: ReactNode;
  /** Ankernavigatie onder de galerij. */
  anchorLinks?: { id: string; label: string }[];
  /** Ref naar de koopknop, voor een herhaalde knop onderaan. */
  onAddRef?: (add: () => void) => void;
  /** Eigen opbouw (Ambient): kleine regel boven de titel, belofte, vinkjes, kiezer en blok onder de knop. */
  layout?: {
    eyebrow: string;
    promise: string;
    checks: string[];
    qtyPicker: (unitPrice: number | null) => ReactNode;
    belowButton: ReactNode;
    mobileGalleryHeight: string;
  };
}

export const ProductHeroSection = ({
  product,
  selectedVariant: propVariant,
  onVariantChange,
  heroContent,
  qty = 1,
  onQtyChange,
  afterTrust,
  anchorLinks,
  onAddRef,
  layout,
}: ProductHeroSectionProps) => {
  const now = useOfferDate();
  const defaultContent: HeroContent = {
    h1: "Veilig licht. Precies wanneer jij beweegt.",
    subtitle: "Zachte nachtverlichting die je begeleidt zonder iemand wakker te maken.",
    bullets: [
      "Automatische bewegingssensor",
      "Warm licht (2700K), slaapvriendelijk",
      "Installatie zonder gereedschap",
    ],
  };
  const content = heroContent || defaultContent;
  const [searchParams] = useSearchParams();
  const [localVariant, setLocalVariant] = useState(
    product.node.variants.edges[0]?.node
  );
  const selectedVariant = propVariant ?? localVariant;
  const addItem = useCartStore((state) => state.addItem);
  const [priceKey, setPriceKey] = useState(0);
  const [pickedByUser, setPickedByUser] = useState(false);
  const offer = isOfferProduct(product.node.handle);
  const angle = getAngle(product.node.handle, searchParams.get("a") ?? getStoredAngle());

  // Handle URL params for variant selection (from quiz or ad links)
  useEffect(() => {
    const sizeParam = searchParams.get("size");
    const colorParam = searchParams.get("color");

    if (sizeParam || colorParam) {
      const matchingVariant = product.node.variants.edges.find((variant) => {
        let sizeMatch = !sizeParam;
        let colorMatch = !colorParam;

        variant.node.selectedOptions.forEach((option) => {
          const name = option.name.toLowerCase();
          const value = option.value.toLowerCase();

          if (
            sizeParam &&
            (name === "maat" || name === "size" || name === "lengte")
          ) {
            sizeMatch = value.includes(sizeParam.toLowerCase().replace("cm", ""));
          }
          if (
            colorParam &&
            (name === "kleur" || name === "color" || name === "colour")
          ) {
            colorMatch = value.toLowerCase() === colorParam.toLowerCase();
          }
        });

        return sizeMatch && colorMatch;
      });

      if (matchingVariant) {
        handleVariantChange(matchingVariant.node);
      }
    }
  }, [searchParams, product]);

  const handleVariantChange = (
    variant: ShopifyProduct["node"]["variants"]["edges"][0]["node"]
  ) => {
    setLocalVariant(variant);
    onVariantChange?.(variant);
    setPriceKey((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: {
        amount: selectedVariant.price.amount,
        currencyCode: selectedVariant.price.currencyCode,
      },
      quantity: offer ? qty : 1,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  // Product pages always retain the order returned by Shopify, including scene links.
  const productImages = product.node.images?.edges?.map((edge) => ({
      url: edge.node.url,
      altText: edge.node.altText,
      width: edge.node.width,
      height: edge.node.height,
    })) || [];
  const productImageClassName = "h-full w-full object-contain";

  onAddRef?.(handleAddToCart);
  const blueprint = blueprintFor(product.node.handle);
  const saving = eightSetSaving(selectedVariant, product.node.variants.edges.map((e) => e.node));
  const unitPrice = selectedVariant ? parseFloat(selectedVariant.price.amount) : null;
  const compareAt = selectedVariant?.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : null;
  const count = offer ? qty : 1;
  const btnRef = useRef<HTMLButtonElement>(null);

  const subtitle = angle?.heading ?? firstSentence(content.subtitle);
  const benefits = angle?.benefits ?? content.bullets;

  return (
    <section id="product-hero" className="w-full overflow-hidden bg-background pb-8 md:py-24 lg:py-32 animate-fade-in-slow">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] md:gap-8">
          <div className="relative min-w-0 md:max-h-[730px]">
            <ProductImageGallery
              images={productImages}
              productTitle={product.node.title}
              videoUrl={getProductVideoUrl(product.node.handle)}
              imageClassName={productImageClassName}
              mobileMaxHeight={layout?.mobileGalleryHeight ?? "55svh"}
              hideMobileThumbs={!!layout}
              activeImageUrl={
                pickedByUser &&
                selectedVariant?.image?.url &&
                selectedVariant.image.url !== (product.node.featuredImage?.url ?? productImages[0]?.url)
                  ? selectedVariant.image.url
                  : null
              }
            />
          </div>

          <div id="kopen" className={`min-w-0 scroll-mt-24 text-left md:space-y-4 md:pt-0 ${layout ? "space-y-1 pt-2" : "space-y-4 pt-3"}`}>
            {layout ? (
              <>
                <p className="text-sm font-semibold leading-snug text-primary md:text-base">{layout.eyebrow}</p>
                <h1 className="line-clamp-2 text-xl font-bold leading-[1.1] text-foreground md:text-4xl lg:text-5xl">{content.h1}</h1>
                <div key={priceKey} className="flex flex-wrap items-baseline gap-x-3" style={{ animation: "fade-in 0.4s ease-out" }}>
                  <PerLampPrice unitPrice={unitPrice} qty={count} offer={offer} />
                  {compareAt != null && unitPrice != null && compareAt > unitPrice && (
                    <s className="text-base text-foreground/70">{formatPrice(compareAt)}</s>
                  )}
                </div>
                <p className="text-[15px] leading-snug text-foreground/85 md:text-base">{layout.promise}</p>
                <ul className="flex flex-col gap-0.5 md:gap-1">
                  {layout.checks.map((c) => (
                    <li key={c} className="flex items-center gap-1.5 text-[15px] leading-tight text-foreground md:text-base"><Check aria-hidden className="h-4 w-4 flex-none text-primary" />{c}</li>
                  ))}
                </ul>
                {product.node.variants.edges.length > 1 && (
                  <div className="max-md:[&>div]:grid max-md:[&>div]:grid-cols-[minmax(0,1fr)_auto] max-md:[&>div]:items-start max-md:[&>div]:gap-3 max-md:[&>div>*]:!mt-0 max-md:[&_.flex-wrap]:flex-nowrap max-md:[&_.flex-wrap]:gap-1.5 max-md:[&_.flex-wrap>button]:min-w-0 max-md:[&_.flex-wrap>button]:px-1 max-md:[&_.gap-4]:gap-1">
                  <VariantPicker
                    product={product}
                    selectedVariant={selectedVariant}
                    onVariantChange={(v) => {
                      setPickedByUser(true);
                      handleVariantChange(v);
                    }}
                  />
                  </div>
                )}
                {offer && layout.qtyPicker(unitPrice)}
                <Button
                  ref={btnRef}
                  onClick={handleAddToCart}
                  size="lg"
                  disabled={!selectedVariant?.availableForSale}
                  className="w-full min-h-12 h-auto rounded-full bg-cta px-10 py-3.5 text-base font-medium tracking-wide text-cta-foreground transition-all duration-500 hover:bg-cta-hover focus-visible:ring-cta"
                >
                  {selectedVariant?.availableForSale ? "In winkelwagen" : "Uitverkocht"}
                </Button>
                {layout.belowButton}
              </>
            ) : (
            <>
            <div className="space-y-1">
              <h1 className="line-clamp-2 text-2xl font-bold leading-[1.1] text-foreground md:text-4xl lg:text-5xl">
                {content.h1}
              </h1>
              <p className="text-base text-foreground/80 md:text-lg">{subtitle}</p>
            </div>

            {blueprint ? <IconBenefits items={blueprint.benefits} /> : <Benefits items={benefits} />}

            {product.node.variants.edges.length > 1 && (
              <VariantPicker
                product={product}
                selectedVariant={selectedVariant}
                onVariantChange={(v) => {
                  setPickedByUser(true);
                  handleVariantChange(v);
                }}
              />
            )}
            {saving != null && (
              <p className="text-base font-medium text-foreground">{formatPrice(saving)} voordeliger dan 2 sets van 4</p>
            )}

            {offer && (
              <QuantityOfferPicker unitPrice={unitPrice} value={qty} onChange={(q) => onQtyChange?.(q)} />
            )}

            <div key={priceKey} style={{ animation: "fade-in 0.4s ease-out" }}>
              <PerLampPrice unitPrice={unitPrice} qty={count} offer={offer} setLamps={lampsInSet(selectedVariant)} />
            </div>

            <Button
              ref={btnRef}
              onClick={handleAddToCart}
              size="lg"
              disabled={!selectedVariant?.availableForSale}
              className="w-full min-h-12 h-auto rounded-full bg-cta px-10 py-4 text-base font-medium tracking-wide text-cta-foreground transition-all duration-500 hover:bg-cta-hover focus-visible:ring-cta"
            >
              {selectedVariant?.availableForSale ? "In winkelwagen" : "Uitverkocht"}
            </Button>
            <PlacementGuideBonus productHandle={product.node.handle} />
            <PurchaseReassurance />
            <TrustLine />
            {afterTrust}
            {anchorLinks && <AnchorNav links={anchorLinks} />}

            </>
            )}

            <StickyAddBar
              watch={btnRef}
              qty={count}
              total={unitPrice != null ? quoteQty(unitPrice, count, now).total : null}
              disabled={!selectedVariant?.availableForSale}
              onAdd={handleAddToCart}
              image={productImages[0]?.url}
              label={product.node.handle === STEP_PRODUCT_HANDLE
                ? parseVariantLabel("sconce", selectedVariant?.selectedOptions ?? []).setSize
                : offer ? undefined : selectedVariant?.title}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/** Eerste zin van een tekst, zodat de intro onder de titel kort blijft. */
function firstSentence(text: string) {
  const m = text.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}
