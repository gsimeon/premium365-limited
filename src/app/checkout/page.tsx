"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, CreditCard, ArrowRight, Loader2, Truck } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items } = useCart();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("GB");
  const [provider, setProvider] = useState("stripe");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const total = items.reduce((sum, x) => sum + x.priceMinor * x.quantity, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }
    setBusy(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          provider,
          items: items.map((x) => ({ productId: x.productId, quantity: x.quantity })),
          shippingAddress: { name, address1, city, postcode, country },
          customerNote: note,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not initialize secure payment gateway session.");
      }
      if (typeof data.url !== "string") {
        throw new Error("Payment provider did not return a valid redirection checkout URL.");
      }

      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout could not be started.");
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-extrabold text-white">Checkout</h1>
        <p className="mt-3 text-slate-400">Your shopping cart is currently empty.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-blue-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 shadow-md transition-all"
        >
          Browse Hardware Catalogue
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-slate-900 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
          Encrypted 256-Bit SSL
        </span>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-white">
          Secure Checkout
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Your order total is verified atomically on our server. Card details are entered directly on Stripe or PayPal&apos;s secure servers.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Form */}
        <form onSubmit={submit} className="lg:col-span-8 space-y-6">
          {/* Step 1: Customer Contact */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                1
              </span>
              <span>Contact Information</span>
            </h2>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Email Address for Receipt & Tracking Updates <span className="text-blue-400">*</span>
              <input
                id="checkout-email"
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="billing@company.co.uk"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
              />
            </label>
          </div>

          {/* Step 2: Shipping Destination */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                2
              </span>
              <span>Delivery Address</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 sm:col-span-2">
                Recipient / Business Name <span className="text-blue-400">*</span>
                <input
                  id="checkout-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="e.g. Acme Tech Procurement"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 sm:col-span-2">
                Street Address <span className="text-blue-400">*</span>
                <input
                  id="checkout-address"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  autoComplete="address-line1"
                  placeholder="Suite 4, Innovation House"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                City / Town <span className="text-blue-400">*</span>
                <input
                  id="checkout-city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="address-level2"
                  placeholder="Birmingham"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                UK Postcode <span className="text-blue-400">*</span>
                <input
                  id="checkout-postcode"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  autoComplete="postal-code"
                  placeholder="B16 0LR"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 sm:col-span-2">
                Country
                <select
                  id="checkout-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="GB">United Kingdom (Direct UK Courier)</option>
                  <option value="IE">Ireland</option>
                </select>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Provider Choice */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                3
              </span>
              <span>Payment Gateway</span>
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  provider === "stripe"
                    ? "border-blue-500 bg-blue-500/10 shadow-sm"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="provider"
                      value="stripe"
                      checked={provider === "stripe"}
                      onChange={() => setProvider("stripe")}
                      className="accent-blue-600"
                    />
                    <span className="font-bold text-white text-sm">Credit / Debit Card (Stripe)</span>
                  </div>
                  <CreditCard className="h-4 w-4 text-blue-400" />
                </div>
                <p className="mt-2 text-xs text-slate-400 pl-5">
                  Visa, Mastercard, American Express, Apple Pay & Google Pay supported.
                </p>
              </label>

              <label
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  provider === "paypal"
                    ? "border-blue-500 bg-blue-500/10 shadow-sm"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="provider"
                      value="paypal"
                      checked={provider === "paypal"}
                      onChange={() => setProvider("paypal")}
                      className="accent-blue-600"
                    />
                    <span className="font-bold text-white text-sm">PayPal Checkout</span>
                  </div>
                  <Lock className="h-4 w-4 text-blue-400" />
                </div>
                <p className="mt-2 text-xs text-slate-400 pl-5">
                  Pay securely with your PayPal balance, linked bank account, or Pay in 3.
                </p>
              </label>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Delivery Instructions / Company PO Number (Optional)
              <textarea
                id="checkout-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={1000}
                rows={2}
                placeholder="e.g. Leave with building reception, PO-2026-991"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
              />
            </label>
          </div>

          {error && (
            <div role="alert" className="rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200">
              <p className="font-bold">Checkout Notice:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          )}

          <button
            id="checkout-submit-button"
            type="submit"
            disabled={busy}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 hover:shadow-blue-500/50 disabled:opacity-60 disabled:cursor-wait transition-all"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Redirecting to {provider === "stripe" ? "Stripe" : "PayPal"} Secure Gateway…</span>
              </>
            ) : (
              <>
                <span>Proceed to {provider === "stripe" ? "Stripe" : "PayPal"} Secure Payment</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Right Column: Order Review Sidebar */}
        <aside className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <h2 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-3">
            Your Order Items
          </h2>

          <div className="space-y-4 divide-y divide-slate-800/80">
            {items.map((item) => (
              <div key={item.productId} className="pt-3 first:pt-0 flex justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-white line-clamp-1">{item.name}</p>
                  <p className="text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-200 shrink-0">
                  {formatPrice(item.priceMinor * item.quantity, item.currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-slate-200 font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tracked UK Shipping</span>
              <span className="text-emerald-400 font-semibold">Free Delivery</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>UK VAT</span>
              <span className="text-slate-300">Included in total</span>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="text-xl font-extrabold text-blue-400">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
              <span>12-Month Hardware Guarantee on all items</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Direct tracked UK dispatch from Birmingham</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Payment processed with full provider idempotency</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
