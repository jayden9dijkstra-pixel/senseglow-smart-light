import { useEffect, useState, type ReactNode } from "react";
import { Activity, BatteryCharging, Droplets, Hand, Lightbulb, Magnet, Pointer, RotateCcw, ShieldCheck, Sun, Truck } from "lucide-react";
import type { ShopifyProduct } from "@/lib/shopify";
import type { Benefit, BenefitIcon } from "@/lib/productBlueprint";
import { formatPrice } from "@/lib/price";
import { deliveryWindow, formatDeliveryDate } from "@/lib/delivery";
import { responsiveImg } from "@/lib/shopifyImage";
import { isBlackFriday } from "@/lib/blackFriday";
import { useOfferDate } from "@/hooks/useOfferDate";
import { QTY_OPTIONS, quoteQty, type OfferQty } from "@/lib/quantityOffer";
import { GoogleReviewLine } from "@/components/GoogleBrandReview";
import idealLogo from "@/assets/pay/ideal.svg";
import visaLogo from "@/assets/pay/visa.svg";
import masterLogo from "@/assets/pay/master.svg";
import paypalLogo from "@/assets/pay/paypal.svg";

export type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];
export type Img = { url: string; altText: string | null };

const ICONS: Record<BenefitIcon, typeof Activity> = {
  motion: Activity, usb: BatteryCharging, magnet: Magnet, stick: Hand, touch: Pointer, sun: Sun, water: Droplets, light: Lightbulb,
};

/* ---------- varianten uit elkaar halen: kleur, maat (cm) of set ---------- */
const COLOR_RE = /^(Zwart|Wit|Zilver|Goud|Grijs)\b/i;
export function partsOf(v: Variant) {
  let color = "";
  let size = "";
  for (const o of v.selectedOptions) {
    const cm = o.value.match(/\d+\s*cm/i)?.[0];
    const col = o.value.match(COLOR_RE)?.[0];
    if (/delige set/i.test(o.value)) size = o.value;
    else if (cm) size = cm.replace(/\s+/, " ");
    if (col) color = col;
  }
  return { color, size };
}
const uniq = (xs: string[]) => [...new Set(xs)].filter(Boolean);
export function findVariant(variants: Variant[], color: string, size: string) {
  return variants.find((v) => { const p = partsOf(v); return p.color === color && p.size === size; })
    ?? variants.find((v) => partsOf(v).color === color)
    ?? variants[0];
}

/* ---------- galerij ---------- */
export function FunnelGallery({ images, title, chips = [], mobileAspect = "aspect-square", activeUrl = null }: { images: Img[]; title: string; chips?: string[]; mobileAspect?: string; activeUrl?: string | null }) {
  const [active, setActive] = useState(0);
  // Na een variantkeuze springt de hoofdfoto naar die variantfoto uit dezelfde galerij.
  useEffect(() => {
    if (!activeUrl) return;
    const base = (u: string) => u.split("?")[0];
    const idx = images.findIndex((im) => base(im.url) === base(activeUrl));
    if (idx >= 0) setActive(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUrl, images.length]);
  const main = images[Math.min(active, images.length - 1)];
  if (!main) return <div className={`${mobileAspect} w-full animate-pulse rounded-3xl bg-secondary md:aspect-square`} />;
  return (
    <div className="min-w-0 space-y-2">
      <div className="lift relative overflow-hidden rounded-3xl bg-white">
        <img
          {...responsiveImg(main.url, "(min-width: 768px) 50vw, 100vw")}
          alt={main.altText || title}
          className={`${mobileAspect} w-full object-cover md:aspect-square`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        {chips.length > 0 && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap gap-2" aria-hidden>
            {chips.map((c) => (
              <span key={c} className="rounded-full bg-[#1C120C]/75 px-3 py-1.5 text-xs font-bold text-[#FBE7C2] backdrop-blur-md">{c}</span>
            ))}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Meer foto's">
          {images.map((im, i) => (
            <li key={im.url} className="flex-none">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Foto ${i + 1}: ${im.altText ?? title}`}
                aria-current={i === active}
                className={`block h-16 w-16 overflow-hidden rounded-xl border-2 bg-white md:h-20 md:w-20 ${i === active ? "border-[#F4A261]" : "border-transparent opacity-80"}`}
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

/* ---------- bouwstenen ---------- */
export function PriceRow({ price, was, label }: { price: number | null; was: number | null; label?: string }) {
  const off = price != null && was != null && was > price ? Math.round((1 - price / was) * 100) : 0;
  return (
    <div className="flex flex-wrap items-center gap-3" aria-live="polite">
      {off > 0 && <s className="text-xl text-foreground/50">{formatPrice(was!)}</s>}
      <span className="text-4xl font-extrabold tracking-tight text-[#E0362C]">{price != null ? formatPrice(price) : "…"}</span>
      {off > 0 && <span className="rounded-full bg-[#E0362C] px-3 py-1 text-sm font-bold text-white">{label ? `${label} ` : ""}−{off}%</span>}
    </div>
  );
}

export function Highlights({ items }: { items: Benefit[] }) {
  return (
    <ul className="space-y-2 text-[17px] text-foreground">
      {items.map((b) => {
        const Icon = ICONS[b.icon] ?? Lightbulb;
        return (
          <li key={b.text} className="flex gap-3"><Icon aria-hidden className="mt-0.5 h-5 w-5 flex-none text-[#E8853D]" />{b.text}</li>
        );
      })}
    </ul>
  );
}

export function Pills({ label, value, options, onChange, swatch = false, note }: { label: string; value: string; options: string[]; onChange: (v: string) => void; swatch?: boolean; note?: (o: string) => ReactNode }) {
  if (options.length < 2) return null;
  return (
    <fieldset className="space-y-2">
      <legend className="text-base font-bold text-foreground">{label}: <span className="font-medium">{value}</span></legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={o === value}
            onClick={() => onChange(o)}
            className={`flex min-h-12 items-center gap-2 rounded-full border-2 bg-white px-5 text-base font-semibold ${o === value ? "border-[#1C120C]" : "border-border"}`}
          >
            {swatch && <span aria-hidden className={`h-4 w-4 rounded-full border border-foreground/30 ${/zwart/i.test(o) ? "bg-[#1a1a1a]" : /zilver/i.test(o) ? "bg-gradient-to-br from-[#e5e5e5] to-[#9a9a9a]" : "bg-white"}`} />}
            {o}
            {note?.(o)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export type ChoiceCard = { key: string; title: string; sub?: string; price: number | null; was: number | null; badge?: string };

export function ChoiceCards({ legend, cards, value, onChange }: { legend: string; cards: ChoiceCard[]; value: string; onChange: (k: string) => void }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-base font-bold text-foreground">{legend}</legend>
      <div className="space-y-4 pt-2" role="radiogroup" aria-label={legend}>
        {cards.map((c) => {
          const selected = c.key === value;
          const off = c.price != null && c.was != null && c.was > c.price ? Math.round((1 - c.price / c.was) * 100) : 0;
          return (
            <button
              key={c.key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(c.key)}
              className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-colors ${selected ? "lift border-[#F4A261] bg-white" : "border-border bg-white/60"}`}
            >
              {c.badge && <span className="btn-glow absolute -top-3 right-4 rounded-full px-3 py-1 text-xs font-extrabold">{c.badge}</span>}
              <span aria-hidden className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 ${selected ? "border-[#E8853D]" : "border-foreground/30"}`}>
                {selected && <span className="h-3 w-3 rounded-full bg-[#E8853D]" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-foreground">
                  {c.title}
                  {off > 0 && <span className="rounded-full bg-[#E0362C] px-2 py-0.5 text-xs font-bold text-white">−{off}%</span>}
                </span>
                {c.sub && <span className="block text-sm text-foreground/70">{c.sub}</span>}
              </span>
              <span className="flex-none text-right">
                <span className={`block text-lg font-extrabold ${off > 0 ? "text-[#E0362C]" : "text-foreground"}`}>{c.price != null ? formatPrice(c.price) : "…"}</span>
                {off > 0 && <s className="block text-sm text-foreground/50">{formatPrice(c.was!)}</s>}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function GlowButton({ children, onClick, disabled, innerRef }: { children: ReactNode; onClick: () => void; disabled?: boolean; innerRef?: React.Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={innerRef}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="btn-glow h-[60px] w-full rounded-full text-lg font-extrabold transition-transform active:scale-[0.98] disabled:opacity-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#1C120C]"
    >
      {children}
    </button>
  );
}

export function RiskBlock() {
  const now = useOfferDate();
  const { from, to } = deliveryWindow(now);
  return (
    <ul className="lift space-y-2 rounded-3xl bg-white p-5 text-base text-foreground">
      <li className="flex gap-3"><Truck aria-hidden className="mt-0.5 h-5 w-5 flex-none" /><span>Bezorgd tussen <strong>{formatDeliveryDate(from)}</strong> en <strong>{formatDeliveryDate(to)}</strong>, gratis</span></li>
      <li className="flex gap-3"><RotateCcw aria-hidden className="mt-0.5 h-5 w-5 flex-none" /><span>Niet tevreden? 30 dagen bedenktijd en je geld terug</span></li>
      <li className="flex gap-3"><ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 flex-none" /><span>1 jaar extra garantie bovenop je wettelijke garantie</span></li>
      <li className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <span className="rounded bg-[#FFB3C7] px-1.5 py-0.5 text-sm font-bold text-[#0B051D]">Klarna</span>
        <span className="mr-1">Achteraf betalen</span>
        {[{ n: "iDEAL", s: idealLogo }, { n: "Visa", s: visaLogo }, { n: "Mastercard", s: masterLogo }, { n: "PayPal", s: paypalLogo }].map((m) => (
          <img key={m.n} src={m.s} alt={m.n} width={36} height={23} className="h-[23px] w-[36px]" loading="lazy" />
        ))}
      </li>
    </ul>
  );
}

/** Kop + review boven de prijs; titel klein genoeg voor mobiel. */
export function FunnelTitle({ title, sub, as: Tag = "h1" }: { title: string; sub?: string; as?: "h1" | "h2" }) {
  return (
    <div className="space-y-2">
      <GoogleReviewLine />
      <Tag className="text-[26px] font-extrabold leading-[1.08] text-foreground md:text-5xl">{title}</Tag>
      {sub && <p className="text-base text-foreground/75">{sub}</p>}
    </div>
  );
}

/* ---------- productpagina: kleur, maat, aantal ---------- */
const QTY_TEXT: Record<OfferQty, { title: string; sub?: string; badge?: string }> = {
  1: { title: "1 lamp" },
  2: { title: "2 lampen", sub: "Ook te combineren met andere SenseGlow-lampen" },
  4: { title: "4 lampen", sub: "Voor meerdere plekken in huis", badge: "Meeste korting" },
};

/**
 * Koopblok voor productpagina's in de opbouw van de Wall Lamp: titel, rode prijs, highlights,
 * kleur en maat, aantalkaarten met het bestaande 'Meer lampen'-aanbod, één gloedknop, risicoblok.
 */
export function ProductFunnelPanel({
  product, title, sub, highlights, variant, onVariantChange, qty, onQtyChange, onAdd, offer, buttonRef,
}: {
  product: ShopifyProduct; title: string; sub?: string; highlights: Benefit[];
  variant: Variant | null; onVariantChange: (v: Variant) => void; qty: OfferQty; onQtyChange: (q: OfferQty) => void;
  onAdd: () => void; offer: boolean; buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const now = useOfferDate();
  const variants = product.node.variants.edges.map((e) => e.node);
  const current = variant ?? variants[0];
  const { color, size } = partsOf(current);
  const colors = uniq(variants.map((v) => partsOf(v).color));
  const sizes = uniq(variants.filter((v) => partsOf(v).color === color || !color).map((v) => partsOf(v).size));
  const unit = parseFloat(current.price.amount);
  const compareAt = current.compareAtPrice ? parseFloat(current.compareAtPrice.amount) : null;
  const count = offer ? qty : 1;
  const q = quoteQty(unit, count, now);
  const price = offer ? q.total : unit;
  const was = offer && q.rate > 0 ? Math.round(unit * count * 100) / 100 : compareAt;
  const bf = isBlackFriday(now);
  const sizePrice = (s: string) => {
    const v = variants.find((x) => partsOf(x).size === s && (partsOf(x).color === color || !color));
    return v ? <span className="text-sm font-medium text-foreground/60">{formatPrice(parseFloat(v.price.amount))}</span> : null;
  };

  return (
    <div className="min-w-0 space-y-5">
      <FunnelTitle title={title} sub={sub} />
      <PriceRow price={price} was={was} label={bf ? "Black Friday" : undefined} />
      <Highlights items={highlights} />
      <Pills label="Kleur" value={color} options={colors} swatch onChange={(c) => onVariantChange(findVariant(variants, c, size))} />
      <Pills label="Maat" value={size} options={sizes} note={sizes.length > 1 && !/set/.test(size) ? sizePrice : undefined} onChange={(s) => onVariantChange(findVariant(variants, color, s))} />
      {offer && (
        <ChoiceCards
          legend="Kies je set"
          value={String(qty)}
          onChange={(k) => onQtyChange(Number(k) as OfferQty)}
          cards={QTY_OPTIONS.map((n) => {
            const t = quoteQty(unit, n, now);
            return { key: String(n), ...QTY_TEXT[n], price: t.total, was: t.rate > 0 ? Math.round(unit * n * 100) / 100 : null };
          })}
        />
      )}
      <GlowButton innerRef={buttonRef} onClick={onAdd} disabled={!current.availableForSale}>
        {current.availableForSale ? `In winkelwagen · ${formatPrice(price)}` : "Uitverkocht"}
      </GlowButton>
      <RiskBlock />
    </div>
  );
}
