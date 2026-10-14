import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { paypalRequest } from "@/lib/payments/paypal";
import { sendPendingOrderConfirmation } from "@/lib/email/order-confirmation";
export const runtime = "nodejs";
const schema = z.object({ orderId: z.string().uuid(), paypalOrderId: z.string().min(5).max(80) });
type CaptureResponse = { id: string; status: string; purchase_units?: { payments?: { captures?: { id: string; status: string; amount?: { currency_code: string; value: string } }[] } }[] };
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid PayPal return details." }, { status: 400 });
  const service = createServiceClient();
  const { data: payment, error: paymentError } = await service.from("payments").select("order_id,provider,provider_session_id,status,amount_minor,currency").eq("order_id", parsed.data.orderId).eq("provider", "paypal").eq("provider_session_id", parsed.data.paypalOrderId).maybeSingle();
  if (paymentError || !payment) return NextResponse.json({ error: "PayPal session does not match this order." }, { status: 400 });
  if (payment.status === "paid") return NextResponse.json({ ok: true });
  let captured: CaptureResponse;
  try { captured = await paypalRequest<CaptureResponse>(`/v2/checkout/orders/${encodeURIComponent(parsed.data.paypalOrderId)}/capture`, { method: "POST", headers: { "PayPal-Request-Id": `premium365-capture-${parsed.data.orderId}` }, body: "{}" }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "PayPal capture failed." }, { status: 502 }); }
  const capture = captured.purchase_units?.[0]?.payments?.captures?.[0];
  if (captured.status !== "COMPLETED" || !capture || !capture.amount || capture.status !== "COMPLETED" || capture.amount.currency_code !== payment.currency.trim().toUpperCase() || Math.round(Number(capture.amount.value) * 100) !== payment.amount_minor) return NextResponse.json({ error: "PayPal capture is not completed or does not match the expected amount." }, { status: 409 });
  const { error } = await service.rpc("payment_mark_paid", { p_order_id: payment.order_id, p_provider: "paypal", p_provider_session_id: captured.id === parsed.data.paypalOrderId ? captured.id : parsed.data.paypalOrderId, p_provider_payment_id: capture.id, p_event_id: `paypal-capture-${capture.id}`, p_event_type: "CHECKOUT.CAPTURE.CLIENT_RETURN" });
  if (error) { console.error("PayPal capture recorded but order transition failed", error.message); return NextResponse.json({ error: "Payment was captured but order confirmation is delayed. Contact support with your order reference." }, { status: 500 }); }
  try { await sendPendingOrderConfirmation(payment.order_id); } catch (emailError) { console.error("Order confirmation email remains pending", emailError instanceof Error ? emailError.message : "unknown error"); }
  return NextResponse.json({ ok: true });
}
