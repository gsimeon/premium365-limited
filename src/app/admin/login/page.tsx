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
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Lock className="h-7 w-7" />
        </div>

        <span className="mt-6 block text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
          Staff & Operations Portal
        </span>

        <h1 className="mt-2 font-display text-3xl font-extrabold text-white">
          Restricted Staff Sign In
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Request a passwordless magic link to access catalogue management, inventory allocation, and order fulfillment. Access is restricted to authorized staff and administrator accounts.
        </p>

        {!configured && (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-950/40 p-5 text-xs text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <span>⚠️ Supabase Keys Required in .env.local</span>
            </div>
            <p className="leading-relaxed">
              Magic link dispatch requires your Supabase <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-amber-300">anon</code> key to be set in <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-amber-300">.env.local</code>.
            </p>
            <p className="text-[11px] text-amber-400/90 pt-1">
              Find keys in Supabase: <strong>Project Settings → API</strong>.
            </p>
          </div>
        )}

        {params.error && configured && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200">
            <span className="font-bold">Access error: </span>
            {params.error}
          </div>
        )}

        {params.sent && (
          <div role="status" className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs text-emerald-200">
            Magic link dispatched. Check your staff inbox for the verification link.
          </div>
        )}

        <form action={requestAdminMagicLink} className="mt-6 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Authorized Staff Email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="operator@premium365.uk"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
            />
          </label>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            <span>Send Secure Magic Link</span>
            <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Role elevation is performed exclusively via Supabase SQL migrations. Service-role credentials are strictly kept on the server.
          </span>
        </div>
      </div>
    </section>
  );
}
