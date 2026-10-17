/**
 * Monzo Payment Link Utilities
 * Formats: https://monzo.me/<username>/<amount>?d=<description>
 */

export const DEFAULT_MONZO_USERNAME =
  process.env.NEXT_PUBLIC_MONZO_USERNAME ||
  process.env.MONZO_USERNAME ||
  "gsimeon";

export interface MonzoPaymentOptions {
  priceMinor: number;
  productName: string;
  sku?: string | null;
  orderId?: string | null;
  username?: string;
}

/**
 * Clean username (remove leading @ and trim)
 */
export function sanitizeMonzoUsername(username?: string): string {
  const raw = username || DEFAULT_MONZO_USERNAME;
  return raw.trim().replace(/^@/, "");
}

/**
 * Generate a Monzo.me payment URL with exact price and product description
 */
export function generateMonzoPaymentLink({
  priceMinor,
  productName,
  sku,
  orderId,
  username,
}: MonzoPaymentOptions): string {
  const cleanUser = sanitizeMonzoUsername(username);
  const amountPounds = (priceMinor / 100).toFixed(2);

  // Construct description
  let desc = productName.trim();
  if (sku) {
    desc += ` (SKU: ${sku.trim()})`;
  } else if (orderId) {
    desc = `Order #${orderId.slice(0, 8).toUpperCase()} - ${desc}`;
  }

  // Monzo description parameter
  const encodedDesc = encodeURIComponent(desc.slice(0, 100)); // Monzo limits description length

  return `https://monzo.me/${cleanUser}/${amountPounds}?d=${encodedDesc}`;
}

/**
 * Generate a high-resolution QR code URL for a Monzo payment link
 */
export function generateMonzoQrCodeUrl(paymentUrl: string, size = 260): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(
    paymentUrl
  )}`;
}
