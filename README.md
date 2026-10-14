# Premium 365 Limited — MVP starter

Starter foundation for the Premium 365 UK e-commerce and IT services website.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Postgres/Auth (SQL migrations included)
- Stripe Checkout and PayPal order/capture source integrations are included, but must be configured and tested in provider test/sandbox environments before live use.

## Prerequisites
- Node.js 20+
- npm
- A Supabase project for database/auth testing

## Local setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in values.
3. Start the site: `npm run dev`
4. Open `http://localhost:3000`.
5. Apply SQL files in `supabase/migrations/` in filename order using the Supabase SQL editor or Supabase CLI.
6. Run `supabase/seed.sql` only after migrations.

## Included
- Responsive branded homepage and basic route placeholders
- Supabase browser/server client helpers
- Zod validation example for service enquiries
- Initial PostgreSQL schema, RLS policies, and seed data
- Payment adapter interface placeholders and production checklist

## Not included / not yet production-ready
- Customer account and self-service order-history screens
- Product image upload/storage and category/supplier management UI
- Automated retry UI for pending email notifications, refund reconciliation reports, tax and shipping calculation, analytics, monitoring
- Full legal review, penetration/security review, automated tests, and end-to-end staging validation

Do not accept real orders or payments until all provider flows, migrations, tax/shipping rules, and stock concurrency cases have been tested in staging. Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code. Do not use client-side values as proof of payment.

## Product and fulfilment assumptions
- Curated launch catalogue (roughly 20–50 products)
- UK customers and GBP pricing
- Manual inventory and fulfilment
- Stock availability must be checked and reserved atomically on the server when order creation is implemented
- Academy course pages initially collect enquiries rather than sell courses

## Suggested build sequence
1. Configure Supabase and apply migrations.
2. Implement authentication, staff/admin RBAC, and product/category CRUD.
3. Implement catalogue queries, product detail pages, and image storage.
4. Build cart and a server-side order creation + inventory reservation transaction.
5. Integrate Stripe and PayPal in test mode; verify webhook signatures and make processing idempotent.
6. Add email notifications, admin fulfilment workflow, and shipment tracking.
7. Test access control, payment edge cases, accessibility, SEO, backup/restore, and legal requirements.

## Milestone 2: live catalogue and staff administration

The shop now reads active product records from Supabase, and product detail pages resolve by slug. The `/admin` dashboard supports product creation/editing and manual stock/reorder-level updates. Product creation, edits, and inventory updates use database functions so the data change and its audit record are committed in the same transaction. Admin access requires a Supabase-authenticated user whose `profiles.role` is `staff` or `admin`.

### Apply the migrations

Run every SQL file in `supabase/migrations` in numeric order, including migrations `006_catalogue_admin_policies.sql` and `007_admin_catalogue_functions.sql`. Then run `supabase/seed.sql` to add the starter categories and enquiry-led services/courses. The seed does not create products or invent prices.

### Configure staff access

1. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` in your local environment.
2. In Supabase Auth, configure the site URL and allow the callback URL `http://localhost:3000/auth/callback` for local development. Add the real production callback URL only when deployment is configured.
3. Visit `/admin/login` and request a magic link using the email you intend to use as the project administrator.
4. After the user has signed in once, open the Supabase SQL Editor using a trusted project-owner account and assign the role. Replace the example email before executing:

```sql
update public.profiles p
set role = 'admin', updated_at = now()
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('your-admin@example.com');
```

5. Sign in again and open `/admin`. Do not expose the Supabase service-role key to browser code and do not add any client-side role promotion feature.

### Catalogue behavior and current limits

- Only products with `status = 'active'` are visible in the public shop.
- Draft and archived products are visible only to authenticated staff/admins under the RLS policies.
- Prices are stored as integer minor units (pence) and the admin form accepts GBP pounds.
- Stock is manually maintained. Updating on-hand quantity below currently reserved stock is rejected.
- Supplier contact details and inventory quantities have no anonymous read policy.
- Product imagery/storage upload, category CRUD UI, supplier fulfilment automation, and production email delivery are not implemented yet. Cart, checkout, payment-provider source integrations, and basic order administration were added in Milestone 3 but require staging validation.
- This milestone has not been connected to a real Supabase project or deployed. Build/type checks still need to be run in an environment where the npm dependencies can be installed.


## Milestone 3: cart, checkout, payment notifications, and fulfilment

### What this milestone adds

- Browser-persisted cart with quantity controls and current catalogue prices shown as estimates.
- Checkout form that submits product IDs and quantities only; the database function recalculates prices and reserves tracked inventory atomically.
- Stripe Checkout Session creation and PayPal Orders API approval flow. Card/payment details are entered at the provider, not on this site.
- Stripe webhook signature verification and PayPal webhook signature verification before order/payment state transitions.
- Payment amount/currency checks, provider-event idempotency, reservation release on failed/expired checkout, and paid-order stock deduction.
- `/admin/orders` for staff/admins to review orders, update fulfilment status, and record shipment carrier/tracking details.

### Additional configuration

Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` for Stripe test mode. Configure a Stripe webhook endpoint at `/api/webhooks/stripe` for at least `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`. Use Stripe's test keys until all test cases pass.

Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_WEBHOOK_ID` for PayPal Sandbox. Register `/api/webhooks/paypal` in the PayPal developer dashboard and subscribe to `PAYMENT.CAPTURE.COMPLETED`. `PAYPAL_API_BASE` is optional; it defaults to PayPal Sandbox outside production and the live PayPal API in production. Configure credentials and webhook IDs for the same environment.

Apply migrations `001` through `008` in numeric order. The checkout RPCs are granted only to Supabase's `service_role`; never expose `SUPABASE_SERVICE_ROLE_KEY` to client code. `NEXT_PUBLIC_SITE_URL` must exactly match the deployed site's origin when using provider return URLs.

### Important launch limitations

- Shipping and tax are currently recorded as zero. This is a development-only assumption; configure and review UK VAT, shipping rates, consumer terms, returns, and invoice requirements before taking live orders.
- Supplier-fulfilled items do not reserve owned inventory; their availability still requires manual confirmation before dispatch.
- Order confirmation email, refund execution/reconciliation, abandoned-session cleanup beyond provider expiration notifications, fraud rules, rate limiting, and customer self-service order history are not implemented.
- PayPal and Stripe must be tested with sandbox/test credentials and verified webhook deliveries. Never mark an order paid from a browser redirect alone.
- Do not use live payment credentials until database functions, webhooks, stock concurrency, cancellation/expiry, and fulfilment transitions have been tested in a real staging Supabase project.


## Milestone 4: order confirmation, refunds, and security hardening

### Added in source
- Order-confirmation email sender using Resend's HTTPS API. Configure `EMAIL_FROM` and `EMAIL_PROVIDER_API_KEY`; do not use an unverified sender domain.
- `order_notification_outbox` migration to track confirmation delivery attempts and avoid duplicate sends after successful delivery. Payment transitions create the outbox record transactionally. Email provider failures are logged and do not reverse a successful payment.
- Full-refund action for staff/admins in `/admin/orders`, requesting the refund from the original Stripe PaymentIntent or PayPal capture and then recording the result. Provider idempotency keys are used to reduce duplicate-refund risk. Check the provider dashboard if the provider succeeds but the local database update fails. This implementation supports full refunds only; partial refunds and automated reconciliation reporting remain future work.
- Standard browser security headers, including anti-framing, MIME-sniffing protection, referrer policy, restricted browser permissions, and HSTS in production.

### Apply and configure
1. Apply migrations `001` through `009` in numeric order. Migration `009` replaces the payment transition function to create an email outbox row atomically.
2. Set `EMAIL_FROM` and `EMAIL_PROVIDER_API_KEY` for Resend. The email sender is optional in development, but should be configured and tested before live sales.
3. Test refunds only with Stripe test credentials or PayPal Sandbox until provider transactions, retries, and database reconciliation have been validated.

### Production gates still open
- Automated typecheck, lint, production build, unit/integration tests, and database migration execution have not been verified in this environment.
- Add scheduled retry/reconciliation for pending outbox rows and payment states; current outbox provides a record of pending/failed delivery but no scheduler.
- Add partial refunds, returns workflow, fraud/rate-limiting controls, tax/VAT and shipping calculations, email templates/branding, and end-to-end staging coverage.
- Review security and legal obligations, confirm backups/restores, and test all webhooks and stock race conditions against a real staging Supabase project.
- No deployment or live payment connection has been performed.


## Automated release smoke tests

Run `npm test` to execute dependency-free Node smoke tests for migration numbering, service-role-only checkout RPC grants, notification outbox constraints, security headers, and provider refund completion checks. These are static release smoke tests; they do not replace TypeScript/lint/build checks, database integration tests, or end-to-end provider tests.


## Milestone 5: staging and release preparation

- `.github/workflows/ci.yml` defines a GitHub Actions quality gate for smoke tests, typecheck, lint, and production build. It uses placeholder credentials only; it does not deploy the site.
- `STAGING_DEPLOYMENT.md` documents isolated staging setup, Supabase migrations, Stripe test mode, PayPal Sandbox, required end-to-end cases, and production release gates.
- `supabase/operations/payment-reconciliation.sql` provides read-only queries for suspicious order/payment mismatches, webhook processing errors, pending notification outbox rows, and inconsistent payment/order states. Treat query output as confidential customer data.

No staging host, Supabase project, payment provider, email service, or domain has been connected from this environment. The GitHub Actions workflow will run after this project is pushed to a GitHub repository with Actions enabled. Because this starter currently has no committed lockfile, CI uses `npm install`; committing a verified `package-lock.json` is recommended before production.
