"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, CreditCard, ArrowRight, Loader2, Truck, Sparkles } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/format";
import { AddressPostcodeLookup } from "@/components/checkout/address-postcode-lookup";

export default function CheckoutPage() {
  const { items, add } = useCart();
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
      <section className="mx-auto max-w-4xl px-5 py-16 sm:py-24 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
            Checkout · Cart Empty
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Shopping Cart is Empty
          </h1>
          <p className="max-w-md mx-auto text-sm text-slate-600 leading-relaxed">
            To complete a purchase and enter your delivery address, add an item to your cart from the hardware catalogue, or click below to populate a sample item for testing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                add({
                  productId: "c1a10001-0000-0000-0000-000000000001",
                  slug: "thinkpad-t14-gen-4",
                  name: "ThinkPad T14 Gen 4 Core i7 32GB 1TB SSD",
                  priceMinor: 89900,
                  currency: "GBP",
                })
              }
              className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 shadow-md transition-all cursor-pointer"
            >
              Add Demo Item & Open Full Checkout →
            </button>
            <Link
              href="/shop"
              className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-all"
            >
              Browse Hardware Catalogue
            </Link>
          </div>

          {/* Interactive Live Preview of Address & House Popup */}
          <div className="mt-8 border-t border-slate-100 pt-8 text-left max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Try Delivery Address & House Popup Here:
                </h3>
                <p className="text-xs text-slate-500">
                  Type your UK postcode (e.g. <span className="font-mono font-bold text-blue-600">B16 0LR</span> or <span className="font-mono font-bold text-blue-600">SW1A 2AA</span>) to test the house selector popup.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <AddressPostcodeLookup
                postcode={postcode}
                onPostcodeChange={(pc) => setPostcode(pc)}
                onSelectAddress={({ line1, city: c, postcode: pc }) => {
                  setAddress1(line1);
                  setCity(c);
                  setPostcode(pc);
                }}
              />
            </div>

            {address1 && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                <p className="font-bold">Address Selected Successfully:</p>
                <p className="mt-0.5">{address1}, {city}, {postcode}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-16">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Encrypted 256-Bit SSL
        </span>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          Secure Checkout
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          Your order total is verified atomically on our server. Card details are entered directly on Stripe or PayPal&apos;s secure servers.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Form */}
        <form onSubmit={submit} className="lg:col-span-8 space-y-6">
          {/* Step 1: Customer Contact */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                1
              </span>
              <span>Contact Information</span>
            </h2>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address for Receipt & Tracking Updates <span className="text-blue-600">*</span>
              <input
                id="checkout-email"
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="billing@company.co.uk"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-2xs"
              />
            </label>
          </div>

          {/* Step 2: Shipping Destination */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-100 pb-3">
              <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  2
                </span>
                <span>Delivery Address</span>
              </h2>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Auto-find house & street by postcode
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 sm:col-span-2">
                Recipient / Business Name <span className="text-blue-600">*</span>
                <input
                  id="checkout-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="e.g. Acme Tech Procurement"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-2xs"
                />
              </label>

              {/* UK Postcode Finder with House Lookup Popup */}
              <div className="sm:col-span-2 rounded-2xl bg-slate-50/80 p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-blue-600" />
                    Fast Address Autocomplete
                  </span>
                  <span className="text-[11px] text-slate-500">
                    UK Royal Mail & ONS database
                  </span>
                </div>
                <AddressPostcodeLookup
                  postcode={postcode}
                  onPostcodeChange={(newPc) => setPostcode(newPc)}
                  onSelectAddress={({ line1, city: newCity, postcode: newPc }) => {
                    setAddress1(line1);
                    setCity(newCity);
                    setPostcode(newPc);
                  }}
                  onManualEntryClick={() => {
                    const el = document.getElementById("checkout-address");
                    el?.focus();
                  }}
                />
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 sm:col-span-2">
                Street Address <span className="text-blue-600">*</span>
                <input
                  id="checkout-address"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  autoComplete="address-line1"
                  placeholder="e.g. 14 Hallewell Road or Suite 4, Innovation House"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-2xs"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                City / Town <span className="text-blue-600">*</span>
                <input
                  id="checkout-city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="address-level2"
                  placeholder="e.g. Birmingham"
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-2xs"
                />
              </label>

              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Country
                <select
                  id="checkout-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-2xs"
                >
                  <option value="GB">United Kingdom (Direct UK Courier)</option>
                  <option value="IE">Ireland</option>
                </select>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Provider Choice */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                3
              </span>
              <span>Payment Gateway</span>
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  provider === "stripe"
                    ? "border-blue-600 bg-blue-50/70 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
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
                    <span className="font-bold text-slate-900 text-sm">Credit / Debit Card (Stripe)</span>
                  </div>
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <p className="mt-2 text-xs text-slate-600 pl-5">
                  Visa, Mastercard, American Express, Apple Pay & Google Pay supported.
                </p>
              </label>

              <label
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  provider === "paypal"
                    ? "border-blue-600 bg-blue-50/70 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
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
                    <span className="font-bold text-slate-900 text-sm">PayPal Checkout</span>
                  </div>
                  <Lock className="h-4 w-4 text-blue-600" />
                </div>
                <p className="mt-2 text-xs text-slate-600 pl-5">
                  Pay securely with your PayPal balance, linked bank account, or Pay in 3.
                </p>
              </label>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-2 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Delivery Instructions / Company PO Number (Optional)
              <textarea
                id="checkout-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={1000}
                rows={2}
                placeholder="e.g. Leave with building reception, PO-2026-991"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-2xs"
              />
            </label>
          </div>

          {error && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <p className="font-bold">Checkout Notice:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          )}

          <button
            id="checkout-submit-button"
            type="submit"
            disabled={busy}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait transition-all"
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
        <aside className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Your Order Items
          </h2>

          <div className="space-y-4 divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.productId} className="pt-3 first:pt-0 flex justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                  <p className="text-slate-500 mt-0.5">Quantity: {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatPrice(item.priceMinor * item.quantity, item.currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="text-slate-900 font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tracked UK Shipping</span>
              <span className="text-emerald-700 font-bold">Free Delivery</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>UK VAT</span>
              <span className="text-slate-600">Included in total</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="text-xl font-black text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>12-Month Hardware Guarantee on all items</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-600 shrink-0" />
              <span>Direct tracked UK dispatch from Birmingham</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Payment processed with full provider idempotency</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
