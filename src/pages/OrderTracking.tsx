import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronRight,
  Package,
  Truck,
  CheckCircle2,
  ClipboardCheck,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

/* ------------------------------------------------------------------ types */

interface Money {
  amount: string;
  currencyCode: string;
}

interface OrderItem {
  title: string;
  variantTitle: string | null;
  quantity: number;
  image: string | null;
  imageAlt: string | null;
  total: Money | null;
}

interface OrderData {
  name: string;
  createdAt: string;
  fulfillmentStatus: string | null;
  financialStatus: string | null;
  total: Money | null;
  shippingAddress: {
    name: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    zip: string | null;
    country: string | null;
  } | null;
  items: OrderItem[];
  fulfillment: {
    status: string | null;
    createdAt: string | null;
    estimatedDeliveryAt: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
    carrier: string | null;
  } | null;
}

type ViewState = "form" | "loading" | "found" | "notfound";

/* -------------------------------------------------------------- helpers */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeOrderNumber = (raw: string) => raw.replace(/\D/g, "");

const formatMoney = (money: Money | null) => {
  if (!money) return "";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: money.currencyCode || "EUR",
  }).format(Number(money.amount));
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatShortDate = (date: Date) =>
  date.toLocaleDateString("nl-NL", { day: "numeric", month: "long" });

const addBusinessDays = (start: Date, days: number) => {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return result;
};

type StatusKey = "received" | "preparing" | "shipped" | "transit" | "delivered";

const resolveStatus = (order: OrderData): StatusKey => {
  const status = (order.fulfillmentStatus ?? "").toUpperCase();
  const fulfillmentStatus = (order.fulfillment?.status ?? "").toUpperCase();
  if (status === "DELIVERED" || fulfillmentStatus === "DELIVERED") return "delivered";
  if (status === "FULFILLED" || fulfillmentStatus === "SUCCESS") {
    return order.fulfillment?.trackingNumber ? "transit" : "shipped";
  }
  if (status === "IN_PROGRESS" || status === "PARTIALLY_FULFILLED") return "preparing";
  return "received";
};

const STATUS_LABEL: Record<StatusKey, string> = {
  received: "Bestelling ontvangen",
  preparing: "In voorbereiding",
  shipped: "Verzonden",
  transit: "Onderweg",
  delivered: "Afgeleverd",
};

const STATUS_STEP: Record<StatusKey, number> = {
  received: 0,
  preparing: 1,
  shipped: 2,
  transit: 2,
  delivered: 3,
};

const STEPS = [
  { label: "Ontvangen", icon: ClipboardCheck },
  { label: "Voorbereiding", icon: Package },
  { label: "Verzonden", icon: Truck },
  { label: "Afgeleverd", icon: CheckCircle2 },
];

const trackEvent = (event: string) => {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", event);
};

/* ---------------------------------------------------------------- page */

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ orderNumber?: string; email?: string }>({});
  const [view, setView] = useState<ViewState>("form");
  const [order, setOrder] = useState<OrderData | null>(null);

  const lookup = async (nextOrderNumber: string, nextEmail: string) => {
    setView("loading");
    try {
      const { data, error } = await supabase.functions.invoke("order-lookup", {
        body: { orderNumber: nextOrderNumber, email: nextEmail },
      });

      if (error || !data?.found) {
        setOrder(null);
        setView("notfound");
        trackEvent("order_lookup_notfound");
        return;
      }

      setOrder(data.order as OrderData);
      setView("found");
      trackEvent("order_lookup_success");
    } catch {
      setOrder(null);
      setView("notfound");
      trackEvent("order_lookup_notfound");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { orderNumber?: string; email?: string } = {};
    const normalized = normalizeOrderNumber(orderNumber);

    if (!normalized) nextErrors.orderNumber = "Vul je ordernummer in, bijvoorbeeld #1003.";
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = "Vul een geldig e-mailadres in.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    lookup(normalized, email.trim());
  };

  const reset = () => {
    setView("form");
    setOrder(null);
  };

  return (
    <PageLayout
      seo={{
        title: "Volg je bestelling · SenseGlow",
        description:
          "Bekijk de status van je SenseGlow bestelling. Vul je ordernummer en e-mailadres in en zie direct waar je pakket is.",
        path: "/volg-je-bestelling",
      }}
    >
      <section className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div
            className={`mx-auto transition-all duration-500 ${
              view === "found" ? "max-w-[720px]" : "max-w-[480px]"
            }`}
          >
            <div className="rounded-[10px] border border-glow/15 bg-card/60 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-glow">
                <Package className="h-5 w-5" aria-hidden="true" />
                <span className="text-[11px] uppercase tracking-[0.25em] font-medium">SenseGlow</span>
              </div>

              <div aria-live="polite">
                {view === "loading" && <Skeleton />}

                {view !== "loading" && view !== "found" && (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="space-y-2">
                      <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
                        Volg je bestelling
                      </h1>
                      <p className="text-foreground/60 leading-relaxed">
                        Vul je ordernummer en e-mailadres in om de status van je pakket te bekijken.
                      </p>
                    </div>

                    {view === "notfound" && (
                      <p className="rounded-[10px] border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground/80 leading-relaxed">
                        We kunnen deze bestelling niet vinden. Controleer of je ordernummer en
                        e-mailadres kloppen. Nog steeds problemen? Mail{" "}
                        <a className="text-glow underline" href="mailto:support@senseglow.shop">
                          support@senseglow.shop
                        </a>
                        .
                      </p>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="order-number">Ordernummer</Label>
                      <Input
                        id="order-number"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="bijv. #SG1042"
                        autoComplete="off"
                        maxLength={32}
                        aria-invalid={!!errors.orderNumber}
                        aria-describedby={errors.orderNumber ? "order-number-error" : undefined}
                        className="rounded-[8px] tabular-nums focus-visible:ring-glow"
                      />
                      {errors.orderNumber && (
                        <p id="order-number-error" className="text-sm text-destructive">
                          {errors.orderNumber}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order-email">E-mailadres</Label>
                      <Input
                        id="order-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hetzelfde e-mailadres als bij je bestelling"
                        autoComplete="email"
                        maxLength={255}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "order-email-error" : undefined}
                        className="rounded-[8px] focus-visible:ring-glow"
                      />
                      {errors.email && (
                        <p id="order-email-error" className="text-sm text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Bekijk status
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>

                    <p className="text-sm text-foreground/50">
                      Geen ordernummer? Kijk in je bevestigingsmail van SenseGlow.
                    </p>
                  </form>
                )}

                {view === "found" && order && (
                  <OrderResult
                    order={order}
                    onRetry={() => lookup(normalizeOrderNumber(orderNumber), email.trim())}
                    onBack={reset}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

/* ----------------------------------------------------------- subviews */

const Skeleton = () => (
  <div className="space-y-4 opacity-30 animate-pulse" aria-label="Bezig met laden">
    <div className="h-8 w-2/3 rounded-[8px] bg-glow" />
    <div className="h-4 w-full rounded-[8px] bg-glow" />
    <div className="h-4 w-5/6 rounded-[8px] bg-glow" />
    <div className="h-24 w-full rounded-[10px] bg-glow" />
  </div>
);

const OrderResult = ({
  order,
  onRetry,
  onBack,
}: {
  order: OrderData;
  onRetry: () => void;
  onBack: () => void;
}) => {
  const status = resolveStatus(order);
  const activeStep = STATUS_STEP[status];
  const created = new Date(order.createdAt);
  const from = addBusinessDays(created, 7);
  const to = addBusinessDays(created, 14);

  const badgeClass =
    status === "delivered" || status === "shipped" || status === "transit"
      ? "bg-[hsl(140_30%_42%/0.15)] text-[hsl(140_35%_45%)] border-[hsl(140_30%_42%/0.3)]"
      : status === "preparing"
        ? "bg-glow/10 text-glow border-glow/30"
        : "bg-foreground/5 text-foreground/60 border-foreground/15";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground tabular-nums">
            {order.name}
          </h1>
          <p className="text-sm text-foreground/50">Besteld op {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-[6px] border px-3 py-1.5 text-sm font-medium ${badgeClass}`}
          >
            {status === "delivered" && <CheckCircle2 className="h-4 w-4" />}
            {STATUS_LABEL[status]}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="rounded-[6px] text-foreground/60"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Vernieuwen
          </Button>
        </div>
      </div>

      {/* stepper */}
      <ol className="flex items-start justify-between gap-2">
        {STEPS.map((step, index) => {
          const done = index < activeStep;
          const current = index === activeStep;
          const Icon = step.icon;
          return (
            <li key={step.label} className="relative flex-1 flex flex-col items-center text-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-4 right-1/2 left-[-50%] h-px ${
                    index <= activeStep ? "bg-glow" : "bg-foreground/15"
                  }`}
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border ${
                  done || current
                    ? "border-glow bg-glow/15 text-glow"
                    : "border-foreground/15 bg-background text-foreground/30"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span
                className={`mt-2 text-xs ${current ? "text-foreground" : "text-foreground/50"}`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-foreground/70 mb-4">
            Bestelde items
          </h2>
          <ul className="space-y-4">
            {order.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="flex gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.imageAlt ?? item.title}
                    loading="lazy"
                    className="h-16 w-16 rounded-[8px] object-cover border border-foreground/10"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-[8px] border border-foreground/10 bg-foreground/5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  {item.variantTitle && (
                    <p className="text-sm text-foreground/50">{item.variantTitle}</p>
                  )}
                  <p className="text-sm text-foreground/50 tabular-nums">Aantal: {item.quantity}</p>
                </div>
                <span className="text-sm tabular-nums text-foreground/70">
                  {formatMoney(item.total)}
                </span>
              </li>
            ))}
          </ul>
          {order.total && (
            <div className="mt-4 flex justify-between border-t border-foreground/10 pt-4 text-sm font-medium">
              <span>Totaal</span>
              <span className="tabular-nums">{formatMoney(order.total)}</span>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-[11px] uppercase tracking-[0.25em] text-foreground/70 mb-4">
            Verzending
          </h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-foreground/50">Verzendmethode</dt>
              <dd className="text-foreground">{order.fulfillment?.carrier ?? "DHL Standard"}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Track en trace</dt>
              <dd>
                {order.fulfillment?.trackingUrl ? (
                  <a
                    href={order.fulfillment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-glow underline tabular-nums"
                  >
                    {order.fulfillment.trackingNumber ?? "Volg je pakket"}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : order.fulfillment?.trackingNumber ? (
                  <span className="tabular-nums text-foreground">
                    {order.fulfillment.trackingNumber}
                  </span>
                ) : (
                  <span className="text-foreground/60">Wordt binnenkort toegevoegd</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-foreground/50">Geschatte levering</dt>
              <dd className="text-foreground tabular-nums">
                {formatShortDate(from)} tot {formatShortDate(to)}
              </dd>
            </div>
            {order.shippingAddress && (
              <div>
                <dt className="text-foreground/50">Bezorgadres</dt>
                <dd className="text-foreground leading-relaxed">
                  {order.shippingAddress.name && <>{order.shippingAddress.name}<br /></>}
                  {order.shippingAddress.address1}
                  {order.shippingAddress.address2 ? ` ${order.shippingAddress.address2}` : ""}
                  <br />
                  <span className="tabular-nums">{order.shippingAddress.zip}</span>{" "}
                  {order.shippingAddress.city}
                  <br />
                  {order.shippingAddress.country}
                </dd>
              </div>
            )}
          </dl>

          {!order.fulfillment?.trackingNumber && (
            <p className="mt-4 rounded-[10px] border border-glow/15 bg-glow/5 p-4 text-sm text-foreground/70 leading-relaxed">
              Je bestelling is bevestigd en wordt door onze leverancier voorbereid. Je track en trace
              verschijnt hier binnen 48 uur.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-foreground/10 pt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          Vragen? Mail ons via{" "}
          <a className="text-glow underline" href="mailto:support@senseglow.shop">
            support@senseglow.shop
          </a>
          .
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="rounded-[6px] text-foreground/60"
        >
          Andere bestelling zoeken
        </Button>
      </div>
    </div>
  );
};

export default OrderTracking;
