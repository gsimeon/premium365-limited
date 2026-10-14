import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { paypalRequest } from "@/lib/payments/paypal";
export const runtime = "nodejs";
const schema = z.object({ email: z.string().trim().email().max(320), provider: z.enum(["stripe","paypal"]), items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(30), shippingAddress: z.object({ name: z.string().trim().min(2).max(160), address1: z.string().trim().min(3).max(200), city: z.string().trim().min(2).max(100), postcode: z.string().trim().min(2).max(20), country: z.enum(["GB","IE"]) }), customerNote: z.string().max(1000).optional().default("") });
function siteUrl() { return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""); }
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid checkout details." }, { status: 400 });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return NextResponse.json({ error: "Checkout is not configured yet. Please contact Premium 365." }, { status: 503 });
  if (parsed.data.provider === "stripe" && !process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Card checkout is not configured yet." }, { status: 503 });
  if (parsed.data.provider === "paypal" && (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET)) return NextResponse.json({ error: "PayPal checkout is not configured yet." }, { status: 503 });
  const service = createServiceClient(); const userClient = await createClient(); const { data: { user } } = await userClient.auth.getUser();
  const { data: created, error: createError } = await service.rpc("checkout_create_order", { p_email: parsed.data.email, p_user_id: user?.id ?? null, p_items: parsed.data.items, p_shipping_address: parsed.data.shippingAddress, p_customer_note: parsed.data.customerNote });
  if (createError || !created?.order_id) return NextResponse.json({ error: createError?.message || "Unable to reserve the requested products." }, { status: 409 });
  const orderId = String(created.order_id); const amount = Number(created.total_minor); const currency = String(created.currency || "GBP").toLowerCase();
  try {
    const { data: items, error: itemsError } = await service.from("order_items").select("product_name_snapshot,quantity,unit_price_minor").eq("order_id", orderId);
    if (itemsError || !items?.length) throw new Error("Could not load order items.");
    let url: string; let sessionId: string;
    if (parsed.data.provider === "stripe") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.create({ mode: "payment", customer_email: parsed.data.email, client_reference_id: orderId, metadata: { order_id: orderId }, payment_intent_data: { metadata: { order_id: orderId } }, line_items: items.map((item) => ({ quantity: item.quantity, price_data: { currency, unit_amount: item.unit_price_minor, product_data: { name: item.product_name_snapshot } } })), success_url: `${siteUrl()}/checkout/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${siteUrl()}/checkout/cancelled?order_id=${encodeURIComponent(orderId)}` });
      if (!session.url) throw new Error("Stripe did not return a checkout URL."); url = session.url; sessionId = session.id;
    } else {
      const paypalOrder = await paypalRequest<{ id: string; links?: { rel: string; href: string }[] }>("/v2/checkout/orders", { method: "POST", headers: { "PayPal-Request-Id": `premium365-${orderId}` }, body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ reference_id: orderId, custom_id: orderId, invoice_id: orderId, amount: { currency_code: "GBP", value: (amount / 100).toFixed(2) }, description: `Premium 365 order ${orderId}` }], application_context: { brand_name: "Premium 365 Limited", user_action: "PAY_NOW", return_url: `${siteUrl()}/checkout/success?provider=paypal&order_id=${encodeURIComponent(orderId)}`, cancel_url: `${siteUrl()}/checkout/cancelled?order_id=${encodeURIComponent(orderId)}` } }) });
      const approval = paypalOrder.links?.find((link) => link.rel === "approve")?.href; if (!approval) throw new Error("PayPal did not return an approval URL."); url = approval; sessionId = paypalOrder.id;
    }
    const { error: paymentError } = await service.from("payments").insert({ order_id: orderId, provider: parsed.data.provider, provider_session_id: sessionId, status: "created", amount_minor: amount, currency: "GBP" });
    if (paymentError) throw new Error("Could not save the payment session.");
    return NextResponse.json({ url });
  } catch (error) {
    await service.rpc("checkout_release_order", { p_order_id: orderId, p_reason: "payment_failed" });
    console.error("Checkout session creation failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "We could not start payment. Your stock reservation has been released; please try again." }, { status: 502 });
  }
}
