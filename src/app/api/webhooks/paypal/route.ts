import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { paypalRequest } from "@/lib/payments/paypal";
import { sendPendingOrderConfirmation } from "@/lib/email/order-confirmation";
export const runtime = "nodejs";
type PayPalEvent = { id: string; event_type: string; resource?: { id?: string; amount?: { currency_code?: string; value?: string }; supplementary_data?: { related_ids?: { order_id?: string } } } };
export async function POST(request: Request) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID; if (!webhookId) return NextResponse.json({ error: "PayPal webhook is not configured." }, { status: 400 });
  const event = await request.json().catch(() => null) as PayPalEvent | null; if (!event?.id || !event.event_type || !event.resource) return NextResponse.json({ error: "Invalid event payload." }, { status: 400 });
  const headers = request.headers;
  const verification = { auth_algo: headers.get("paypal-auth-algo"), cert_url: headers.get("paypal-cert-url"), transmission_id: headers.get("paypal-transmission-id"), transmission_sig: headers.get("paypal-transmission-sig"), transmission_time: headers.get("paypal-transmission-time"), webhook_id: webhookId, webhook_event: event };
  try {
    const verified = await paypalRequest<{ verification_status: string }>("/v1/notifications/verify-webhook-signature", { method: "POST", body: JSON.stringify(verification) });
    if (verified.verification_status !== "SUCCESS") return NextResponse.json({ error: "Invalid PayPal webhook signature." }, { status: 400 });
  } catch { return NextResponse.json({ error: "Could not verify PayPal webhook." }, { status: 400 }); }
  if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") return NextResponse.json({ received: true, ignored: true });
  const capture = event.resource; const paypalOrderId = capture.supplementary_data?.related_ids?.order_id;
  if (!paypalOrderId || !capture.amount?.value || !capture.amount.currency_code || !capture.id) return NextResponse.json({ error: "Capture payload is incomplete." }, { status: 400 });
  const service = createServiceClient();
  const { data: payment, error: paymentError } = await service.from("payments").select("order_id,amount_minor,currency").eq("provider", "paypal").eq("provider_session_id", paypalOrderId).maybeSingle();
  if (paymentError || !payment || payment.currency.trim().toUpperCase() !== capture.amount.currency_code || Math.round(Number(capture.amount.value) * 100) !== payment.amount_minor) return NextResponse.json({ error: "Capture does not match a known order or expected amount." }, { status: 400 });
  const { error } = await service.rpc("payment_mark_paid", { p_order_id: payment.order_id, p_provider: "paypal", p_provider_session_id: paypalOrderId, p_provider_payment_id: capture.id, p_event_id: event.id, p_event_type: event.event_type });
  if (error) { console.error("PayPal webhook processing failed", error.message); return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 }); }
  try { await sendPendingOrderConfirmation(payment.order_id); } catch (emailError) { console.error("Order confirmation email remains pending", emailError instanceof Error ? emailError.message : "unknown error"); }
  return NextResponse.json({ received: true });
}
