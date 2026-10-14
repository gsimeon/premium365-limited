export const metadata = {
  title: "Terms of Sale & Website Use | Premium 365 Limited",
  description: "Terms and conditions of hardware sales, IT consulting engagements, and website use for Premium 365 Limited.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <section className="relative overflow-hidden border-b border-slate-900 bg-slate-900/60 py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Legal Agreement</span>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-black text-white">Terms of Sale & Use</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: October 2026 · Premium 365 Limited</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 sm:px-6 pt-12 space-y-8 text-sm leading-relaxed text-slate-300">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">1. Introduction & Company Details</h2>
          <p>
            These terms govern the sale of technology hardware, IT services, and use of this website. Premium 365 Limited is incorporated in England and Wales with its registered office at 36 Hallewell Road, Birmingham, B16 0LR, United Kingdom.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">2. Formation of Contract & Orders</h2>
          <p>
            An order submitted through our website constitutes an offer to purchase. A legally binding contract is only formed when we receive verified payment notification from our payment providers (Stripe or PayPal) and dispatch the items or confirm engagement dates.
          </p>
          <p>
            We reserve the right to decline or cancel orders in cases of pricing errors, suspected fraud, or sudden supplier stock exhaustion. In such events, any funds captured are refunded in full.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">3. Pricing & Currency</h2>
          <p>
            All prices are stated in British Pounds Sterling (GBP). Standard UK courier delivery is included on qualifying hardware orders unless specified otherwise. We reserve the right to correct pricing discrepancies prior to order fulfillment.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">4. Hardware Warranty & Guarantees</h2>
          <p>
            All brand-new equipment is covered by manufacturer warranties. Certified refurbished equipment carries our 12-month return-to-base hardware warranty covering internal component failure under standard operational conditions. Accidental damage, liquid ingress, and unauthorised modifications are excluded.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">5. Governing Law & Jurisdiction</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of England and Wales. The courts of England and Wales have exclusive jurisdiction to settle any dispute or claim arising under these terms.
          </p>
        </div>
      </section>
    </div>
  );
}
