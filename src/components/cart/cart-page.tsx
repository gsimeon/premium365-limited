"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-provider";

export function CartPage() {
  const { items, setQuantity, remove } = useCart();
  const total = items.reduce((sum, x) => sum + x.priceMinor * x.quantity, 0);

  if (!items.length) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <div className="grid h-20 w-20 mx-auto place-items-center rounded-3xl bg-blue-50 border border-blue-200 text-blue-600 shadow-xs">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          Explore our curated catalogue of business laptops, workstations, displays, and networking systems.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all"
        >
          <span>Browse Hardware Catalogue</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Order Summary</span>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-slate-900">Shopping Cart</h1>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {items.reduce((s, i) => s + i.quantity, 0)} item(s) selected
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Item List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <article
              key={item.productId}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-colors hover:border-slate-300"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-display text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-slate-500">
                  Unit price: <span className="font-semibold text-slate-800">{formatPrice(item.priceMinor, item.currency)}</span>
                </p>
              </div>

              {/* Quantity Stepper & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 shadow-2xs">
                  <button
                    type="button"
                    aria-label={`Decrease quantity for ${item.name}`}
                    onClick={() => setQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity for ${item.name}`}
                    onClick={() => setQuantity(item.productId, Math.min(20, item.quantity + 1))}
                    className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="block text-sm font-extrabold text-slate-900">
                    {formatPrice(item.priceMinor * item.quantity, item.currency)}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item.productId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}

          {/* Delivery & Security Note */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 shadow-xs">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Tracked UK Dispatch (Royal Mail 24 / DPD)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>12-Month Hardware Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <aside className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
            Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Estimated Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Standard UK Delivery</span>
              <span className="font-semibold text-emerald-700">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>VAT / Taxes</span>
              <span className="text-slate-900 font-semibold">Included</span>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Due</span>
              <span className="text-xl font-black text-slate-900">{formatPrice(total)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/checkout"
              id="proceed-checkout-button"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/shop"
              className="block w-full text-center py-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-4 text-[11px] text-slate-400 text-center space-y-1">
            <p>🔒 256-Bit SSL Encrypted Checkout</p>
            <p>Supported: Stripe (Visa, MC, Amex) & PayPal</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
