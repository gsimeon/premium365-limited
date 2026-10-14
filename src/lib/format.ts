export function formatPrice(priceMinor: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(priceMinor / 100);
}
