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
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const adminAuthClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const targetEmail = process.env.ADMIN_EMAIL || process.argv[2] || "gsimeon2k@gmail.com";
const targetPassword = process.env.ADMIN_PASSWORD || process.argv[3] || "Praise2000!";

async function main() {
  console.log(`Setting up admin user: ${targetEmail}`);

  // 1. Check if user already exists
  const { data: usersData, error: listError } = await adminAuthClient.auth.admin.listUsers();
  if (listError) {
    console.error("Failed to list users:", listError);
    process.exit(1);
  }

  const existingUser = usersData.users.find(
    (u) => u.email?.toLowerCase() === targetEmail.toLowerCase()
  );

  let userId;

  if (existingUser) {
    console.log(`User already exists with ID: ${existingUser.id}. Updating password and email confirmation...`);
    userId = existingUser.id;
    const { error: updateError } = await adminAuthClient.auth.admin.updateUserById(
      userId,
      {
        password: targetPassword,
        email_confirm: true,
        user_metadata: {
          ...existingUser.user_metadata,
          full_name: existingUser.user_metadata?.full_name || "Admin Staff",
        },
      }
    );
    if (updateError) {
      console.error("Failed to update user:", updateError);
      process.exit(1);
    }
    console.log("User password and confirmation updated successfully.");
  } else {
    console.log("User does not exist. Creating new user...");
    const { data: newUser, error: createError } = await adminAuthClient.auth.admin.createUser({
      email: targetEmail,
      password: targetPassword,
      email_confirm: true,
      user_metadata: { full_name: "Admin Staff" },
    });
    if (createError) {
      console.error("Failed to create user:", createError);
      process.exit(1);
    }
    userId = newUser.user.id;
    console.log(`User created successfully with ID: ${userId}`);
  }

  // 2. Ensure profile exists and has role = 'admin'
  console.log("Checking and updating public.profiles role to 'admin'...");
  const { data: profile, error: profileFetchError } = await adminAuthClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileFetchError) {
    console.error("Error fetching profile:", profileFetchError);
  }

  if (!profile) {
    console.log("Profile does not exist yet. Inserting profile with role 'admin'...");
    const { error: insertError } = await adminAuthClient.from("profiles").insert({
      id: userId,
      full_name: "Admin Staff",
      role: "admin",
    });
    if (insertError) {
      console.error("Failed to insert profile:", insertError);
      process.exit(1);
    }
  } else {
    console.log(`Current profile role: ${profile.role}. Updating to 'admin'...`);
    const { error: updateProfileError } = await adminAuthClient
      .from("profiles")
      .update({ role: "admin", full_name: profile.full_name || "Admin Staff" })
      .eq("id", userId);
    if (updateProfileError) {
      console.error("Failed to update profile role:", updateProfileError);
      process.exit(1);
    }
  }

  // 3. Verify sign in using anon client
  console.log("Verifying staff authentication with anon key...");
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const anonClient = createClient(supabaseUrl, anonKey);

  const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
    email: targetEmail,
    password: targetPassword,
  });

  if (signInError) {
    console.error("Verification sign-in failed:", signInError);
    process.exit(1);
  }

  console.log(`Verification sign-in succeeded! Authenticated user ID: ${signInData.user.id}`);

  // 4. Verify profile role from verified session
  const { data: verifiedProfile, error: verifiedProfileError } = await anonClient
    .from("profiles")
    .select("role, full_name")
    .eq("id", signInData.user.id)
    .single();

  if (verifiedProfileError) {
    console.error("Verification profile read error:", verifiedProfileError);
    process.exit(1);
  }

  console.log(`Verified Profile: Full Name = "${verifiedProfile.full_name}", Role = "${verifiedProfile.role}"`);

  if (verifiedProfile.role !== "admin") {
    console.error(`Verification FAILED: Role is ${verifiedProfile.role}, expected 'admin'`);
    process.exit(1);
  }

  console.log("SUCCESS! Admin account for gsimeon2k@gmail.com is fully configured and ready for staff login.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
