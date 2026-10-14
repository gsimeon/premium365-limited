"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Cpu, ShieldCheck, GraduationCap, Info, PhoneCall } from "lucide-react";
import { CartCount } from "@/components/cart/cart-count";

const nav = [
  { href: "/shop", label: "Shop", icon: Cpu, badge: "Hardware" },
  { href: "/services", label: "IT Services", icon: ShieldCheck, badge: "Consulting" },
  { href: "/academy", label: "Academy", icon: GraduationCap, badge: "Training" },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: PhoneCall },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs">
      {/* Top announcement bar */}
      <div className="hidden border-b border-slate-200/70 bg-slate-50/90 px-5 py-1.5 text-xs text-slate-600 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              UK Enterprise Technology & IT Solutions
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">Next-Day UK Dispatch Available</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700 font-medium">📍 Birmingham, UK (B16 0LR)</span>
            <Link href="/admin/login" className="text-slate-500 hover:text-blue-600 font-medium transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        {/* Brand Logo */}
        <Link href="/" id="brand-logo" className="group flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 p-[1px] shadow-md shadow-blue-500/20">
            <div className="grid h-full w-full place-items-center rounded-[11px] bg-blue-600 font-black text-white text-xs tracking-wider transition-colors group-hover:bg-blue-700">
              P365
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              PREMIUM 365
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Limited · UK
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-semibold transition-all rounded-full ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className={`ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <CartCount />

          <Link
            href="/contact"
            id="header-cta"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/40"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile menu trigger */}
          <button
            id="mobile-menu-toggle"
            type="button"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden shadow-xs"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white/98 px-5 py-6 backdrop-blur-2xl lg:hidden shadow-lg">
          <nav className="grid gap-2" aria-label="Mobile Navigation">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-2xl p-3.5 text-base font-semibold transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700 border border-blue-200" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700"
            >
              Consult Our UK Team
            </Link>
            <div className="text-center text-xs text-slate-500">
              36 Hallewell Road, Birmingham, B16 0LR
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
