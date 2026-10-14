# Staging deployment and integration test runbook

This runbook prepares a staging environment. It does **not** mean the application has been deployed or connected to any live service.

## 1. Create isolated staging services

1. Create a dedicated Supabase project for staging. Do not use the production project for initial tests.
2. Create separate Stripe test-mode and PayPal Sandbox app credentials.
3. Configure a verified sender in Resend for staging, or leave email disabled and test outbox records only.
4. Deploy the repository to a staging host (for example, a Vercel preview/staging project) only after CI is green.
5. Use a staging hostname and set `NEXT_PUBLIC_SITE_URL` to that exact HTTPS origin.

## 2. Configure staging environment variables

Set these in the staging host's server-side environment settings. Do not commit values to Git:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never `NEXT_PUBLIC_`)
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` (Stripe test mode)
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID` (PayPal Sandbox)
- `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com`
- `EMAIL_FROM` and `EMAIL_PROVIDER_API_KEY` (optional until email delivery is tested)

Use separate credentials for every environment. Confirm that no secret appears in client bundles, browser network responses, logs, or repository history.

## 3. Apply and validate database migrations

Apply `supabase/migrations/001_profiles_roles.sql` through `009_notifications_refunds.sql` in numeric order to the staging database. Then run `supabase/seed.sql`. Inspect the SQL output and stop if any migration fails; do not continue with a partially migrated database.

After creating the intended admin user, assign the admin role through the trusted Supabase SQL Editor using the role-assignment instructions in `README.md`. Never implement role escalation in the browser.

Run the read-only reconciliation queries in `supabase/operations/payment-reconciliation.sql` after test transactions. Investigate every mismatch before continuing.

## 4. Configure provider webhooks

### Stripe test mode

Register `https://YOUR-STAGING-HOST/api/webhooks/stripe` in Stripe's test-mode dashboard. Subscribe to the event types documented in `README.md`. Copy the signing secret for that exact endpoint into `STRIPE_WEBHOOK_SECRET`.

### PayPal Sandbox

Register `https://YOUR-STAGING-HOST/api/webhooks/paypal` in the PayPal developer dashboard, subscribe to `PAYMENT.CAPTURE.COMPLETED`, and set the webhook ID in `PAYPAL_WEBHOOK_ID`. Ensure the credentials and webhook belong to the same Sandbox app.

Do not treat the browser return URL as proof of payment. Confirm that the provider's signed webhook was accepted and the database reflects the matching amount, currency, provider, and order.

## 5. Required staging test cases

Record a pass/fail result, timestamp, test order ID, provider event ID, and evidence for each case. Do not record card data, credentials, or other payment secrets.

- [ ] Anonymous visitor can browse only active products.
- [ ] Anonymous user cannot read private inventory, orders, payments, audit records, or the notification outbox.
- [ ] Non-staff account cannot open admin routes or execute staff-only database functions.
- [ ] Admin can create/edit/publish a product; invalid price, SKU, or stock input is rejected.
- [ ] Two concurrent checkout attempts for the last unit cannot oversell stock.
- [ ] Client-submitted prices are ignored; server/database prices determine order totals.
- [ ] Stripe test payment completes only after valid webhook verification and matching amount/currency.
- [ ] Invalid Stripe signature is rejected; duplicate webhook delivery does not duplicate payment or stock deduction.
- [ ] PayPal Sandbox capture and signed webhook are verified; invalid/duplicate events are safely handled.
- [ ] Failed or expired payment releases the reservation exactly once.
- [ ] Full refund uses the original provider transaction; duplicate refund submission does not issue a second refund.
- [ ] Payment succeeds but local state update fails: alert and reconciliation process can detect the mismatch.
- [ ] Email provider failure does not reverse payment; outbox status remains visible for manual retry.
- [ ] Order status changes and tracking metadata are limited to authorised staff and audited.
- [ ] Keyboard navigation, responsive layouts, error messages, and screen-reader labels are checked.
- [ ] Backup and restore are tested using staging data.

## 6. Production release gates

Do not switch provider credentials to live mode until all tests above pass and the following are complete:

- UK VAT, product tax treatment, shipping rates, consumer cancellation/returns, privacy, cookie, and terms wording reviewed by qualified advisers where appropriate.
- Product availability, supplier fulfilment, stock ownership, delivery estimates, and return handling are operationally defined.
- Email sender domain verified; confirmation email and failed-delivery handling tested.
- Payment reconciliation has an assigned owner and a documented daily process; alerting exists for unresolved mismatches.
- Dependency audit, full build, typecheck, lint, database RLS review, accessibility, and security review pass.
- DNS, HTTPS/TLS, backups, restore procedure, monitoring, incident contact, and rollback plan verified.
- A small real-world canary purchase/refund is approved and performed only after all previous gates pass.

## Current status

This is a runbook only. The staging project, credentials, provider webhooks, domain, and hosting have not been configured from this environment. CI results will become available after this project is pushed to a GitHub repository with Actions enabled.
