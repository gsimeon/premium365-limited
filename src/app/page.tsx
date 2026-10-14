import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Cpu, Database, Cloud, Terminal, CheckCircle2, ChevronRight, Zap, Star } from "lucide-react";
import { getActiveProducts } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

export default async function Home() {
  const { products } = await getActiveProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="relative overflow-hidden bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-8 pb-20 lg:pt-14 lg:pb-28">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[550px] w-[550px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/90 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span>UK Enterprise Technology Partner</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600 font-medium">Birmingham, B16 0LR</span>
              </div>

              <h1 className="font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl xl:text-7xl leading-[1.08]">
                Make technology work <span className="text-gradient">harder, smarter & faster</span> for your business.
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
                Premium 365 Limited delivers curated enterprise hardware, tailored cloud & cybersecurity engineering, business intelligence dashboards, and accredited professional training for ambitious UK teams.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  id="hero-shop-cta"
                  className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 hover:gap-3"
                >
                  <span>Explore Hardware Shop</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/services"
                  id="hero-services-cta"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-blue-400 hover:bg-slate-50 hover:text-blue-700"
                >
                  <span>Explore IT Services</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Next-Day UK Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>12-Month Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-600 shrink-0" />
                  <span>Cyber Essentials Aligned</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Subtle Glow framing */}
                <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-blue-500/20 via-cyan-400/20 to-indigo-500/20 blur-xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
                  {/* Image showcase */}
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-100">
                    <Image
                      src="/images/hero-tech.jpg"
                      alt="Premium 365 Enterprise Hardware and Engineering Desk Setup"
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1 text-xs font-bold text-blue-700 shadow-xs">
                        Enterprise Grade
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Highlights */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Full Lifecycle IT</p>
                        <h2 className="text-lg font-bold text-slate-900">Hardware · Cloud · Security</h2>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        <span className="text-slate-700">5.0 UK Rated</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">HARDWARE</p>
                        <p className="mt-1 text-sm font-bold text-slate-900">Curated Workstations</p>
                        <p className="mt-0.5 text-[11px] text-slate-600">Lenovo, Apple, Dell & Cisco</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[11px] font-bold text-slate-500 uppercase">SOLUTIONS</p>
                        <p className="mt-1 text-sm font-bold text-slate-900">Zero-Trust Security</p>
                        <p className="mt-0.5 text-[11px] text-slate-600">Power BI & Cloud Migration</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">Stripe & PayPal Protected</span>
                      <Link href="/about" className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <span>Learn our story</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE PILLARS SECTION */}
      <section className="relative py-24 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Our Comprehensive Ecosystem</span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-slate-900">
              Everything your team needs to thrive in modern IT.
            </h2>
            <p className="text-base text-slate-600">
              We bridge the gap between physical hardware procurement, digital software delivery, and human capability development.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Cpu className="h-7 w-7" />
              </div>
              <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-slate-400">Pillar 01</span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Curated Technology Shop</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Rigorous selection of premium business laptops, 4K monitors, enterprise networking, and backup storage configured for commercial reliability.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>ThinkPad, MacBook Pro & Dell UltraSharp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>Brand New & Certified Refurbished</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>Full 12-Month Hardware Guarantee</span>
                </li>
              </ul>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 font-bold text-sm text-blue-600 group-hover:text-blue-700"
              >
                <span>Browse Catalogue</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400 hover:shadow-xl">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200/80 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-slate-400">Pillar 02</span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">IT Services & Consulting</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Hands-on software development, cybersecurity reviews, cloud migration, and automated Power BI reporting tailored to solve real operational bottlenecks.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600" />
                  <span>Cyber Essentials & Zero-Trust Auditing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600" />
                  <span>Custom Web Apps & System Integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600" />
                  <span>Executive BI Dashboards & Pipelines</span>
                </li>
              </ul>
              <Link
                href="/services"
                className="mt-8 inline-flex items-center gap-2 font-bold text-sm text-cyan-600 group-hover:text-cyan-700"
              >
                <span>Explore IT Services</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-400 hover:shadow-xl">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Terminal className="h-7 w-7" />
              </div>
              <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-slate-400">Pillar 03</span>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Premium 365 Academy</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Practical, career-focused training modules in cybersecurity foundations, data analysis with Power BI, cloud computing, and enterprise automation.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>Corporate cohort & executive formats</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>Real-world hands-on lab projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>Verified course completion credentials</span>
                </li>
              </ul>
              <Link
                href="/academy"
                className="mt-8 inline-flex items-center gap-2 font-bold text-sm text-indigo-600 group-hover:text-indigo-700"
              >
                <span>View Academy Courses</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SHOWCASE */}
      <section className="relative py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Curated Launch Catalogue</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
                Featured Business Technology
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base">
                Tested, verified, and backed by Premium 365 UK support.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>View full catalogue (24 products)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={product.imageUrl || "/images/laptop-pro.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="rounded-full bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 shadow-xs">
                      {product.condition}
                    </span>
                    {product.badge && (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{product.categories?.name ?? "Hardware"}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {product.summary}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Price GBP</span>
                      <p className="text-xl font-black text-slate-900">
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
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VISUAL IT SERVICES HIGHLIGHT */}
      <section className="relative py-24 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Visual Box */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-2 shadow-xl">
              <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-[2rem] bg-slate-100">
                <Image
                  src="/images/cybersecurity.jpg"
                  alt="Enterprise Cybersecurity & Zero-Trust Defense"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 border border-slate-200 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Cybersecurity & Resilient Systems</p>
                      <p className="text-xs text-slate-600">Zero-trust architecture, Cyber Essentials, and vulnerability audits.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Enterprise Solutions</span>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
                Modernise without the guesswork.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Whether you need a dedicated development sprint, an impartial security posture review, or real-time business intelligence to drive decisions, our Birmingham-based consultancy delivers tangible outcomes.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Database className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Power BI & Data Engineering</h3>
                    <p className="mt-0.5 text-xs text-slate-600">Consolidate disparate spreadsheets and operational databases into executive dashboards.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Cloud className="h-5 w-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Cloud Architecture & Migration</h3>
                    <p className="mt-0.5 text-xs text-slate-600">Secure AWS, Microsoft Azure, and Supabase migrations designed for scale and low latency.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-700 shadow-md shadow-blue-600/25"
                >
                  View All IT Services
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition-all hover:bg-slate-50 hover:border-blue-400"
                >
                  Book Discovery Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="relative py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 sm:p-14 text-white shadow-2xl">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Let’s Collaborate</span>
              <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Ready to take your technology to the next level?
              </h2>
              <p className="text-base text-blue-100 leading-relaxed">
                Connect with our team to discuss hardware volume discounts, custom IT delivery schedules, or bespoke training programmes.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  id="cta-contact-button"
                  className="rounded-full bg-white px-7 py-4 text-sm font-bold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
                >
                  Speak With Our Team
                </Link>
                <Link
                  href="/shop"
                  className="rounded-full border border-white/30 bg-blue-800/40 px-7 py-4 text-sm font-bold text-white transition-all hover:bg-white/15"
                >
                  Shop Hardware
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
