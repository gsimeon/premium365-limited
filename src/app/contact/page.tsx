import { Mail, MapPin, Clock, HelpCircle } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata = {
  title: "Contact Us | Premium 365 Limited",
  description:
    "Get in touch with the Premium 365 team in Birmingham, UK for hardware procurement quotes, custom software development, cybersecurity audits, or Academy training inquiries.",
};

const faqs = [
  {
    q: "How does delivery and tracking work for hardware purchases?",
    a: "Orders placed on our hardware shop are verified, packed in anti-static protective packaging, and dispatched via Royal Mail Tracked 24 or DPD Next Day delivery. You receive full tracking updates as soon as the courier scans your package.",
  },
  {
    q: "What warranty is included on new and certified refurbished hardware?",
    a: "All new hardware carries full manufacturer warranties (typically 2–3 years). All certified refurbished hardware includes our comprehensive 12-month Premium 365 Return-to-Base hardware warranty covering parts and labor.",
  },
  {
    q: "Can you provide custom hardware configurations or volume discounts?",
    a: "Yes. For business deployments exceeding 5 units, we provide custom invoicing, bulk discounts, and pre-imaging services. Contact us through the enquiry form with your device specifications.",
  },
  {
    q: "How are IT consulting and development projects structured?",
    a: "We begin with a zero-cost technical discovery consultation to scope requirements, followed by an itemized statement of work with fixed milestones or weekly agile sprint pricing.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-900 bg-slate-900/60 py-16 sm:py-24">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[450px] w-[450px] rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-black text-white leading-tight">
              Tell us what you&apos;re working on.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Whether you need commercial hardware procurement, an IT consulting roadmap, or Academy training registration, our team is ready to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
              <h2 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-3">
                Direct Department Contacts
              </h2>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Hardware Sales & Procurement</p>
                    <a href="mailto:sales@premium365.uk" className="text-blue-400 hover:underline">
                      sales@premium365.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">IT Consulting & Cybersecurity</p>
                    <a href="mailto:consulting@premium365.uk" className="text-cyan-400 hover:underline">
                      consulting@premium365.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Academy Admissions</p>
                    <a href="mailto:academy@premium365.uk" className="text-indigo-400 hover:underline">
                      academy@premium365.uk
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 space-y-4">
              <h2 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-3">
                Registered Office
              </h2>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Premium 365 Limited</p>
                    <p className="mt-0.5 text-slate-400">
                      36 Hallewell Road<br />
                      Birmingham, B16 0LR<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
                  <Clock className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Operating Hours</p>
                    <p className="mt-0.5 text-slate-400">Monday – Friday: 09:00 – 17:30 UK Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">FAQ</span>
            <h2 className="font-display text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
                <h3 className="font-bold text-white text-base flex items-start gap-2.5">
                  <HelpCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
