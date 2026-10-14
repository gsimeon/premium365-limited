import Link from "next/link";
import { ShieldCheck, MapPin, Building2 } from "lucide-react";

export const metadata = {
  title: "About Premium 365 Limited | Enterprise Technology Partner",
  description:
    "Learn about Premium 365 Limited, a UK technology partner based in Birmingham delivering enterprise hardware, tailored IT consulting, software engineering, and professional training.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-900 bg-slate-900/60 py-16 sm:py-24">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Our Identity & Mission
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-white leading-tight">
              Technology should create sustainable momentum.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Premium 365 Limited is a multidisciplinary UK technology partner headquartered in Birmingham, bringing together commercial hardware procurement, bespoke software development, proactive cybersecurity, and professional capability building.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-16">
        {/* Story & Approach */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">The Problem We Solve</span>
            <h2 className="font-display text-3xl font-extrabold text-white">
              Bridging the gap between hardware and software delivery.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Most technology providers focus exclusively on one side: they are either hardware box-shifters with zero engineering understanding, or consulting agencies who cannot recommend or configure the physical equipment their client teams rely upon daily.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Premium 365 Limited was founded to unify these worlds. We curate and configure the right physical workstations, design and deploy the cloud systems that power them, protect the perimeter with zero-trust security, and train your staff to wield those tools with proficiency.
            </p>
          </div>

          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
            <h3 className="font-display text-lg font-bold text-white border-b border-slate-800 pb-3">Company Details</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <Building2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Legal Entity</strong>
                  <span>Premium 365 Limited</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Registered Office</strong>
                  <span>36 Hallewell Road, Birmingham, B16 0LR, United Kingdom</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Jurisdiction</strong>
                  <span>Incorporated in England & Wales</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Guiding Principles */}
        <div className="mt-24 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Our Foundations</span>
            <h2 className="font-display text-3xl font-bold text-white">Principles That Guide Every Engagement</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Pragmatic Engineering", desc: "We deploy proven, maintainable architectures that solve immediate business friction without unnecessary complexity." },
              { title: "Security by Design", desc: "Every device, cloud policy, and software system is built around Cyber Essentials and zero-trust safeguards." },
              { title: "Transparent Pricing", desc: "Clear GBP quotes, no hidden cloud surcharges, and honest hardware lead times with tracking." },
              { title: "Lifelong Capability", desc: "We don't leave black boxes. We train and empower your internal team through our Academy modules." },
            ].map((p, i) => (
              <div key={p.title} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
                <span className="font-mono text-sm font-black text-blue-400">0{i + 1}</span>
                <h3 className="font-bold text-white text-base">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 text-center space-y-5">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Let&apos;s discuss how Premium 365 can support your team.
          </h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From procuring fleet workstations to architectural reviews and corporate training programmes.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-blue-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
            >
              Get in Touch with our Team
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-slate-700 bg-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all"
            >
              Browse Hardware
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
