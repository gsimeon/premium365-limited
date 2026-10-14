import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Checkout Cancelled | Premium 365 Limited",
};

export default function CheckoutCancelledPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <span className="mt-6 block text-xs font-black uppercase tracking-[0.2em] text-amber-400">
          Payment Incomplete
        </span>

        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
          Checkout was cancelled
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
          Your payment was not confirmed by the provider. If you cancelled intentionally or experienced a gateway timeout, your items remain saved in your cart. Any temporary inventory reservations are released automatically once the session expires.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400">
          Need help completing your order? Contact our Birmingham team at <strong className="text-white">sales@premium365.uk</strong>.
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Shopping Cart</span>
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
