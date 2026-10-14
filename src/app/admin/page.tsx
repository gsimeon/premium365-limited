import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, formatPrice } from "@/lib/catalogue";
import { createProductAction, updateInventoryAction, updateProductAction } from "./actions";

export const metadata = { title: "Catalogue Administration | Premium 365 Limited" };

type SearchParams = Promise<{ error?: string; success?: string }>;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">Setup Verification</span>
          <h1 className="font-display text-3xl font-extrabold text-white">Database Configuration Pending</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Configure your Supabase credentials in <code className="rounded bg-slate-950 px-2 py-0.5 text-blue-400 font-mono text-xs">.env.local</code> and apply migrations 001–009 to manage live product listings and inventory records.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 shadow-md transition-all"
            >
              Continue to Staff Sign In ↗
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">Authentication Required</span>
          <h1 className="font-display text-3xl font-extrabold text-white">Staff Sign In Required</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sign in with the email address registered to your Premium 365 staff profile. Access is granted only to accounts with staff or admin privileges.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 shadow-md transition-all"
            >
              Proceed to Sign In ↗
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["staff", "admin"].includes(profile.role)) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24">
        <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">Access Denied</span>
          <h1 className="font-display text-3xl font-extrabold text-white">Authorisation Required</h1>
          <p className="text-sm text-red-200 leading-relaxed">
            Your account is authenticated, but your profile lacks the required staff or administrator role. Please ask your database administrator to update your role in public.profiles.
          </p>
        </div>
      </div>
    );
  }

  const [{ data: categories }, { data: products, error }] = await Promise.all([
    supabase.from("categories").select("id,name").eq("is_active", true).order("sort_order"),
    supabase
      .from("products")
      .select("id,name,slug,summary,description,sku,price_minor,currency,condition,fulfilment_type,status,category_id,inventory(quantity_on_hand,reorder_level,quantity_reserved)")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-slate-900 pb-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
            Premium 365 Operations · Operations Portal
          </span>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-white">
            Catalogue & Inventory Management
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Authenticated as: <strong className="text-slate-200">{profile.full_name || user.email}</strong> · Role: <span className="text-blue-400 font-bold uppercase">{profile.role}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <Link href="/admin/orders" className="text-blue-400 hover:text-blue-300 transition-colors">
            Order Fulfilment (008) ↗
          </Link>
          <span className="text-slate-700">|</span>
          <Link href="/shop" className="text-slate-400 hover:text-white transition-colors">
            Live Public Shop ↗
          </Link>
        </div>
      </div>

      {params.error && (
        <div role="alert" className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200">
          {params.error}
        </div>
      )}

      {params.success && (
        <div role="status" className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-xs text-emerald-200">
          {params.success === "product-created"
            ? "Product and initial inventory created."
            : params.success === "product-updated"
            ? "Product details updated."
            : "Inventory and reorder levels updated."}
        </div>
      )}

      {error && (
        <div role="alert" className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200">
          Could not load catalogue records. Check that all migrations (001–007) have been applied.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Create Product Form */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-4 shadow-xl">
          <div>
            <h2 className="font-display text-xl font-bold text-white">Add New Product</h2>
            <p className="mt-1 text-xs text-slate-400">
              Prices are entered in GBP pounds. Product and stock rows are committed atomically with an audit log record.
            </p>
          </div>

          <form action={createProductAction} className="mt-6 space-y-4">
            <Field label="Product Name" name="name" placeholder="e.g. Lenovo ThinkPad X1 Carbon" required />
            <Field label="URL Slug" name="slug" placeholder="lenovo-thinkpad-x1-carbon" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
            <Field label="SKU (Optional)" name="sku" placeholder="P365-LAP-001" />
            <Field label="Price (GBP £)" name="price" type="number" placeholder="1599.00" required min="0" step="0.01" />

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Category
              <select
                name="categoryId"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Uncategorised</option>
                {(categories ?? []).map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Condition"
                name="condition"
                values={[
                  ["new", "New"],
                  ["refurbished", "Refurbished"],
                  ["used", "Used"],
                ]}
              />
              <SelectField
                label="Fulfilment"
                name="fulfilmentType"
                values={[
                  ["owned_stock", "Owned stock"],
                  ["supplier_fulfilled", "Supplier fulfilled"],
                  ["mixed", "Mixed"],
                ]}
              />
            </div>

            <SelectField
              label="Publication Status"
              name="status"
              values={[
                ["draft", "Draft (Hidden)"],
                ["active", "Published (Live in Shop)"],
                ["archived", "Archived"],
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Initial Stock" name="quantity" type="number" defaultValue="0" min="0" step="1" required />
              <Field label="Reorder Level" name="reorderLevel" type="number" defaultValue="0" min="0" step="1" required />
            </div>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Summary (1–2 sentences)
              <textarea
                name="summary"
                rows={2}
                placeholder="High-level product summary..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Full Description
              <textarea
                name="description"
                rows={3}
                placeholder="Detailed specifications, warranty information, and package contents..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all"
            >
              Save Product & Allocate Stock
            </button>
          </form>
        </div>

        {/* Right Column: Existing Products List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Live Products & Stock</h2>
            <span className="text-xs text-slate-400 font-mono">{products?.length ?? 0} record(s)</span>
          </div>

          {!products?.length ? (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
              No product rows currently in database. Use the form on the left to add a product or verify migrations.
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const stock = Array.isArray(product.inventory) ? product.inventory[0] : product.inventory;
                return (
                  <article
                    key={product.id}
                    className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-3 shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-base font-bold text-white">{product.name}</h3>
                        <p className="font-mono text-[11px] text-slate-400">
                          /{product.slug} {product.sku ? `· SKU ${product.sku}` : "· No SKU"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          product.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : product.status === "draft"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <p className="font-bold text-slate-200">
                        {formatPrice(product.price_minor, product.currency)}{" "}
                        <span className="font-normal text-slate-400">
                          · {product.condition} · {product.fulfilment_type.replace(/_/g, " ")}
                        </span>
                      </p>

                      <p className="text-[11px] text-slate-400">
                        On Hand: <strong className="text-white">{stock?.quantity_on_hand ?? 0}</strong> · Reserved:{" "}
                        <strong className="text-amber-400">{stock?.quantity_reserved ?? 0}</strong> · Reorder:{" "}
                        <strong className="text-slate-300">{stock?.reorder_level ?? 0}</strong>
                      </p>
                    </div>

                    {/* Edit Accordion */}
                    <details className="mt-3 border-t border-slate-800 pt-3">
                      <summary className="cursor-pointer text-xs font-bold text-blue-400 hover:text-blue-300">
                        Edit Product Details
                      </summary>
                      <form action={updateProductAction} className="mt-4 space-y-3">
                        <input type="hidden" name="id" value={product.id} />
                        <Field label="Name" name="name" defaultValue={product.name} required />
                        <Field label="Slug" name="slug" defaultValue={product.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
                        <Field label="SKU" name="sku" defaultValue={product.sku ?? ""} />
                        <Field
                          label="Price (GBP £)"
                          name="price"
                          type="number"
                          defaultValue={(product.price_minor / 100).toFixed(2)}
                          required
                          min="0"
                          step="0.01"
                        />
                        <SelectField
                          label="Condition"
                          name="condition"
                          defaultValue={product.condition}
                          values={[
                            ["new", "New"],
                            ["refurbished", "Refurbished"],
                            ["used", "Used"],
                          ]}
                        />
                        <SelectField
                          label="Fulfilment"
                          name="fulfilmentType"
                          defaultValue={product.fulfilment_type}
                          values={[
                            ["owned_stock", "Owned stock"],
                            ["supplier_fulfilled", "Supplier fulfilment"],
                            ["mixed", "Mixed"],
                          ]}
                        />
                        <SelectField
                          label="Status"
                          name="status"
                          defaultValue={product.status}
                          values={[
                            ["draft", "Draft"],
                            ["active", "Published"],
                            ["archived", "Archived"],
                          ]}
                        />
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                          Category
                          <select
                            name="categoryId"
                            defaultValue={product.category_id ?? ""}
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                          >
                            <option value="">Uncategorised</option>
                            {(categories ?? []).map((category) => (
                              <option value={category.id} key={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="submit"
                          className="rounded-full bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-blue-600 transition-colors"
                        >
                          Update Product Info
                        </button>
                      </form>
                    </details>

                    {/* Stock Accordion */}
                    <details className="mt-2 border-t border-slate-800 pt-2">
                      <summary className="cursor-pointer text-xs font-bold text-cyan-400 hover:text-cyan-300">
                        Adjust Stock & Reorder Levels
                      </summary>
                      <form action={updateInventoryAction} className="mt-3 grid grid-cols-2 gap-3">
                        <input type="hidden" name="productId" value={product.id} />
                        <Field
                          label="Stock on Hand"
                          name="quantity"
                          type="number"
                          defaultValue={String(stock?.quantity_on_hand ?? 0)}
                          min="0"
                          step="1"
                          required
                        />
                        <Field
                          label="Reorder Level"
                          name="reorderLevel"
                          type="number"
                          defaultValue={String(stock?.reorder_level ?? 0)}
                          min="0"
                          step="1"
                          required
                        />
                        <button
                          className="col-span-2 rounded-full bg-blue-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 transition-colors"
                          type="submit"
                        >
                          Save Stock Levels
                        </button>
                      </form>
                    </details>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  defaultValue,
  min,
  max,
  step,
  pattern,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  min?: string;
  max?: string;
  step?: string;
  pattern?: string;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
      {label} {required && <span className="text-blue-400">*</span>}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  values,
  defaultValue,
}: {
  label: string;
  name: string;
  values: [string, string][];
  defaultValue?: string;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
      {label}
      <select
        name={name}
        defaultValue={defaultValue ?? values[0][0]}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
      >
        {values.map(([value, title]) => (
          <option key={value} value={value}>
            {title}
          </option>
        ))}
      </select>
    </label>
  );
}
