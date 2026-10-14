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
    <div className="relative overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-950 pt-8 pb-20 lg:pt-14 lg:pb-32">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[550px] w-[550px] rounded-full bg-blue-600/20 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                <span>UK Enterprise Technology Partner</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">Birmingham, B16 0LR</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl xl:text-7xl leading-[1.08]">
                Make technology work <span className="text-gradient">harder, smarter & faster</span> for your business.
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
                Premium 365 Limited delivers curated enterprise hardware, tailored cloud & cybersecurity engineering, business intelligence dashboards, and accredited professional training for ambitious UK teams.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  id="hero-shop-cta"
                  className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/50 hover:gap-3"
                >
                  <span>Explore Hardware Shop</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/services"
                  id="hero-services-cta"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-7 py-4 text-sm font-bold text-slate-200 backdrop-blur-md transition-all hover:border-blue-500 hover:bg-slate-800 hover:text-white"
                >
                  <span>Explore IT Services</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-900 grid grid-cols-3 gap-4 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Next-Day UK Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>12-Month Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400 shrink-0" />
                  <span>Cyber Essentials Aligned</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow framing */}
                <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-600 opacity-30 blur-xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
                  {/* Image showcase */}
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-950">
                    <Image
                      src="/images/hero-tech.jpg"
                      alt="Premium 365 Enterprise Hardware and Engineering Desk Setup"
                      fill
                      priority
                      className="object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/80 px-3 py-1 text-xs font-semibold text-blue-300">
                        Enterprise Grade
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Highlights */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Full Lifecycle IT</p>
                        <h2 className="text-lg font-bold text-white">Hardware · Cloud · Security</h2>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>5.0 UK Rated</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-[11px] font-semibold text-slate-400">HARDWARE</p>
                        <p className="mt-1 text-sm font-bold text-slate-200">Curated Workstations</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">Lenovo, Apple, Dell & Cisco</p>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-[11px] font-semibold text-slate-400">SOLUTIONS</p>
                        <p className="mt-1 text-sm font-bold text-slate-200">Zero-Trust Security</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">Power BI & Cloud Migration</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-slate-400">Stripe & PayPal Protected</span>
                      <Link href="/about" className="font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
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
      <section className="relative py-24 bg-slate-900/60 border-y border-slate-900">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-400">Our Comprehensive Ecosystem</span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white">
              Everything your team needs to thrive in modern IT.
            </h2>
            <p className="text-base text-slate-400">
              We bridge the gap between physical hardware procurement, digital software delivery, and human capability development.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="group relative rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/50 hover:shadow-glow">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Cpu className="h-7 w-7" />
              </div>
              <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-slate-500">Pillar 01</span>
              <h3 className="mt-2 text-2xl font-bold text-white">Curated Technology Shop</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Rigorous selection of premium business laptops, 4K monitors, enterprise networking, and backup storage configured for commercial reliability.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span>ThinkPad, MacBook Pro & Dell UltraSharp</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span>Brand New & Certified Refurbished</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <span>Full 12-Month Hardware Guarantee</span>
                </li>
              </ul>
              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-2 font-bold text-sm text-blue-400 group-hover:text-blue-300"
              >
                <span>Browse Catalogue</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="group relative rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-glow-cyan">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-slate-500">Pillar 02</span>
              <h3 className="mt-2 text-2xl font-bold text-white">IT Services & Consulting</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Hands-on software development, cybersecurity reviews, cloud migration, and automated Power BI reporting tailored to solve real operational bottlenecks.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Cyber Essentials & Zero-Trust Auditing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Custom Web Apps & System Integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Executive BI Dashboards & Pipelines</span>
                </li>
              </ul>
              <Link
                href="/services"
                className="mt-8 inline-flex items-center gap-2 font-bold text-sm text-cyan-400 group-hover:text-cyan-300"
              >
                <span>Explore IT Services</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="group relative rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-glow">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Terminal className="h-7 w-7" />
              </div>
              <span className="mt-6 block text-xs font-bold uppercase tracking-widest text-slate-500">Pillar 03</span>
              <h3 className="mt-2 text-2xl font-bold text-white">Premium 365 Academy</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Practical, career-focused training modules in cybersecurity foundations, data analysis with Power BI, cloud computing, and enterprise automation.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                  <span>Corporate cohort & executive formats</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                  <span>Real-world hands-on lab projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                  <span>Verified course completion credentials</span>
                </li>
              </ul>
              <Link
                href="/academy"
                className="mt-8 inline-flex items-center gap-2 font-bold text-sm text-indigo-400 group-hover:text-indigo-300"
              >
                <span>View Academy Courses</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SHOWCASE */}
      <section className="relative py-24 bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-400">Curated Launch Catalogue</span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white">
                Featured Business Technology
              </h2>
              <p className="mt-2 text-slate-400 text-sm sm:text-base">
                Tested, verified, and backed by Premium 365 UK support.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View full catalogue (6 products)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700"
              >
                {/* Product Image */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                  <Image
                    src={product.imageUrl || "/images/laptop-pro.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300">
                      {product.condition}
                    </span>
                    {product.badge && (
                      <span className="rounded-full bg-blue-600/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold text-slate-400">{product.categories?.name ?? "Hardware"}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-400 line-clamp-3">
                    {product.summary}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Price GBP</span>
                      <p className="text-xl font-extrabold text-white">
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
                        className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-200 transition-colors hover:border-blue-500 hover:text-white"
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
      <section className="relative py-24 bg-slate-900/40 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Visual Box */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-950 p-2 shadow-2xl">
              <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-[2rem]">
                <Image
                  src="/images/cybersecurity.jpg"
                  alt="Enterprise Cybersecurity & Zero-Trust Defense"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-cyan-400" />
                    <div>
                      <p className="text-sm font-bold text-white">Cybersecurity & Resilient Systems</p>
                      <p className="text-xs text-slate-400">Zero-trust architecture, Cyber Essentials, and vulnerability audits.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-400">Enterprise Solutions</span>
              <h2 className="font-display text-3xl sm:text-5xl font-black text-white leading-tight">
                Modernise without the guesswork.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                Whether you need a dedicated development sprint, an impartial security posture review, or real-time business intelligence to drive decisions, our Birmingham-based consultancy delivers tangible outcomes.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                  <Database className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Power BI & Data Engineering</h3>
                    <p className="mt-0.5 text-xs text-slate-400">Consolidate disparate spreadsheets and operational databases into executive dashboards.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                  <Cloud className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Cloud Architecture & Migration</h3>
                    <p className="mt-0.5 text-xs text-slate-400">Secure AWS, Microsoft Azure, and Supabase migrations designed for scale and low latency.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="rounded-full bg-cyan-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  View All IT Services
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 transition-all hover:border-slate-600 hover:text-white"
                >
                  Book Discovery Call
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="relative py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 sm:p-14 text-white shadow-2xl">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">Let’s Collaborate</span>
              <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Ready to take your technology to the next level?
              </h2>
              <p className="text-base text-blue-50 leading-relaxed">
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
                  className="rounded-full border border-white/30 bg-blue-700/40 px-7 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
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
