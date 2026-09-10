import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, PackageCheck, Palette, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageLayout } from "@/components/layout/PageLayout";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

type BundleDef = {
  id: string;
  name: string;
  tagline: string;
  handles: string[];
  rate: number;
  code: string;
  packSize: 2 | 3 | 4;
};

const BUNDLES: BundleDef[] = [
  {
    id: "kast",
    name: "Kast Starter",
    tagline: "Voor keuken, kast en werkblad.",
    handles: ["senseglow_wave", "senseglow_ambient_motion_bar"],
    rate: 0.1,
    code: "SG-KAST",
    packSize: 2,
  },
  {
    id: "hal",
    name: "Hal Starter",
    tagline: "Voor gang, trap en overloop.",
    handles: ["senseglow_ambient_motion_bar", "senseglow_wall_lamp"],
    rate: 0.08,
    code: "SG-HAL",
    packSize: 2,
  },
  {
    id: "wholehome",
    name: "Whole Home",
    tagline: "Alle vijf lampen, binnen en buiten.",
    handles: [
      "senseglow_wave",
      "senseglow_ambient_motion_bar",
      "senseglow_wall_lamp",
      "senseglow_solar_lantern",
      "senseglow_flex",
    ],
    rate: 0.08,
    code: "SG-WHOLEHOME",
    packSize: 4,
  },
];

const REASONS = [
  {
    icon: PackageCheck,
    title: "Direct alles in huis",
    body: "Eén levering, één keer plakken en je bent klaar.",
  },
  {
    icon: Palette,
    title: "Consistent design overal",
    body: "Dezelfde warme lichtkleur en afwerking in elke ruimte.",
  },
  {
    icon: PiggyBank,
    title: "Meer korting bij meer lampen",
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

const euro = (value: number) => `€${value.toFixed(2).replace(".", ",")}`;

const Bundles = () => {
  const addItem = useCartStore((state) => state.addItem);
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

  const byHandle = useMemo(
    () => new Map(products.map((p) => [p.node.handle, p])),
    [products]
  );

  const handleAdd = (bundle: BundleDef) => {
    const picked = bundle.handles
      .map((handle) => byHandle.get(handle))
      .filter((p): p is ShopifyProduct => Boolean(p));
    if (picked.length !== bundle.handles.length) return;

    picked.forEach((product) => {
      const variant = product.node.variants.edges[0]?.node;
      if (!variant) return;
      addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
        isBundle: true,
        bundleName: bundle.name,
        bundleVariantLabel: product.node.title,
        bundlePackSize: bundle.packSize,
        bundleRate: bundle.rate,
        bundleDiscountCode: bundle.code,
      });
    });
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
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
      <section className="pb-20 md:pb-28 bg-background">
        <div className="container">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-foreground/30" />
            </div>
          ) : failed ? (
            <p className="text-center text-foreground/70 py-16">
              De bundels konden nu niet geladen worden. Probeer het later opnieuw.
            </p>
          ) : (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              {BUNDLES.map((bundle) => {
                const picked = bundle.handles
                  .map((handle) => byHandle.get(handle))
                  .filter((p): p is ShopifyProduct => Boolean(p));
                const available = picked.length === bundle.handles.length;
                const full = picked.reduce(
                  (sum, p) => sum + parseFloat(p.node.priceRange.minVariantPrice.amount),
                  0
                );
                const discounted = full * (1 - bundle.rate);
                const image = picked[0]?.node.images?.edges?.[0]?.node;

                return (
                  <div
                    key={bundle.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-foreground/8 bg-background-secondary/40 hover:border-glow/40 transition-colors duration-500"
                  >
                    <div className="relative aspect-[4/3] bg-muted/10 overflow-hidden">
                      {image?.url && (
                        <img
                          src={image.url}
                          alt={bundle.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <span className="absolute top-4 left-4 rounded-full bg-glow text-background text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5">
                        {Math.round(bundle.rate * 100)}% korting
                      </span>
                    </div>

                    <div className="p-7 flex flex-col flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-2">{bundle.name}</h2>
                      <p className="text-sm text-foreground/60 mb-5">{bundle.tagline}</p>

                      <ul className="space-y-2 mb-6">
                        {picked.map((p) => (
                          <li key={p.node.handle} className="text-sm text-foreground/70">
                            <Link
                              to={`/product/${p.node.handle}`}
                              className="hover:text-glow transition-colors"
                            >
                              {p.node.title}
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {available && (
                        <div className="flex items-baseline gap-3 mb-6">
                          <span className="text-sm text-foreground/40 line-through">
                            {euro(full)}
                          </span>
                          <span className="text-2xl font-bold text-foreground">
                            {euro(discounted)}
                          </span>
                        </div>
                      )}

                      <Button
                        onClick={() => handleAdd(bundle)}
                        disabled={!available}
                        className="mt-auto w-full rounded-full"
                      >
                        Voeg bundel toe
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Waarom een bundel */}
      <section className="py-16 md:py-20 bg-background-secondary">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
              Waarom een bundel?
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
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
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
