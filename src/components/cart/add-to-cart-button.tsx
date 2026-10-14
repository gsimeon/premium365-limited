"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";

export function AddToCartButton({
  product,
}: {
  product: { id: string; slug: string; name: string; price_minor: number; currency: string };
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceMinor: product.price_minor,
          currency: product.currency,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
      }}
      className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95 ${
        added
          ? "bg-emerald-600 text-white shadow-emerald-500/25"
          : "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700 hover:shadow-md"
      }`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
