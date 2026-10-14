import { createServiceClient } from "@/lib/supabase/service";

/** Sends an order confirmation through Resend, using an outbox row as the retry guard. */
export async function sendPendingOrderConfirmation(orderId: string): Promise<void> {
  const service = createServiceClient();
  const { data: notification, error: notificationError } = await service
    .from("order_notification_outbox")
    .select("id,order_id,notification_type,status,attempts")
    .eq("order_id", orderId)
    .eq("notification_type", "order_confirmation")
    .maybeSingle();
  if (notificationError) throw notificationError;
  if (!notification || notification.status === "sent") return;

  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    await service.from("order_notification_outbox").update({ status: "pending", last_error: "Email provider is not configured", attempts: Number(notification.attempts || 0) + 1, updated_at: new Date().toISOString() }).eq("id", notification.id);
    return;
  }
  const { data: order, error: orderError } = await service.from("orders")
    .select("id,email,currency,subtotal_minor,shipping_minor,tax_minor,total_minor,created_at,order_items(product_name_snapshot,quantity,line_total_minor)")
    .eq("id", orderId).maybeSingle();
  if (orderError || !order) throw orderError || new Error("Order for confirmation email was not found");
  const money = (minor: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: String(order.currency).trim() }).format(Number(minor) / 100);
  const lines = (order.order_items || []).map((item: { product_name_snapshot: string; quantity: number; line_total_minor: number }) => `${item.product_name_snapshot} × ${item.quantity} — ${money(item.line_total_minor)}`);
  const text = ["Thank you for your order with Premium 365 Limited.", `Order reference: ${order.id}`, `Placed: ${new Date(order.created_at).toLocaleString("en-GB", { timeZone: "Europe/London" })}`, "", ...lines, "", `Subtotal: ${money(order.subtotal_minor)}`, `Delivery: ${money(order.shipping_minor)}`, `Tax: ${money(order.tax_minor)}`, `Total: ${money(order.total_minor)}`, "", "We will contact you with fulfilment updates. If you need help, reply to this email.", "Premium 365 Limited | 36 Hallewell Road, Birmingham, B16 0LR, United Kingdom"].join("\n");
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [order.email], subject: `Order confirmation — ${order.id.slice(0, 8).toUpperCase()}`, text }), cache: "no-store" });
  if (!response.ok) {
    const reason = (await response.text()).slice(0, 500);
    await service.from("order_notification_outbox").update({ status: "pending", last_error: reason, attempts: Number(notification.attempts || 0) + 1, updated_at: new Date().toISOString() }).eq("id", notification.id);
    throw new Error(`Email provider rejected the order confirmation (${response.status})`);
  }
  await service.from("order_notification_outbox").update({ status: "sent", sent_at: new Date().toISOString(), last_error: null, attempts: Number(notification.attempts || 0) + 1, updated_at: new Date().toISOString() }).eq("id", notification.id);
}
