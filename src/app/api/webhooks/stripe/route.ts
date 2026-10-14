import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { sendPendingOrderConfirmation } from "@/lib/email/order-confirmation";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET; const key = process.env.STRIPE_SECRET_KEY; const signature = request.headers.get("stripe-signature");
  if (!secret || !key || !signature) return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  const stripe = new Stripe(key); let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, secret); } catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }
  const service = createServiceClient();
  try {
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session; const orderId = session.metadata?.order_id;
      if (orderId) await service.rpc("checkout_release_order", { p_order_id: orderId, p_reason: "cancelled" });
    }
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session; const orderId = session.metadata?.order_id || session.client_reference_id;
      if (!orderId || session.payment_status !== "paid") return NextResponse.json({ received: true, ignored: true });
      const { data: order, error } = await service.from("orders").select("id,total_minor,currency,status").eq("id", orderId).maybeSingle();
      if (error || !order || session.amount_total !== order.total_minor || session.currency?.toUpperCase() !== order.currency.trim().toUpperCase()) return NextResponse.json({ error: "Order/payment amount mismatch." }, { status: 400 });
      const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;
      const { error: paidError } = await service.rpc("payment_mark_paid", { p_order_id: orderId, p_provider: "stripe", p_provider_session_id: session.id, p_provider_payment_id: paymentIntent, p_event_id: event.id, p_event_type: event.type });
      if (paidError) throw paidError;
      // The outbox is created transactionally by payment_mark_paid; a failed email does not undo payment.
      try { await sendPendingOrderConfirmation(orderId); } catch (emailError) { console.error("Order confirmation email remains pending", emailError instanceof Error ? emailError.message : "unknown error"); }
    }
    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session; const orderId = session.metadata?.order_id; if (orderId) await service.rpc("checkout_release_order", { p_order_id: orderId, p_reason: "payment_failed" });
    }
    return NextResponse.json({ received: true });
  } catch (error) { console.error("Stripe webhook processing failed", error instanceof Error ? error.message : "unknown error"); return NextResponse.json({ error: "Webhook processing failed; provider may retry." }, { status: 500 }); }
}
