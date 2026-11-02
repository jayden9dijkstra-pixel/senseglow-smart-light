import type { ShopifyProduct } from "./shopify";

type Variant = ShopifyProduct["node"]["variants"]["edges"][0]["node"];

/**
 * Kleur die op de eerste Shopify-foto (featuredImage) te zien is.
 * Shopify heeft geen eigen variantfoto's per kleur, dus dit is vastgelegd
 * na het bekijken van foto 1. Pas aan als de eerste foto in Shopify wijzigt.
 */
export const FIRST_PHOTO_COLOR: Record<string, string> = {
  senseglow_ambient_motion_bar: "Zwart",
  senseglow_wave: "Zwart",
  senseglow_wall_lamp: "Wit",
  senseglow_solar_lantern: "Zwart",
  senseglow_flex: "Wit",
};

const COLOR_ALIASES: Record<string, string[]> = {
  zwart: ["zwart", "black", "noir"],
  wit: ["wit", "white", "blanc"],
};

function hasColor(v: Variant, color: string): boolean {
  const words = COLOR_ALIASES[color.toLowerCase()] ?? [color.toLowerCase()];
  return v.selectedOptions.some((o) => words.some((w) => o.value.toLowerCase().includes(w)));
}

/**
 * Standaardvariant op de productpagina: de kleur van foto 1, bij voorkeur de
 * eerste beschikbare 30 cm-maat, anders de eerste variant van die kleur.
 * Een eigen variantfoto in Shopify gaat voor: dan is die kleur al zichtbaar.
 */
export function pickDefaultVariant(product: ShopifyProduct): Variant | null {
  const variants = product.node.variants.edges.map((e) => e.node);
  if (!variants.length) return null;
  const featured = product.node.featuredImage?.url ?? product.node.images?.edges?.[0]?.node.url;
  const color = FIRST_PHOTO_COLOR[product.node.handle];

  let pool = variants;
  const withOwnPhoto = featured ? variants.filter((v) => v.image?.url && v.image.url === featured) : [];
  if (withOwnPhoto.length && withOwnPhoto.length < variants.length) pool = withOwnPhoto;
  else if (color) {
    const byColor = variants.filter((v) => hasColor(v, color));
    if (byColor.length) pool = byColor;
  }

  const available = pool.filter((v) => v.availableForSale);
  const candidates = available.length ? available : pool;
  const size30 = candidates.find((v) => v.selectedOptions.some((o) => o.value.includes("30")));
  return size30 ?? candidates[0];
}
