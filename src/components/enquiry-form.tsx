"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";

function EnquiryFormContent() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("IT services");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");

  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const courseParam = searchParams.get("course");
    const productParam = searchParams.get("product");

    if (serviceParam) {
      setType("IT services");
      setMessage(`I am enquiring about the ${serviceParam} service. Our current requirements are: `);
    } else if (courseParam) {
      setType("Academy / training");
      setMessage(`I am interested in registering for the "${courseParam}" course. Please share syllabus and start dates.`);
    } else if (productParam) {
      setType("Product enquiry");
      setMessage(`I would like to request volume availability and pricing for: ${productParam}.`);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = "P365-ENQ-" + Math.floor(100000 + Math.random() * 900000);
    setRefId(randomRef);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-5">
        <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
            Enquiry Received · Reference: {refId}
          </span>
          <h3 className="font-display text-2xl font-bold text-white">Thank you, {name}</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Your enquiry has been assigned to our Birmingham engineering and procurement team. We will respond to <strong className="text-white">{email}</strong> within 4 business hours.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400 max-w-sm mx-auto">
          <p className="font-semibold text-slate-200">Need immediate assistance?</p>
          <p className="mt-1">Direct inquiries: info@premium365.uk</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage("");
          }}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      id="main-enquiry-form"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7 sm:p-10 shadow-2xl backdrop-blur-xl space-y-5"
    >
      <div className="border-b border-slate-800/80 pb-4">
        <h3 className="font-display text-xl font-bold text-white">Request Consultation or Quote</h3>
        <p className="text-xs text-slate-400 mt-1">
          Tell us about your requirements and a specialist will review your specifications.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Full Name <span className="text-blue-400">*</span>
          <input
            id="enquiry-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah Jenkins"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-normal placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
            autoComplete="name"
          />
        </label>

        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Work Email <span className="text-blue-400">*</span>
          <input
            id="enquiry-email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="s.jenkins@company.co.uk"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-normal placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
            autoComplete="email"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Company / Organisation
          <input
            id="enquiry-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Acme Tech Ltd"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-normal placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
          />
        </label>

        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Phone Number (Optional)
          <input
            id="enquiry-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+44 7123 456789"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-normal placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
            autoComplete="tel"
          />
        </label>
      </div>

      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
        Enquiry Category
        <select
          id="enquiry-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-normal outline-none focus:border-blue-500 transition-colors"
        >
          <option value="IT services">IT Services & Custom Engineering</option>
          <option value="Cybersecurity">Cybersecurity & Risk Audit</option>
          <option value="Data analytics">Data Analytics & Power BI</option>
          <option value="Product enquiry">Hardware Procurement & Volume Quotes</option>
          <option value="Academy / training">Premium 365 Academy / Courses</option>
          <option value="Other">General Enquiry</option>
        </select>
      </label>

      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
        How Can We Help? <span className="text-blue-400">*</span>
        <textarea
          id="enquiry-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Briefly describe your requirements, project scope, or questions..."
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-normal placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
        />
      </label>

      <button
        id="enquiry-submit-button"
        type="submit"
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:shadow-blue-500/50 transition-all"
      >
        <span>Submit Enquiry</span>
        <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>Your data is processed in accordance with UK GDPR. We never share your details.</span>
      </div>
    </form>
  );
}

export function EnquiryForm() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 min-h-[450px] animate-pulse" />
      }
    >
      <EnquiryFormContent />
    </Suspense>
  );
}
