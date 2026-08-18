/**
 * JSON-LD builders (schema.org).
 */
import { SITE_URL, SITE_NAME } from "@/lib/seoContent";
import type { ShopifyProduct } from "@/lib/shopify";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: "support@senseglow.shop",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

function oneYearFromNow(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

export function productSchema(
  product: ShopifyProduct,
  opts: { path: string; description: string },
) {
  const node = product.node;
  const variants = node.variants?.edges?.map((e) => e.node) ?? [];
  const prices = variants
    .map((v) => parseFloat(v.price?.amount ?? "0"))
    .filter((n) => Number.isFinite(n) && n > 0);
  const lowPrice = prices.length ? Math.min(...prices) : undefined;
  const highPrice = prices.length ? Math.max(...prices) : undefined;
  const available = variants.some((v) => v.availableForSale);
  const images = (node.images?.edges ?? []).map((e) => e.node.url).filter(Boolean);
  const url = `${SITE_URL}${opts.path}`;

  const offers =
    lowPrice === undefined
      ? undefined
      : variants.length > 1 && highPrice !== lowPrice
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: lowPrice.toFixed(2),
            highPrice: (highPrice ?? lowPrice).toFixed(2),
            offerCount: variants.length,
            availability: available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            priceValidUntil: oneYearFromNow(),
            url,
          }
        : {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: lowPrice.toFixed(2),
            availability: available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            priceValidUntil: oneYearFromNow(),
            url,
          };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: node.title,
    description: opts.description,
    image: images.length ? images : undefined,
    sku: variants[0]?.id?.split("/").pop() ?? node.handle,
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
    ...(offers ? { offers } : {}),
  };
}
