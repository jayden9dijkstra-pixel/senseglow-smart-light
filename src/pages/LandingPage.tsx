import { responsiveImg, shopifySized } from "@/lib/shopifyImage";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, BatteryCharging, Footprints, Lightbulb, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { QuantityOfferPicker } from "@/components/product/QuantityOfferPicker";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { getLandingPage, landingOfferPrice, directOfferImage, offerImage, offerProductHref, trapDirectTrust, type LandingOffer, type LandingPage as LandingPageData, type LandingStepIcon } from "@/lib/landingPages";
import { HowItWorksSteps } from "@/components/product/HowItWorksSteps";
import { AskUs } from "@/components/product/AskUs";
import { CustomerReviews } from "@/components/CustomerReviews";
import { variantIn } from "@/lib/angles";
import { isOfferProduct, quoteQty, type OfferQty } from "@/lib/quantityOffer";
import { formatPrice } from "@/lib/price";
import { productSchema, breadcrumbSchema } from "@/lib/structuredData";
import { useCartStore } from "@/stores/cartStore";
import { PerLampPrice, StickyAddBar, TrustLine } from "@/components/product/BuyBox";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { BeforeAfterBlock } from "@/components/product/BeforeAfterBlock";
import { InfoAccordion, PlainList, Benefits, type InfoSection } from "@/components/product/InfoAccordion";
import { AnchorNav, SpecTiles, FaqAccordion } from "@/components/product/Blueprint";
import { eightSetSaving, lampsInSet } from "@/lib/productBlueprint";
import { reviewsFor } from "@/data/reviews";
import { TRADE_NAME_LINE } from "@/lib/businessInfo";
import { getBeforeAfterPair } from "@/lib/beforeAfterImages";
import { PurchaseReassurance } from "@/components/product/PurchaseReassurance";
import { PlacementGuideBonus } from "@/components/product/PlacementGuideBonus";
import { parseVariantLabel } from "@/lib/productRegistry";
import { STEP_PRODUCT_HANDLE } from "@/lib/productConfig";
import NotFound from "./NotFound";
import { useOfferDate } from "@/hooks/useOfferDate";
import { canPurchaseVariant } from "@/lib/purchaseAvailability";
import { numericVariantId, trackViewItem } from "@/lib/adsTracking";
import { trackSiteEvent } from "@/lib/siteAnalytics";

type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];

/** Kleurnaam van een variant, zonder maat of setgrootte. */
const colorLabel = (v: Variant) => {
  const color = v.selectedOptions.find((o) => /kleur|color/i.test(o.name) && !/delige/i.test(o.value));
  const raw = color?.value ?? v.selectedOptions.find((o) => !/delige/i.test(o.value))?.value ?? v.title;
  return raw.replace(/\s*\d+\s*cm.*$/i, "").replace(/[\s-]+$/, "").trim();
};

const LANDING_STEP_ICONS: Record<LandingStepIcon, typeof Activity> = {
  walk: Footprints,
  sensor: Activity,
  light: Lightbulb,
  usb: BatteryCharging,
  stick: StickyNote,
  motion: Activity,
};

function LandingSteps({ steps }: { steps: NonNullable<LandingPageData["steps"]> }) {
  return (
    <section aria-labelledby="landing-steps" className="space-y-3">
      <h2 id="landing-steps" className="text-xl font-semibold text-foreground">{steps.heading}</h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.items.map((step, index) => {
          const Icon = LANDING_STEP_ICONS[step.icon];
          return (
            <li key={step.text} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/15 text-primary" aria-hidden>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[17px] font-medium text-foreground">
                <span className="mr-1 font-semibold">{index + 1}.</span>
                {step.text}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function OfferCard({ offer, product, sticky, hideImage, solo, viewPath, directCompact, onAddRef, onAvailabilityChange }: { offer: LandingOffer; product: ShopifyProduct | undefined; sticky?: boolean; hideImage?: boolean; solo?: boolean; viewPath?: string; directCompact?: boolean; onAddRef?: (add: () => void) => void; onAvailabilityChange?: (available: boolean) => void }) {
  const now = useOfferDate();
  const btnRef = useRef<HTMLButtonElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const variants = useMemo(() => product?.node.variants.edges.map((e) => e.node) ?? [], [product]);
  const [option, setOption] = useState<string | undefined>(offer.optionValue);
  const [steps, setSteps] = useState<string | undefined>();
  const want = useMemo(() => ({ ...offer, optionValue: option }), [offer, option]);
  const choices = useMemo(() => {
    const seen = new Set<string>();
    return variants
      .map((v) => variantIn(want, v, variants))
      .filter((v): v is Variant => !!v && !seen.has(v.id) && !!seen.add(v.id));
  }, [variants, want]);
  const [chosen, setChosen] = useState<Variant | null>(null);
  const [qty, setQty] = useState<OfferQty>(offer.qty ?? 1);
  // Bij een andere set blijft de gekozen kleur staan.
  const productImages = product?.node.images?.edges?.map((e) => e.node) ?? [];
  const sceneImage = offerImage(offer, productImages);
  // Standaard de kleur die op de scènefoto staat; de directe koopfoto volgt daarna de variant.
  const photoColor = choices.find((v) => (sceneImage?.altText ?? "").toLowerCase().includes(` ${colorLabel(v).toLowerCase()} `));
  const variant = (chosen && choices.find((v) => colorLabel(v) === colorLabel(chosen))) ?? photoColor ?? choices[0] ?? null;
  const image = directCompact ? directOfferImage(variant?.image, productImages, sceneImage) : sceneImage;
  const picker = isOfferProduct(offer.handle);
  const unit = variant ? parseFloat(variant.price.amount) : null;
  const count = picker ? qty : 1;
  const saving = eightSetSaving(variant, variants);
  const available = canPurchaseVariant(!!product, variant);
  const viewedRef = useRef<string | null>(null);
  useEffect(() => { onAvailabilityChange?.(available); }, [available, onAvailabilityChange]);
  useEffect(() => {
    if (!viewPath || !product || !variant) return;
    const key = `${viewPath}::${variant.id}`;
    if (viewedRef.current === key) return;
    viewedRef.current = key;
    trackViewItem([{
      item_id: numericVariantId(variant.id),
      item_name: product.node.title,
      item_variant: variant.title,
      price: parseFloat(variant.price.amount),
      quantity: 1,
    }]);
    void trackSiteEvent("view_item", {
      path: viewPath,
      itemName: product.node.title,
      value: parseFloat(variant.price.amount),
    });
  }, [viewPath, product, variant]);

  const add = () => {
    if (!product || !variant || !available) return;
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: { amount: variant.price.amount, currencyCode: variant.price.currencyCode },
      quantity: count,
      selectedOptions: variant.selectedOptions,
    });
  };
  onAddRef?.(add);

  return (
    <div data-direct-buy={directCompact ? "" : undefined} className={directCompact ? "flex flex-col gap-2 rounded-2xl border border-foreground/10 bg-background p-3 md:gap-3 md:p-4" : `flex flex-col gap-2 bg-background md:gap-3 md:rounded-2xl md:border md:border-foreground/10 md:p-4 ${hideImage ? "" : "rounded-2xl border border-foreground/10 p-3"}`}>
      {image && (!solo || directCompact) && (
        <img
          {...responsiveImg(image.url, "(min-width: 768px) 33vw, 100vw")}
          alt={image.altText || product?.node.title || offer.label}
          className={directCompact ? "h-32 w-full rounded-lg border border-border/70 bg-background-secondary object-contain md:h-40" : `aspect-[4/3] w-full rounded-xl border border-border/70 bg-background-secondary object-cover md:aspect-square ${hideImage ? "hidden md:block" : ""}`}
          loading={directCompact ? "eager" : "lazy"}
          fetchPriority={directCompact ? "high" : "auto"}
          decoding="async"
        />
      )}
      <div>
        <h2 className={directCompact ? "text-xl font-semibold text-foreground" : `text-lg font-semibold text-foreground ${hideImage ? "sr-only md:not-sr-only" : ""}`}>{offer.label}</h2>
        {offer.note && <p className="text-base text-foreground/80">{offer.note}</p>}
      </div>
      {!directCompact && offer.stepQuestion && offer.stepChoices && (
        <div className="space-y-2">
          <p className="text-base font-medium text-foreground">{offer.stepQuestion}</p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={offer.stepQuestion}>
            {offer.stepChoices.map((c) => (
              <button
                key={c.label}
                type="button"
                role="radio"
                aria-checked={c.label === steps}
                onClick={() => { setSteps(c.label); setOption(c.optionValue); }}
                className={`min-h-12 rounded-xl border px-3 text-base font-medium ${c.label === steps ? "border-primary bg-primary/10 text-foreground" : "border-foreground/20 text-foreground"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          {steps && option && <p className="text-base text-foreground" aria-live="polite">Ons advies voor jouw trap: de {option}.</p>}
        </div>
      )}
      {offer.choices && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Set">
            {offer.choices.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={c === option}
                onClick={() => { setOption(c); setSteps(undefined); }}
                className={`min-h-12 rounded-xl border px-3 text-base font-medium ${c === option ? "border-primary bg-primary/10 text-foreground" : "border-foreground/20 text-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
          {offer.choiceNote && <p className="text-base text-foreground/80">{offer.choiceNote}</p>}
        </div>
      )}
      {choices.length > 1 && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Kleur">
          {choices.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={v.id === variant?.id}
              onClick={() => setChosen(v)}
              className={`min-h-12 rounded-full border px-5 text-base ${v.id === variant?.id ? "border-primary bg-primary/10 text-foreground" : "border-foreground/20 text-foreground"}`}
            >
              {colorLabel(v)}
            </button>
          ))}
        </div>
      )}
      {saving != null && <p className="text-base font-medium text-foreground">{formatPrice(saving)} voordeliger dan 2 sets van 4</p>}
      {picker && <QuantityOfferPicker unitPrice={unit} value={qty} onChange={setQty} />}
      <PerLampPrice unitPrice={unit} qty={count} offer={picker} setLamps={lampsInSet(variant)} />
      <Button
        ref={btnRef}
        disabled={!available}
        onClick={add}
        className="mt-auto h-12 w-full rounded-full bg-cta text-base text-cta-foreground hover:bg-cta-hover focus-visible:ring-cta"
      >
        {!product ? "Laden..." : variant?.availableForSale ? "In winkelwagen" : "Uitverkocht"}
      </Button>
      <PlacementGuideBonus productHandle={offer.handle} />
      {directCompact ? (
        <p className="whitespace-nowrap text-center text-sm text-foreground/80">{trapDirectTrust()}</p>
      ) : (
        <PurchaseReassurance />
      )}
      {sticky && !directCompact && <TrustLine />}
      {sticky && (
        <StickyAddBar
          watch={btnRef}
          qty={count}
          total={unit != null ? quoteQty(unit, count, now).total : null}
          disabled={!available}
          onAdd={add}
          image={image?.url}
          label={offer.handle === STEP_PRODUCT_HANDLE
            ? parseVariantLabel("sconce", variant?.selectedOptions ?? []).setSize
            : picker ? undefined : variant?.title}
        />
      )}
    </div>
  );
}

const LandingPage = () => {
  const { pathname } = useLocation();
  const page = getLandingPage(pathname.replace(/\/+$/, ""));
  const [products, setProducts] = useState<Record<string, ShopifyProduct>>({});
  const addRef = useRef<(() => void) | null>(null);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!page) return;
    setAvailable(false);
    addRef.current = null;
    const handles = [...new Set(page.offers.map((o) => o.handle))];
    Promise.all(handles.map((h) => fetchProductByHandle(h).catch(() => null))).then((list) => {
      const map: Record<string, ShopifyProduct> = {};
      list.forEach((p) => p && (map[p.node.handle] = p));
      setProducts(map);
    });
  }, [page]);

  if (!page) return <NotFound />;

  const jsonLd = [
    ...Object.values(products).map((p) => productSchema(p, { path: page.path, description: page.description })),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: page.h1, path: page.path },
    ]),
  ];

  const solo = page.offers.length === 1;
  const cols = page.offers.length >= 3 ? "md:grid-cols-3" : page.offers.length === 2 ? "md:grid-cols-2" : "";
  const handles = [...new Set(page.offers.map((o) => o.handle))];
  const first = page.offers[0];
  const heroImage = first ? offerImage(first, products[first.handle]?.node.images?.edges?.map((e) => e.node) ?? []) : null;

  if (page.layout) {
    return <AdLandingLayout page={page} products={products} jsonLd={jsonLd} />;
  }

  const pair = first ? getBeforeAfterPair(first.handle) : undefined;
  const firstImages = first ? products[first.handle]?.node.images?.edges?.map((e) => e.node) ?? [] : [];
  const desktopImages = heroImage ? [heroImage, ...firstImages.filter((im) => im.url !== heroImage.url)] : firstImages;
  const intro = page.intro.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? page.intro;

  const sections: InfoSection[] = [
    ...(page.extra ? [{ id: "extra", title: page.extra.heading, body: <ExtraBlock page={page} products={products} /> }] : []),
    ...(page.sections ?? []).map((sec) => ({ id: sec.heading, title: sec.heading, body: <PlainList items={sec.items} /> })),
  ];
  const hasReviews = reviewsFor(first.handle).length > 0;
  const anchorLinks = [
    { id: "kopen", label: "Kopen" },
    { id: "zo-werkt-het", label: "Zo werkt het" },
    ...(hasReviews ? [{ id: "reviews", label: "Reviews" }] : []),
    { id: "specificaties", label: "Specificaties" },
    { id: "vragen", label: "Vragen" },
  ];

  return (
    <PageLayout seo={{ title: page.title, description: page.description, path: page.path, jsonLd, dutchOnly: true }}>
      <div className="container max-w-6xl space-y-8 pb-12 md:space-y-12 md:py-14">
        <section id="kopen" className="scroll-mt-24 space-y-3 md:space-y-6">
          {!page.directBuy && (
            <div className="md:hidden">
              {heroImage ? (
                <ProductImageGallery images={[heroImage]} productTitle={page.h1} mobileMaxHeight="32svh" imageClassName="h-full w-full object-cover" />
              ) : (
                <div className="-mx-6 h-[32svh] animate-pulse bg-secondary" />
              )}
            </div>
          )}
          <div className={solo && !page.directBuy ? "md:grid md:grid-cols-2 md:items-start md:gap-12" : ""}>
            {solo && !page.directBuy && (
              <div className="hidden md:sticky md:top-24 md:block">
                {desktopImages.length > 0 ? (
                  <ProductImageGallery images={desktopImages} productTitle={page.h1} />
                ) : (
                  <div className="aspect-square animate-pulse rounded-[2rem] bg-secondary" />
                )}
              </div>
            )}
            <div className={page.directBuy ? "mx-auto max-w-3xl space-y-3" : "space-y-3 md:space-y-6"}>
              <div className="max-w-3xl space-y-1 md:space-y-3">
                <h1 className={`line-clamp-2 text-2xl font-bold leading-tight text-foreground ${solo ? "md:text-4xl" : "md:text-5xl"}`}>{page.h1}</h1>
                <p className="text-base text-foreground/80 md:text-lg">{intro}</p>
              </div>
              <div className={`grid gap-4 ${cols}`}>
                {page.offers.map((o, i) => (
                  <OfferCard key={o.id} offer={o} product={products[o.handle]} sticky={i === 0} hideImage={i === 0} solo={solo} viewPath={page.directBuy ? page.path : undefined} directCompact={page.directBuy && i === 0} onAddRef={i === 0 ? (fn) => (addRef.current = fn) : undefined} onAvailabilityChange={i === 0 ? setAvailable : undefined} />
                ))}
              </div>
              <div className="max-w-3xl space-y-4">
                <Benefits items={page.benefits} />
                <AnchorNav links={anchorLinks} />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-3xl space-y-10">
          <div id="zo-werkt-het" className="scroll-mt-24 space-y-6">
            <HowItWorksSteps handle={first.handle} />
            {pair && <BeforeAfterBlock pair={pair} />}
          </div>
          <div id="reviews" className="scroll-mt-24"><CustomerReviews handle={first.handle} /></div>
          <section id="specificaties" className="scroll-mt-24 space-y-6">
            {page.specs.map((t, i) => (
              <SpecTiles key={t.product} rows={t.rows} id={`spec-${i}`} title={page.specs.length > 1 ? t.product : "Specificaties"} />
            ))}
            <p className="text-base">
              Meer weten? Bekijk{" "}
              {handles.map((h, i) => (
                <span key={h}>
                  {i > 0 && " en "}
                  <Link to={offerProductHref(page.offers.find((o) => o.handle === h)!)} className="text-primary underline underline-offset-4">
                    {products[h]?.node.title ?? "dit product"}
                  </Link>
                </span>
              ))}
              .
            </p>
          </section>
          <FaqAccordion faqs={page.faqs} />
          {sections.length > 0 && <InfoAccordion sections={sections} />}
          {page.alternative && (
            <aside className="space-y-2 rounded-2xl border border-foreground/10 p-4">
              <h2 className="text-lg font-semibold text-foreground">{page.alternative.heading}</h2>
              <p className="text-base text-foreground/80">{page.alternative.text}</p>
              <Link to={page.alternative.href} className="inline-flex min-h-12 items-center text-base font-medium text-primary underline underline-offset-4">
                {page.alternative.label}
              </Link>
            </aside>
          )}
          <div className="space-y-3">
            <AskUs />
            <p className="text-base text-foreground/80">{TRADE_NAME_LINE}</p>
          </div>
          <Button disabled={!available} onClick={() => { if (available) addRef.current?.(); }} className="h-12 w-full rounded-full bg-cta text-base text-cta-foreground hover:bg-cta-hover focus-visible:ring-cta">
            {!products[first.handle] ? "Laden..." : available ? "In winkelwagen" : "Uitverkocht"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

function AdLandingLayout({ page, products, jsonLd }: { page: LandingPageData; products: Record<string, ShopifyProduct>; jsonLd: Record<string, unknown>[] }) {
  const first = page.offers[0];
  const product = products[first.handle];
  const heroImage = offerImage(first, product?.node.images?.edges?.map((edge) => edge.node) ?? []);

  return (
    <PageLayout seo={{ title: page.title, description: page.description, path: page.path, jsonLd, dutchOnly: true, noindex: page.noindex }}>
      <div className="container max-w-3xl space-y-8 pb-12 md:py-14">
        <section id="kopen" className="scroll-mt-24 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{page.h1}</h1>
            <p className="text-[17px] leading-relaxed text-foreground/80 md:text-lg">{page.intro}</p>
          </div>
          {page.layout === "steps-first" && page.steps && <LandingSteps steps={page.steps} />}
          {heroImage ? (
            <ProductImageGallery images={[heroImage]} productTitle={page.h1} mobileMaxHeight="28svh" imageClassName="h-full w-full object-cover" />
          ) : (
            <div className="h-[28svh] animate-pulse rounded-lg bg-secondary" />
          )}
          <OfferCard offer={first} product={product} sticky hideImage solo viewPath={page.path} />
          {page.layout === "steps-after-buy" && page.steps && <LandingSteps steps={page.steps} />}
        </section>
        <FaqAccordion faqs={page.faqs} />
      </div>
    </PageLayout>
  );
}

function ExtraBlock({ page, products }: { page: NonNullable<ReturnType<typeof getLandingPage>>; products: Record<string, ShopifyProduct> }) {
  const now = useOfferDate();
  if (!page.extra) return null;
  return (
    <div className="space-y-2">
      <p>{page.extra.text}</p>
      <ul className="space-y-1">
        {page.offers.map((o) => {
          const q = landingOfferPrice(o, products[o.handle]?.node.variants.edges.map((e) => e.node) ?? [], now);
          const n = isOfferProduct(o.handle) ? o.qty ?? 1 : 1;
          return (
            <li key={o.id}>
              {o.label}
              {n > 1 ? `, ${n} lampen` : ""}
              {q && <span className="font-semibold text-foreground"> {formatPrice(q.total)}</span>}
              {q && n > 1 && <span> ({formatPrice(q.perLamp)} per lamp)</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LandingPage;
