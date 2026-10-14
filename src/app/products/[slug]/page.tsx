import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, RotateCcw, ArrowLeft, Cpu } from "lucide-react";
import { formatPrice, getActiveProductBySlug } from "@/lib/catalogue";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

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
        <h1 className="font-display text-3xl font-black text-white">Product Not Found</h1>
        <p className="mt-4 text-slate-400">The requested technology item is no longer available in the catalogue.</p>
        <Link href="/shop" className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500">
          ← Return to Shop
        </Link>
      </section>
    );
  }

  const product = result.product;

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      {/* Breadcrumbs */}
      <div className="border-b border-slate-900 bg-slate-900/40 py-3.5">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-blue-400">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-blue-400">Shop</Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Hardware Catalogue</span>
        </Link>

        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Product Image Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative h-96 sm:h-[480px] w-full overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900/80 shadow-2xl">
              <Image
                src={product.imageUrl || "/images/laptop-pro.jpg"}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                  {product.condition}
                </span>
                {product.badge && (
                  <span className="rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 p-4">
                <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>In Stock · Birmingham Warehouse</span>
                </div>
                <span className="text-xs text-slate-400">UK Dispatch</span>
              </div>
            </div>

            {/* Trust Assurances Under Image */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 text-center">
              <div>
                <Truck className="h-4 w-4 text-blue-400 mx-auto" />
                <p className="mt-1.5 text-xs font-bold text-white">Next-Day UK</p>
                <p className="text-[10px] text-slate-400">Tracked dispatch</p>
              </div>
              <div className="border-x border-slate-800">
                <ShieldCheck className="h-4 w-4 text-cyan-400 mx-auto" />
                <p className="mt-1.5 text-xs font-bold text-white">12-Mo Warranty</p>
                <p className="text-[10px] text-slate-400">Full parts & labor</p>
              </div>
              <div>
                <RotateCcw className="h-4 w-4 text-emerald-400 mx-auto" />
                <p className="mt-1.5 text-xs font-bold text-white">14-Day Returns</p>
                <p className="text-[10px] text-slate-400">Statutory policy</p>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Specification */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
                  {product.categories?.name ?? "Technology"}
                </span>
                {product.sku && (
                  <span className="font-mono text-xs text-slate-500 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {product.name}
              </h1>

              {/* Price Tag */}
              <div className="flex items-baseline gap-3 pt-2">
                <p className="font-display text-4xl font-black text-white">
                  {formatPrice(product.price_minor, product.currency)}
                </p>
                <span className="text-xs text-slate-400 font-medium">GBP Inc. UK VAT / Delivery</span>
              </div>

              <p className="text-sm leading-relaxed text-slate-300 pt-1">
                {product.summary}
              </p>

              {/* Purchase Actions Container */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span>Fulfilment Method:</span>
                  <span className="font-bold text-blue-400">
                    {product.fulfilment_type === "owned_stock" ? "Direct Birmingham Stock" : "Partner Fulfilled"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
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

                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="rounded-full border border-slate-700 bg-slate-800/80 px-6 py-3 text-xs font-bold text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
                  >
                    Request Business Quote
                  </Link>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Safe Checkout: Stripe & PayPal</span>
                  <span>Free standard delivery on this item</span>
                </div>
              </div>

              {/* Extended Description */}
              {product.description && (
                <div className="pt-4 space-y-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Overview & Capabilities</h2>
                  <p className="text-sm leading-relaxed text-slate-400 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Technical Specifications Table */}
            {product.specs && (
              <div className="pt-6 border-t border-slate-900 space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-400" />
                  <span>Technical Specifications</span>
                </h2>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 divide-y divide-slate-800/80 text-xs">
                  {Object.entries(product.specs).map(([label, value]) => (
                    <div key={label} className="grid grid-cols-3 p-3.5">
                      <span className="font-medium text-slate-400">{label}</span>
                      <span className="col-span-2 font-semibold text-slate-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
