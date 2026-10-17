"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Copy,
  Check,
  QrCode,
  X,
  CreditCard,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  generateMonzoPaymentLink,
  generateMonzoQrCodeUrl,
  DEFAULT_MONZO_USERNAME,
} from "@/lib/monzo";
import { formatPrice } from "@/lib/format";

export interface MonzoPayProduct {
  id?: string;
  name: string;
  price_minor: number;
  sku?: string | null;
  currency?: string;
}

interface MonzoPayButtonProps {
  product: MonzoPayProduct;
  variant?: "primary" | "secondary" | "pill" | "admin";
  className?: string;
}

export function MonzoPayButton({
  product,
  variant = "primary",
  className = "",
}: MonzoPayButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(DEFAULT_MONZO_USERNAME);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const priceFormatted = formatPrice(product.price_minor, product.currency || "GBP");
  const paymentLink = generateMonzoPaymentLink({
    priceMinor: product.price_minor,
    productName: product.name,
    sku: product.sku,
    username,
  });
  const qrCodeUrl = generateMonzoQrCodeUrl(paymentLink, 280);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      {variant === "primary" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`group flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#FF365D] via-[#FF5449] to-[#FF7B40] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-rose-500/20 hover:opacity-95 hover:shadow-lg hover:shadow-rose-500/30 active:scale-98 transition-all cursor-pointer ${className}`}
        >
          <CreditCard className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
          <span>Pay with Monzo · {priceFormatted}</span>
        </button>
      )}

      {variant === "secondary" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`group inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100/70 transition-all cursor-pointer ${className}`}
        >
          <span className="grid h-5 w-5 place-items-center rounded-md bg-[#FF365D] text-white text-[10px] font-black">
            M
          </span>
          <span>Monzo Payment Link</span>
        </button>
      )}

      {variant === "pill" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/80 px-3 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 hover:text-rose-900 transition-colors cursor-pointer ${className}`}
          title="Generate Monzo Payment Link"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF365D]" />
          <span>Monzo Pay</span>
        </button>
      )}

      {variant === "admin" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-50 hover:border-rose-400 transition-all cursor-pointer ${className}`}
        >
          <ExternalLink className="h-3.5 w-3.5 text-[#FF365D]" />
          <span>Generate Monzo Link</span>
        </button>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#14233C] to-[#1F3354] p-6 text-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-[#FF365D] to-[#FF7B40] text-xs font-black text-white shadow-xs">
                    M
                  </span>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-rose-300">
                    Monzo Payment Link
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white">Instant Monzo Checkout</h3>
                <p className="text-xs text-slate-300">
                  Direct payment via Monzo app, Apple Pay, Google Pay, or UK debit card.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Product Price Summary Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Product
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                  {product.sku && (
                    <span className="font-mono text-[10px] text-slate-500">SKU: {product.sku}</span>
                  )}
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Price
                  </span>
                  <p className="text-2xl font-black text-slate-900">{priceFormatted}</p>
                </div>
              </div>

              {/* Monzo.me Link Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Generated Monzo.me Payment Link:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      readOnly
                      value={paymentLink}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100/70 px-3.5 py-3 font-mono text-xs text-slate-800 outline-none select-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-800 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-slate-500" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Action: Open Monzo Page */}
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF365D] via-[#FF5449] to-[#FF7B40] py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-rose-500/25 hover:opacity-95 hover:shadow-xl hover:shadow-rose-500/35 active:scale-98 transition-all cursor-pointer text-center"
              >
                <span>Proceed to Pay {priceFormatted} on Monzo</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              {/* QR Code Toggle / Display */}
              <div className="border-t border-slate-100 pt-4 text-center">
                {!showQr ? (
                  <button
                    type="button"
                    onClick={() => setShowQr(true)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Show Mobile QR Code for Phone Scanning</span>
                  </button>
                ) : (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-xs text-slate-600 font-medium">
                      Scan with your smartphone camera to pay {priceFormatted} instantly:
                    </p>
                    <div className="mx-auto w-48 h-48 rounded-2xl border-2 border-slate-200 bg-white p-2 shadow-inner grid place-items-center relative">
                      <Image
                        src={qrCodeUrl}
                        alt={`Monzo QR Code for ${product.name}`}
                        width={176}
                        height={176}
                        className="rounded-xl"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQr(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    >
                      Hide QR code
                    </button>
                  </div>
                )}
              </div>

              {/* Username Customizer Footer */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Receiving Monzo Username:</span>
                  <span className="font-mono text-slate-500">monzo.me/@{username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim().replace(/^@/, ""))}
                    placeholder="gsimeon"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 font-mono outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  />
                  <span className="text-[10px] text-slate-400">Configurable</span>
                </div>
              </div>
            </div>

            {/* Footer Trust Bar */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Monzo Bank UK Regulated
              </span>
              <span>No account required for card/Apple Pay</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
