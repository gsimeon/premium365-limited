import { NextRequest, NextResponse } from "next/server";
import {
  generateMonzoPaymentLink,
  generateMonzoQrCodeUrl,
  DEFAULT_MONZO_USERNAME,
} from "@/lib/monzo";
import { getActiveProductBySlug, getActiveProducts } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const productId = searchParams.get("productId") || searchParams.get("id");
  const customAmount = searchParams.get("amount"); // e.g. "899.00" or integer
  const customDesc = searchParams.get("desc") || searchParams.get("description");
  const customUser = searchParams.get("username") || DEFAULT_MONZO_USERNAME;

  // Case 1: Custom amount and description
  if (customAmount) {
    const parsedAmount = parseFloat(customAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }
    const priceMinor = Math.round(parsedAmount * 100);
    const productName = customDesc || "Premium 365 Order";
    const paymentLink = generateMonzoPaymentLink({
      priceMinor,
      productName,
      username: customUser,
    });
    const qrCodeUrl = generateMonzoQrCodeUrl(paymentLink, 280);

    return NextResponse.json({
      success: true,
      productName,
      priceMinor,
      priceFormatted: formatPrice(priceMinor),
      username: customUser,
      paymentLink,
      qrCodeUrl,
    });
  }

  // Case 2: Product lookup by slug
  if (slug) {
    const { product } = await getActiveProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const paymentLink = generateMonzoPaymentLink({
      priceMinor: product.price_minor,
      productName: product.name,
      sku: product.sku,
      username: customUser,
    });
    const qrCodeUrl = generateMonzoQrCodeUrl(paymentLink, 280);

    return NextResponse.json({
      success: true,
      productId: product.id,
      slug: product.slug,
      productName: product.name,
      sku: product.sku,
      priceMinor: product.price_minor,
      priceFormatted: formatPrice(product.price_minor, product.currency),
      username: customUser,
      paymentLink,
      qrCodeUrl,
    });
  }

  // Case 3: Product lookup by ID
  if (productId) {
    const { products } = await getActiveProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const paymentLink = generateMonzoPaymentLink({
      priceMinor: product.price_minor,
      productName: product.name,
      sku: product.sku,
      username: customUser,
    });
    const qrCodeUrl = generateMonzoQrCodeUrl(paymentLink, 280);

    return NextResponse.json({
      success: true,
      productId: product.id,
      slug: product.slug,
      productName: product.name,
      sku: product.sku,
      priceMinor: product.price_minor,
      priceFormatted: formatPrice(product.price_minor, product.currency),
      username: customUser,
      paymentLink,
      qrCodeUrl,
    });
  }

  return NextResponse.json(
    {
      error:
        "Please provide 'slug', 'productId', or 'amount' with 'description' as query parameters.",
    },
    { status: 400 }
  );
}
