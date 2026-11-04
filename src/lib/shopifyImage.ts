/**
 * Shopify CDN-formaten: ?width=N levert een kleinere versie en de CDN
 * stuurt automatisch WebP/AVIF naar browsers die dat ondersteunen.
 */
export const IMAGE_WIDTHS = [400, 800, 1200] as const;

const isShopifyCdn = (url: string) => /(^|\/\/)cdn\.shopify\.com\//.test(url);

export function shopifySized(url: string, width: number): string {
  if (!isShopifyCdn(url)) return url;
  const u = new URL(url);
  u.searchParams.set("width", String(width));
  return u.toString();
}

export function shopifySrcSet(url: string, widths: readonly number[] = IMAGE_WIDTHS): string | undefined {
  if (!isShopifyCdn(url)) return undefined;
  return widths.map((w) => `${shopifySized(url, w)} ${w}w`).join(", ");
}

/** src, srcSet en sizes in één keer voor een <img>. */
export function responsiveImg(url: string, sizes: string, fallbackWidth = 800) {
  return { src: shopifySized(url, fallbackWidth), srcSet: shopifySrcSet(url), sizes };
}

/** Voegt één preload-link toe voor de LCP-foto (vervangt een eerdere). */
export function preloadImage(url: string, sizes: string) {
  if (typeof document === "undefined") return;
  const id = "sg-lcp-preload";
  document.getElementById(id)?.remove();
  const link = document.createElement("link");
  link.id = id;
  link.rel = "preload";
  link.as = "image";
  link.href = shopifySized(url, 800);
  const set = shopifySrcSet(url);
  if (set) {
    link.setAttribute("imagesrcset", set);
    link.setAttribute("imagesizes", sizes);
  }
  link.setAttribute("fetchpriority", "high");
  document.head.appendChild(link);
}
