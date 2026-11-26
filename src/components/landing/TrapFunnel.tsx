import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";
import type { LandingPage } from "@/lib/landingPages";
import { formatPrice } from "@/lib/price";
import { canPurchaseVariant } from "@/lib/purchaseAvailability";
import { numericVariantId, trackViewItem } from "@/lib/adsTracking";
import { trackSiteEvent } from "@/lib/siteAnalytics";
import { useOfferDate } from "@/hooks/useOfferDate";
import { isBlackFriday } from "@/lib/blackFriday";
import { DeferredLamp3D } from "@/components/product/DeferredLamp3D";
import { SetUnitPrice } from "@/components/product/SetUnitPrice";
import { lampsInSet } from "@/lib/productBlueprint";
import { ChoiceCards, FunnelGallery, FunnelTitle, GlowButton, Highlights, Pills, PriceRow, RiskBlock, partsOf, type Img, type Variant } from "@/components/product/FunnelBuy";

const WALL_LAMP_3D = "https://cdn.shopify.com/s/files/1/0964/9497/7322/files/senseglow-wall-lamp-3d.glb";

const SETS = [
  { value: "4-delige set", lamps: 4, title: "4 lampen", fit: "Trap tot 12 treden" },
  { value: "8-delige set", lamps: 8, title: "8 lampen", fit: "Trap vanaf 13 treden, of trap plus overloop" },
] as const;

const HIGHLIGHTS = [
  { icon: "stick" as const, text: "Plakken op de muur: geen boren, geen stroomkabel" },
  { icon: "motion" as const, text: "Gaat vanzelf aan als je de trap nadert" },
  { icon: "usb" as const, text: "Oplaadbaar via USB-C: nooit meer batterijen kopen" },
];

const money = (v: Variant | undefined, key: "price" | "compareAtPrice") => {
  const m = v?.[key];
  return m ? parseFloat(m.amount) : null;
};

/** Trapfoto's eerst, daarna de rest zoals in Shopify. */
function orderImages(images: Img[]): Img[] {
  const score = (im: Img) => (/trap/i.test(im.altText ?? "") ? 0 : /set van 4|zwart en wit|wit en zwart/i.test(im.altText ?? "") ? 1 : 2);
  return [...images].sort((a, b) => score(a) - score(b));
}

/**
 * Koopblok van de Wall Lamp: setkaarten (4 of 8), kleur, rode prijs uit Shopify (compare-at), één gloedknop.
 * Gebruikt op de trap-advertentiepagina's en op de Wall Lamp-productpagina.
 */
export function TrapFunnelPanel({ product, title, sub, buttonRef, path, onVariantImage }: { product: ShopifyProduct | undefined; title: string; sub?: string; buttonRef?: React.RefObject<HTMLButtonElement>; path?: string; onVariantImage?: (url: string | null) => void }) {
  const now = useOfferDate();
  const addItem = useCartStore((s) => s.addItem);
  const variants = useMemo(() => product?.node.variants.edges.map((e) => e.node) ?? [], [product]);
  const colors = useMemo(() => [...new Set(variants.map((v) => partsOf(v).color))].filter(Boolean), [variants]);
  const [color, setColor] = useState<string | null>(null);
  const [set, setSet] = useState<string>(SETS[1].value);
  const activeColor = color ?? (colors.includes("Zwart") ? "Zwart" : colors[0]) ?? "";
  const variantFor = (s: string) => variants.find((v) => partsOf(v).size === s && partsOf(v).color === activeColor);
  const variant = variantFor(set);
  const available = canPurchaseVariant(!!product, variant);
  const price = money(variant, "price");
  const was = money(variant, "compareAtPrice");
  const ownRef = useRef<HTMLButtonElement>(null);
  const btnRef = buttonRef ?? ownRef;
  const [showSticky, setShowSticky] = useState(false);
  const viewed = useRef<string | null>(null);
  // Alleen na een keuze van de bezoeker de variantfoto doorgeven; bij laden blijft foto 1 staan.
  const pickReady = useRef(false);
  useEffect(() => {
    if (!pickReady.current) { pickReady.current = true; return; }
    onVariantImage?.(variant?.image?.url ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, set]);

  useEffect(() => {
    if (!path || !product || !variant || viewed.current === variant.id) return;
    viewed.current = variant.id;
    trackViewItem([{ item_id: numericVariantId(variant.id), item_name: product.node.title, item_variant: variant.title, price: parseFloat(variant.price.amount), quantity: 1 }]);
    void trackSiteEvent("view_item", { path, itemName: product.node.title, value: parseFloat(variant.price.amount) });
  }, [product, variant, path]);

  useEffect(() => {
    const el = btnRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [product, btnRef]);

  const add = () => {
    if (!product || !variant || !available) return;
    addItem({ product, variantId: variant.id, variantTitle: variant.title, price: { amount: variant.price.amount, currencyCode: variant.price.currencyCode }, quantity: 1, selectedOptions: variant.selectedOptions });
  };

  const label = !product ? "Laden..." : !variant?.availableForSale ? "Uitverkocht" : `In winkelwagen · ${price != null ? formatPrice(price) : ""}`;

  return (
    <div className="min-w-0 space-y-5">
      <FunnelTitle title={title} sub={sub} />
      <PriceRow price={price} was={was} label={isBlackFriday(now) ? "Black Friday" : undefined} />
      <SetUnitPrice price={price} lamps={lampsInSet(variant)} />
      <Highlights items={HIGHLIGHTS} />
      <Pills label="Kleur" value={activeColor} options={colors} swatch onChange={setColor} />
      <ChoiceCards
        legend="Kies je set"
        value={set}
        onChange={setSet}
        cards={SETS.map((s) => {
          const v = variantFor(s.value);
          const p = money(v, "price");
          const w = money(v, "compareAtPrice");
          const save = p != null && w != null && w > p ? Math.round(w - p) : 0;
          return { key: s.value, title: s.title, sub: s.fit, price: p, was: w, badge: s.lamps === 8 && save > 0 ? `Je bespaart €${save}` : undefined };
        })}
      />
      <GlowButton innerRef={btnRef} onClick={add} disabled={!available}>{label}</GlowButton>
      <RiskBlock />
      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden" data-print-hidden>
          <button type="button" disabled={!available} onClick={add} className="btn-glow h-12 w-full rounded-full text-base font-extrabold disabled:opacity-50">
            {SETS.find((s) => s.value === set)?.title} {activeColor.toLowerCase()} · {price != null ? formatPrice(price) : ""} · In winkelwagen
          </button>
        </div>
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

/** Eén-product-funnel voor de trap-advertentiepagina's. Alle prijzen uit Shopify; geen verzonnen reviews of specs. */
export function TrapFunnel({ page, product, jsonLd }: { page: LandingPage; product: ShopifyProduct | undefined; jsonLd: Record<string, unknown>[] }) {
  const images = useMemo(() => orderImages(product?.node.images?.edges?.map((e) => e.node) ?? []), [product]);
  return (
    <PageLayout seo={{ title: page.title, description: page.description, path: page.path, jsonLd, dutchOnly: true }}>
      <div className="container max-w-6xl pb-16 pt-4 md:pt-10">
        <section id="kopen" className="grid gap-6 md:grid-cols-2 md:items-start md:gap-12">
          <div className="min-w-0 md:sticky md:top-24">
            <FunnelGallery images={images} title={page.h1} chips={["Oplaadbaar via USB-C", "Plakken, geen boren"]} compact mobileAspect="aspect-[5/2]" />
          </div>
          <TrapFunnelPanel product={product} title={page.h1} sub="SenseGlow Wall Lamp, oplaadbaar via USB-C" path={page.path} />
        </section>

        <section aria-labelledby="in-3d" className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 md:items-center md:gap-12">
          <DeferredLamp3D src={WALL_LAMP_3D} alt="SenseGlow Wall Lamp in 3D, set van 4" poster={images[0]?.url} />
          <div className="space-y-3">
            <h2 id="in-3d" className="text-3xl text-foreground md:text-5xl">Klein, plat en overal te plakken</h2>
            <p className="text-lg text-foreground/80">Bekijk de Wall Lamp van alle kanten. Het lampje zit op de trapmuur, de sensor kijkt mee en het licht valt naar beneden op de treden.</p>
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
              <li key={t} className="lift rounded-3xl bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full btn-glow text-lg font-extrabold">{i + 1}</span>
                <h3 className="mt-3 text-xl font-extrabold text-foreground">{t}</h3>
                <p className="mt-1 text-base text-foreground/80">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="vergelijk" className="mt-16 md:mt-24">
          <h2 id="vergelijk" className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">Waarom oplaadbaar beter werkt</h2>
          <div className="lift mt-6 overflow-hidden rounded-3xl bg-white">
            <table className="w-full text-left text-base">
              <thead className="bg-[#1C120C] text-[#FFF8EF]">
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

        <section className="night-glow mt-16 rounded-3xl p-8 text-center text-[#FFF8EF] md:mt-24 md:p-14">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Nooit meer in het donker de trap op</h2>
          <p className="mx-auto mt-2 max-w-md text-base text-white/80">Bestel vandaag, betaal achteraf met Klarna en probeer het 30 dagen.</p>
          <button
            type="button"
            onClick={() => document.getElementById("kopen")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-glow mt-6 h-14 rounded-full px-8 text-lg font-extrabold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Kies je set
          </button>
        </section>
      </div>
    </PageLayout>
  );
}
