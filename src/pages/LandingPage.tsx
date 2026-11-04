import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductFAQSection } from "@/components/product/ProductFAQSection";
import { DeliveryEstimate } from "@/components/product/DeliveryEstimate";
import { QuantityOfferPicker } from "@/components/product/QuantityOfferPicker";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { getLandingPage, landingOfferPrice, offerImage, type LandingOffer } from "@/lib/landingPages";
import { WhySenseGlow } from "@/components/product/WhySenseGlow";
import { variantIn } from "@/lib/angles";
import { isOfferProduct, quoteQty, OFFER_TEXT, type OfferQty } from "@/lib/quantityOffer";
import { formatPrice } from "@/lib/price";
import { WARRANTY_TEXT } from "@/lib/productFaqs";
import { productSchema, breadcrumbSchema } from "@/lib/structuredData";
import { useCartStore } from "@/stores/cartStore";
import { PerLampPrice, StickyAddBar, TrustLine } from "@/components/product/BuyBox";
import NotFound from "./NotFound";

type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];

/** Kleurnaam van een variant, zonder maat of setgrootte. */
const colorLabel = (v: Variant) => {
  const color = v.selectedOptions.find((o) => /kleur|color/i.test(o.name) && !/delige/i.test(o.value));
  const raw = color?.value ?? v.selectedOptions.find((o) => !/delige/i.test(o.value))?.value ?? v.title;
  return raw.replace(/\s*\d+\s*cm.*$/i, "").trim();
};

function OfferCard({ offer, product, sticky }: { offer: LandingOffer; product: ShopifyProduct | undefined; sticky?: boolean }) {
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
    <div className="flex flex-col gap-2.5 rounded-2xl border border-foreground/10 bg-background p-3 md:gap-3 md:p-4">
      {image && (
        <img
          src={image.url}
          alt={image.altText || product?.node.title || offer.label}
          className={`h-[200px] w-full rounded-xl bg-secondary md:h-auto md:aspect-square ${offer.imageUrl ? "object-cover" : "object-contain p-3 md:p-4"}`}
          loading="eager"
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
      <TrustLine />
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

  return (
    <PageLayout seo={{ title: page.title, description: page.description, path: page.path, jsonLd, dutchOnly: true }}>
      <div className="container max-w-6xl space-y-14 pb-10 pt-3 md:py-14">
        <section className="space-y-3 md:space-y-6">
          <div className="max-w-3xl space-y-1.5 md:space-y-3">
            <h1 className="text-2xl font-bold leading-tight text-foreground md:text-5xl">{page.h1}</h1>
            <p className="line-clamp-2 text-sm text-muted-foreground md:line-clamp-none md:text-lg">{page.intro}</p>
          </div>
          <div className={`grid gap-4 ${cols}`}>
            {page.offers.map((o, i) => (
              <OfferCard key={o.id} offer={o} product={products[o.handle]} sticky={i === 0} />
            ))}
          </div>
          <DeliveryEstimate />
          {page.pickerNote && <p className="text-sm text-foreground/70">{page.pickerNote}</p>}
          {page.offers.some((o) => isOfferProduct(o.handle)) && <p className="text-sm text-foreground/70">{OFFER_TEXT}</p>}
        </section>

        {page.why && <WhySenseGlow handles={[...new Set(page.offers.map((o) => o.handle))]} />}

        {page.extra && (
          <section className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-bold text-foreground">{page.extra.heading}</h2>
            <p className="text-foreground/80">{page.extra.text}</p>
            <ul className="space-y-1.5 text-foreground/80">
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
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-foreground">{page.benefitsHeading ?? "Waarom deze keuze"}</h2>
          <ul className="space-y-2">
            {page.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-foreground/80">
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
            <li className="flex items-start gap-2.5 text-foreground/80">
              <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
              <span>{WARRANTY_TEXT}</span>
            </li>
          </ul>
        </section>

        {page.sections?.map((sec) => (
          <section key={sec.heading} className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-bold text-foreground">{sec.heading}</h2>
            <ul className="space-y-1.5 text-foreground/80">
              {sec.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Specificaties</h2>
          {page.specs.map((t) => (
            <div key={t.product} className="overflow-hidden rounded-2xl border border-foreground/10">
              <table className="w-full text-left text-sm">
                <caption className="bg-secondary px-4 py-3 text-left font-semibold text-foreground">{t.product}</caption>
                <tbody>
                  {t.rows.map(([k, v]) => (
                    <tr key={k} className="border-t border-foreground/10">
                      <th scope="row" className="w-1/3 px-4 py-2.5 font-medium text-foreground">{k}</th>
                      <td className="px-4 py-2.5 text-foreground/75">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <p className="text-sm text-muted-foreground">
            Meer weten? Bekijk de productpagina van{" "}
            {[...new Set(page.offers.map((o) => o.handle))].map((h, i) => (
              <span key={h}>
                {i > 0 && " en "}
                <Link to={`/product/${h}`} className="text-primary underline underline-offset-4">
                  {products[h]?.node.title ?? "dit product"}
                </Link>
              </span>
            ))}
            .
          </p>
        </section>
      </div>

      <ProductFAQSection headline="Veelgestelde vragen" subtitle={page.h1} faqs={page.faqs} />
    </PageLayout>
  );
};

export default LandingPage;
