import { responsiveImg, shopifySized } from "@/lib/shopifyImage";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { QuantityOfferPicker } from "@/components/product/QuantityOfferPicker";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { getLandingPage, landingOfferPrice, offerImage, offerProductHref, type LandingOffer } from "@/lib/landingPages";
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
import { eightSetSaving } from "@/lib/productBlueprint";
import { reviewsFor } from "@/data/reviews";
import { TRADE_NAME_LINE } from "@/lib/businessInfo";
import { getBeforeAfterPair } from "@/lib/beforeAfterImages";
import { PurchaseReassurance } from "@/components/product/PurchaseReassurance";
import { parseVariantLabel } from "@/lib/productRegistry";
import { STEP_PRODUCT_HANDLE } from "@/lib/productConfig";
import NotFound from "./NotFound";

type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];

/** Kleurnaam van een variant, zonder maat of setgrootte. */
const colorLabel = (v: Variant) => {
  const color = v.selectedOptions.find((o) => /kleur|color/i.test(o.name) && !/delige/i.test(o.value));
  const raw = color?.value ?? v.selectedOptions.find((o) => !/delige/i.test(o.value))?.value ?? v.title;
  return raw.replace(/\s*\d+\s*cm.*$/i, "").replace(/[\s-]+$/, "").trim();
};

function OfferCard({ offer, product, sticky, hideImage, onAddRef }: { offer: LandingOffer; product: ShopifyProduct | undefined; sticky?: boolean; hideImage?: boolean; onAddRef?: (add: () => void) => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const variants = useMemo(() => product?.node.variants.edges.map((e) => e.node) ?? [], [product]);
  const [option, setOption] = useState<string | undefined>(offer.optionValue);
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
  const image = offerImage(offer, product?.node.images?.edges?.map((e) => e.node) ?? []);
  // Standaard de kleur die op de eerste foto staat.
  const photoColor = choices.find((v) => (image?.altText ?? "").toLowerCase().includes(` ${colorLabel(v).toLowerCase()} `));
  const variant = (chosen && choices.find((v) => colorLabel(v) === colorLabel(chosen))) ?? photoColor ?? choices[0] ?? null;
  const picker = isOfferProduct(offer.handle);
  const unit = variant ? parseFloat(variant.price.amount) : null;
  const count = picker ? qty : 1;
  const saving = eightSetSaving(variant, variants);

  const add = () => {
    if (!product || !variant) return;
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
    <div className={`flex flex-col gap-2 bg-background md:gap-3 md:rounded-2xl md:border md:border-foreground/10 md:p-4 ${hideImage ? "" : "rounded-2xl border border-foreground/10 p-3"}`}>
      {image && (
        <img
          {...responsiveImg(image.url, "(min-width: 768px) 33vw, 100vw")}
          alt={image.altText || product?.node.title || offer.label}
          className={`aspect-[4/3] w-full rounded-xl bg-secondary object-cover md:aspect-square ${hideImage ? "hidden md:block" : ""}`}
          loading="lazy"
          decoding="async"
        />
      )}
      <div>
        <h2 className={`text-lg font-semibold text-foreground ${hideImage ? "sr-only md:not-sr-only" : ""}`}>{offer.label}</h2>
        {offer.note && <p className="text-base text-foreground/80">{offer.note}</p>}
      </div>
      {offer.choices && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Set">
            {offer.choices.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={c === option}
                onClick={() => setOption(c)}
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
      <PerLampPrice unitPrice={unit} qty={count} offer={picker} />
      <Button
        ref={btnRef}
        disabled={!product || !variant?.availableForSale}
        onClick={add}
        className="mt-auto h-12 w-full rounded-full bg-primary text-base text-primary-foreground hover:bg-primary/90"
      >
        {!product ? "Laden..." : variant?.availableForSale ? "In winkelwagen" : "Uitverkocht"}
      </Button>
      <PurchaseReassurance />
      {sticky && <TrustLine />}
      {sticky && (
        <StickyAddBar
          watch={btnRef}
          qty={count}
          total={unit != null ? quoteQty(unit, count).total : null}
          disabled={!product || !variant?.availableForSale}
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

  useEffect(() => {
    if (!page) return;
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

  const cols = page.offers.length >= 3 ? "md:grid-cols-3" : page.offers.length === 2 ? "md:grid-cols-2" : "md:max-w-md";
  const handles = [...new Set(page.offers.map((o) => o.handle))];
  const first = page.offers[0];
  const heroImage = first ? offerImage(first, products[first.handle]?.node.images?.edges?.map((e) => e.node) ?? []) : null;
  const pair = first ? getBeforeAfterPair(first.handle) : undefined;
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
          <div className="md:hidden">
            {heroImage ? (
              <ProductImageGallery images={[heroImage]} productTitle={page.h1} mobileMaxHeight="26svh" />
            ) : (
              <div className="-mx-6 h-[26svh] animate-pulse bg-secondary" />
            )}
          </div>
          <div className="max-w-3xl space-y-1 md:space-y-3">
            <h1 className="line-clamp-2 text-2xl font-bold leading-tight text-foreground md:text-5xl">{page.h1}</h1>
            <p className="text-base text-foreground/80 md:text-lg">{intro}</p>
          </div>
          <div className={`grid gap-4 ${cols}`}>
            {page.offers.map((o, i) => (
              <OfferCard key={o.id} offer={o} product={products[o.handle]} sticky={i === 0} hideImage={i === 0} onAddRef={i === 0 ? (fn) => (addRef.current = fn) : undefined} />
            ))}
          </div>
          <div className="max-w-3xl space-y-4">
            <Benefits items={page.benefits} />
            <AnchorNav links={anchorLinks} />
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
          <Button onClick={() => addRef.current?.()} className="h-12 w-full rounded-full bg-primary text-base text-primary-foreground hover:bg-primary/90">
            In winkelwagen
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};


function ExtraBlock({ page, products }: { page: NonNullable<ReturnType<typeof getLandingPage>>; products: Record<string, ShopifyProduct> }) {
  if (!page.extra) return null;
  return (
    <div className="space-y-2">
      <p>{page.extra.text}</p>
      <ul className="space-y-1">
        {page.offers.map((o) => {
          const q = landingOfferPrice(o, products[o.handle]?.node.variants.edges.map((e) => e.node) ?? []);
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
