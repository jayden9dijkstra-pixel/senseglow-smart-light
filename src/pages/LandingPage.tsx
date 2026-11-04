import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { QuantityOfferPicker } from "@/components/product/QuantityOfferPicker";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { getLandingPage, landingOfferPrice, offerImage, type LandingOffer } from "@/lib/landingPages";
import { variantIn } from "@/lib/angles";
import { isOfferProduct, quoteQty, type OfferQty } from "@/lib/quantityOffer";
import { formatPrice } from "@/lib/price";
import { productSchema, breadcrumbSchema } from "@/lib/structuredData";
import { useCartStore } from "@/stores/cartStore";
import { PerLampPrice, StickyAddBar, TrustLine } from "@/components/product/BuyBox";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { BeforeAfterSlider } from "@/components/product/BeforeAfterSlider";
import { InfoAccordion, PlainList, FaqList, Benefits, type InfoSection } from "@/components/product/InfoAccordion";
import { ShippingInfo } from "@/components/product/ShippingInfo";
import { getBeforeAfterPair } from "@/lib/beforeAfterImages";
import { PRODUCT_HANDLE } from "@/lib/productConfig";
import NotFound from "./NotFound";

type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];

/** Kleurnaam van een variant, zonder maat of setgrootte. */
const colorLabel = (v: Variant) => {
  const color = v.selectedOptions.find((o) => /kleur|color/i.test(o.name) && !/delige/i.test(o.value));
  const raw = color?.value ?? v.selectedOptions.find((o) => !/delige/i.test(o.value))?.value ?? v.title;
  return raw.replace(/\s*\d+\s*cm.*$/i, "").replace(/[\s-]+$/, "").trim();
};

function OfferCard({ offer, product, sticky, hideImage }: { offer: LandingOffer; product: ShopifyProduct | undefined; sticky?: boolean; hideImage?: boolean }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const variants = useMemo(() => product?.node.variants.edges.map((e) => e.node) ?? [], [product]);
  const choices = useMemo(() => {
    const seen = new Set<string>();
    return variants
      .map((v) => variantIn(offer, v, variants))
      .filter((v): v is Variant => !!v && !seen.has(v.id) && !!seen.add(v.id));
  }, [variants, offer]);
  const [chosen, setChosen] = useState<Variant | null>(null);
  const [qty, setQty] = useState<OfferQty>(offer.qty ?? 1);
  const variant = chosen ?? choices[0] ?? null;
  const image = offerImage(offer, product?.node.images?.edges?.map((e) => e.node) ?? []);
  const picker = isOfferProduct(offer.handle);
  const unit = variant ? parseFloat(variant.price.amount) : null;
  const count = picker ? qty : 1;

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

  return (
    <div className={`flex flex-col gap-3 bg-background md:rounded-2xl md:border md:border-foreground/10 md:p-4 ${hideImage ? "" : "rounded-2xl border border-foreground/10 p-3"}`}>
      {image && (
        <img
          src={image.url}
          alt={image.altText || product?.node.title || offer.label}
          className={`aspect-[4/3] w-full rounded-xl bg-secondary object-cover md:aspect-square ${hideImage ? "hidden md:block" : ""}`}
          loading={hideImage ? "eager" : "lazy"}
        />
      )}
      <div>
        <h2 className="text-base font-semibold text-foreground">{offer.label}</h2>
        {offer.note && <p className="text-sm text-muted-foreground">{offer.note}</p>}
      </div>
      <PerLampPrice unitPrice={unit} qty={count} offer={picker} />
      {choices.length > 1 && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Kleur">
          {choices.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={v.id === variant?.id}
              onClick={() => setChosen(v)}
              className={`rounded-full border px-3 py-1 text-sm ${v.id === variant?.id ? "border-primary bg-primary/10 text-foreground" : "border-foreground/15 text-foreground/70"}`}
            >
              {colorLabel(v)}
            </button>
          ))}
        </div>
      )}
      {picker && <QuantityOfferPicker unitPrice={unit} value={qty} onChange={setQty} />}
      <Button
        ref={btnRef}
        disabled={!product || !variant?.availableForSale}
        onClick={add}
        className="mt-auto w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {!product ? "Laden..." : variant?.availableForSale ? "In winkelwagen" : "Uitverkocht"}
      </Button>
      {sticky && <TrustLine />}
      {sticky && (
        <StickyAddBar
          watch={btnRef}
          qty={count}
          total={unit != null ? quoteQty(unit, count).total : null}
          disabled={!product || !variant?.availableForSale}
          onAdd={add}
        />
      )}
    </div>
  );
}

const LandingPage = () => {
  const { pathname } = useLocation();
  const page = getLandingPage(pathname.replace(/\/+$/, ""));
  const [products, setProducts] = useState<Record<string, ShopifyProduct>>({});

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
  const pair = SLIDER_FIRST.has(page.path) ? getBeforeAfterPair(PRODUCT_HANDLE) : undefined;
  const intro = page.intro.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? page.intro;

  const sections: InfoSection[] = [
    ...(page.extra ? [{ id: "extra", title: page.extra.heading, body: <ExtraBlock page={page} products={products} /> }] : []),
    ...(page.sections ?? []).map((sec) => ({ id: sec.heading, title: sec.heading, body: <PlainList items={sec.items} /> })),
    {
      id: "specs",
      title: "Specificaties",
      body: (
        <div className="space-y-4">
          {page.specs.map((t) => (
            <div key={t.product}>
              <p className="mb-1 font-medium text-foreground">{t.product}</p>
              <dl className="divide-y divide-foreground/10">
                {t.rows.map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-1.5">
                    <dt className="w-1/3 flex-shrink-0 font-medium text-foreground">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <p>
            Meer weten? Bekijk{" "}
            {handles.map((h, i) => (
              <span key={h}>
                {i > 0 && " en "}
                <Link to={`/product/${h}`} className="text-primary underline underline-offset-4">
                  {products[h]?.node.title ?? "dit product"}
                </Link>
              </span>
            ))}
            .
          </p>
        </div>
      ),
    },
    { id: "verzending", title: "Verzending & retour", body: <ShippingInfo handles={handles} /> },
    { id: "faq", title: "Veelgestelde vragen", body: <FaqList faqs={page.faqs} /> },
  ];

  return (
    <PageLayout seo={{ title: page.title, description: page.description, path: page.path, jsonLd, dutchOnly: true }}>
      <div className="container max-w-6xl space-y-8 pb-12 md:space-y-12 md:py-14">
        <section className="space-y-4 md:space-y-6">
          <div className="md:hidden">
            {heroImage || pair ? (
              <ProductImageGallery
                images={heroImage ? [heroImage] : []}
                productTitle={page.h1}
                imageClassName="h-full w-full object-cover"
                leadSlide={pair ? <BeforeAfterSlider beforeSrc={pair.off} afterSrc={pair.on} alt={pair.alt} className="h-full" /> : undefined}
              />
            ) : (
              <div className="-mx-6 aspect-[4/5] animate-pulse bg-secondary" />
            )}
          </div>
          <div className="max-w-3xl space-y-1 md:space-y-3">
            <h1 className="line-clamp-2 text-2xl font-bold leading-tight text-foreground md:text-5xl">{page.h1}</h1>
            <p className="text-sm text-muted-foreground md:text-lg">{intro}</p>
          </div>
          <div className={`grid gap-4 ${cols}`}>
            {page.offers.map((o, i) => (
              <OfferCard key={o.id} offer={o} product={products[o.handle]} sticky={i === 0} hideImage={i === 0} />
            ))}
          </div>
          <div className="max-w-3xl border-t border-foreground/10 pt-4">
            <Benefits items={page.benefits} />
          </div>
        </section>

        <div className="max-w-3xl">
          <InfoAccordion sections={sections} />
        </div>
      </div>
    </PageLayout>
  );
};

/** Pagina's waar de voor/na-schuif van de Ambient Motion Bar het eerste beeld is. */
const SLIDER_FIRST = new Set(["/gangverlichting", "/trapverlichting"]);

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
