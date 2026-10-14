import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { updateOrderAction, refundOrderAction } from "./actions";

export const metadata = { title: "Order Fulfilment & Operations | Premium 365 Limited" };

type Params = Promise<{ error?: string; success?: string }>;

interface OrderItemRow {
  product_name_snapshot: string;
  sku_snapshot: string | null;
  quantity: number;
  unit_price_minor: number;
  line_total_minor: number;
}

interface ShipmentRow {
  carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  status: string;
  shipped_at: string | null;
}

interface OrderRow {
  id: string;
  email: string;
  status: string;
  currency: string;
  subtotal_minor: number;
  shipping_minor: number;
  tax_minor: number;
  total_minor: number;
  shipping_address: {
    name?: string;
    address1?: string;
    city?: string;
    postcode?: string;
    country?: string;
  } | null;
  created_at: string;
  order_items: OrderItemRow[];
  shipments: ShipmentRow[];
}

export default async function AdminOrders({ searchParams }: { searchParams: Params }) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">Setup Verification</span>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">Database Configuration Pending</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Configure your Supabase credentials in <code className="rounded bg-slate-100 px-2 py-0.5 text-blue-700 font-mono text-xs border border-slate-200">.env.local</code> and apply migrations 001–009 to view and manage live customer orders.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 shadow-md transition-all"
            >
              Continue to Staff Sign In ↗
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await auth.from("profiles").select("role").eq("id", user.id).maybeSingle();

  if (!profile || !["staff", "admin"].includes(profile.role)) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-24">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 sm:p-12 shadow-sm space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-700">Restricted Access</span>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">Access Not Authorised</h1>
          <p className="text-sm text-red-700">
            Your authenticated profile does not possess staff or administrator rights for order management.
          </p>
          <div className="pt-2">
            <Link href="/" className="inline-flex rounded-full bg-slate-800 px-6 py-3 text-xs font-bold text-white hover:bg-slate-700 transition-colors">
              Return to Storefront
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const service = createServiceClient();
  const { data: rawOrders, error } = await service
    .from("orders")
    .select("id,email,status,currency,subtotal_minor,shipping_minor,tax_minor,total_minor,shipping_address,created_at,order_items(product_name_snapshot,sku_snapshot,quantity,unit_price_minor,line_total_minor),shipments(carrier,tracking_number,tracking_url,status,shipped_at)")
    .order("created_at", { ascending: false })
    .limit(100);

  const orders = rawOrders as unknown as OrderRow[] | null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">Paid</span>;
      case "processing":
        return <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">Processing</span>;
      case "shipped":
        return <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">Shipped</span>;
      case "completed":
        return <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700 border border-teal-200">Completed</span>;
      case "refunded":
        return <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">Refunded</span>;
      case "cancelled":
        return <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-200">Cancelled</span>;
      default:
        return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <p className="text-xs font-mono font-bold uppercase tracking-[.25em] text-blue-600">
                Premium 365 Operations · Fulfilment
              </p>
            </div>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Order Fulfilment Desk
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Track customer orders, manage dispatch statuses, attach tracking numbers, and process authorized refunds.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs"
            >
              ← Catalogue Administration
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {params.error && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {params.error}
          </div>
        )}
        {params.success && (
          <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {params.success === "refunded" ? "Refund confirmed by the payment provider and recorded." : "Order status updated successfully."}
          </div>
        )}
        {error && (
          <div role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Could not load orders. Ensure migration 008 has been applied to Supabase and service keys are configured.
          </div>
        )}

        {/* Orders List */}
        {!orders?.length ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">No Orders Received Yet</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Customer checkouts will populate here in real time. All transactions are backed by Stripe / PayPal webhooks and Supabase migrations.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {orders.map((o) => (
              <article
                key={o.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Order #{o.id.slice(0, 8).toUpperCase()}
                      </span>
                      {getStatusBadge(o.status)}
                    </div>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">{o.email}</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Placed on {new Date(o.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      {formatPrice(o.total_minor, o.currency.trim())}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Includes VAT & Tracked UK Delivery
                    </p>
                  </div>
                </div>

                {/* Items and Delivery Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Items */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Purchased Items</span>
                      <span className="text-xs text-slate-500">{(o.order_items || []).length} items</span>
                    </div>
                    <div className="space-y-2.5">
                      {(o.order_items || []).map((i, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm gap-3">
                          <div>
                            <p className="font-medium text-slate-900">{i.product_name_snapshot}</p>
                            {i.sku_snapshot && (
                              <p className="text-xs font-mono text-slate-500">SKU: {i.sku_snapshot}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-slate-900">
                              {formatPrice(i.line_total_minor, o.currency.trim())}
                            </p>
                            <p className="text-xs text-slate-500">Qty {i.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address & Carrier */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Delivery Address</span>
                      <span className="text-xs text-slate-500">Royal Mail / DPD Tracked</span>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                      {[
                        o.shipping_address?.name,
                        o.shipping_address?.address1,
                        o.shipping_address?.city,
                        o.shipping_address?.postcode,
                        o.shipping_address?.country,
                      ]
                        .filter(Boolean)
                        .join("\n") || "No delivery address supplied"}
                    </p>
                    {(o.shipments || []).map((sh, idx) => (
                      <div key={idx} className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
                        <span className="font-bold">Shipment recorded:</span> {sh.carrier || "Carrier pending"} · Tracking: {sh.tracking_number || "Pending"}
                        {sh.tracking_url && (
                          <div className="mt-1">
                            <a className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1" href={sh.tracking_url} target="_blank" rel="noreferrer">
                              Track with carrier ↗
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fulfilment Update Drawer */}
                <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all">
                  <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700">
                    + Update Fulfilment Status & Tracking Number
                  </summary>
                  <form action={updateOrderAction} className="mt-5 grid gap-4 sm:grid-cols-2">
                    <input type="hidden" name="orderId" value={o.id} />
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                      Fulfilment Status
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none shadow-2xs"
                      >
                        {[
                          ["processing", "Processing"],
                          ["shipped", "Shipped"],
                          ["completed", "Completed"],
                          ["cancelled", "Cancelled (unpaid only)"],
                        ].map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                      Carrier
                      <input
                        name="carrier"
                        defaultValue={o.shipments?.[0]?.carrier || ""}
                        maxLength={100}
                        className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. Royal Mail Special Delivery, DPD"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                      Tracking Number
                      <input
                        name="trackingNumber"
                        defaultValue={o.shipments?.[0]?.tracking_number || ""}
                        maxLength={150}
                        className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none shadow-2xs"
                        placeholder="e.g. GB123456789"
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-700">
                      Carrier Tracking URL (HTTPS)
                      <input
                        name="trackingUrl"
                        type="url"
                        defaultValue={o.shipments?.[0]?.tracking_url || ""}
                        className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none shadow-2xs"
                        placeholder="https://track.royalmail.com/..."
                      />
                    </label>
                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/25"
                      >
                        Save Fulfilment Record
                      </button>
                    </div>
                  </form>
                </details>

                {/* Refund Drawer */}
                {["paid", "processing", "shipped", "completed"].includes(o.status) && (
                  <details className="rounded-2xl border border-red-200 bg-red-50/50 p-4 transition-all">
                    <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-700">
                      Issue Full Refund ({formatPrice(o.total_minor, o.currency.trim())})
                    </summary>
                    <div className="mt-4 space-y-3 text-xs text-slate-600">
                      <p>
                        This issues a live refund request through the original payment gateway (Stripe API or PayPal REST API).
                        Ensure returns have arrived at the Birmingham inspection facility before issuing.
                      </p>
                      <form action={refundOrderAction}>
                        <input type="hidden" name="orderId" value={o.id} />
                        <button
                          type="submit"
                          className="rounded-full border border-red-300 bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-red-700 hover:bg-red-600 hover:text-white transition-all shadow-xs"
                        >
                          Confirm Refund of {formatPrice(o.total_minor, o.currency.trim())}
                        </button>
                      </form>
                    </div>
                  </details>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
