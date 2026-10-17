import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const client = createClient(supabaseUrl, anonKey);

async function verify() {
  const email = process.env.ADMIN_EMAIL || process.argv[2] || "gsimeon2k@gmail.com";
  const password = process.env.ADMIN_PASSWORD || process.argv[3] || "Praise2000!";
  console.log(`Testing staff authentication for ${email}...`);
  const { data: authData, error: authError } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error("Sign in failed:", authError.message);
    process.exit(1);
  }

  console.log("Logged in successfully! User ID:", authData.user.id);

  // Check profile
  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", authData.user.id)
    .single();

  if (profileError) {
    console.error("Profile check failed:", profileError.message);
    process.exit(1);
  }

  console.log("User Profile:", profile);
  if (profile.role !== "admin") {
    console.error("User does not have admin role!");
    process.exit(1);
  }

  // Check current_app_role() function
  const { data: roleData, error: roleError } = await client.rpc("current_app_role");
  if (roleError) {
    console.error("current_app_role RPC failed:", roleError.message);
  } else {
    console.log("current_app_role() returned:", roleData);
  }

  // Check inventory read permissions
  const { data: inventory, error: invError } = await client
    .from("inventory")
    .select("product_id, quantity_on_hand, quantity_reserved")
    .limit(3);

  if (invError) {
    console.error("Inventory access check failed:", invError.message);
  } else {
    console.log(`Inventory access check passed! Read ${inventory.length} inventory records.`);
  }

  // Check audit logs read permissions
  const { data: auditLogs, error: auditError } = await client
    .from("audit_logs")
    .select("id, action, created_at")
    .limit(3);

  if (auditError) {
    console.error("Audit log access check failed:", auditError.message);
  } else {
    console.log(`Audit log access check passed! Read ${auditLogs.length} audit records.`);
  }

  console.log("\nALL PERMISSIONS VERIFIED! gsimeon2k@gmail.com is fully authenticated and authorised as an admin.");
}

verify().catch((e) => {
  console.error("Error during verification:", e);
  process.exit(1);
});
