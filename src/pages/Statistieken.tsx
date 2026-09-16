import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/seo/Seo";
import { Button } from "@/components/ui/button";
import { Users, Eye, ShoppingCart, CreditCard, Activity } from "lucide-react";

type SiteEvent = {
  created_at: string;
  session_id: string;
  event_type: string;
  path: string | null;
  referrer: string | null;
  device: string | null;
  country: string | null;
};

const RANGES = [
  { days: 1, label: "Vandaag" },
  { days: 7, label: "7 dagen" },
  { days: 30, label: "30 dagen" },
] as const;

function countUnique(events: SiteEvent[]): number {
  return new Set(events.map((e) => e.session_id)).size;
}

function topList(events: SiteEvent[], key: keyof SiteEvent, limit = 8) {
  const counts = new Map<string, number>();
  for (const e of events) {
    const raw = (e[key] as string | null) || "Onbekend";
    counts.set(raw, (counts.get(raw) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export default function Statistieken() {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [rangeDays, setRangeDays] = useState<number>(7);
  const [events, setEvents] = useState<SiteEvent[]>([]);
  const [live, setLive] = useState<SiteEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.replace("/login?next=/statistieken");
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
    const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("site_events")
      .select("created_at, session_id, event_type, path, referrer, device, country")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    setEvents((data as SiteEvent[]) || []);
    setLoading(false);
  }, [rangeDays]);

  const loadLive = useCallback(async () => {
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("site_events")
      .select("created_at, session_id, event_type, path, referrer, device, country")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);
    setLive((data as SiteEvent[]) || []);
  }, []);

  useEffect(() => {
    if (!allowed) return;
    void load();
  }, [allowed, load]);

  useEffect(() => {
    if (!allowed) return;
    void loadLive();
    const timer = window.setInterval(() => void loadLive(), 20000);
    return () => window.clearInterval(timer);
  }, [allowed, loadLive]);

  const stats = useMemo(() => {
    const views = events.filter((e) => e.event_type === "page_view");
    const carts = events.filter((e) => e.event_type === "add_to_cart");
    const checkouts = events.filter((e) => e.event_type === "begin_checkout");
    return {
      visitors: countUnique(views),
      views: views.length,
      carts: countUnique(carts),
      checkouts: countUnique(checkouts),
      pages: topList(views, "path"),
      sources: topList(views, "referrer"),
      devices: topList(views, "device", 4),
      countries: topList(views, "country", 6),
    };
  }, [events]);

  const liveVisitors = countUnique(live);

  if (checking) {
    return <main className="min-h-screen grid place-items-center bg-background text-muted-foreground">Bezig met laden...</main>;
  }

  if (!allowed) {
    return (
      <main className="min-h-screen grid place-items-center bg-background px-6 text-center">
        <Seo title="Statistieken | SenseGlow" description="Interne cijfers." path="/statistieken" noindex />
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold mb-3">Geen toegang</h1>
          <p className="text-sm text-muted-foreground">
            Dit account mag de cijfers niet bekijken. Vraag om beheerdersrechten.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 md:px-10">
      <Seo title="Statistieken | SenseGlow" description="Interne cijfers." path="/statistieken" noindex />

      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Statistieken</h1>
            <p className="text-sm text-muted-foreground">Live bezoekers en gedrag op senseglow.shop</p>
          </div>
          <div className="flex items-center gap-2">
            {RANGES.map((r) => (
              <Button
                key={r.days}
                variant={rangeDays === r.days ? "default" : "outline"}
                size="sm"
                onClick={() => setRangeDays(r.days)}
              >
                {r.label}
              </Button>
            ))}
          </div>
        </header>

        <section className="rounded-2xl border border-primary/20 bg-card/60 p-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
            <span className="text-sm text-muted-foreground">Nu online, laatste 5 minuten</span>
          </div>
          <p className="mt-2 text-4xl font-semibold">{liveVisitors}</p>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            {live.slice(0, 6).map((e, i) => (
              <li key={i} className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="truncate">{e.path || "/"}</span>
                <span className="text-xs">{e.device}</span>
                <span className="text-xs">{e.country || ""}</span>
              </li>
            ))}
            {live.length === 0 && <li>Op dit moment niemand op de site.</li>}
          </ul>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Bezoekers", value: stats.visitors, Icon: Users },
            { label: "Paginaweergaves", value: stats.views, Icon: Eye },
            { label: "In winkelwagen", value: stats.carts, Icon: ShoppingCart },
            { label: "Naar afrekenen", value: stats.checkouts, Icon: CreditCard },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="rounded-xl border border-border/60 bg-card/50 p-5">
              <Icon className="mb-3 h-4 w-4 text-primary" />
              <p className="text-2xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-border/60 bg-card/50 p-5">
          <h2 className="mb-3 text-sm font-medium">Van bezoek tot afrekenen</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "Bezoekers", value: stats.visitors },
              { label: "Legden iets in de winkelwagen", value: stats.carts },
              { label: "Klikten op afrekenen", value: stats.checkouts },
            ].map((row) => {
              const pct = stats.visitors > 0 ? Math.round((row.value / stats.visitors) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex justify-between">
                    <span>{row.label}</span>
                    <span className="text-muted-foreground">
                      {row.value} ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Meest bekeken pagina's", rows: stats.pages },
            { title: "Waar bezoekers vandaan komen", rows: stats.sources },
            { title: "Apparaat", rows: stats.devices },
            { title: "Land", rows: stats.countries },
          ].map((block) => (
            <div key={block.title} className="rounded-xl border border-border/60 bg-card/50 p-5">
              <h2 className="mb-3 text-sm font-medium">{block.title}</h2>
              <ul className="space-y-1.5 text-sm">
                {block.rows.map(([label, count]) => (
                  <li key={label} className="flex justify-between gap-4">
                    <span className="truncate text-muted-foreground">{label}</span>
                    <span>{count}</span>
                  </li>
                ))}
                {block.rows.length === 0 && <li className="text-muted-foreground">Nog geen gegevens.</li>}
              </ul>
            </div>
          ))}
        </section>

        <p className="text-xs text-muted-foreground">
          {loading ? "Bezig met verversen..." : "Cijfers komen uit je eigen site, los van Shopify en Google."}
        </p>
      </div>
    </main>
  );
}
