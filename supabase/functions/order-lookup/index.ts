import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://senseglow.shop",
  "https://www.senseglow.shop",
  "https://senseglow-smart-light.lovable.app",
];

const SHOPIFY_STORE_DOMAIN =
  Deno.env.get("SHOPIFY_STORE_DOMAIN") ?? "senseglow-smart-light-5jjoq.myshopify.com";
const SHOPIFY_ADMIN_TOKEN =
  Deno.env.get("SHOPIFY_ADMIN_TOKEN") ?? Deno.env.get("SHOPIFY_ACCESS_TOKEN") ?? "";
const SHOPIFY_API_VERSION = "2025-07";

function corsFor(origin: string | null) {
  const allowed =
    origin && (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/.*\.lovable\.app$/.test(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin))
      ? origin
      : ALLOWED_ORIGINS[1];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  } as Record<string, string>;
}

/* --------------------------------------------------------- rate limiting */

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE_LIMIT;
}

/* ------------------------------------------------------------ validation */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeOrderNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits || null;
}

/* ---------------------------------------------------------------- query */

const ORDER_QUERY = `
  query FindOrder($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          id
          name
          createdAt
          displayFinancialStatus
          displayFulfillmentStatus
          email
          shippingAddress { name address1 address2 city zip country }
          lineItems(first: 20) {
            edges {
              node {
                title
                variantTitle
                quantity
                image { url altText }
                originalTotalSet { shopMoney { amount currencyCode } }
              }
            }
          }
          fulfillments {
            status
            trackingInfo { number url company }
            estimatedDeliveryAt
            createdAt
          }
          totalPriceSet { shopMoney { amount currencyCode } }
        }
      }
    }
  }
`;

Deno.serve(async (req) => {
  const cors = corsFor(req.headers.get("origin"));

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const notFound = () =>
    new Response(JSON.stringify({ found: false }), {
      status: 404,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body: { orderNumber?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_body" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const rawOrder = typeof body.orderNumber === "string" ? body.orderNumber.trim().slice(0, 32) : "";
  const rawEmail = typeof body.email === "string" ? body.email.trim().slice(0, 255) : "";
  const orderNumber = normalizeOrderNumber(rawOrder);

  if (!orderNumber || !EMAIL_RE.test(rawEmail)) {
    return new Response(JSON.stringify({ error: "invalid_input" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  if (!SHOPIFY_ADMIN_TOKEN) {
    console.error("Missing Shopify admin token");
    return new Response(JSON.stringify({ error: "server_misconfigured" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const logLookup = async (found: boolean) => {
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      );
      await supabase.from("order_lookups").insert({ order_number: orderNumber, ip, found });
    } catch (e) {
      console.error("lookup log failed", e);
    }
  };

  try {
    const res = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
        },
        body: JSON.stringify({
          query: ORDER_QUERY,
          variables: { query: `name:${orderNumber} email:${rawEmail}` },
        }),
      },
    );

    if (!res.ok) {
      console.error("Shopify admin error", res.status, await res.text());
      await logLookup(false);
      return notFound();
    }

    const json = await res.json();
    if (json.errors) {
      console.error("Shopify GraphQL errors", JSON.stringify(json.errors));
      await logLookup(false);
      return notFound();
    }

    const node = json?.data?.orders?.edges?.[0]?.node;
    if (!node || String(node.email ?? "").toLowerCase() !== rawEmail.toLowerCase()) {
      await logLookup(false);
      return notFound();
    }

    const fulfillment = Array.isArray(node.fulfillments) ? node.fulfillments[0] : null;
    const tracking = fulfillment?.trackingInfo?.[0] ?? null;

    const payload = {
      found: true,
      order: {
        name: node.name,
        createdAt: node.createdAt,
        fulfillmentStatus: node.displayFulfillmentStatus ?? null,
        financialStatus: node.displayFinancialStatus ?? null,
        total: node.totalPriceSet?.shopMoney ?? null,
        shippingAddress: node.shippingAddress
          ? {
              name: node.shippingAddress.name ?? null,
              address1: node.shippingAddress.address1 ?? null,
              address2: node.shippingAddress.address2 ?? null,
              city: node.shippingAddress.city ?? null,
              zip: node.shippingAddress.zip ?? null,
              country: node.shippingAddress.country ?? null,
            }
          : null,
        items: (node.lineItems?.edges ?? []).map((e: any) => ({
          title: e.node.title,
          variantTitle: e.node.variantTitle ?? null,
          quantity: e.node.quantity,
          image: e.node.image?.url ?? null,
          imageAlt: e.node.image?.altText ?? null,
          total: e.node.originalTotalSet?.shopMoney ?? null,
        })),
        fulfillment: fulfillment
          ? {
              status: fulfillment.status ?? null,
              createdAt: fulfillment.createdAt ?? null,
              estimatedDeliveryAt: fulfillment.estimatedDeliveryAt ?? null,
              trackingNumber: tracking?.number ?? null,
              trackingUrl: tracking?.url ?? null,
              carrier: tracking?.company ?? null,
            }
          : null,
      },
    };

    await logLookup(true);

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("order-lookup failed", e);
    await logLookup(false);
    return notFound();
  }
});
