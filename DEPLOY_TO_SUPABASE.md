# Supabase Staging Deployment Guide (Project: ujrwzurzyeibtustvzcv)

This guide walks you through executing the database schema and starter data for **Premium 365 Limited** on your Supabase project.

---

## Method 1: Instant SQL Editor Deployment (Recommended — 2 Minutes)

We have pre-compiled all 9 migrations and the starter taxonomy into a single, ordered SQL file:
`supabase/all_migrations_001_to_009_and_seed.sql`

1. Open your Supabase Project SQL Editor:
   👉 **[https://supabase.com/dashboard/project/ujrwzurzyeibtustvzcv/sql/new](https://supabase.com/dashboard/project/ujrwzurzyeibtustvzcv/sql/new)**
2. Copy the entire contents of [`supabase/all_migrations_001_to_009_and_seed.sql`](file:///c:/Users/PC/.gemini/antigravity-ide/scratch/premium365-starter/supabase/all_migrations_001_to_009_and_seed.sql).
3. Paste into the SQL Editor and click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).
4. You will see `Success. No rows returned` (or row counts for seed insertions).

---

## Method 2: Supabase CLI Deployment

If you prefer using the command line with your Supabase Access Token:

1. Retrieve an access token from:
   👉 **[https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)**
2. In your terminal:
   ```powershell
   $env:SUPABASE_ACCESS_TOKEN="<your-personal-access-token>"
   npx.cmd supabase link --project-ref ujrwzurzyeibtustvzcv
   npx.cmd supabase db push
   ```

---

## What Gets Installed

1. **`001_profiles_roles.sql`**: Roles (`customer`, `staff`, `admin`), profile linkage to `auth.users`, and RLS helper functions.
2. **`002_catalogue_inventory.sql`**: Categories, suppliers, products, product images, inventory levels, and read policies.
3. **`003_orders_payments.sql`**: Orders, line items, multi-gateway payments, shipments, and customer order visibility policies.
4. **`004_services_academy.sql`**: Consulting services, academy training courses, and enquiry outbox tables.
5. **`005_audit_events.sql`**: Immutable security audit log tracking administrative inventory and order modifications.
6. **`006_catalogue_admin_policies.sql`**: Role-based access control policies for staff/admin management.
7. **`007_admin_catalogue_functions.sql`**: Atomic transactional functions for product creation and inventory updates.
8. **`008_checkout_reservations.sql`**: Atomic checkout reservation engine with stock hold timers and price verification.
9. **`009_notifications_refunds.sql`**: Transactional outbox for order confirmation emails and audit trail for Stripe/PayPal refunds.
10. **`seed.sql`**: Initial starter categories (Laptops, Workstations, Peripherals) and service definitions.

---

## Post-Migration: Assigning Your Admin Account

1. Start your local dev server:
   ```powershell
   npm.cmd run dev
   ```
2. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) and sign in with your email.
3. Open the Supabase SQL Editor and run the role-assignment query with your email address:
   ```sql
   UPDATE public.profiles p
   SET role = 'admin', updated_at = now()
   FROM auth.users u
   WHERE p.id = u.id
     AND lower(u.email) = lower('your-admin-email@example.com');
   ```
4. Refresh [http://localhost:3000/admin](http://localhost:3000/admin) to manage live products, adjust inventory allocations, and access the order fulfillment desk at `/admin/orders`.
