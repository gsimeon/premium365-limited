"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Mail, AlertCircle } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CheckoutSuccessClient({
  provider,
  orderId,
  paypalOrderId,
  sessionId,
}: {
  provider: string | null;
  orderId: string | null;
  paypalOrderId: string | null;
  sessionId: string | null;
}) {
  const { clear } = useCart();
  const [message, setMessage] = useState("Checking payment confirmation with provider…");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (provider === "paypal") {
        if (!orderId || !paypalOrderId) {
          setError(
            "We could not match the PayPal return to an order. Please contact support before retrying payment."
          );
          return;
        }
        try {
          const response = await fetch("/api/checkout/paypal/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, paypalOrderId }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Payment confirmation is pending.");
          if (alive) {
            clear();
            setConfirmed(true);
            setMessage(
              "Your PayPal payment has been confirmed. Our Birmingham fulfillment team will review, pack, and dispatch your order."
            );
          }
        } catch (e) {
          if (alive) setError(e instanceof Error ? e.message : "Payment confirmation is pending.");
        }
      } else if (provider === "stripe" && sessionId) {
        if (alive) {
          clear();
          setConfirmed(true);
          setMessage(
            "You have returned from Stripe. Your order will be confirmed once our verified payment notification is processed. Please do not retry payment while confirmation is pending."
          );
        }
      } else {
        setError(
          "The payment return is missing details. Check your payment receipt or contact Premium 365 support."
        );
      }
    }
    void run();
    return () => {
      alive = false;
    };
  }, [provider, orderId, paypalOrderId, sessionId, clear]);

  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <CheckCircle2 className="h-8 w-8 text-blue-400" />
        </div>

        <span className="mt-6 block text-xs font-black uppercase tracking-[0.2em] text-blue-400">
          {confirmed ? "Checkout Confirmed & Received" : "Checkout Processed"}
        </span>

        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
          Thank you for your order.
        </h1>

        {error ? (
          <div role="alert" className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-4 text-xs text-amber-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Payment Status Notice:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300">
            {message}
          </p>
        )}

        {orderId && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>Order Reference:</span>
            <span className="font-mono font-bold text-white uppercase">{orderId}</span>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-400" />
            <span>Order confirmation and tracking updates will be dispatched to your email.</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Backed by full Premium 365 12-month hardware guarantee.</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-blue-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-slate-700 bg-slate-900 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
