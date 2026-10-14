export const metadata = {
  title: "Privacy Notice (UK GDPR) | Premium 365 Limited",
  description: "UK GDPR privacy notice, data controller disclosures, and data rights for Premium 365 Limited.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <section className="relative overflow-hidden border-b border-slate-900 bg-slate-900/60 py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">UK GDPR Compliance</span>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-black text-white">Privacy Notice</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: October 2026 · Premium 365 Limited</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 sm:px-6 pt-12 space-y-8 text-sm leading-relaxed text-slate-300">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">1. Data Controller</h2>
          <p>
            Premium 365 Limited (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting and respecting your privacy in full compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400">
            <strong className="block text-slate-200">Registered Office:</strong>
            36 Hallewell Road, Birmingham, B16 0LR, United Kingdom.
            <br />
            Data Protection Contact: privacy@premium365.uk
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">2. Personal Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-slate-200">Contact details:</strong> Name, work email address, telephone number, and company name when submitting an enquiry or registering for training.</li>
            <li><strong className="text-slate-200">Order & Delivery data:</strong> Postal address, items purchased, transaction references, and courier tracking details.</li>
            <li><strong className="text-slate-200">Payment metadata:</strong> Transaction IDs and payment confirmation status. <em>We never store credit card numbers or banking secrets on our servers; payments are processed directly by Stripe and PayPal.</em></li>
            <li><strong className="text-slate-200">Technical telemetry:</strong> IP address, browser type, and server session headers for fraud prevention and security auditing.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">3. Lawful Basis for Processing</h2>
          <p>We process your data under the following legal bases:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-slate-200">Contractual Necessity:</strong> To fulfill purchases, deliver hardware, provide training, and execute consulting engagements.</li>
            <li><strong className="text-slate-200">Legal Obligation:</strong> For financial record-keeping, VAT accounting with HMRC, and fraud prevention.</li>
            <li><strong className="text-slate-200">Legitimate Interests:</strong> To respond to enquiries, secure our network infrastructure, and enhance our services.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">4. Your Statutory Rights</h2>
          <p>
            Under UK GDPR, you have the right to request access to your personal data, request correction of inaccurate records, request erasure (&quot;right to be forgotten&quot;), and object to or restrict processing.
          </p>
          <p>
            To exercise any of these rights, contact our Data Protection Officer at <a href="mailto:privacy@premium365.uk" className="text-blue-400 hover:underline">privacy@premium365.uk</a>. You also have the right to lodge a complaint with the UK Information Commissioner&apos;s Office (ICO).
          </p>
        </div>
      </section>
    </div>
  );
}
