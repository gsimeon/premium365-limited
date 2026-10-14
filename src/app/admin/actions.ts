"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/catalogue";

const productSchema = z.object({
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug with hyphens only."),
  summary: z.string().trim().max(300).optional().default(""),
  description: z.string().trim().max(8000).optional().default(""),
  sku: z.string().trim().max(80).optional().default(""),
  price: z.coerce.number().finite().min(0).max(10000000),
  condition: z.enum(["new", "refurbished", "used"]),
  fulfilmentType: z.enum(["owned_stock", "supplier_fulfilled", "mixed"]),
  status: z.enum(["draft", "active", "archived"]),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(0).max(1000000),
  reorderLevel: z.coerce.number().int().min(0).max(1000000),
});

async function requireStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (error || !profile || !["staff", "admin"].includes(profile.role)) redirect("/admin/login?error=unauthorised");
  return { supabase, user };
}

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

export async function createProductAction(formData: FormData) {
  const { supabase } = await requireStaff();
  const parsed = productSchema.safeParse({
    name: value(formData, "name"), slug: value(formData, "slug"), summary: value(formData, "summary"),
    description: value(formData, "description"), sku: value(formData, "sku"), price: value(formData, "price"),
    condition: value(formData, "condition"), fulfilmentType: value(formData, "fulfilmentType"),
    status: value(formData, "status"), categoryId: value(formData, "categoryId"),
    quantity: value(formData, "quantity"), reorderLevel: value(formData, "reorderLevel"),
  });
  if (!parsed.success) redirect(`/admin?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Please check the product fields.")}`);
  const p = parsed.data;
  const { error } = await supabase.rpc("admin_create_product", {
    p_name: p.name, p_slug: p.slug, p_summary: p.summary, p_description: p.description,
    p_sku: p.sku, p_price_minor: Math.round(p.price * 100), p_currency: "GBP",
    p_condition: p.condition, p_fulfilment_type: p.fulfilmentType, p_status: p.status,
    p_category_id: p.categoryId || null, p_quantity_on_hand: p.quantity, p_reorder_level: p.reorderLevel,
  });
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/shop");
  redirect("/admin?success=product-created");
}

const updateProductSchema = productSchema.omit({ quantity: true, reorderLevel: true });
export async function updateProductAction(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = z.string().uuid().safeParse(value(formData, "id"));
  const parsed = updateProductSchema.safeParse({
    name: value(formData, "name"), slug: value(formData, "slug"), summary: value(formData, "summary"),
    description: value(formData, "description"), sku: value(formData, "sku"), price: value(formData, "price"),
    condition: value(formData, "condition"), fulfilmentType: value(formData, "fulfilmentType"),
    status: value(formData, "status"), categoryId: value(formData, "categoryId"),
  });
  if (!id.success) redirect("/admin?error=Invalid%20product%20identifier.");
  if (!parsed.success) redirect(`/admin?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid product fields.")}`);
  const p = parsed.data;
  const { error } = await supabase.rpc("admin_update_product", {
    p_id: id.data, p_name: p.name, p_slug: p.slug, p_summary: p.summary, p_description: p.description,
    p_sku: p.sku, p_price_minor: Math.round(p.price * 100), p_condition: p.condition,
    p_fulfilment_type: p.fulfilmentType, p_status: p.status, p_category_id: p.categoryId || null,
  });
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/shop"); revalidatePath(`/products/${p.slug}`);
  redirect("/admin?success=product-updated");
}

export async function updateInventoryAction(formData: FormData) {
  const { supabase } = await requireStaff();
  const productId = z.string().uuid().safeParse(value(formData, "productId"));
  const quantity = z.coerce.number().int().min(0).max(1000000).safeParse(value(formData, "quantity"));
  const reorderLevel = z.coerce.number().int().min(0).max(1000000).safeParse(value(formData, "reorderLevel"));
  if (!productId.success || !quantity.success || !reorderLevel.success) redirect("/admin?error=Please%20enter%20valid%20inventory%20numbers.");
  const { error } = await supabase.rpc("admin_update_inventory", {
    p_product_id: productId.data, p_quantity_on_hand: quantity.data, p_reorder_level: reorderLevel.data,
  });
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin"); revalidatePath("/shop");
  redirect("/admin?success=inventory-updated");
}

export async function requestAdminMagicLink(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/admin/login?error=Supabase%20is%20not%20configured%20yet.");
  const email = z.string().trim().email().safeParse(value(formData, "email"));
  if (!email.success) redirect("/admin/login?error=Enter%20a%20valid%20email%20address.");
  const supabase = await createClient();
  const callback = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/admin`;
  const { error } = await supabase.auth.signInWithOtp({ email: email.data, options: { emailRedirectTo: callback } });
  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  redirect("/admin/login?sent=1");
}
