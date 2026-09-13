import { useEffect, useState } from "react";
import { PackageCheck, Palette, PiggyBank } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageLayout } from "@/components/layout/PageLayout";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { BundleShowcase } from "@/components/bundles/BundleShowcase";

const REASONS = [
  {
    icon: PackageCheck,
    title: "Alles in 1 zending",
    body: "Je ontvangt de gekozen lampen samen in één bestelling.",
  },
  {
    icon: Palette,
    title: "Consistente warme sfeer",
    body: "Laat dezelfde rustige lichtsfeer terugkomen in meerdere ruimtes.",
  },
  {
    icon: PiggyBank,
    title: "Meer korting bij meer",
    body: "De korting rekent automatisch af in de checkout.",
  },
];

const FAQ = [
  {
    q: "Hoe wordt de korting verrekend?",
    a: "De kortingscode gaat automatisch mee naar de checkout. Je ziet het bedrag daar terug voordat je betaalt.",
  },
  {
    q: "Kan ik een bundel aanpassen?",
    a: "Ja. Voeg de bundel toe en pas daarna in de winkelwagen aan wat je wilt. De korting past zich aan de inhoud aan.",
  },
  {
    q: "Geldt de garantie ook op bundels?",
    a: "Ja, 1 jaar garantie op elk onderdeel en 30 dagen retour, net als bij losse lampen.",
  },
  {
    q: "Kan ik bundelkortingen stapelen?",
    a: "Nee, er geldt één kortingscode per bestelling. De hoogste korting wordt gebruikt.",
  },
];

const Bundles = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const fetched = await fetchProducts(50);
        if (active) setProducts(fetched);
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="w-full bg-background py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              Bundels met korting
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Meer sfeer, minder kosten
            </h1>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed">
              Combineer de lampen die bij elkaar horen. De korting rekent zichzelf af in de checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Bundle cards */}
      <section className="w-full bg-background pb-16 md:pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <BundleShowcase products={products} loading={loading} failed={failed} immersive />

          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-7 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Binnenkort</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">Bouw je eigen combinatie</h2>
              <p className="mt-2 text-sm text-muted-foreground">Kies straks zelf de lampen die het beste bij jouw huis passen.</p>
            </div>
            <span className="rounded-full border border-primary/30 px-4 py-2 text-sm text-primary">In ontwikkeling</span>
          </div>
        </div>
      </section>

      {/* Waarom een bundel */}
      <section className="w-full bg-background-secondary py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
              Waarom bundelen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {REASONS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="text-center">
                  <Icon className="h-6 w-6 text-glow mx-auto mb-4" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-background py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Vragen over bundels
            </h2>
            <Accordion type="single" collapsible>
              {FAQ.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-foreground/60 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Bundles;
