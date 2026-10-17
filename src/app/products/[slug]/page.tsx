import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, RotateCcw, ArrowLeft, Cpu } from "lucide-react";
import { formatPrice, getActiveProductBySlug } from "@/lib/catalogue";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { MonzoPayButton } from "@/components/monzo/monzo-pay-button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getActiveProductBySlug(slug);
  return {
    title: product ? `${product.name} | Premium 365 Hardware` : "Product Details | Premium 365",
    description: product?.summary ?? "Enterprise technology hardware curated by Premium 365 Limited.",
  };
}

export default async function ProductDetail({ params }: Props) {
  const { slug } = await params;
  const result = await getActiveProductBySlug(slug);

  if (!result.product && result.configured) notFound();

  if (!result.product) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-black text-slate-900">Product Not Found</h1>
        <p className="mt-4 text-slate-600">The requested technology item is no longer available in the catalogue.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 shadow-md">
          ← Return to Shop
        </Link>
      </section>
    );
  }

  const product = result.product;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Breadcrumbs */}
      <div className="border-b border-slate-200 bg-white py-3.5">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-blue-600">Shop</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Hardware Catalogue</span>
        </Link>

        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative h-96 sm:h-[480px] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl">
              <Image
                src={product.imageUrl || "/images/laptop-pro.jpg"}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
              
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-xs">
                  {product.condition}
                </span>
                {product.badge && (
                  <span className="rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 p-4 shadow-md">
                <div className="flex items-center gap-2.5 text-xs text-emerald-700 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>In Stock · Birmingham Warehouse</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">UK Dispatch</span>
              </div>
            </div>

            {/* Trust Assurances Under Image */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <div>
                <Truck className="h-4 w-4 text-blue-600 mx-auto" />
                <p className="mt-1.5 text-xs font-bold text-slate-900">Next-Day UK</p>
                <p className="text-[10px] text-slate-500">Tracked dispatch</p>
              </div>
              <div className="border-x border-slate-200">
                <ShieldCheck className="h-4 w-4 text-cyan-600 mx-auto" />
                <p className="mt-1.5 text-xs font-bold text-slate-900">12-Mo Warranty</p>
                <p className="text-[10px] text-slate-500">Full parts & labor</p>
              </div>
              <div>
                <RotateCcw className="h-4 w-4 text-emerald-600 mx-auto" />
                <p className="mt-1.5 text-xs font-bold text-slate-900">14-Day Returns</p>
                <p className="text-[10px] text-slate-500">Statutory policy</p>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Specification */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                  {product.categories?.name ?? "Technology"}
                </span>
                {product.sku && (
                  <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Price Tag */}
              <div className="flex items-baseline gap-3 pt-2">
                <p className="font-display text-4xl font-black text-slate-900">
                  {formatPrice(product.price_minor, product.currency)}
                </p>
                <span className="text-xs text-slate-500 font-medium">GBP Inc. UK VAT / Delivery</span>
              </div>

              <p className="text-sm leading-relaxed text-slate-600 pt-1">
                {product.summary}
              </p>

              {/* Purchase Actions Container */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Fulfilment Method:</span>
                  <span className="font-bold text-blue-700">
                    {product.fulfilment_type === "owned_stock" ? "Direct Birmingham Stock" : "Partner Fulfilled"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="flex-1">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price_minor: product.price_minor,
                        currency: product.currency,
                      }}
                    />
                  </div>

                  <MonzoPayButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price_minor: product.price_minor,
                      sku: product.sku,
                      currency: product.currency,
                    }}
                    variant="primary"
                    className="w-full sm:w-auto"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="text-xs font-bold text-slate-700 hover:text-blue-600 underline"
                  >
                    Request Bespoke Business Quote / B2B PO →
                  </Link>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Free UK Courier Dispatch
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>Fast Instant Payments: Monzo.me · Apple Pay · Card</span>
                  <span>12-Month UK Warranty</span>
                </div>
              </div>

              {/* Extended Description */}
              {product.description && (
                <div className="pt-4 space-y-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Overview & Capabilities</h2>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Technical Specifications Table */}
            {product.specs && (
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-600" />
                  <span>Technical Specifications</span>
                </h2>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 text-xs shadow-xs">
                  {Object.entries(product.specs).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-3 p-3.5">
                      <span className="font-medium text-slate-500">{label}</span>
                      <span className="col-span-2 font-semibold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Technology Recommendations */}
        <div className="mt-24 border-t border-slate-200 pt-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
                Alternative Hardware
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                Frequently Paired & Similar Equipment
              </h3>
            </div>
            <Link href="/shop" className="text-xs font-bold text-blue-600 hover:underline">
              View All 24 Products →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                name: "Dell UltraSharp 32 4K USB-C Hub Monitor",
                slug: "dell-ultrasharp-32-4k-hub-monitor",
                price_minor: 72900,
                category: "Accessories",
                image: "/images/analytics.jpg",
                condition: "Brand New",
              },
              {
                name: "CalDigit TS4 Thunderbolt 4 Station (18 Ports, 98W)",
                slug: "caldigit-ts4-docking-station",
                price_minor: 36900,
                category: "Peripherals",
                image: "/images/laptop-pro.jpg",
                condition: "Brand New",
              },
              {
                name: "Logitech MX Master 3S Mouse & Mechanical Keys Combo",
                slug: "logitech-mx-master-3s-combo",
                price_minor: 18900,
                category: "Accessories",
                image: "/images/laptop-pro.jpg",
                condition: "Brand New",
              },
            ].map((rel) => (
              <Link
                key={rel.slug}
                href={`/products/${rel.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg shadow-xs"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={rel.image}
                    alt={rel.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200 shadow-xs">
                    {rel.condition}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-[10px] font-mono text-slate-500">{rel.category}</span>
                  <h4 className="font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {rel.name}
                  </h4>
                  <p className="mt-1 font-extrabold text-blue-600 text-sm">
                    {formatPrice(rel.price_minor, "GBP")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
