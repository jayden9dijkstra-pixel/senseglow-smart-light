/**
 * Intern dashboard. Alleen voor een ingelogde beheerder, uitgesloten van Google.
 * Alle externe data komt via de backend; er wordt nooit iets geschat.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, CheckCircle2, CircleDot, Download, Loader2, RefreshCw, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { amsDate, pctChange, round2, type Settings } from "@/lib/dashboardMetrics";
import { adsByCampaign, computeStats, perDaySeries, perVariant, type AdRow, type Filters, type Summary } from "./dashboard/compute";

const AD_VAT_KEY = "sg_ad_spend_incl_vat";
const INTERNAL_COOKIE = "sg_internal=1; path=/; max-age=31536000; SameSite=Lax";

/* ------------------------------------------------------------ notatie */
const eur = (v: number | null | undefined) =>
  v === null || v === undefined ? "Geen data" : new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v);
const num = (v: number | null | undefined, d = 0) =>
  v === null || v === undefined ? "Geen data" : new Intl.NumberFormat("nl-NL", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
const pct = (v: number | null | undefined) => (v === null || v === undefined ? "Geen data" : `${num(v, 2)}%`);
const dmy = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}-${m}-${y}`;
};
const hhmm = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat("nl-NL", { timeZone: "Europe/Amsterdam", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)) : "nooit";
const dateTime = (iso: string) =>
  `${dmy(amsDate(iso))} ${new Intl.DateTimeFormat("nl-NL", { timeZone: "Europe/Amsterdam", hour: "2-digit", minute: "2-digit" }).format(new Date(iso))}`;

/* ------------------------------------------------------------ periode */
const PRESETS = [
  ["today", "Vandaag"], ["yesterday", "Gisteren"], ["7d", "7 dagen"], ["30d", "30 dagen"], ["month", "Deze maand"], ["custom", "Eigen periode"],
] as const;
const addDays = (d: string, n: number) => new Date(Date.parse(d) + n * 86_400_000).toISOString().slice(0, 10);
function rangeFor(preset: string, from?: string | null, to?: string | null) {
  const today = amsDate(new Date());
  switch (preset) {
    case "today": return { from: today, to: today };
    case "yesterday": return { from: addDays(today, -1), to: addDays(today, -1) };
    case "30d": return { from: addDays(today, -29), to: today };
    case "month": return { from: `${today.slice(0, 8)}01`, to: today };
    case "custom": {
      const ok = (s?: string | null) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
      if (ok(from) && ok(to) && from! <= to!) {
        const days = (Date.parse(to!) - Date.parse(from!)) / 86_400_000 + 1;
        if (days <= 365) return { from: from!, to: to! };
      }
      return { from: addDays(today, -6), to: today };
    }
    default: return { from: addDays(today, -6), to: today };
  }
}

/* ------------------------------------------------------------ bouwstenen */
function Delta({ cur, prev, invert }: { cur: number | null; prev: number | null | undefined; invert?: boolean }) {
  if (prev === undefined) return null;
  const c = pctChange(cur, prev);
  if (c === null) return <span className="text-xs text-muted-foreground">vs vorige: geen data</span>;
  const good = invert ? c <= 0 : c >= 0;
  return <span className={`text-xs ${good ? "text-[hsl(var(--success,160_60%_35%))]" : "text-destructive"}`}>{c >= 0 ? "+" : ""}{num(c, 1)}% vs vorige</span>;
}
function Card({ label, value, sub, danger, children }: { label: string; value: string; sub?: string; danger?: boolean; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${danger ? "text-destructive" : ""}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      {children}
    </div>
  );
}
function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Empty({ reason }: { reason: string }) {
  return <p className="text-sm text-muted-foreground">Geen data: {reason}</p>;
}
type Light = "green" | "amber" | "red";
function Lamp({ state, title, text }: { state: Light; title: string; text: string }) {
  const Icon = state === "green" ? CheckCircle2 : state === "amber" ? AlertTriangle : XCircle;
  const cls = state === "green" ? "text-[hsl(160_60%_35%)]" : state === "amber" ? "text-accent" : "text-destructive";
  return (
    <div className="flex gap-3 rounded-md border border-border/60 p-3">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cls}`} aria-label={state} />
      <div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{text}</p></div>
    </div>
  );
}
function SortTable<T extends Record<string, unknown>>({ rows, cols, total, csvName }: {
  rows: T[]; cols: { key: keyof T & string; label: string; fmt?: (v: any, r: T) => string; danger?: (r: T) => boolean }[];
  total?: Partial<Record<keyof T, string>>; csvName?: string;
}) {
  const [sort, setSort] = useState<{ k: string; asc: boolean } | null>(null);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    return [...rows].sort((a, b) => {
      const x = a[sort.k] as any, y = b[sort.k] as any;
      const r = x === null ? -1 : y === null ? 1 : x < y ? -1 : x > y ? 1 : 0;
      return sort.asc ? r : -r;
    });
  }, [rows, sort]);
  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [cols.map((c) => esc(c.label)).join(";"), ...sorted.map((r) => cols.map((c) => esc(typeof r[c.key] === "number" ? String(r[c.key]).replace(".", ",") : r[c.key])).join(";"))];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `${csvName}.csv`; a.click();
  };
  return (
    <div>
      {csvName && (
        <div className="mb-2 flex justify-end">
          <Button size="sm" variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />CSV</Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>{cols.map((c) => (
              <th key={c.key} className="cursor-pointer select-none py-2 pr-3" onClick={() => setSort((s) => ({ k: c.key, asc: s?.k === c.key ? !s.asc : false }))}>
                {c.label}{sort?.k === c.key ? (sort.asc ? " ↑" : " ↓") : ""}
              </th>))}</tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={i} className="border-t border-border/60">
                {cols.map((c) => <td key={c.key} className={`py-2 pr-3 ${c.danger?.(r) ? "text-destructive font-medium" : ""}`}>{c.fmt ? c.fmt(r[c.key], r) : String(r[c.key] ?? "")}</td>)}
              </tr>
            ))}
            {total && (
              <tr className="border-t-2 border-border font-semibold">{cols.map((c) => <td key={c.key} className="py-2 pr-3">{total[c.key] ?? ""}</td>)}</tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ pagina */
export default function AdminDashboard() {
  const [params, setParams] = useSearchParams();
  const preset = params.get("p") ?? "7d";
  const { from, to } = rangeFor(preset, params.get("from"), params.get("to"));
  const compare = params.get("cmp") === "1";
  const excludeInternal = params.get("exclude_internal") !== "0";
  const campaign = params.get("campagne") ?? "";
  const variant = params.get("variant") ?? "";
  const tab = params.get("tab") ?? "overzicht";
  const setParam = (k: string, v: string | null) => setParams((p) => { const n = new URLSearchParams(p); if (v === null || v === "") n.delete(k); else n.set(k, v); return n; }, { replace: true });

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adInclVat, setAdInclVat] = useState(() => localStorage.getItem(AD_VAT_KEY) !== "0");
  useEffect(() => { localStorage.setItem(AD_VAT_KEY, adInclVat ? "1" : "0"); }, [adInclVat]);

  useEffect(() => {
    document.cookie = INTERNAL_COOKIE;
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) { window.location.replace("/login?next=/admin/dashboard"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", s.session.user.id);
      setAllowed(Boolean(roles?.some((r) => r.role === "admin")));
      setChecking(false);
    })();
  }, []);

  const reqId = useRef(0);
  const load = useCallback(async (force = false) => {
    const id = ++reqId.current;
    setLoading(true);
    const { data: d, error: e } = await supabase.functions.invoke("dashboard-summary", {
      body: { from, to, compare, exclude_internal: excludeInternal, force },
    });
    if (id !== reqId.current) return;
    if (e || (d as any)?.error) setError((d as any)?.error ?? "De gegevens konden niet geladen worden.");
    else { setError(null); setData(d as Summary); }
    setLoading(false);
  }, [from, to, compare, excludeInternal]);

  useEffect(() => { if (allowed) void load(); }, [allowed, load]);
  useEffect(() => {
    if (!allowed) return;
    const t = setInterval(() => { if (document.visibilityState === "visible") void load(); }, 60_000);
    return () => clearInterval(t);
  }, [allowed, load]);

  const f: Filters = { campaign, variant, adInclVat };
  const cur = useMemo(() => (data ? computeStats(data.current, data.costs, data.settings, f) : null), [data, campaign, variant, adInclVat]); // eslint-disable-line react-hooks/exhaustive-deps
  const prev = useMemo(() => (data?.previous ? computeStats(data.previous, data.costs, data.settings, f) : null), [data, campaign, variant, adInclVat]); // eslint-disable-line react-hooks/exhaustive-deps
  const series = useMemo(() => (data ? perDaySeries(data.current, data.range.from, data.range.to, f) : []), [data, campaign, variant, adInclVat]); // eslint-disable-line react-hooks/exhaustive-deps
  const campaigns = useMemo(() => [...new Set(data?.current.ads.map((a) => a.campaign) ?? [])].sort(), [data]);
  const variants = useMemo(() => [...new Set(data?.costs.map((c) => c.product) ?? [])], [data]);

  if (checking) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!allowed) return <div className="flex min-h-screen items-center justify-center p-8 text-center"><p>Je hebt geen toegang tot deze pagina.</p></div>;

  const adsUpdated = data?.sources.adsScript.updatedAt ?? data?.sources.adsLegacy.updatedAt ?? null;
  const adsStale = !data?.sources.adsScript.updatedAt || Date.now() - Date.parse(data.sources.adsScript.updatedAt) > 3 * 3_600_000;
  const P = (k: keyof NonNullable<typeof cur>) => (prev ? (prev[k] as number | null) : undefined);

  return (
    <main className="mx-auto w-full max-w-7xl overflow-x-hidden px-3 py-6 md:px-6 md:py-10">
      <meta name="robots" content="noindex, nofollow" />
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Bestellingen: {hhmm(data?.sources.orders.updatedAt ?? null)} · Advertenties: {hhmm(adsUpdated)} · Bezoeken: {hhmm(data?.sources.events.updatedAt ?? null)}
          </p>
        </div>
        <Button variant="outline" onClick={() => void load(true)} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Verversen
        </Button>
      </header>

      {/* Periodekiezer */}
      <div className="mb-5 space-y-3 rounded-lg border border-border bg-card p-3 md:p-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(([k, label]) => (
            <Button key={k} size="sm" variant={preset === k ? "default" : "outline"} onClick={() => {
              setParams((p) => { const n = new URLSearchParams(p); n.set("p", k); if (k === "custom") { n.set("from", from); n.set("to", to); } else { n.delete("from"); n.delete("to"); } return n; }, { replace: true });
            }}>{label}</Button>
          ))}
        </div>
        {preset === "custom" && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Input type="date" className="w-auto" value={from} max={to} onChange={(e) => setParam("from", e.target.value)} />
            <span>t/m</span>
            <Input type="date" className="w-auto" value={to} min={from} onChange={(e) => setParam("to", e.target.value)} />
            <span className="text-xs text-muted-foreground">max. 365 dagen</span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="text-muted-foreground">{dmy(from)} t/m {dmy(to)}</span>
          <label className="flex items-center gap-2"><Switch checked={compare} onCheckedChange={(v) => setParam("cmp", v ? "1" : null)} />Vergelijk met vorige periode</label>
          <label className="flex items-center gap-2"><Switch checked={excludeInternal} onCheckedChange={(v) => setParam("exclude_internal", v ? null : "0")} />Eigen verkeer uitsluiten</label>
          <label className="flex items-center gap-2"><Switch checked={adInclVat} onCheckedChange={setAdInclVat} />Advertentiebedrag is incl. btw (÷ 1,21)</label>
          <select className="h-9 rounded-md border border-input bg-background px-2" value={campaign} onChange={(e) => setParam("campagne", e.target.value)}>
            <option value="">Alle campagnes</option>{campaigns.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="h-9 rounded-md border border-input bg-background px-2" value={variant} onChange={(e) => setParam("variant", e.target.value)}>
            <option value="">Alle producten</option>{variants.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {data?.sources.orders.error && <p className="mb-4 text-sm text-destructive">Shopify: {data.sources.orders.error} (opgeslagen bestellingen worden getoond)</p>}
      {data && adsStale && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-accent/50 bg-accent/10 p-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>Advertentiecijfers van het Google Ads Script {data.sources.adsScript.updatedAt ? `zijn sinds ${dateTime(data.sources.adsScript.updatedAt)} niet bijgewerkt (langer dan 3 uur)` : "zijn nog nooit ontvangen"}. Bron nu: {data.current.adsSource}.</span>
        </div>
      )}

      {!data || !cur ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <Tabs value={tab} onValueChange={(v) => setParam("tab", v === "overzicht" ? null : v)}>
          <TabsList className="mb-4 flex h-auto flex-wrap justify-start">
            {[["overzicht", "Overzicht"], ["ads", "Ads"], ["orders", "Orders"], ["producten", "Producten en marges"], ["tracking", "Tracking"], ["trechter", "Trechter"], ["instellingen", "Instellingen"]].map(([k, l]) => (
              <TabsTrigger key={k} value={k}>{l}</TabsTrigger>
            ))}
          </TabsList>

          {/* A. Overzicht */}
          <TabsContent value="overzicht" className="space-y-5">
            {cur.missingCost.length > 0 && <p className="text-sm text-destructive">Inkoop ontbreekt voor: {cur.missingCost.join(", ")}. Winst is onvolledig.</p>}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              <Card label="Omzet (incl. btw)" value={eur(cur.revenueIncl)} sub={`excl. btw ${eur(cur.revenueExcl)}`}><Delta cur={cur.revenueIncl} prev={P("revenueIncl")} /></Card>
              <Card label="Bestellingen" value={num(cur.orders)}><Delta cur={cur.orders} prev={P("orders")} /></Card>
              <Card label="Gem. orderwaarde" value={eur(cur.aov)}><Delta cur={cur.aov} prev={P("aov")} /></Card>
              <Card label="Advertentiekosten" value={eur(cur.spend)}><Delta cur={cur.spend} prev={P("spend")} invert /></Card>
              <Card label="Nettowinst" value={cur.missingCost.length ? "Onvolledig" : eur(cur.netProfit)} danger={(cur.netProfit ?? 0) < 0}
                sub={cur.profitMargin !== null ? `marge ${pct(cur.profitMargin)} · per order ${eur(cur.profitPerOrder)}` : undefined}><Delta cur={cur.netProfit} prev={P("netProfit")} /></Card>
              <Card label="ROAS" value={num(cur.roas, 2)} danger={cur.roas !== null && cur.breakEvenRoas !== null && cur.roas < cur.breakEvenRoas} sub={`break-even ${num(cur.breakEvenRoas, 2)}`}><Delta cur={cur.roas} prev={P("roas")} /></Card>
              <Card label="CPA" value={eur(cur.cpa)} danger={cur.cpa !== null && cur.breakEvenCpa !== null && cur.cpa > cur.breakEvenCpa} sub={`break-even ${eur(cur.breakEvenCpa)}`}><Delta cur={cur.cpa} prev={P("cpa")} invert /></Card>
              <Card label="Conversiepercentage" value={pct(cur.conversionRate)} sub="bestellingen ÷ sessies"><Delta cur={cur.conversionRate} prev={P("conversionRate")} /></Card>
              <Card label="Bezoekers (sessies)" value={num(cur.visitors)}><Delta cur={cur.visitors} prev={P("visitors")} /></Card>
              <Card label="Af te dragen btw (indicatie)" value={eur(cur.vat)} sub={data.settings?.tax_reserve_enabled ? `belastingreservering ${eur(cur.taxReserve)}` : "geen fiscaal advies"} />
            </div>
            <Section title="Omzet en advertentiekosten per dag" note="Omzet incl. btw. Dagen zonder advertentiecijfers hebben geen kostenpunt.">
              <div className="h-64 w-full">
                <ResponsiveContainer>
                  <LineChart data={series.map((s) => ({ ...s, label: dmy(s.day).slice(0, 5) }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip formatter={(v: number) => eur(v)} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Omzet" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="spend" name="Advertentiekosten" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Section>
            <div className="grid gap-5 md:grid-cols-2">
              <Section title="Top 5 producten">
                {perVariant(cur.ordersList, data.costs, data.settings).length === 0 ? <Empty reason="geen bestellingen in deze periode" /> : (
                  <ol className="space-y-2 text-sm">{perVariant(cur.ordersList, data.costs, data.settings).slice(0, 5).map((v) => (
                    <li key={v.label} className="flex justify-between gap-3"><span className="truncate">{v.label}</span><span className="shrink-0">{v.units}× · {eur(v.revenue)}</span></li>
                  ))}</ol>
                )}
              </Section>
              <Section title="Trackingstatus"><TrackingLamps data={data} cur={cur} adsStale={adsStale} /></Section>
            </div>
          </TabsContent>

          {/* B. Ads */}
          <TabsContent value="ads" className="space-y-5">
            <AdsTab ads={cur.ads} adInclVat={adInclVat} source={data.current.adsSource} />
          </TabsContent>

          {/* C. Orders */}
          <TabsContent value="orders">
            <Section title="Bestellingen" note="Zonder persoonsgegevens. Testbestellingen en terugbetaalde orders staan er niet in.">
              {cur.ordersList.length === 0 ? <Empty reason="geen bestellingen in deze periode" /> : (
                <SortTable csvName="orders" rows={cur.ordersList.map((o) => ({
                  order: o.order_number, tijd: o.ordered_at, bedrag: o.total,
                  producten: o.line_items.map((l) => `${l.quantity}× ${l.title}${l.variant_title ? ` (${l.variant_title})` : ""}`).join(", "),
                  land: o.country_code ?? "Geen data", status: o.financial_status ?? "", klik: o.has_gclid ? "ja" : "nee",
                  source: o.utm_source ?? "", medium: o.utm_medium ?? "", campaign: o.utm_campaign ?? "",
                }))} cols={[
                  { key: "order", label: "Order" }, { key: "tijd", label: "Tijd", fmt: dateTime }, { key: "bedrag", label: "Bedrag", fmt: eur },
                  { key: "producten", label: "Producten" }, { key: "land", label: "Land" }, { key: "status", label: "Status" },
                  { key: "klik", label: "Klik-ID" }, { key: "source", label: "utm_source" }, { key: "medium", label: "utm_medium" }, { key: "campaign", label: "utm_campaign" },
                ]} />
              )}
            </Section>
          </TabsContent>

          {/* D. Producten */}
          <TabsContent value="producten" className="space-y-5">
            <Section title="Per variant" note="Marge per stuk = prijs excl. btw × (1 − transactie − overig) − inkoop − heffing bij een losse bestelling. Break-even CPA = marge per stuk; break-even conversieratio = CPC ÷ break-even CPA.">
              {(() => {
                const rows = perVariant(cur.ordersList, data.costs, data.settings);
                if (!rows.length) return <Empty reason="geen verkochte producten in deze periode" />;
                return <SortTable csvName="producten" rows={rows.map((r) => ({
                  ...r, cost: r.cost, beCr: r.breakEvenCpa && cur.cpc !== null && r.breakEvenCpa > 0 ? (cur.cpc / r.breakEvenCpa) * 100 : null,
                }))} cols={[
                  { key: "label", label: "Variant" }, { key: "units", label: "Verkocht" }, { key: "revenue", label: "Omzet", fmt: eur },
                  { key: "cost", label: "Inkoop/stuk", fmt: (v) => (v === null ? "inkoop ontbreekt" : eur(v)) },
                  { key: "marginPerUnit", label: "Marge/stuk", fmt: eur, danger: (r) => (r.marginPerUnit ?? 0) < 0 },
                  { key: "totalMargin", label: "Totale marge", fmt: eur, danger: (r) => (r.totalMargin ?? 0) < 0 },
                  { key: "breakEvenCpa", label: "Break-even CPA", fmt: eur, danger: (r) => cur.cpa !== null && r.breakEvenCpa !== null && cur.cpa > r.breakEvenCpa },
                  { key: "beCr", label: "Break-even conv.ratio", fmt: pct },
                ]} />;
              })()}
            </Section>
            <Section title="Financieel overzicht" note="Indicatie, geen fiscaal advies.">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Card label="Omzet incl. btw" value={eur(cur.revenueIncl)} /><Card label="Btw (21%)" value={eur(cur.vat)} />
                <Card label="Omzet excl. btw" value={eur(cur.revenueExcl)} /><Card label="Inkoop" value={eur(cur.purchase)} />
                <Card label="Importheffing" value={eur(cur.levy)} /><Card label="Dekkingsbijdrage" value={eur(cur.contribution)} />
                <Card label="Advertentiekosten" value={eur(cur.spend)} /><Card label="Nettowinst" value={eur(cur.netProfit)} danger={(cur.netProfit ?? 0) < 0} />
              </div>
            </Section>
          </TabsContent>

          {/* E. Tracking */}
          <TabsContent value="tracking" className="space-y-5">
            <Section title="Status"><TrackingLamps data={data} cur={cur} adsStale={adsStale} /></Section>
            <Section title="Klik-ID's">
              <p className="text-sm">{num(cur.ordersList.filter((o) => o.has_gclid).length)} van {num(cur.orders)} bestellingen hebben een klik-ID ({pct(cur.orders ? (cur.ordersList.filter((o) => o.has_gclid).length / cur.orders) * 100 : null)}).</p>
              <div className="mt-3 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Per utm_campaign</p>
                  {Object.entries(cur.ordersList.reduce<Record<string, number>>((a, o) => { const k = o.utm_campaign ?? "(geen)"; a[k] = (a[k] ?? 0) + 1; return a; }, {})).map(([k, v]) => (
                    <p key={k} className="text-sm">{k}: {v}</p>
                  ))}
                  {cur.orders === 0 && <Empty reason="geen bestellingen" />}
                </div>
                <div>
                  <p className="mb-2 text-xs text-muted-foreground">Recente klik-ID's bij afrekenen (gemaskeerd)</p>
                  {data.recentClickIds.length === 0 ? <Empty reason="nog geen klik-ID opgeslagen" /> : data.recentClickIds.map((c, i) => (
                    <p key={i} className="font-mono text-xs">{c.masked} · {c.utm_campaign ?? "-"} · {dateTime(c.at)}</p>
                  ))}
                </div>
              </div>
            </Section>
            <Section title="Google Ads-conversies tegenover echte orders met klik-ID" note="Tracking-gat = orders met klik-ID − conversies volgens Google. Google Ads loopt enkele uren achter.">
              <SortTable rows={series.map((s) => ({ dag: s.day, google: s.adConversions, echt: s.gclidOrders, gat: s.adConversions === null ? null : round2(s.gclidOrders - s.adConversions) }))}
                cols={[{ key: "dag", label: "Dag", fmt: dmy }, { key: "google", label: "Conversies Google", fmt: (v) => num(v, 1) }, { key: "echt", label: "Orders met klik-ID" },
                  { key: "gat", label: "Tracking-gat", fmt: (v) => num(v, 1), danger: (r) => (r.gat ?? 0) !== 0 }]} />
            </Section>
            <Section title="Events per dag" note="Aankopen komen uit Shopify; de site slaat zelf geen aankoopmoment op.">
              <SortTable csvName="events" rows={series.map((s) => ({ dag: s.day, view_item: s.events.view_item ?? 0, add_to_cart: s.events.add_to_cart ?? 0, begin_checkout: s.events.begin_checkout ?? 0, purchase: s.orders }))}
                cols={[{ key: "dag", label: "Dag", fmt: dmy }, { key: "view_item", label: "view_item" }, { key: "add_to_cart", label: "add_to_cart" }, { key: "begin_checkout", label: "begin_checkout" }, { key: "purchase", label: "purchase (Shopify)" }]} />
            </Section>
          </TabsContent>

          {/* F. Trechter */}
          <TabsContent value="trechter"><FunnelTab data={data} orders={cur.orders} /></TabsContent>

          {/* G. Instellingen */}
          <TabsContent value="instellingen"><SettingsTab data={data} onSaved={() => void load(true)} /></TabsContent>
        </Tabs>
      )}
    </main>
  );
}

function TrackingLamps({ data, cur, adsStale }: { data: Summary; cur: ReturnType<typeof computeStats>; adsStale: boolean }) {
  const checkouts = Object.values(data.current.events.perDay).reduce((a, d) => a + (d.begin_checkout ?? 0), 0);
  const withG = cur.ordersList.filter((o) => o.has_gclid).length;
  const convValue = cur.ads.reduce<number | null>((a, r) => (r.conversion_value === null ? a : (a ?? 0) + r.conversion_value), null);
  return (
    <div className="space-y-2">
      <Lamp state={data.recentClickIds.length ? "green" : "amber"} title="Klik-ID blijft bewaard tot afrekenen"
        text={data.recentClickIds.length ? `Laatste opgeslagen: ${dateTime(data.recentClickIds[0].at)}. ${withG} van ${cur.orders} orders in deze periode hebben er een.` : "Nog geen klik-ID bij een afrekening opgeslagen."} />
      <Lamp state={cur.orders === 0 ? "amber" : checkouts >= cur.orders ? "green" : "red"} title="Aankopen kloppen met gestarte afrekeningen"
        text={`${checkouts} afrekeningen gestart, ${cur.orders} Shopify-orders. Minder afrekeningen dan orders wijst op een meetlek.`} />
      <Lamp state={adsStale ? "red" : "green"} title="Advertentiecijfers zijn actueel" text={data.sources.adsScript.updatedAt ? `Laatst ontvangen ${dateTime(data.sources.adsScript.updatedAt)}.` : "Het Google Ads Script heeft nog niets gestuurd."} />
      <Lamp state={convValue === null ? "amber" : convValue > 0 ? "green" : "red"} title="Conversiewaarde is niet 0"
        text={convValue === null ? "Geen conversiewaarde beschikbaar (alleen via het Google Ads Script)." : `Conversiewaarde in deze periode: ${eur(convValue)}.`} />
    </div>
  );
}

function AdsTab({ ads, adInclVat, source }: { ads: AdRow[]; adInclVat: boolean; source: string }) {
  if (!ads.length) return <Section title="Campagnes"><Empty reason="geen advertentiecijfers in deze periode" /></Section>;
  const vatF = adInclVat ? 1.21 : 1;
  const enrich = (r: AdRow, spend: number) => ({
    ...r, spend, ctr: r.impressions ? (r.clicks / r.impressions) * 100 : null, cpc: r.clicks ? spend / r.clicks : null,
    roas: spend && r.conversion_value !== null ? r.conversion_value / spend : null, cpa: r.conversions ? spend / r.conversions : null,
  });
  const camp = adsByCampaign(ads, adInclVat).map((r) => enrich(r, r.spend));
  const daily = ads.map((r) => enrich(r, r.spend / vatF)).sort((a, b) => (a.date < b.date ? 1 : -1));
  const t = camp.reduce((a, r) => ({ spend: a.spend + r.spend, clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions, conversions: a.conversions + r.conversions }), { spend: 0, clicks: 0, impressions: 0, conversions: 0 });
  const cols = [
    { key: "spend", label: "Uitgaven", fmt: eur }, { key: "clicks", label: "Klikken", fmt: (v: number) => num(v) }, { key: "impressions", label: "Vertoningen", fmt: (v: number) => num(v) },
    { key: "ctr", label: "CTR", fmt: pct }, { key: "cpc", label: "CPC", fmt: eur }, { key: "conversions", label: "Conversies", fmt: (v: number) => num(v, 1) },
    { key: "conversion_value", label: "Conv.waarde", fmt: eur }, { key: "roas", label: "ROAS", fmt: (v: number | null) => num(v, 2) }, { key: "cpa", label: "CPA", fmt: eur },
    { key: "status", label: "Status", fmt: (v: string | null) => (v ? (v === "ENABLED" ? "actief" : v === "PAUSED" ? "gepauzeerd" : v.toLowerCase()) : "Geen data") },
  ] as const;
  return (
    <>
      <Section title="Per campagne" note={`Bron: ${source}. Kosten ${adInclVat ? "zonder btw (÷ 1,21)" : "zoals Google ze toont"}.`}>
        <SortTable csvName="ads-campagnes" rows={camp as any} cols={[{ key: "campaign", label: "Campagne" }, ...cols] as any}
          total={{ campaign: "Totaal", spend: eur(t.spend), clicks: num(t.clicks), impressions: num(t.impressions), ctr: pct(t.impressions ? (t.clicks / t.impressions) * 100 : null), cpc: eur(t.clicks ? t.spend / t.clicks : null), conversions: num(t.conversions, 1), cpa: eur(t.conversions ? t.spend / t.conversions : null) } as any} />
      </Section>
      <Section title="Per dag">
        <SortTable csvName="ads-per-dag" rows={daily as any} cols={[{ key: "date", label: "Dag", fmt: dmy }, { key: "campaign", label: "Campagne" }, ...cols] as any} />
      </Section>
    </>
  );
}

function FunnelTab({ data, orders }: { data: Summary; orders: number }) {
  const devices = Object.keys(data.current.events.funnel).sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b)));
  if (!devices.length) return <Section title="Trechter"><Empty reason="geen bezoeken gemeten in deze periode" /></Section>;
  const names: Record<string, string> = { all: "Alle apparaten", mobile: "Mobiel", desktop: "Desktop", tablet: "Tablet", unknown: "Onbekend" };
  return (
    <div className="space-y-5">
      {devices.map((d) => {
        const f = data.current.events.funnel[d];
        const steps: [string, number | null][] = [
          ["Sessies", f.session ?? 0], ["Productweergaven", f.view_item ?? 0], ["In winkelwagen", f.add_to_cart ?? 0],
          ["Checkout gestart", f.begin_checkout ?? 0], ["Gekocht (Shopify)", d === "all" ? orders : null],
        ];
        return (
          <Section key={d} title={names[d] ?? d} note={d === "all" ? `Verlaten winkelwagens: ${f.abandoned_carts ?? 0} (wel toegevoegd, nooit afrekenen gestart).` : `Aankopen per apparaat zijn niet beschikbaar: Shopify-orders zijn niet aan een apparaat gekoppeld. Verlaten winkelwagens: ${f.abandoned_carts ?? 0}.`}>
            <div className="space-y-2">
              {steps.map(([label, v], i) => {
                const prevV = i ? steps[i - 1][1] : null;
                const drop = v !== null && prevV ? (1 - v / prevV) * 100 : null;
                const width = v !== null && steps[0][1] ? Math.max(2, (v / (steps[0][1] as number)) * 100) : 0;
                return (
                  <div key={label} className="text-sm">
                    <div className="flex justify-between"><span>{label}</span><span>{v === null ? "Geen data" : num(v)}{drop !== null ? ` · uitval ${num(drop, 1)}%` : ""}</span></div>
                    <div className="mt-1 h-2 rounded bg-muted"><div className="h-2 rounded bg-primary" style={{ width: `${width}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </Section>
        );
      })}
    </div>
  );
}

function SettingsTab({ data, onSaved }: { data: Summary; onSaved: () => void }) {
  const [costs, setCosts] = useState(() => data.costs.map((c) => ({ ...c, val: String(c.cost_excl_vat).replace(".", ",") })));
  const s: Settings = data.settings ?? { levy_tiers: [], transaction_rate: 0.025, other_rate: 0.07, tax_reserve_pct: 0, tax_reserve_enabled: false };
  const [tiers, setTiers] = useState(() => s.levy_tiers.map((t) => ({ min: String(t.min).replace(".", ","), levy: String(t.levy).replace(".", ",") })));
  const [tx, setTx] = useState(String(s.transaction_rate * 100).replace(".", ","));
  const [other, setOther] = useState(String(s.other_rate * 100).replace(".", ","));
  const [taxPct, setTaxPct] = useState(String(s.tax_reserve_pct).replace(".", ","));
  const [taxOn, setTaxOn] = useState(s.tax_reserve_enabled);
  const [msg, setMsg] = useState<string | null>(null);
  const [newRow, setNewRow] = useState({ product: "", variant: "", match_pattern: "", val: "" });
  const n = (v: string) => { const x = Number(v.replace(",", ".")); return Number.isFinite(x) && x >= 0 ? x : NaN; };

  const save = async () => {
    setMsg(null);
    const bad = [...costs.map((c) => n(c.val)), ...tiers.flatMap((t) => [n(t.min), n(t.levy)]), n(tx), n(other), n(taxPct)].some((x) => Number.isNaN(x));
    if (bad || n(tx) > 50 || n(other) > 50 || n(taxPct) > 100) { setMsg("Controleer de bedragen: alleen positieve getallen, percentages tot 50% (belasting tot 100%)."); return; }
    for (const c of costs) {
      if (n(c.val) !== c.cost_excl_vat) {
        const { error } = await supabase.from("product_costs").update({ cost_excl_vat: n(c.val), updated_at: new Date().toISOString() }).eq("variant_key", c.variant_key);
        if (error) { setMsg("Opslaan van inkoopprijzen mislukte."); return; }
      }
    }
    if (newRow.product && newRow.match_pattern && newRow.val) {
      try { new RegExp(newRow.match_pattern, "i"); } catch { setMsg("Het zoekpatroon is ongeldig."); return; }
      const key = `${newRow.product}-${newRow.variant}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
      const { error } = await supabase.from("product_costs").insert({ variant_key: key, product: newRow.product.slice(0, 100), variant: newRow.variant.slice(0, 100), match_pattern: newRow.match_pattern.slice(0, 200), cost_excl_vat: n(newRow.val) });
      if (error) { setMsg("Nieuwe variant opslaan mislukte (bestaat hij al?)."); return; }
    }
    const { error } = await supabase.from("dashboard_settings").upsert({
      id: 1, levy_tiers: tiers.map((t) => ({ min: n(t.min), levy: n(t.levy) })).sort((a, b) => a.min - b.min),
      transaction_rate: n(tx) / 100, other_rate: n(other) / 100, tax_reserve_pct: n(taxPct), tax_reserve_enabled: taxOn, updated_at: new Date().toISOString(),
    });
    if (error) { setMsg("Opslaan van instellingen mislukte."); return; }
    setMsg("Opgeslagen.");
    onSaved();
  };

  return (
    <div className="space-y-5">
      <Section title="Inkoopprijzen per variant" note="Inkoop excl. btw. Het zoekpatroon koppelt Shopify-producttitel + variant aan deze prijs (specifiekste patroon wint).">
        <div className="space-y-2">
          {costs.map((c, i) => (
            <div key={c.variant_key} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="min-w-[220px] flex-1">{c.product} · {c.variant}</span>
              <span className="text-xs text-muted-foreground">bijgewerkt {dmy(amsDate(c.updated_at))}</span>
              <Input className="w-28" inputMode="decimal" value={c.val} onChange={(e) => setCosts((cs) => cs.map((x, j) => (j === i ? { ...x, val: e.target.value } : x)))} aria-label={`Inkoop ${c.product} ${c.variant}`} />
            </div>
          ))}
          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            <Input className="w-40" placeholder="Product" value={newRow.product} onChange={(e) => setNewRow({ ...newRow, product: e.target.value })} />
            <Input className="w-36" placeholder="Variant" value={newRow.variant} onChange={(e) => setNewRow({ ...newRow, variant: e.target.value })} />
            <Input className="w-48" placeholder="Zoekpatroon, bijv. wave.*30" value={newRow.match_pattern} onChange={(e) => setNewRow({ ...newRow, match_pattern: e.target.value })} />
            <Input className="w-28" placeholder="Inkoop" inputMode="decimal" value={newRow.val} onChange={(e) => setNewRow({ ...newRow, val: e.target.value })} />
          </div>
        </div>
      </Section>
      <Section title="Importheffing per zending" note="Eén keer per bestelling, op basis van de totale inkoop van die bestelling (staffel Nova).">
        {tiers.map((t, i) => (
          <div key={i} className="mb-2 flex items-center gap-2 text-sm">
            <span>vanaf €</span><Input className="w-24" inputMode="decimal" value={t.min} onChange={(e) => setTiers((ts) => ts.map((x, j) => (j === i ? { ...x, min: e.target.value } : x)))} />
            <span>inkoop: heffing €</span><Input className="w-24" inputMode="decimal" value={t.levy} onChange={(e) => setTiers((ts) => ts.map((x, j) => (j === i ? { ...x, levy: e.target.value } : x)))} />
          </div>
        ))}
      </Section>
      <Section title="Kosten en belasting" note="Belastingreservering is een indicatie, geen fiscaal advies.">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">Transactiekosten %<Input className="w-20" inputMode="decimal" value={tx} onChange={(e) => setTx(e.target.value)} /></label>
          <label className="flex items-center gap-2">Overige kosten %<Input className="w-20" inputMode="decimal" value={other} onChange={(e) => setOther(e.target.value)} /></label>
          <label className="flex items-center gap-2"><Switch checked={taxOn} onCheckedChange={setTaxOn} />Belastingreservering</label>
          <label className="flex items-center gap-2">% over winst<Input className="w-20" inputMode="decimal" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} /></label>
        </div>
      </Section>
      <Section title="Eigen verkeer" note="Dit apparaat is gemarkeerd als eigen verkeer zodra je het dashboard opent. Op een ander apparaat: open de site één keer met ?intern=1 (en ?intern=0 om het weer te wissen).">
        <p className="flex items-center gap-2 text-sm"><CircleDot className="h-4 w-4 text-primary" />Dit apparaat: {/(?:^|;\s*)sg_internal=1/.test(document.cookie) ? "gemarkeerd als eigen verkeer" : "niet gemarkeerd"}</p>
      </Section>
      <div className="flex items-center gap-3">
        <Button onClick={() => void save()}>Opslaan</Button>
        {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
      </div>
    </div>
  );
}
