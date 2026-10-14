"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { requestAdminMagicLink, signInWithPasswordAction } from "../actions";

interface AdminLoginFormProps {
  configured: boolean;
  error?: string;
  sent?: string;
}

export function AdminLoginForm({ configured, error, sent }: AdminLoginFormProps) {
  const [authMode, setAuthMode] = useState<"password" | "magic-link">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Ambient background decoration */}
      <div 
        className="absolute -top-12 -left-12 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-12 -right-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Top Breadcrumb & Status Bar */}
      <div className="flex items-center justify-between mb-6 px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-slate-400 group-hover:text-blue-600" />
          <span>Return to Storefront</span>
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1 text-[11px] font-medium text-emerald-800 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-7 sm:p-10 shadow-xl shadow-slate-200/60">
        
        {/* Portal Header */}
        <div className="flex items-start justify-between">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-50">
            <Lock className="h-7 w-7" />
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span>Operations Portal</span>
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-1.5">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff & Admin Sign In
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Restricted access for catalogue administration, inventory management, and customer order fulfillment.
          </p>
        </div>

        {/* Database Configuration Alert */}
        {!configured && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
              <span>Supabase Keys Required in .env.local</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              Authentication requires your Supabase <code className="rounded bg-amber-100/90 px-1.5 py-0.5 font-mono text-amber-950 font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to be set.
            </p>
            <p className="text-[11px] text-amber-700 pt-0.5">
              Copy keys from Supabase Dashboard: <strong>Project Settings → API</strong>.
            </p>
          </div>
        )}

        {/* Dynamic Alerts */}
        {error && configured && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-xs text-red-800 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-red-900">Authentication Failed</p>
              <p className="leading-relaxed text-red-700">{error}</p>
            </div>
          </div>
        )}

        {sent && (
          <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs text-emerald-800 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-emerald-950">Magic Link Dispatched</p>
              <p className="leading-relaxed text-emerald-800">
                Please check your inbox. Click the verification link to securely authenticate into the staff portal.
              </p>
            </div>
          </div>
        )}

        {/* Authentication Mode Tabs */}
        <div className="mt-7 grid grid-cols-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAuthMode("password")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              authMode === "password"
                ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>Staff Password</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode("magic-link")}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              authMode === "magic-link"
                ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Magic Link OTP</span>
          </button>
        </div>

        {/* Tab 1: Staff Password Form */}
        {authMode === "password" ? (
          <form 
            action={signInWithPasswordAction} 
            onSubmit={() => setSubmitting(true)} 
            className="mt-6 space-y-4"
          >
            <div>
              <label 
                htmlFor="staff-email-password" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="staff-email-password"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="admin@premium365.uk"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-normal shadow-xs"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="staff-password" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-normal shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-blue-600 active:scale-[0.99] transition-all disabled:opacity-75 disabled:pointer-events-none cursor-pointer mt-2"
            >
              <span>{submitting ? "Authenticating..." : "Sign In to Operations"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        ) : (
          /* Tab 2: Magic Link Form */
          <form 
            action={requestAdminMagicLink} 
            onSubmit={() => setSubmitting(true)} 
            className="mt-6 space-y-4"
          >
            <div>
              <label 
                htmlFor="staff-email-magic" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Authorized Staff Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="staff-email-magic"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="operator@premium365.uk"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-normal shadow-xs"
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                A passwordless single-use verification link will be sent to your registered address.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-blue-600 active:scale-[0.99] transition-all disabled:opacity-75 disabled:pointer-events-none cursor-pointer mt-2"
            >
              <span>{submitting ? "Dispatching..." : "Send Secure Magic Link"}</span>
              <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}

        {/* Security & Access Tips Accordion */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between text-left text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Need help signing in or configuring permissions?</span>
            </span>
            <span className="text-[11px] text-blue-600 font-bold">
              {showTips ? "Hide details" : "View guide"}
            </span>
          </button>

          {showTips && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-600 space-y-2 animate-in fade-in duration-200">
              <p className="font-semibold text-slate-900">
                Staff Authentication Architecture:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                <li>Accounts must be granted the <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.2 rounded border border-blue-200">staff</code> or <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.2 rounded border border-blue-200">admin</code> role in the <code className="text-slate-800 font-mono">public.profiles</code> table.</li>
                <li>To elevate your account, execute in Supabase SQL editor: <code className="block mt-1 font-mono text-[10px] bg-white p-2 rounded border border-slate-200 text-slate-800 overflow-x-auto">UPDATE public.profiles SET role = &#39;admin&#39; WHERE id = &#39;your-user-uuid&#39;;</code></li>
                <li>Session tokens and Row-Level Security (RLS) policies are automatically verified on each request.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Security Seals */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2">
            <ShieldCheck className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">RBAC Guard</p>
            <p className="text-[9px] text-slate-400">Strict Roles</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2">
            <Lock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">TLS 1.3</p>
            <p className="text-[9px] text-slate-400">End-to-End</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2">
            <Sparkles className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Audit Log</p>
            <p className="text-[9px] text-slate-400">Activity Tracked</p>
          </div>
        </div>
      </div>

      {/* Footer Attribution */}
      <p className="mt-6 text-center text-[11px] text-slate-500">
        Premium 365 Limited · Internal Systems Administration Portal · Birmingham, UK
      </p>
    </div>
  );
}
