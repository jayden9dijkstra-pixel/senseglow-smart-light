/**
 * Intern dashboard: uitgaven, omzet, herkomst en marge.
 * Alleen bereikbaar voor een ingelogde beheerder en uitgesloten van Google.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { contributionMargin, formatDateNl, formatEuro } from "@/lib/margins";

type Panel<T> = {
  data: T | null;
  source: string;
  fetchedAt: string | null;
  error: string | null;
};

type OrderLine = {
  title: string;
  variant_title: string | null;
  quantity: number;
  price: number;
};

type OrderRow = {
  order_number: string;
  ordered_at: string;
  total: number;
  currency: string;
  line_items: OrderLine[];
  gclid: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
};

type AdsRow = {
  stat_date: string;
  campaign_name: string | null;
  product_title: string | null;
  cost: number;
  impressions: number;
  clicks: number;
};

type EventRow = {
  created_at: string;
  session_id: string;
  event_type: string;
};

type Summary = {
  orders: Panel<OrderRow[]>;
  ads: Panel<AdsRow[]>;
  analytics: Panel<EventRow[]>;
  generatedAt: string;
};

const INTERNAL_COOKIE = "sg_internal=1; path=/; max-age=31536000; SameSite=Lax";

function sinceDate(days: number): Date {
  if (days === 1) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function Unavailable({ reason }: { reason: string }) {
  return <p className="text-sm text-muted-foreground">Niet beschikbaar: {reason}</p>;
}

function PanelBox({
  title,
  source,
  fetchedAt,
  note,
  children,
}: {
  title: string;
  source: string;
  fetchedAt: string | null;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">
          Bron: {source}
          {fetchedAt ? ` • bijgewerkt ${new Date(fetchedAt).toLocaleString("nl-NL")}` : ""}
        </p>
      </div>
      {note && <p className="mb-3 text-xs text-muted-foreground">{note}</p>}
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/60 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    document.cookie = INTERNAL_COOKIE;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.replace("/login?next=/admin/dashboard");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      setAllowed(Boolean(roles?.some((r) => r.role === "admin")));
      setChecking(false);
    })();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase.functions.invoke("dashboard-summary");
    if (error) {
      setLoadError("De gegevens konden niet geladen worden.");
    } else {
      setSummary(data as Summary);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (allowed) void load();
  }, [allowed, load]);

  const refreshAds = useCallback(async () => {
    setLoading(true);
    await supabase.functions.invoke("google-ads-report");
    await load();
  }, [load]);

  const orders = summary?.orders.data ?? [];
  const ads = summary?.ads.data ?? [];
  const events = summary?.analytics.data ?? [];

  const period = useCallback(
    (days: number) => {
      const from = sinceDate(days);
      const periodOrders = orders.filter((o) => new Date(o.ordered_at) >= from);
      // Alleen campagnetotalen tellen mee; productregels zijn een uitsplitsing daarvan.
      const periodAds = ads.filter(
        (a) => !a.product_title && new Date(`${a.stat_date}T00:00:00`) >= from,
      );
      const periodEvents = events.filter((e) => new Date(e.created_at) >= from);

      const revenue = periodOrders.reduce((s, o) => s + o.total, 0);
      const spend = periodAds.reduce((s, a) => s + a.cost, 0);
      const clicks = periodAds.reduce((s, a) => s + a.clicks, 0);
      const impressions = periodAds.reduce((s, a) => s + a.impressions, 0);
      const sessions = new Set(
        periodEvents.filter((e) => e.event_type === "page_view").map((e) => e.session_id),
      ).size;
      const productViews = periodEvents.filter((e) => e.event_type === "view_item").length;

      return {
        orders: periodOrders.length,
        revenue,
        aov: periodOrders.length ? revenue / periodOrders.length : 0,
        spend,
        clicks,
        impressions,
        ctr: impressions ? (clicks / impressions) * 100 : 0,
        cpc: clicks ? spend / clicks : 0,
        sessions,
        productViews,
        conversionRate: clicks ? (periodOrders.length / clicks) * 100 : null,
        costPerOrder: periodOrders.length ? spend / periodOrders.length : null,
        roas: spend ? revenue / spend : null,
        addToCart: periodEvents.filter((e) => e.event_type === "add_to_cart").length,
        beginCheckout: periodEvents.filter((e) => e.event_type === "begin_checkout").length,
      };
    },
    [orders, ads, events],
  );

  const today = useMemo(() => period(1), [period]);
  const week = useMemo(() => period(7), [period]);

  const perProduct = useMemo(() => {
    const map = new Map<
      string,
      { title: string; units: number; revenue: number; margin: number | null; orders: Set<string> }
    >();
    for (const order of orders) {
      for (const line of order.line_items) {
        const entry = map.get(line.title) ?? {
          title: line.title,
          units: 0,
          revenue: 0,
          margin: 0 as number | null,
          orders: new Set<string>(),
        };
        entry.units += line.quantity;
        entry.revenue += line.price * line.quantity;
        const perUnit = contributionMargin(line.price, line.title, line.variant_title);
        entry.margin =
          entry.margin === null || perUnit === null ? null : entry.margin + perUnit * line.quantity;
        entry.orders.add(order.order_number);
        map.set(line.title, entry);
      }
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  // Titels uit Google Ads en Shopify verschillen per taal en variant.
  // We brengen ze terug tot één productnaam zodat de kosten bij het juiste product komen.
  const productKey = useCallback((title: string): string | null => {
    const t = title.toLowerCase();
    if (t.includes("ambient") || t.includes("mouvement ambiante")) return "ambient";
    if (t.includes("wave")) return "wave";
    if (t.includes("wall lamp") || t.includes("applique")) return "wall";
    if (t.includes("solar") || t.includes("lanterne")) return "solar";
    if (t.includes("flex")) return "flex";
    return null;
  }, []);

  const productAdSpend = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of ads) {
      if (!row.product_title) continue;
      const key = productKey(row.product_title);
      if (!key) continue;
      map.set(key, (map.get(key) ?? 0) + row.cost);
    }
    return map;
  }, [ads, productKey]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <p>Je hebt geen toegang tot deze pagina.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <meta name="robots" content="noindex, nofollow" />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Uitgaven, omzet, herkomst en marge op één plek.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void load()} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Verversen
          </Button>
          <Button variant="outline" onClick={() => void refreshAds()} disabled={loading}>
            Advertentiecijfers ophalen
          </Button>
        </div>
      </div>

      {loadError && <p className="mb-6 text-sm text-destructive">{loadError}</p>}

      <div className="space-y-6">
        {/* 1. Vandaag en 7 dagen */}
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { label: "Vandaag", stats: today },
            { label: "Laatste 7 dagen", stats: week },
          ].map(({ label, stats }) => (
            <PanelBox
              key={label}
              title={label}
              source="Shopify, Google Ads en eigen bezoekmeting"
              fetchedAt={summary?.generatedAt ?? null}
              note="Google Ads-cijfers lopen enkele uren achter."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {summary?.ads.error ? (
                  <div className="col-span-full">
                    <Unavailable reason={summary.ads.error} />
                  </div>
                ) : (
                  <>
                    <Stat label="Advertentiekosten" value={formatEuro(stats.spend)} />
                    <Stat label="Vertoningen" value={String(stats.impressions)} />
                    <Stat label="Klikken" value={String(stats.clicks)} />
                    <Stat label="CTR" value={`${stats.ctr.toFixed(2)}%`} />
                    <Stat label="Gem. klikprijs" value={formatEuro(stats.cpc)} />
                  </>
                )}
                {summary?.orders.error && !summary.orders.data ? (
                  <div className="col-span-full">
                    <Unavailable reason={summary.orders.error} />
                  </div>
                ) : (
                  <>
                    <Stat label="Bestellingen" value={String(stats.orders)} />
                    <Stat label="Omzet" value={formatEuro(stats.revenue)} />
                    <Stat label="Gem. orderwaarde" value={formatEuro(stats.aov)} />
                  </>
                )}
                <Stat label="Sessies" value={String(stats.sessions)} />
                <Stat label="Productpagina's bekeken" value={String(stats.productViews)} />
                <Stat
                  label="Bestellingen per klik"
                  value={stats.conversionRate === null ? "n.b." : `${stats.conversionRate.toFixed(2)}%`}
                />
                <Stat
                  label="Kosten per bestelling"
                  value={stats.costPerOrder === null ? "n.b." : formatEuro(stats.costPerOrder)}
                />
                <Stat
                  label="Omzet per euro advertentie"
                  value={stats.roas === null ? "n.b." : stats.roas.toFixed(2)}
                />
              </div>
            </PanelBox>
          ))}
        </div>

        {/* 2. Per product */}
        <PanelBox
          title="Per product"
          source={summary?.orders.source ?? "Shopify"}
          fetchedAt={summary?.orders.fetchedAt ?? null}
        >
          {perProduct.length === 0 ? (
            <Unavailable reason={summary?.orders.error ?? "nog geen verkochte producten"} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2">Product</th>
                    <th>Verkocht</th>
                    <th>Omzet</th>
                    <th>Dekkingsbijdrage</th>
                    <th>Advertentiekosten</th>
                    <th>Marge na advertenties</th>
                  </tr>
                </thead>
                <tbody>
                  {perProduct.map((row) => {
                    const spend = productAdSpend.get(row.title);
                    const afterAds =
                      row.margin === null || spend === undefined ? null : row.margin - spend;
                    return (
                      <tr key={row.title} className="border-t border-border/60">
                        <td className="py-2 pr-4">{row.title}</td>
                        <td>{row.units}</td>
                        <td>{formatEuro(row.revenue)}</td>
                        <td>{row.margin === null ? "n.b." : formatEuro(row.margin)}</td>
                        <td>{spend === undefined ? "n.b." : formatEuro(spend)}</td>
                        <td className={afterAds !== null && afterAds < 0 ? "text-destructive" : ""}>
                          {afterAds === null ? "n.b." : formatEuro(afterAds)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-muted-foreground">
                Advertentiekosten per product zijn alleen beschikbaar als Google Ads de cijfers per
                product levert. Staat er n.b., dan is dat getal niet opgehaald.
              </p>
            </div>
          )}
        </PanelBox>

        {/* 3. Bestellingen */}
        <PanelBox
          title="Laatste bestellingen"
          source={summary?.orders.source ?? "Shopify"}
          fetchedAt={summary?.orders.fetchedAt ?? null}
        >
          {orders.length === 0 ? (
            <Unavailable reason={summary?.orders.error ?? "nog geen bestellingen"} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2">Bestelling</th>
                    <th>Datum</th>
                    <th>Bedrag</th>
                    <th>Artikelen</th>
                    <th>Klik-id</th>
                    <th>Bron</th>
                    <th>Campagne</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 25).map((order) => (
                    <tr key={order.order_number} className="border-t border-border/60 align-top">
                      <td className="py-2 pr-4">{order.order_number}</td>
                      <td>{formatDateNl(order.ordered_at)}</td>
                      <td>{formatEuro(order.total)}</td>
                      <td className="pr-4">
                        {order.line_items
                          .map((l) => `${l.quantity}x ${l.title}${l.variant_title ? ` (${l.variant_title})` : ""}`)
                          .join(", ")}
                      </td>
                      <td>{order.gclid ? "ja" : "nee"}</td>
                      <td>{order.utm_source ?? "-"}</td>
                      <td>{order.utm_campaign ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PanelBox>

        {/* 4. Trechter */}
        <PanelBox
          title="Trechter, laatste 7 dagen"
          source="Eigen bezoekmeting en Shopify"
          fetchedAt={summary?.analytics.fetchedAt ?? null}
          note="Eigen bezoeken zijn uit deze cijfers gefilterd."
        >
          {summary?.analytics.error ? (
            <Unavailable reason={summary.analytics.error} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Productpagina bekeken", value: week.productViews },
                { label: "In winkelwagen", value: week.addToCart },
                { label: "Afrekenen gestart", value: week.beginCheckout },
                { label: "Bestellingen", value: week.orders },
              ].map((step, index, all) => {
                const previous = index > 0 ? all[index - 1].value : null;
                const drop =
                  previous && previous > 0 ? (1 - step.value / previous) * 100 : null;
                return (
                  <div key={step.label} className="rounded-md border border-border/60 p-3">
                    <p className="text-xs text-muted-foreground">{step.label}</p>
                    <p className="text-lg font-semibold">{step.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {drop === null ? "" : `${drop.toFixed(0)}% uitval`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </PanelBox>
      </div>
    </main>
  );
}
