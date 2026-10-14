"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { paypalRequest } from "@/lib/payments/paypal";
async function requireStaff() { const client = await createClient(); const { data:{user} } = await client.auth.getUser(); if (!user) redirect("/admin/login"); const { data: profile } = await client.from("profiles").select("role").eq("id",user.id).maybeSingle(); if (!profile || !["staff","admin"].includes(profile.role)) redirect("/admin/login?error=unauthorised"); return user.id; }
function val(fd: FormData, key: string) { const v=fd.get(key); return typeof v === "string" ? v : ""; }
export async function updateOrderAction(fd: FormData) {
  const actor = await requireStaff(); const orderId = z.string().uuid().safeParse(val(fd,"orderId")); const status = z.enum(["processing","shipped","completed","cancelled"]).safeParse(val(fd,"status")); const carrier=z.string().trim().max(100).safeParse(val(fd,"carrier")); const trackingNumber=z.string().trim().max(150).safeParse(val(fd,"trackingNumber")); const trackingUrl=z.string().trim().max(500).refine(v=>!v || /^https:\/\//i.test(v),"Tracking URL must use HTTPS.").safeParse(val(fd,"trackingUrl"));
  if (!orderId.success || !status.success || !carrier.success || !trackingNumber.success || !trackingUrl.success) redirect("/admin/orders?error=Please%20check%20the%20order%20fields.");
  const service=createServiceClient(); const {data:order,error:readError}=await service.from("orders").select("id,status").eq("id",orderId.data).maybeSingle(); if(readError||!order) redirect("/admin/orders?error=Order%20not%20found.");
  if (status.data === "cancelled" && order.status !== "pending_payment") redirect("/admin/orders?error=Only%20unpaid%20orders%20can%20be%20cancelled%20here.");
  if (status.data === "processing" && !["paid","processing"].includes(order.status)) redirect("/admin/orders?error=Only%20paid%20orders%20can%20enter%20processing.");
  if (status.data === "shipped" && !["paid","processing","shipped"].includes(order.status)) redirect("/admin/orders?error=Order%20must%20be%20paid%20before%20shipping.");
  if (status.data === "completed" && !["shipped","processing","completed"].includes(order.status)) redirect("/admin/orders?error=Order%20must%20be%20processing%20or%20shipped%20before%20completion.");
  if (status.data === "cancelled") { const {error:releaseError}=await service.rpc("checkout_release_order",{p_order_id:orderId.data,p_reason:"cancelled"}); if(releaseError) redirect(`/admin/orders?error=${encodeURIComponent(releaseError.message)}`); }
  else { const {error:updateError}=await service.from("orders").update({status:status.data,updated_at:new Date().toISOString()}).eq("id",orderId.data); if(updateError) redirect(`/admin/orders?error=${encodeURIComponent(updateError.message)}`); }
  if(status.data === "shipped") { const {data:shipment}=await service.from("shipments").select("id").eq("order_id",orderId.data).maybeSingle(); const payload={carrier:carrier.data||null,tracking_number:trackingNumber.data||null,tracking_url:trackingUrl.data||null,status:"shipped",shipped_at:new Date().toISOString()}; const result=shipment ? await service.from("shipments").update(payload).eq("id",shipment.id) : await service.from("shipments").insert({order_id:orderId.data,...payload}); if(result.error) redirect(`/admin/orders?error=${encodeURIComponent("Order status updated but shipment details failed: "+result.error.message)}`); }
  await service.from("audit_logs").insert({actor_id:actor,action:"order_status_updated",entity_type:"order",entity_id:orderId.data,metadata:{from:order.status,to:status.data,carrier:carrier.data,trackingNumber:trackingNumber.data}});
  revalidatePath("/admin/orders"); revalidatePath("/admin"); redirect("/admin/orders?success=updated");
}

export async function refundOrderAction(fd: FormData) {
  const actor = await requireStaff();
  const parsed = z.string().uuid().safeParse(val(fd, "orderId"));
  if (!parsed.success) redirect("/admin/orders?error=Invalid%20order%20reference.");
  const service = createServiceClient();
  const { data: order, error: orderError } = await service.from("orders").select("id,email,status,total_minor,currency").eq("id", parsed.data).maybeSingle();
  if (orderError || !order) redirect("/admin/orders?error=Order%20not%20found.");
  if (!["paid", "processing", "shipped", "completed"].includes(order.status)) redirect("/admin/orders?error=Only%20successfully%20paid%20orders%20can%20be%20refunded.");
  const { data: payment, error: paymentError } = await service.from("payments").select("id,provider,provider_session_id,provider_payment_id,status,amount_minor,currency").eq("order_id", order.id).eq("status", "paid").maybeSingle();
  if (paymentError || !payment) redirect("/admin/orders?error=No%20matching%20paid%20payment%20was%20found.");
  try {
    if (payment.provider === "stripe") {
      if (!process.env.STRIPE_SECRET_KEY || !payment.provider_payment_id) throw new Error("Stripe payment intent is missing or Stripe is not configured.");
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const refund = await stripe.refunds.create({ payment_intent: payment.provider_payment_id, reason: "requested_by_customer", metadata: { order_id: order.id } }, { idempotencyKey: `premium365-full-refund-${order.id}` });
      if (refund.status !== "succeeded") throw new Error(`Stripe refund is not yet complete (status: ${refund.status}). Reconcile before retrying.`);
    } else if (payment.provider === "paypal") {
      if (!payment.provider_payment_id) throw new Error("PayPal capture reference is missing.");
      const refund = await paypalRequest<{ status?: string }>(`/v2/payments/captures/${encodeURIComponent(payment.provider_payment_id)}/refund`, { method: "POST", headers: { "PayPal-Request-Id": `premium365-full-refund-${order.id}` }, body: JSON.stringify({ amount: { value: (Number(payment.amount_minor) / 100).toFixed(2), currency_code: String(payment.currency).trim().toUpperCase() }, invoice_id: `refund-${order.id}` }) });
      if (refund.status !== "COMPLETED") throw new Error(`PayPal refund is not yet complete (status: ${refund.status || "unknown"}). Reconcile before retrying.`);
    } else {
      throw new Error("Unsupported payment provider.");
    }
  } catch (error) {
    console.error("Refund provider request failed", error instanceof Error ? error.message : "unknown error");
    redirect("/admin/orders?error=The%20provider%20did%20not%20confirm%20the%20refund.%20Check%20the%20provider%20dashboard%20before%20retrying.");
  }
  const now = new Date().toISOString();
  const { error: paymentUpdateError } = await service.from("payments").update({ status: "refunded", updated_at: now }).eq("id", payment.id).eq("status", "paid");
  if (paymentUpdateError) redirect("/admin/orders?error=Provider%20refund%20succeeded%20but%20local%20record%20update%20failed.%20Reconcile%20the%20provider%20dashboard.");
  const { error: orderUpdateError } = await service.from("orders").update({ status: "refunded", updated_at: now }).eq("id", order.id);
  if (orderUpdateError) redirect("/admin/orders?error=Provider%20refund%20succeeded%20but%20order%20record%20update%20failed.%20Reconcile%20the%20provider%20dashboard.");
  await service.from("audit_logs").insert({ actor_id: actor, action: "order_refunded_full", entity_type: "order", entity_id: order.id, metadata: { provider: payment.provider, amount_minor: payment.amount_minor, currency: payment.currency } });
  revalidatePath("/admin/orders");
  redirect("/admin/orders?success=refunded");
}
