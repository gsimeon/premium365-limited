"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartCount() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      id="cart-nav-button"
      className="group relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-slate-50 hover:text-blue-600"
    >
      <ShoppingBag className="h-4 w-4 text-blue-600 transition-transform group-hover:scale-110" />
      <span>Cart</span>
      <span
        id="cart-badge-count"
        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-all ${
          count > 0
            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
            : "bg-slate-100 text-slate-600 border border-slate-200"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
