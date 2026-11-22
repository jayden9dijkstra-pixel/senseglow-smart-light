import { Link } from "react-router-dom";
import { Activity, BatteryCharging, Check, Minus, RotateCcw, StickyNote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/i18n/I18nProvider";
import { DeliveryEstimate } from "@/components/product/DeliveryEstimate";
import { GoogleReviewLine } from "@/components/GoogleBrandReview";
import { QTY_OPTIONS, offerRate, quoteQty, type OfferQty } from "@/lib/quantityOffer";
import { isBlackFriday } from "@/lib/blackFriday";
import { useOfferDate } from "@/hooks/useOfferDate";
import { formatPrice } from "@/lib/price";
import { shopifySized } from "@/lib/shopifyImage";
import { RETURN_DAYS } from "@/lib/purchaseTrust";
import {
  AMBIENT_COMPARE, AMBIENT_FEATURES, AMBIENT_SPECS, AMBIENT_STEPS, AMBIENT_TILES,
  AMBIENT_WHY_PRODUCT, AMBIENT_WHY_SENSEGLOW, type Cell,
} from "@/lib/ambientPage";

/** 'Bundel en bespaar': de bestaande staffel als kaartjes, bedragen uit de Shopify-prijs. */
export function BundleCards({ unitPrice, value, onChange }: { unitPrice: number | null; value: OfferQty; onChange: (q: OfferQty) => void }) {
  const now = useOfferDate();
  return (
    <div className="space-y-1.5">
      <p className="text-base font-semibold text-foreground">
        Bundel en bespaar{isBlackFriday(now) && <span className="ml-2 text-sm font-medium text-primary" data-no-translate>Black Friday t/m 30 nov</span>}
      </p>
      <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Aantal lampen">
        {QTY_OPTIONS.map((qty) => {
          const rate = offerRate(qty, now);
          const q = unitPrice != null ? quoteQty(unitPrice, qty, now) : null;
          const active = qty === value;
          return (
            <Button
              key={qty}
              type="button"
              variant="outline"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(qty)}
              className={`flex h-auto min-h-12 flex-col items-center gap-0 rounded-xl px-0.5 py-1.5 ${active ? "border-primary bg-primary/5" : "border-foreground/15 hover:border-primary/40"}`}
            >
              <span className="whitespace-nowrap text-sm font-medium text-foreground sm:text-base">{qty === 1 ? "1 stuk" : `${qty} stuks`}{rate ? <span className="ml-1 font-bold text-primary">-{Math.round(rate * 100)}%</span> : null}</span>
              {q && <span className="text-sm text-foreground/80">{formatPrice(q.total)}</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

/** Direct onder de knop: levertijd, retour, review en de inklapbare blokken. */
export function AmbientBelowButton() {
  const { localizePath } = useI18n();
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <DeliveryEstimate />
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <RotateCcw className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
          <Link to={localizePath("/retourneren")} className="hover:underline">{`${RETURN_DAYS} dagen retour`}</Link>
        </p>
      </div>
      <GoogleReviewLine />
      <Accordion type="multiple" className="divide-y divide-foreground/10 border-y border-foreground/10">
        <AccordionItem value="waarom" className="border-0">
          <AccordionTrigger className="min-h-12 py-3 text-left text-base font-semibold hover:no-underline">Waarom dit product</AccordionTrigger>
          <AccordionContent className="pb-4 text-base text-foreground/85">
            <ul className="space-y-1.5">{AMBIENT_WHY_PRODUCT.map((t) => <li key={t} className="flex gap-2"><Check className="mt-1 h-4 w-4 flex-none text-primary" aria-hidden />{t}</li>)}</ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="specs" className="border-0">
          <AccordionTrigger className="min-h-12 py-3 text-left text-base font-semibold hover:no-underline">Specificaties</AccordionTrigger>
          <AccordionContent className="pb-4 text-base">
            <dl className="divide-y divide-foreground/10">
              {AMBIENT_SPECS.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5"><dt className="text-foreground/80">{k}</dt><dd className="text-right font-medium text-foreground">{v}</dd></div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="verzending" className="border-0">
          <AccordionTrigger className="min-h-12 py-3 text-left text-base font-semibold hover:no-underline">Verzending en retour</AccordionTrigger>
          <AccordionContent className="space-y-2 pb-4 text-base text-foreground/85">
            <p>Levering in 7-14 werkdagen. Verzending naar Nederland en België is gratis.</p>
            <p>{`${RETURN_DAYS} dagen retour, bovenop je wettelijke 14 dagen. Mail naar support@senseglow.shop met je bestelnummer.`}</p>
            <p><Link to={localizePath("/retourneren")} className="text-primary underline underline-offset-4">Lees meer over retourneren</Link></p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const STEP_ICONS = { usb: BatteryCharging, stick: StickyNote, motion: Activity };

export function AmbientSteps() {
  return (
    <section id="zo-werkt-het" aria-labelledby="ambient-how" className="scroll-mt-24 space-y-4">
      <h2 id="ambient-how" className="text-2xl font-semibold text-foreground">Hoe werkt het?</h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {AMBIENT_STEPS.map((s, i) => {
          const Icon = STEP_ICONS[s.icon];
          return (
            <li key={s.title} className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/15 text-primary"><Icon className="h-5 w-5" aria-hidden /></span>
              <span>
                <span className="block text-base font-semibold text-foreground"><span aria-hidden data-no-translate>{`${i + 1}. `}</span>{s.title}</span>
                <span className="block text-base text-foreground/85">{s.text}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

type Img = { url: string; altText: string | null; width?: number | null; height?: number | null };

export function AmbientFeatureBlocks({ images }: { images: Img[] }) {
  const norm = (s: string | null) => (s ?? "").trim().toLowerCase();
  return (
    <section className="space-y-10">
      {AMBIENT_FEATURES.map((f, i) => {
        const img = images.find((im) => norm(im.altText) === norm(f.alt)) ?? images[i];
        return (
          <div key={f.title} className="grid items-center gap-5 md:grid-cols-2 md:gap-10">
            {img && (
              <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border/70 bg-background-secondary">
                <img src={shopifySized(img.url, 900)} alt={img.altText ?? f.title} width={900} height={675} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">{f.title}</h2>
              <p className="text-base leading-relaxed text-foreground/85">{f.text}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function AmbientWhySenseGlow() {
  const { localizePath } = useI18n();
  return (
    <section aria-labelledby="ambient-why" className="space-y-3 rounded-2xl bg-secondary/60 p-5">
      <h2 id="ambient-why" className="text-2xl font-semibold text-foreground">Waarom SenseGlow</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {AMBIENT_WHY_SENSEGLOW.map((t, i) => (
          <li key={t} className="flex gap-2 text-base text-foreground">
            <Check className="mt-1 h-4 w-4 flex-none text-primary" aria-hidden />
            {i === 3 ? <Link to={localizePath("/contact")} className="hover:underline">{t}</Link> : t}
          </li>
        ))}
      </ul>
    </section>
  );
}

const CELL: Record<Cell, { icon: typeof Check; label: string; cls: string }> = {
  ja: { icon: Check, label: "Ja", cls: "text-primary" },
  nee: { icon: X, label: "Nee", cls: "text-foreground/70" },
  soms: { icon: Minus, label: "Soms", cls: "text-foreground/70" },
};

export function AmbientCompare() {
  return (
    <section aria-labelledby="ambient-compare" className="space-y-3">
      <h2 id="ambient-compare" className="text-2xl font-semibold text-foreground">SenseGlow Ambient Bar vs. lamp met batterijen vs. lamp met snoer</h2>
      <table className="w-full table-fixed border-collapse text-left text-sm sm:text-base">
        <thead>
          <tr className="border-b border-foreground/15">
            <th className="w-[28%] py-2 pr-2 font-medium text-foreground/80"><span className="sr-only">Kenmerk</span></th>
            {AMBIENT_COMPARE.columns.map((c, i) => (
              <th key={c} scope="col" className={`px-1 py-2 text-center align-bottom font-semibold ${i === 0 ? "rounded-t-lg bg-primary/10 text-foreground" : "text-foreground/85"}`}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AMBIENT_COMPARE.rows.map((r) => (
            <tr key={r.label} className="border-b border-foreground/10">
              <th scope="row" className="py-3 pr-2 font-medium text-foreground">{r.label}</th>
              {r.cells.map((c, i) => {
                const { icon: Icon, label, cls } = CELL[c];
                return (
                  <td key={i} className={`px-1 py-3 text-center ${i === 0 ? "bg-primary/10" : ""}`}>
                    <span className={`inline-flex flex-col items-center gap-0.5 ${cls}`}><Icon className="h-5 w-5" aria-hidden /><span className="text-sm">{label}</span></span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function AmbientTiles() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Kenmerken">
      {AMBIENT_TILES.map((t) => (
        <li key={t} className="flex min-h-16 items-center justify-center rounded-2xl bg-secondary/60 p-3 text-center text-base font-semibold text-foreground">{t}</li>
      ))}
    </ul>
  );
}
