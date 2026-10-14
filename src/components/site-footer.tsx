import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-900 bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Tracked UK Delivery</p>
              <p className="text-[11px] text-slate-400">Royal Mail 24 & DPD Next Day</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">12-Month Hardware Guarantee</p>
              <p className="text-[11px] text-slate-400">Full warranty on all systems</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">14-Day Statutory Returns</p>
              <p className="text-[11px] text-slate-400">UK consumer rights compliant</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Bank-Grade Encryption</p>
              <p className="text-[11px] text-slate-400">Stripe & PayPal verified checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">
              P365
            </div>
            <span className="font-display text-lg font-black tracking-tight text-white">
              PREMIUM 365 LIMITED
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            A comprehensive UK technology partner delivering curated enterprise hardware, custom software, proactive cybersecurity, business intelligence, and professional training.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 text-xs text-slate-400">
            <strong className="block text-slate-200">Registered Office:</strong>
            36 Hallewell Road, Birmingham, B16 0LR, United Kingdom.
            <br />
            Incorporated in England & Wales.
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">Technology Shop</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Business Laptops</Link></li>
            <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Workstations & Monitors</Link></li>
            <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Enterprise Networking</Link></li>
            <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Storage & NAS Solutions</Link></li>
            <li><Link href="/shop" className="hover:text-blue-400 transition-colors">Certified Refurbished</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">IT Consultancy</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/services#software" className="hover:text-blue-400 transition-colors">Custom Software Development</Link></li>
            <li><Link href="/services#cybersecurity" className="hover:text-blue-400 transition-colors">Cybersecurity Audits</Link></li>
            <li><Link href="/services#analytics" className="hover:text-blue-400 transition-colors">Power BI & Data Analytics</Link></li>
            <li><Link href="/services#cloud" className="hover:text-blue-400 transition-colors">Cloud Architecture</Link></li>
            <li><Link href="/services#consulting" className="hover:text-blue-400 transition-colors">Managed IT Support</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">Company & Legal</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Premium 365</Link></li>
            <li><Link href="/academy" className="hover:text-blue-400 transition-colors">Training Academy</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Our Team</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy (GDPR)</Link></li>
            <li><Link href="/legal/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/legal/delivery-returns" className="hover:text-blue-400 transition-colors">Delivery & Returns</Link></li>
            <li><Link href="/admin/login" className="hover:text-blue-400 transition-colors">Staff Portal</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950 px-5 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© {new Date().getFullYear()} Premium 365 Limited. All rights reserved. Company registered in England & Wales.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Stripe Verified</span>
            <span>·</span>
            <span>PayPal Approved</span>
            <span>·</span>
            <span>256-Bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
