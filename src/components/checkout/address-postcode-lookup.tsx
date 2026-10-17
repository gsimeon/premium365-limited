"use client";

import { useState, useId, useMemo, useEffect, useCallback } from "react";
import { Search, MapPin, Building2, Home, Check, X, Loader2, ArrowRight } from "lucide-react";

export interface SelectedAddress {
  line1: string;
  city: string;
  postcode: string;
}

interface AddressItem {
  id: string;
  line1: string;
  city: string;
  postcode: string;
  display: string;
}

interface AddressLookupResponse {
  success?: boolean;
  postcode?: string;
  city?: string;
  street?: string;
  addresses?: AddressItem[];
  error?: string;
}

interface AddressPostcodeLookupProps {
  postcode: string;
  onPostcodeChange: (newPostcode: string) => void;
  onSelectAddress: (address: SelectedAddress) => void;
  onManualEntryClick?: () => void;
}

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2}$/i;

export function AddressPostcodeLookup({
  postcode,
  onPostcodeChange,
  onSelectAddress,
  onManualEntryClick,
}: AddressPostcodeLookupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupData, setLookupData] = useState<AddressLookupResponse | null>(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedDisplay, setSelectedDisplay] = useState<string | null>(null);

  const searchInputId = useId();

  const performLookup = useCallback(async (targetPostcode?: string) => {
    const pc = (targetPostcode ?? postcode).trim();
    if (!pc) {
      setError("Please enter a UK postcode first (e.g. B16 0LR or SW1A 2AA).");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFilterQuery("");

    try {
      const response = await fetch(`/api/address/lookup?postcode=${encodeURIComponent(pc)}`);
      const data: AddressLookupResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not find addresses for this postcode.");
      }

      setLookupData(data);
      if (data.postcode) {
        onPostcodeChange(data.postcode);
      }
      setIsOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find address.");
      setLookupData(null);
    } finally {
      setIsLoading(false);
    }
  }, [postcode, onPostcodeChange]);

  // Auto-trigger lookup as soon as a valid UK postcode is entered
  useEffect(() => {
    const trimmed = postcode.trim();
    if (UK_POSTCODE_REGEX.test(trimmed)) {
      const timer = setTimeout(() => {
        // Only auto-trigger if we don't already have data for this exact postcode
        if (lookupData?.postcode?.replace(/\s/g, "").toUpperCase() !== trimmed.replace(/\s/g, "").toUpperCase()) {
          void performLookup(trimmed);
        }
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [postcode, lookupData, performLookup]);

  // Close popup with Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Filter addresses based on user's live typing inside the popup
  const filteredAddresses = useMemo(() => {
    if (!lookupData?.addresses) return [];
    if (!filterQuery.trim()) return lookupData.addresses;

    const q = filterQuery.toLowerCase().trim();
    return lookupData.addresses.filter((item) =>
      item.line1.toLowerCase().includes(q) || item.display.toLowerCase().includes(q)
    );
  }, [lookupData, filterQuery]);

  // Check if custom house number was typed that isn't already directly matched
  const customPremiseOption = useMemo(() => {
    if (!filterQuery.trim() || !lookupData?.street || !lookupData?.city || !lookupData?.postcode) {
      return null;
    }
    const cleanQ = filterQuery.trim();
    const hasExact = filteredAddresses.some(
      (a) => a.line1.toLowerCase() === `${cleanQ} ${lookupData.street}`.toLowerCase()
    );
    if (hasExact) return null;

    const line1 = `${cleanQ} ${lookupData.street}`;
    return {
      id: "custom-premise",
      line1,
      city: lookupData.city,
      postcode: lookupData.postcode,
      display: `${line1}, ${lookupData.city}, ${lookupData.postcode}`,
    };
  }, [filterQuery, lookupData, filteredAddresses]);

  function handleSelect(item: { line1: string; city: string; postcode: string; display: string }) {
    onSelectAddress({
      line1: item.line1,
      city: item.city,
      postcode: item.postcode,
    });
    setSelectedDisplay(item.display);
    setIsOpen(false);
    setError(null);
  }

  return (
    <div className="space-y-2">
      {/* Postcode Input and Action Bar */}
      <div>
        <label
          htmlFor="checkout-postcode"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          UK Postcode <span className="text-blue-600">*</span>
        </label>
        <div className="mt-2 flex gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <MapPin className="h-4 w-4" />
            </div>
            <input
              id="checkout-postcode"
              required
              value={postcode}
              onChange={(e) => {
                onPostcodeChange(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void performLookup();
                }
              }}
              autoComplete="postal-code"
              placeholder="e.g. B16 0LR or SW1A 2AA"
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all uppercase font-medium shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={() => void performLookup()}
            disabled={isLoading || !postcode.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Searching…</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Find Address</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected Address Banner */}
      {selectedDisplay && !error && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="truncate">
              Selected: <strong className="font-semibold">{selectedDisplay}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="ml-2 font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0 cursor-pointer"
          >
            Change
          </button>
        </div>
      )}

      {/* Inline Quick Select Dropdown */}
      {lookupData?.addresses && lookupData.addresses.length > 0 && !isOpen && (
        <div className="pt-1 space-y-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Available Houses & Flats ({lookupData.addresses.length}):
          </label>
          <div className="flex gap-2">
            <select
              aria-label="Select address from list"
              onChange={(e) => {
                const item = lookupData.addresses?.find((a) => a.id === e.target.value);
                if (item) handleSelect(item);
              }}
              defaultValue=""
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>
                -- Select your house or flat --
              </option>
              {lookupData.addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.line1} ({a.city})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 shrink-0 cursor-pointer"
            >
              Open Popup Modal
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-start justify-between gap-2">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setError(null);
              onManualEntryClick?.();
            }}
            className="font-bold underline shrink-0 cursor-pointer hover:text-red-900"
          >
            Enter manually
          </button>
        </div>
      )}

      {/* Popup Modal / Available Houses Dialog */}
      {isOpen && lookupData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                  Address Lookup · {lookupData.postcode}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Select Delivery House / Unit
                </h3>
                <p className="text-xs text-slate-500">
                  {lookupData.street ? `${lookupData.street}, ` : ""}
                  {lookupData.city}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all cursor-pointer"
                aria-label="Close address picker"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* House / Flat Filter Search */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id={searchInputId}
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Type house number or flat (e.g. 14, Flat 3B)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                  autoFocus
                />
                {filterQuery && (
                  <button
                    type="button"
                    onClick={() => setFilterQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List of Available Houses / Premises */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-100/60">
              {/* Custom premise quick-select when user types specific number */}
              {customPremiseOption && (
                <button
                  type="button"
                  onClick={() => handleSelect(customPremiseOption)}
                  className="w-full text-left rounded-xl p-3 bg-blue-50/70 border border-blue-200 hover:bg-blue-100/70 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shrink-0">
                      <Home className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-950">
                        {customPremiseOption.line1}
                      </p>
                      <p className="text-[11px] text-blue-700">
                        {customPremiseOption.city}, {customPremiseOption.postcode}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-white px-2 py-1 rounded-md border border-blue-200 shrink-0">
                    Use This Address →
                  </span>
                </button>
              )}

              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelect(addr)}
                    className="w-full text-left rounded-xl p-2.5 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                        {addr.line1.toLowerCase().includes("flat") ||
                        addr.line1.toLowerCase().includes("unit") ? (
                          <Building2 className="h-3.5 w-3.5" />
                        ) : (
                          <Home className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {addr.line1}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {addr.city}, {addr.postcode}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))
              ) : (
                <div className="py-8 text-center px-4">
                  <p className="text-xs text-slate-600">
                    No exact house matched &ldquo;<strong>{filterQuery}</strong>&rdquo;.
                  </p>
                  {customPremiseOption ? null : (
                    <p className="mt-1 text-[11px] text-slate-400">
                      You can select the custom premise option above or enter your address manually.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/70 p-4 flex items-center justify-between text-xs text-slate-600">
              <span className="text-[11px] text-slate-500">
                Found {filteredAddresses.length} available addresses
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onManualEntryClick?.();
                }}
                className="font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Can&apos;t find your address? Enter manually
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
