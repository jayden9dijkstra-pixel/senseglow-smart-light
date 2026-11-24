import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Truck, RotateCcw, ShieldCheck, BatteryCharging, Hand, Footprints } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";
import type { LandingPage } from "@/lib/landingPages";
import { formatPrice } from "@/lib/price";
import { deliveryWindow, formatDeliveryDate } from "@/lib/delivery";
import { canPurchaseVariant } from "@/lib/purchaseAvailability";
import { numericVariantId, trackViewItem } from "@/lib/adsTracking";
import { trackSiteEvent } from "@/lib/siteAnalytics";
import { responsiveImg } from "@/lib/shopifyImage";
import { GoogleReviewLine } from "@/components/GoogleBrandReview";
import { useOfferDate } from "@/hooks/useOfferDate";
import { isBlackFriday } from "@/lib/blackFriday";
import idealLogo from "@/assets/pay/ideal.svg";
import visaLogo from "@/assets/pay/visa.svg";
import masterLogo from "@/assets/pay/master.svg";
import paypalLogo from "@/assets/pay/paypal.svg";

type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];
type Img = { url: string; altText: string | null; width?: number | null; height?: number | null };

const SETS = [
  { value: "4-delige set", lamps: 4, title: "4 lampen", fit: "Trap tot 12 treden" },
  { value: "8-delige set", lamps: 8, title: "8 lampen", fit: "Trap vanaf 13 treden, of trap plus overloop" },
] as const;

const opt = (v: Variant, re: RegExp) => v.selectedOptions.find((o) => re.test(o.value))?.value;
const colorOf = (v: Variant) => v.selectedOptions.find((o) => !/delige/i.test(o.value))?.value ?? "";
const money = (v: Variant | undefined, key: "price" | "compareAtPrice") => {
  const m = v?.[key];
  return m ? parseFloat(m.amount) : null;
};

/** Volgorde van de galerij: trapfoto's eerst, daarna de rest zoals in Shopify. */
function orderImages(images: Img[]): Img[] {
  const score = (im: Img) => (/trap/i.test(im.altText ?? "") ? 0 : /set van 4|zwart en wit|wit en zwart/i.test(im.altText ?? "") ? 1 : 2);
  return [...images].sort((a, b) => score(a) - score(b));
}

function Gallery({ images, title }: { images: Img[]; title: string }) {
  const [active, setActive] = useState(0);
  const main = images[active];
  if (!main) return <div className="aspect-square w-full animate-pulse rounded-2xl bg-secondary" />;
  return (
    <div className="min-w-0 space-y-2">
      <div className="relative overflow-hidden rounded-2xl bg-[#0F1B2D]">
        <img
          {...responsiveImg(main.url, "(min-width: 768px) 50vw, 100vw")}
          alt={main.altText || title}
          className="aspect-[4/3] w-full object-cover md:aspect-square"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Meer foto's">
          {images.map((im, i) => (
            <li key={im.url} className="flex-none">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Foto ${i + 1}: ${im.altText ?? title}`}
                aria-current={i === active}
                className={`block h-16 w-16 overflow-hidden rounded-lg border-2 md:h-20 md:w-20 ${i === active ? "border-foreground" : "border-transparent opacity-80"}`}
              >
                <img {...responsiveImg(im.url, "80px")} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-border py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-foreground">
        {q}
        <ChevronDown aria-hidden className="h-5 w-5 flex-none transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-2 text-base leading-relaxed text-foreground/80">{a}</p>
    </details>
  );
}

/**
 * Eén-product-funnel voor de trap-advertentiepagina's (opbouw zoals de beste NL-dropshipwinkels):
 * galerij, prijs met Shopify compare-at, setkeuze als kaarten, één grote knop, risico weg eronder.
 * Alle prijzen komen uit Shopify; geen verzonnen reviews of specs.
 */
export function TrapFunnel({ page, product, jsonLd }: { page: LandingPage; product: ShopifyProduct | undefined; jsonLd: Record<string, unknown>[] }) {
  const now = useOfferDate();
  const addItem = useCartStore((s) => s.addItem);
  const variants = useMemo(() => product?.node.variants.edges.map((e) => e.node) ?? [], [product]);
  const colors = useMemo(() => [...new Set(variants.map(colorOf))].filter(Boolean), [variants]);
  const [color, setColor] = useState<string | null>(null);
  const [set, setSet] = useState<string>(SETS[0].value);
  const activeColor = color ?? (colors.includes("Zwart") ? "Zwart" : colors[0]) ?? "";
  const variantFor = (setValue: string) => variants.find((v) => opt(v, /delige/i) === setValue && colorOf(v) === activeColor);
  const variant = variantFor(set);
  const available = canPurchaseVariant(!!product, variant);
  const price = money(variant, "price");
  const was = money(variant, "compareAtPrice");
  const images = useMemo(() => orderImages(product?.node.images?.edges?.map((e) => e.node) ?? []), [product]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const viewed = useRef<string | null>(null);
  const { from, to } = deliveryWindow(now);
  const bf = isBlackFriday(now);

  useEffect(() => {
    if (!product || !variant || viewed.current === variant.id) return;
    viewed.current = variant.id;
    trackViewItem([{ item_id: numericVariantId(variant.id), item_name: product.node.title, item_variant: variant.title, price: parseFloat(variant.price.amount), quantity: 1 }]);
    void trackSiteEvent("view_item", { path: page.path, itemName: product.node.title, value: parseFloat(variant.price.amount) });
  }, [product, variant, page.path]);

  useEffect(() => {
    const el = btnRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [product]);

  const add = () => {
    if (!product || !variant || !available) return;
    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: { amount: variant.price.amount, currencyCode: variant.price.currencyCode },
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
  };

  const off = price != null && was != null && was > price ? Math.round((1 - price / was) * 100) : 0;
  const buttonLabel = !product ? "Laden..." : !variant?.availableForSale ? "Uitverkocht" : `In winkelwagen · ${price != null ? formatPrice(price) : ""}`;

  return (
    <PageLayout seo={{ title: page.title, description: page.description, path: page.path, jsonLd, dutchOnly: true }}>
      <div className="border-b border-border bg-secondary">
        <p className="container flex max-w-6xl items-center justify-center gap-x-4 whitespace-nowrap py-2 text-[13px] font-semibold text-foreground md:text-sm">
          <span className="flex items-center gap-1.5"><Truck aria-hidden className="h-4 w-4" />Gratis verzending NL en BE</span>
          <span className="flex items-center gap-1.5"><RotateCcw aria-hidden className="h-4 w-4" />30 dagen geld terug</span>
        </p>
      </div>

      <div className="container max-w-6xl pb-16 pt-4 md:pt-10">
        <section id="kopen" className="grid gap-6 md:grid-cols-2 md:items-start md:gap-12">
          <div className="min-w-0 md:sticky md:top-24">
            <Gallery images={images} title={page.h1} />
          </div>

          <div className="min-w-0 space-y-5">
            <div className="space-y-2">
              <GoogleReviewLine />
              <h1 className="text-[28px] font-extrabold leading-[1.1] tracking-tight text-foreground md:text-5xl">{page.h1}</h1>
              <p className="text-base text-foreground/75">SenseGlow Wall Lamp, oplaadbaar via USB-C</p>
            </div>

            <div className="flex flex-wrap items-center gap-3" aria-live="polite">
              {was != null && off > 0 && <s className="text-xl text-foreground/50">{formatPrice(was)}</s>}
              <span className="text-4xl font-extrabold tracking-tight text-[#D92D20]">{price != null ? formatPrice(price) : "…"}</span>
              {off > 0 && (
                <span className="rounded-full bg-[#D92D20] px-3 py-1 text-sm font-bold text-white">
                  {bf ? "Black Friday " : ""}−{off}%
                </span>
              )}
            </div>

            <ul className="space-y-2 text-[17px] text-foreground">
              <li className="flex gap-3"><Hand aria-hidden className="mt-0.5 h-5 w-5 flex-none text-[#9A5B00]" />Plakken op de muur: geen boren, geen stroomkabel</li>
              <li className="flex gap-3"><Footprints aria-hidden className="mt-0.5 h-5 w-5 flex-none text-[#9A5B00]" />Gaat vanzelf aan als je de trap nadert</li>
              <li className="flex gap-3"><BatteryCharging aria-hidden className="mt-0.5 h-5 w-5 flex-none text-[#9A5B00]" />Oplaadbaar via USB-C: nooit meer batterijen kopen</li>
            </ul>

            {colors.length > 1 && (
              <fieldset className="space-y-2">
                <legend className="text-base font-bold text-foreground">Kleur: <span className="font-medium">{activeColor}</span></legend>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      role="radio"
                      aria-checked={c === activeColor}
                      onClick={() => setColor(c)}
                      className={`flex min-h-12 items-center gap-2 rounded-full border-2 px-5 text-base font-semibold ${c === activeColor ? "border-foreground" : "border-border"}`}
                    >
                      <span aria-hidden className={`h-4 w-4 rounded-full border border-foreground/30 ${/zwart/i.test(c) ? "bg-[#1a1a1a]" : "bg-white"}`} />
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <fieldset className="space-y-2">
              <legend className="text-base font-bold text-foreground">Kies je set</legend>
              <div className="space-y-2" role="radiogroup" aria-label="Kies je set">
                {SETS.map((s) => {
                  const v = variantFor(s.value);
                  const p = money(v, "price");
                  const w = money(v, "compareAtPrice");
                  const selected = s.value === set;
                  const best = s.lamps === 8;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSet(s.value)}
                      className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors ${selected ? "border-foreground bg-[#FFF6E5]" : "border-border bg-background"}`}
                    >
                      <span aria-hidden className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 ${selected ? "border-foreground" : "border-foreground/30"}`}>
                        {selected && <span className="h-3 w-3 rounded-full bg-foreground" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-foreground">
                          {s.title}
                          {best && <span className="rounded-full bg-[#FFB020] px-2 py-0.5 text-xs font-bold text-[#0F1B2D]">Laagste prijs per lamp</span>}
                        </span>
                        <span className="block text-sm text-foreground/70">{s.fit}</span>
                      </span>
                      <span className="flex-none text-right">
                        <span className="block text-lg font-extrabold text-foreground">{p != null ? formatPrice(p) : "…"}</span>
                        {w != null && p != null && w > p && <s className="block text-sm text-foreground/50">{formatPrice(w)}</s>}
                        {p != null && <span className="block text-xs font-semibold text-foreground/70">{formatPrice(Math.round((p / s.lamps) * 100) / 100)} per lamp</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button
              ref={btnRef}
              type="button"
              disabled={!available}
              onClick={add}
              className="h-14 w-full rounded-full bg-[#FFB020] text-lg font-extrabold text-[#0F1B2D] shadow-[0_6px_0_#C98500] transition-transform hover:bg-[#FFA500] active:translate-y-1 active:shadow-[0_2px_0_#C98500] disabled:opacity-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#0F1B2D]"
            >
              {buttonLabel}
            </button>

            <ul className="space-y-2 rounded-2xl bg-secondary p-4 text-base text-foreground">
              <li className="flex gap-3"><Truck aria-hidden className="mt-0.5 h-5 w-5 flex-none" /><span>Bezorgd tussen <strong>{formatDeliveryDate(from)}</strong> en <strong>{formatDeliveryDate(to)}</strong>, gratis</span></li>
              <li className="flex gap-3"><RotateCcw aria-hidden className="mt-0.5 h-5 w-5 flex-none" /><span>Niet tevreden? 30 dagen geld terug, retour op onze kosten</span></li>
              <li className="flex gap-3"><ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 flex-none" /><span>1 jaar extra garantie bovenop je wettelijke garantie</span></li>
              <li className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <span className="rounded bg-[#FFB3C7] px-1.5 py-0.5 text-sm font-bold text-[#0B051D]">Klarna</span>
                <span className="mr-1">Achteraf betalen</span>
                {[{ n: "iDEAL", s: idealLogo }, { n: "Visa", s: visaLogo }, { n: "Mastercard", s: masterLogo }, { n: "PayPal", s: paypalLogo }].map((m) => (
                  <img key={m.n} src={m.s} alt={m.n} width={36} height={23} className="h-[23px] w-[36px]" loading="lazy" />
                ))}
              </li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="zo-werkt-het" className="mt-16 md:mt-24">
          <h2 id="zo-werkt-het" className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Zo hangt je trap in 3 stappen vol licht</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Opladen", "Laad de lampen op met de meegeleverde USB-C-kabel."],
              ["Plakken", "Plak ze op de muur langs de trap, ongeveer om de 3 treden. Geen boren."],
              ["Lopen", "Loop de trap op of af: de lampen gaan vanzelf aan en daarna weer uit."],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-2xl border border-border p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-lg font-extrabold text-background">{i + 1}</span>
                <h3 className="mt-3 text-xl font-extrabold text-foreground">{t}</h3>
                <p className="mt-1 text-base text-foreground/80">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="vergelijk" className="mt-16 md:mt-24">
          <h2 id="vergelijk" className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Waarom oplaadbaar beter werkt</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-base">
              <thead className="bg-foreground text-background">
                <tr><th className="p-3 font-bold" scope="col"><span className="sr-only">Kenmerk</span></th><th className="p-3 font-bold" scope="col">SenseGlow</th><th className="p-3 font-bold" scope="col">Lampjes op batterijen</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Stroom", "Opladen via USB-C", "Steeds nieuwe batterijen kopen"],
                  ["Montage", "Plakken, geen boren", "Vaak plakken of schroeven"],
                  ["Aan en uit", "Vanzelf bij beweging", "Vanzelf bij beweging"],
                ].map(([k, a, b]) => (
                  <tr key={k}>
                    <th scope="row" className="p-3 font-semibold text-foreground/70">{k}</th>
                    <td className="p-3 font-semibold text-foreground"><span className="inline-flex items-center gap-1.5"><Check aria-hidden className="h-4 w-4 text-[#1A7F37]" />{a}</span></td>
                    <td className="p-3 text-foreground/70">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {page.faqs.length > 0 && (
          <section aria-labelledby="vragen" className="mt-16 md:mt-24">
            <h2 id="vragen" className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Veelgestelde vragen</h2>
            <div className="mt-4">
              {page.faqs.map((f) => <Faq key={f.question} q={f.question} a={f.answer} />)}
            </div>
          </section>
        )}

        <section className="mt-16 rounded-3xl bg-[#0F1B2D] p-6 text-center text-white md:mt-24 md:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Nooit meer in het donker de trap op</h2>
          <p className="mx-auto mt-2 max-w-md text-base text-white/80">Bestel vandaag, betaal achteraf met Klarna en probeer het 30 dagen.</p>
          <button
            type="button"
            onClick={() => document.getElementById("kopen")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-6 h-14 rounded-full bg-[#FFB020] px-8 text-lg font-extrabold text-[#0F1B2D] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Kies je set
          </button>
        </section>
      </div>

      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden" data-print-hidden>
          <button
            type="button"
            disabled={!available}
            onClick={add}
            className="h-12 w-full rounded-full bg-[#FFB020] text-base font-extrabold text-[#0F1B2D] disabled:opacity-50"
          >
            {SETS.find((s) => s.value === set)?.title} {activeColor.toLowerCase()} · {price != null ? formatPrice(price) : ""} · In winkelwagen
          </button>
        </div>
      )}
    </PageLayout>
  );
}
