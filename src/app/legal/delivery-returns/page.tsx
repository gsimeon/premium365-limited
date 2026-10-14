import { Truck, RotateCcw, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Delivery & Returns Policy | Premium 365 Limited",
  description: "UK tracked delivery timeframes, 14-day statutory return rights, and warranty repair procedures for Premium 365 Limited.",
};

export default function DeliveryReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <section className="relative overflow-hidden border-b border-slate-900 bg-slate-900/60 py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">UK Fulfilment & Consumer Rights</span>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-black text-white">Delivery & Returns Policy</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: October 2026 · Premium 365 Limited</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 sm:px-6 pt-12 space-y-8 text-sm leading-relaxed text-slate-300">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-blue-400" />
            <h2 className="font-display text-xl font-bold text-white">1. UK Delivery & Dispatch</h2>
          </div>
          <p>
            Hardware orders placed before 14:00 Monday to Friday are prepared, verified, and handed to our logistics partners on the same business day:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-slate-200">Mainland UK Standard Delivery:</strong> Royal Mail Tracked 24 or DPD Next Day (1–2 business days). Free on orders over £150.</li>
            <li><strong className="text-slate-200">Northern Ireland & Offshore Islands:</strong> 2–3 business days via tracked Royal Mail Special Delivery.</li>
            <li><strong className="text-slate-200">Tracking:</strong> Every dispatch includes an online tracking link sent to your registered email upon courier handover.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <RotateCcw className="h-6 w-6 text-emerald-400" />
            <h2 className="font-display text-xl font-bold text-white">2. 14-Day Statutory Cancellation & Returns</h2>
          </div>
          <p>
            Under the Consumer Contracts Regulations 2013, UK retail consumers have the right to cancel their purchase and return physical items within 14 calendar days of delivery without stating a reason.
          </p>
          <p>
            To initiate a return, email <a href="mailto:returns@premium365.uk" className="text-blue-400 hover:underline">returns@premium365.uk</a> with your order reference. Items must be returned undamaged in original packaging with all included accessories and power cables.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-cyan-400" />
            <h2 className="font-display text-xl font-bold text-white">3. Refund Processing</h2>
          </div>
          <p>
            Once returned items arrive at our Birmingham warehouse and pass serial-number inspection, refunds are processed within 3 to 5 business days directly back to the original Stripe or PayPal payment source.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-purple-400" />
            <h2 className="font-display text-xl font-bold text-white">4. Damaged or Faulty Items Under Warranty</h2>
          </div>
          <p>
            If any item arrives damaged in transit or exhibits a hardware fault within the 12-month warranty period, we provide a prepaid return label and prompt repair or replacement. Contact <a href="mailto:support@premium365.uk" className="text-blue-400 hover:underline">support@premium365.uk</a> immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
