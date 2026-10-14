import Link from "next/link";
import { Lock, ShieldAlert, ArrowLeft, Send } from "lucide-react";
import { requestAdminMagicLink } from "../actions";

import { isSupabaseConfigured } from "@/lib/catalogue";

export const metadata = { title: "Staff Sign In | Premium 365 Limited" };

type SearchParams = Promise<{ error?: string; sent?: string }>;

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <section className="mx-auto max-w-xl px-5 py-20 md:py-28">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-xs">
          <Lock className="h-7 w-7" />
        </div>

        <span className="mt-6 block text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
          Staff & Operations Portal
        </span>

        <h1 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
          Restricted Staff Sign In
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Request a passwordless magic link to access catalogue management, inventory allocation, and order fulfillment. Access is restricted to authorized staff and administrator accounts.
        </p>

        {!configured && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <span>⚠️ Supabase Keys Required in .env.local</span>
            </div>
            <p className="leading-relaxed">
              Magic link dispatch requires your Supabase <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-900">anon</code> key to be set in <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-900">.env.local</code>.
            </p>
            <p className="text-[11px] text-amber-700 pt-1">
              Find keys in Supabase: <strong>Project Settings → API</strong>.
            </p>
          </div>
        )}

        {params.error && configured && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
            <span className="font-bold">Access error: </span>
            {params.error}
          </div>
        )}

        {params.sent && (
          <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800">
            Magic link dispatched. Check your staff inbox for the verification link.
          </div>
        )}

        <form action={requestAdminMagicLink} className="mt-6 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Authorized Staff Email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="operator@premium365.uk"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-2xs"
            />
          </label>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all"
          >
            <span>Send Secure Magic Link</span>
            <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Role elevation is performed exclusively via Supabase SQL migrations. Service-role credentials are strictly kept on the server.
          </span>
        </div>
      </div>
    </section>
  );
}
