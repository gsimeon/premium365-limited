import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, RotateCcw, SlidersHorizontal } from "lucide-react";
import { getActiveProducts } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

export const metadata = {
  title: "Shop Enterprise Technology | Premium 365 Limited",
  description:
    "Curated selection of enterprise business laptops, 4K monitors, cloud routers, NAS storage, and productivity peripherals. UK delivery with 12-month warranty.",
};

type SearchParams = Promise<{ category?: string; condition?: string; q?: string }>;

const categories = [
  { slug: "all", label: "All Technology" },
  { slug: "computers-laptops", label: "Computers & Laptops" },
  { slug: "accessories", label: "Peripherals & Accessories" },
  { slug: "networking-storage", label: "Networking & Storage" },
];

export default async function Shop({ searchParams }: { searchParams: SearchParams }) {
  const { category = "all", condition = "all", q = "" } = await searchParams;
  const result = await getActiveProducts();

  // Filter products by category, condition, and search query
  const filteredProducts = result.products.filter((p) => {
    const matchesCategory =
      category === "all" ||
      p.category_id === category ||
      p.categories?.name.toLowerCase().includes(category.replace("-", " "));

    const matchesCondition = condition === "all" || p.condition === condition;

    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.summary && p.summary.toLowerCase().includes(q.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(q.toLowerCase()));

    return matchesCategory && matchesCondition && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-900 bg-slate-900/60 py-16 sm:py-20">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                UK Hardware Procurement
              </span>
              <h1 className="mt-2 font-display text-4xl sm:text-5xl font-black text-white">
                Technology, selected with purpose.
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-300">
                Explore our curated range of commercial-grade laptops, displays, networking equipment, and secure storage solutions.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-300 backdrop-blur-md">
              <span className="font-bold text-white">🇬🇧 UK Stock</span> · Prices in GBP (includes warranty)
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-10">
        {/* Filter and Search Navigation */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-900 pb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = category === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}${condition !== "all" ? `&condition=${condition}` : ""}`}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "border border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Condition Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Condition:
            </span>
            {[
              { slug: "all", label: "All" },
              { slug: "new", label: "Brand New" },
              { slug: "refurbished", label: "Refurbished (Grade A)" },
            ].map((c) => {
              const isActive = condition === c.slug;
              return (
                <Link
                  key={c.slug}
                  href={`/shop?category=${category}&condition=${c.slug}`}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-slate-800 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="my-16 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
            <h3 className="font-display text-2xl font-bold text-white">No products found</h3>
            <p className="mt-2 text-sm text-slate-400">
              No products match your current filter criteria.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-500"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                {/* Product Image Box */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                  <Image
                    src={product.imageUrl || "/images/laptop-pro.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300">
                      {product.condition}
                    </span>
                    {product.badge && (
                      <span className="rounded-full bg-blue-600/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-4">
                    <span className="rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                      In Stock · UK Dispatch
                    </span>
                  </div>
                </div>

                {/* Details Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>{product.categories?.name ?? "Technology"}</span>
                    {product.sku && <span className="font-mono text-[11px] text-slate-500">{product.sku}</span>}
                  </div>

                  <h2 className="mt-2 font-display text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {product.name}
                  </h2>

                  <p className="mt-2.5 flex-1 text-xs leading-relaxed text-slate-400 line-clamp-3">
                    {product.summary}
                  </p>

                  {/* Specs Quick Peek */}
                  {product.specs && (
                    <div className="mt-4 border-t border-slate-800/80 pt-3 space-y-1 text-[11px] text-slate-400">
                      {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-500">{key}:</span>
                          <span className="font-medium text-slate-300 truncate max-w-[170px]">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing and Action */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Price GBP</span>
                      <p className="text-2xl font-black text-white">
                        {formatPrice(product.price_minor, product.currency)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <AddToCartButton
                        product={{
                          id: product.id,
                          slug: product.slug,
                          name: product.name,
                          price_minor: product.price_minor,
                          currency: product.currency,
                        }}
                      />
                      <Link
                        href={`/products/${product.slug}`}
                        className="rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-200 transition-colors hover:border-blue-500 hover:text-white"
                      >
                        Details ↗
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Why Buy From Premium 365 Banner */}
        <div className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/50 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-white">Enterprise Standards for Every Order</h3>
            <p className="mt-2 text-sm text-slate-400">
              Direct procurement backing from our Birmingham engineering team.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3 text-center">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
              <Truck className="h-6 w-6 text-blue-400 mx-auto" />
              <h4 className="mt-3 font-bold text-white text-sm">Insured Next-Day Dispatch</h4>
              <p className="mt-1 text-xs text-slate-400">Royal Mail 24 Tracked and DPD Express across the UK mainland.</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
              <ShieldCheck className="h-6 w-6 text-cyan-400 mx-auto" />
              <h4 className="mt-3 font-bold text-white text-sm">12-Month Hardware Guarantee</h4>
              <p className="mt-1 text-xs text-slate-400">All new and certified refurbished machines include full warranty.</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6">
              <RotateCcw className="h-6 w-6 text-emerald-400 mx-auto" />
              <h4 className="mt-3 font-bold text-white text-sm">14-Day Statutory Returns</h4>
              <p className="mt-1 text-xs text-slate-400">Full statutory consumer protection and business return rights.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
