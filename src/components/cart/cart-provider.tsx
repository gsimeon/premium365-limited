"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
export type CartLine = { productId: string; slug: string; name: string; priceMinor: number; currency: string; quantity: number };
type CartContextValue = { items: CartLine[]; count: number; add: (line: Omit<CartLine, "quantity">) => void; setQuantity: (productId: string, quantity: number) => void; remove: (productId: string) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);
const KEY = "premium365-cart-v1";
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { const raw = localStorage.getItem(KEY); if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) setItems(parsed.filter((x) => x && typeof x.productId === "string" && Number.isInteger(x.quantity) && x.quantity > 0)); } } catch { /* Ignore malformed local cart. */ } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, ready]);
  const add = useCallback((line: Omit<CartLine, "quantity">) => setItems((current) => { const existing = current.find((x) => x.productId === line.productId); if (existing) return current.map((x) => x.productId === line.productId ? { ...x, quantity: Math.min(20, x.quantity + 1) } : x); return [...current, { ...line, quantity: 1 }]; }), []);
  const setQuantity = useCallback((productId: string, quantity: number) => setItems((current) => quantity <= 0 ? current.filter((x) => x.productId !== productId) : current.map((x) => x.productId === productId ? { ...x, quantity: Math.min(20, Math.floor(quantity)) } : x)), []);
  const remove = useCallback((productId: string) => setItems((current) => current.filter((x) => x.productId !== productId)), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((n, x) => n + x.quantity, 0), add, setQuantity, remove, clear }), [items, add, setQuantity, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("useCart must be used inside CartProvider"); return value; }
