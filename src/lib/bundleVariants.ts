/**
 * Bundle variants — single source of truth for bundle pricing & display.
 *
 * Shopify now contains BUNDLE-* variants per product with pre-discounted
 * prices + compare_at_price. The frontend simply reads them; no discount
 * codes are needed at checkout.
 */
import type { ShopifyProduct } from "@/lib/shopify";

export interface BundleVariant {
  variantId: string;
  variantTitle: string;       // raw Shopify variant title
  rawOptionValue: string;     // e.g. "BUNDLE 2-Pack 30+50cm"
  quantity: number;           // 2, 3, 12, 16, ...
  niceLabel: string;          // "Duopak" | "Familiepak" | "Voordeelpak 12-set"
  contents: string;           // human contents, e.g. "30cm + 50cm" or "Zwart + Wit"
  subtitle: string;           // marketing subtitle
  price: number;              // inc-VAT (Shopify price)
  comparePrice: number | null;
  savings: number;            // money saved (>= 0)
  discountLabel: string;      // e.g. "-8%"
  popular: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

const BUNDLE_PREFIX = /^bundle\b/i;

export function isBundleOptionValue(value: string): boolean {
  return BUNDLE_PREFIX.test(value.trim());
}

export function isBundleVariant(
  variant: { selectedOptions: Array<{ name: string; value: string }> }
): boolean {
  return variant.selectedOptions.some((o) => isBundleOptionValue(o.value));
}

function humanizeContents(raw: string): string {
  // Strip "BUNDLE N-Pack" or "BUNDLE N-set" prefix
  let s = raw.replace(/^bundle\s+\d+[-\s]?(?:pack|set)\s*/i, "").trim();
  // Remove parentheses
  s = s.replace(/[()]/g, "").trim();
  // Translate / normalize
  s = s.replace(/black\s*\+\s*white/i, "Zwart + Wit");
  s = s.replace(/white\s*\+\s*black/i, "Wit + Zwart");
  s = s.replace(/2\s*x\s*black/i, "2× Zwart");
  s = s.replace(/2\s*x\s*white/i, "2× Wit");
  // "30cm x2" → "2× 30cm"
  s = s.replace(/(\d+\s?cm)\s*x\s*(\d+)/gi, (_m, sz, n) => `${n}× ${sz}`);
  // "2x30+50cm" → "2× 30cm + 50cm" (best-effort)
  s = s.replace(/(\d+)x(\d+)\+(\d+cm)/gi, (_m, n, a, b) => `${n}× ${a}cm + ${b}`);
  // Spacing around +
  s = s.replace(/\s*\+\s*/g, " + ");
  // Ensure "cm" spacing
  s = s.replace(/(\d+)cm/gi, "$1cm");
  return s.trim();
}

function parseQuantity(raw: string): number {
  const pack = raw.match(/(\d+)[-\s]?pack/i);
  if (pack) return parseInt(pack[1], 10);
  const set = raw.match(/(\d+)[-\s]?set/i);
  if (set) return parseInt(set[1], 10);
  return 2;
}

function niceLabelFor(qty: number, raw: string): string {
  const isSet = /set/i.test(raw);
  if (isSet) return `Voordeelpak ${qty}-set`;
  if (qty === 2) return "Duopak";
  if (qty === 3) return "Familiepak";
  if (qty === 4) return "Voordeelpak";
  return `${qty}-pack`;
}

function subtitleFor(qty: number, isSet: boolean): string {
  if (isSet && qty >= 12) return "Voor het hele huis";
  if (qty === 2) return "Ideaal om te starten";
  if (qty === 3) return "Voor het hele huis";
  if (qty >= 4) return "Maximale besparing";
  return "";
}

/**
 * Extract all bundle variants from a Shopify product, sorted by quantity asc.
 */
export function extractBundleVariants(product: ShopifyProduct): BundleVariant[] {
  const out: BundleVariant[] = [];

  for (const edge of product.node.variants.edges) {
    const v = edge.node;
    const bundleOpt = v.selectedOptions.find((o) => isBundleOptionValue(o.value));
    if (!bundleOpt) continue;

    const raw = bundleOpt.value;
    const qty = parseQuantity(raw);
    const isSet = /set/i.test(raw);
    const price = parseFloat(v.price.amount);

    // compareAtPrice is not currently in the Storefront query — best-effort
    // derive from raw quantity × unit, but Shopify already gives us savings via price.
    // We will populate comparePrice lazily from product's other variant prices below.
    out.push({
      variantId: v.id,
      variantTitle: v.title,
      rawOptionValue: raw,
      quantity: qty,
      niceLabel: niceLabelFor(qty, raw),
      contents: humanizeContents(raw),
      subtitle: subtitleFor(qty, isSet),
      price,
      comparePrice: null,
      savings: 0,
      discountLabel: "",
      popular: false,
      selectedOptions: v.selectedOptions,
    });
  }

  // Compute compareAtPrice using the cheapest non-bundle single price as a proxy.
  // For each bundle: compare = qty × maxSingleUnitPrice (rough but safe upper bound).
  // Better: use Shopify's compare_at_price via a Storefront query update — see TODO.
  const singlePrices = product.node.variants.edges
    .filter((e) => !isBundleVariant(e.node))
    .map((e) => parseFloat(e.node.price.amount))
    .filter((n) => Number.isFinite(n));

  if (singlePrices.length > 0) {
    const maxUnit = Math.max(...singlePrices);
    for (const b of out) {
      const compare = +(maxUnit * b.quantity).toFixed(2);
      if (compare > b.price) {
        b.comparePrice = compare;
        b.savings = +(compare - b.price).toFixed(2);
        b.discountLabel = `-${Math.round((b.savings / compare) * 100)}%`;
      }
    }
  }

  // Sort by quantity asc, then price asc
  out.sort((a, b) => a.quantity - b.quantity || a.price - b.price);

  // Mark popular: 3-pack (or 12-set if no 3-pack), else last
  const threePack = out.find((b) => b.quantity === 3);
  if (threePack) {
    threePack.popular = true;
  } else if (out.length >= 2) {
    out[Math.min(1, out.length - 1)].popular = true;
  }

  return out;
}
