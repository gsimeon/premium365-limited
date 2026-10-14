"use client";
import { useState } from "react";
import { useCart } from "./cart-provider";
export function AddToCartButton({ product }: { product: { id: string; slug: string; name: string; price_minor: number; currency: string } }) {
  const { add } = useCart(); const [added, setAdded] = useState(false);
  return <button type="button" onClick={() => { add({ productId: product.id, slug: product.slug, name: product.name, priceMinor: product.price_minor, currency: product.currency }); setAdded(true); }} className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500">{added ? "Added to cart ✓" : "Add to cart"}</button>;
}
