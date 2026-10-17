import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, RotateCcw, SlidersHorizontal } from "lucide-react";
import { getActiveProducts } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { MonzoPayButton } from "@/components/monzo/monzo-pay-button";

export const metadata = {
  title: "Shop Enterprise Technology | Premium 365 Limited",
  description:
    "Curated selection of enterprise business laptops, 4K monitors, cloud routers, NAS storage, and productivity peripherals. UK delivery with 12-month warranty.",
};

type SearchParams = Promise<{
  category?: string;
  condition?: string;
  brand?: string;
  price?: string;
  q?: string;
}>;

const categories = [
  { slug: "all", label: "All Technology" },
  { slug: "computers-laptops", label: "Laptops & Workstations" },
  { slug: "networking-storage", label: "Networking & Storage" },
  { slug: "accessories", label: "Monitors & Peripherals" },
];

const brands = [
  "All",
  "Apple",
  "Lenovo",
  "Dell",
  "HP",
  "Microsoft",
  "Cisco",
  "Ubiquiti",
  "Synology",
  "QNAP",
  "Fortinet",
  "LG",
  "Samsung",
  "Logitech",
  "CalDigit",
];

const priceRanges = [
  { slug: "all", label: "All Prices" },
  { slug: "under-500", label: "Under £500" },
  { slug: "500-1000", label: "£500 – £1,000" },
  { slug: "1000-2000", label: "£1,000 – £2,000" },
  { slug: "over-2000", label: "£2,000+" },
];

export default async function Shop({ searchParams }: { searchParams: SearchParams }) {
  const {
    category = "all",
    condition = "all",
    brand = "All",
    price = "all",
    q = "",
  } = await searchParams;
  const result = await getActiveProducts();

  // Filter products by category, condition, brand, price range, and search query
  const filteredProducts = result.products.filter((p) => {
    const matchesCategory =
      category === "all" ||
      p.category_id === category ||
      p.categories?.name.toLowerCase().includes(category.replace("-", " "));

    const matchesCondition = condition === "all" || p.condition === condition;

    const matchesBrand = brand === "All" || (p.brand && p.brand.toLowerCase() === brand.toLowerCase());

    let matchesPrice = true;
    if (price === "under-500") matchesPrice = p.price_minor < 50000;
    else if (price === "500-1000") matchesPrice = p.price_minor >= 50000 && p.price_minor <= 100000;
    else if (price === "1000-2000") matchesPrice = p.price_minor > 100000 && p.price_minor <= 200000;
    else if (price === "over-2000") matchesPrice = p.price_minor > 200000;

    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.summary && p.summary.toLowerCase().includes(q.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(q.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(q.toLowerCase()));

    return matchesCategory && matchesCondition && matchesBrand && matchesPrice && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 py-14 sm:py-18">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                UK Hardware Procurement · Birmingham HQ
              </span>
              <h1 className="mt-2 font-display text-4xl sm:text-5xl font-black text-slate-900">
                Technology, selected with purpose.
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Explore our curated enterprise catalogue of genuine commercial laptops, ISV workstations, 10G networking gear, and precision displays.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 shadow-xs">
              <span className="font-bold text-slate-900">🇬🇧 24 Genuine UK Products</span> · Prices in GBP (inc. warranty & VAT)
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-10">
        {/* Filter and Search Navigation */}
        <div className="space-y-5 border-b border-slate-200 pb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = category === cat.slug;
                const queryParams = new URLSearchParams();
                if (cat.slug !== "all") queryParams.set("category", cat.slug);
                if (condition !== "all") queryParams.set("condition", condition);
                if (brand !== "All") queryParams.set("brand", brand);
                if (price !== "all") queryParams.set("price", price);
                const href = `/shop${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

                return (
                  <Link
                    key={cat.slug}
                    href={href}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-xs"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </div>

            {/* Condition Filter */}
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
                const queryParams = new URLSearchParams();
                if (category !== "all") queryParams.set("category", category);
                if (c.slug !== "all") queryParams.set("condition", c.slug);
                if (brand !== "All") queryParams.set("brand", brand);
                if (price !== "all") queryParams.set("price", price);
                const href = `/shop${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

                return (
                  <Link
                    key={c.slug}
                    href={href}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {c.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Secondary Filter Bar: Brands and Price Ranges */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Brand Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mr-1">Brand:</span>
              {brands.map((b) => {
                const isActive = brand.toLowerCase() === b.toLowerCase();
                const queryParams = new URLSearchParams();
                if (category !== "all") queryParams.set("category", category);
                if (condition !== "all") queryParams.set("condition", condition);
                if (b !== "All") queryParams.set("brand", b);
                if (price !== "all") queryParams.set("price", price);
                const href = `/shop${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

                return (
                  <Link
                    key={b}
                    href={href}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-xs"
                    }`}
                  >
                    {b}
                  </Link>
                );
              })}
            </div>

            {/* Price Ranges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mr-1">Budget:</span>
              {priceRanges.map((pr) => {
                const isActive = price === pr.slug;
                const queryParams = new URLSearchParams();
                if (category !== "all") queryParams.set("category", category);
                if (condition !== "all") queryParams.set("condition", condition);
                if (brand !== "All") queryParams.set("brand", brand);
                if (pr.slug !== "all") queryParams.set("price", pr.slug);
                const href = `/shop${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

                return (
                  <Link
                    key={pr.slug}
                    href={href}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-xs"
                    }`}
                  >
                    {pr.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Result Counter & Active Filter Reset */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> genuine UK enterprise products
            </span>
            {(category !== "all" || condition !== "all" || brand !== "All" || price !== "all") && (
              <Link href="/shop" className="text-blue-600 font-bold hover:underline">
                Clear all filters ×
              </Link>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="my-16 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <h3 className="font-display text-2xl font-bold text-slate-900">No products found</h3>
            <p className="mt-2 text-sm text-slate-500">
              No products match your current filter combination.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/20"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl"
              >
                {/* Product Image Box */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={product.imageUrl || "/images/laptop-pro.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 shadow-xs">
                      {product.condition}
                    </span>
                    {product.badge && (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-4">
                    <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 shadow-xs">
                      In Stock · UK Dispatch
                    </span>
                  </div>
                </div>

                {/* Details Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="text-blue-600 font-bold">{product.brand ?? "Enterprise"}</span>
                    {product.sku && <span className="font-mono text-[11px] text-slate-400">{product.sku}</span>}
                  </div>

                  <h2 className="mt-2 font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h2>

                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {product.summary}
                  </p>

                  {/* Specs Quick Peek */}
                  {product.specs && (
                    <div className="mt-4 border-t border-slate-100 pt-3 space-y-1 text-[11px] text-slate-600">
                      {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-slate-400">{key}:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[170px]">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing and Action */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price GBP</span>
                      <p className="text-2xl font-black text-slate-900">
                        {formatPrice(product.price_minor, product.currency)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MonzoPayButton
                        product={{
                          id: product.id,
                          name: product.name,
                          price_minor: product.price_minor,
                          sku: product.sku,
                          currency: product.currency,
                        }}
                        variant="pill"
                      />
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
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Specs ↗
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Why Buy From Premium 365 Banner */}
        <div className="mt-20 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-slate-900">Enterprise Standards for Every Order</h3>
            <p className="mt-2 text-sm text-slate-600">
              Direct procurement backing from our Birmingham engineering team.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3 text-center">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <Truck className="h-6 w-6 text-blue-600 mx-auto" />
              <h4 className="mt-3 font-bold text-slate-900 text-sm">Insured Next-Day Dispatch</h4>
              <p className="mt-1 text-xs text-slate-600">Royal Mail 24 Tracked and DPD Express across the UK mainland.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <ShieldCheck className="h-6 w-6 text-cyan-600 mx-auto" />
              <h4 className="mt-3 font-bold text-slate-900 text-sm">12-Month Hardware Guarantee</h4>
              <p className="mt-1 text-xs text-slate-600">All new and certified refurbished machines include full warranty.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <RotateCcw className="h-6 w-6 text-emerald-600 mx-auto" />
              <h4 className="mt-3 font-bold text-slate-900 text-sm">14-Day Statutory Returns</h4>
              <p className="mt-1 text-xs text-slate-600">Full statutory consumer protection and business return rights.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
