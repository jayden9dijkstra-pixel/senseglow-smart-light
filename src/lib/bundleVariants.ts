/**
 * Bundle variant filter helpers, used to hide legacy BUNDLE-* Shopify
 * variants from the single-variant selectors. Bundle pricing itself is
 * now computed client-side from PACK_RATE in productConfig.
 */
const BUNDLE_PREFIX = /^bundle\b/i;

export function isBundleOptionValue(value: string): boolean {
  return BUNDLE_PREFIX.test(value.trim());
}

export function isBundleVariant(
  variant: { selectedOptions: Array<{ name: string; value: string }> }
): boolean {
  return variant.selectedOptions.some((o) => isBundleOptionValue(o.value));
}
