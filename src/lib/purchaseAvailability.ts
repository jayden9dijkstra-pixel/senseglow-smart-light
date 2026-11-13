/** Both landing-page buy buttons must require a loaded, available variant. */
export function canPurchaseVariant(productLoaded: boolean, variant: { availableForSale: boolean } | null | undefined): boolean {
  return productLoaded && variant?.availableForSale === true;
}