# Implementation status

## Present in this starter
- [x] Next.js/TypeScript project foundation and responsive storefront shell
- [x] Supabase browser/server helper examples and environment template
- [x] Initial schema and row-level security foundations for profiles, catalogue, inventory, orders, services, and audit events
- [x] Seed categories, services, and enquiry-led Academy courses (no invented product listings/prices)
- [x] Public shop query for active Supabase products and product detail route by slug
- [x] Staff magic-link sign-in request and auth callback route
- [x] Role-gated admin catalogue dashboard
- [x] Product creation and editing with server-side Zod validation
- [x] Manual inventory and reorder-level updates with reserved-stock protection
- [x] Atomic SQL functions for product/stock changes and audit log records
- [x] RLS policies restricting catalogue/inventory writes to staff/admin roles
- [x] Setup documentation for applying migrations and trusted administrator role assignment

## Still required before MVP acceptance
- [ ] Install dependencies and run lint, typecheck, and production build successfully
- [ ] Configure a real Supabase project and verify all migrations and RLS behavior
- [ ] Product image upload/storage bucket, category management UI, and supplier management UI
- [ ] Better form error handling without redirecting on every validation failure
- [ ] Server-side enquiry persistence, rate limiting, spam controls, and email notifications
- [ ] Persistent cart and secure guest/customer checkout
- [ ] Atomic stock reservation and order creation
- [ ] Stripe Checkout + signed webhook processing + idempotency
- [ ] PayPal checkout + verified webhook processing + idempotency
- [ ] Order confirmation, refund/cancellation rules, reconciliation, shipping/tracking, and order history
- [ ] Legal/privacy/cookie review and consent where applicable
- [ ] Security, accessibility, SEO, performance, backup, and restore testing
- [ ] Configure and verify Premium365.uk DNS/TLS/deployment

**No deployment, payment connection, or production readiness is claimed.**


## Milestone 3 update — checkout and order operations

### Implemented in source
- Persistent browser cart, product add-to-cart, cart quantity/removal controls, and checkout form.
- Server-side checkout route that validates customer inputs, uses live product IDs/prices from a privileged atomic database function, and creates Stripe Checkout or PayPal order sessions.
- Migration `008_checkout_reservations.sql`: server-role-only order creation/reservation, payment success transition, inventory deduction, provider event idempotency, and failed/expired reservation release.
- Stripe signature-verified webhook handler with order amount/currency matching.
- PayPal signature verification, capture-return endpoint, amount/currency matching, and payment state transition.
- Staff-only `/admin/orders` page for reviewing orders and updating processing/shipping/completion with tracking metadata.

### Not verified / still incomplete
- No real Supabase project has been configured; migration `008` has not been executed against a database.
- Stripe and PayPal provider calls have not been run with test credentials, and webhooks have not been exercised end to end.
- Type-check, lint, production build, automated tests, and security review remain to be run after dependencies are installed.
- Tax/shipping calculations are deliberately zero; this is not ready for live UK sales.
- No email receipts, refunds, customer order portal, automatic supplier availability check, rate limiting, or monitoring yet.
- Domain connection and deployment have not been performed.


## Milestone 4 update — notifications, refunds, and security hardening

### Added in source
- Resend-backed order confirmation sender with a database outbox record and delivery status tracking. Stripe and PayPal successful payment flows invoke the sender after the payment transition.
- Migration `009_notifications_refunds.sql` creates the restricted outbox and updates the payment transition to create notification work transactionally.
- Staff/admin full-refund action for Stripe PaymentIntent and PayPal capture transactions, provider idempotency keys, local payment/order state updates, and audit event.
- Security response headers in `next.config.ts`.

### Not verified / remaining
- Migration 009 has not been applied to a live database.
- Email sending and payment refunds have not been tested with real provider test/sandbox credentials.
- Pending email outbox retries are recorded but not automatically scheduled. Partial refunds and a formal payment reconciliation report are not included.
- Tax/VAT and delivery charges remain zero; no production readiness or deployment is claimed.

- [x] Added five dependency-free release smoke tests (`npm test`); all five passed in the current environment.
- [ ] Full typecheck/lint/build still blocked because dependency installation timed out; the global TypeScript command reports missing project dependencies and therefore is not a valid project typecheck.


## Milestone 5 update — staging and release preparation

### Added in source
- GitHub Actions CI workflow to run the dependency-free smoke tests, TypeScript check, ESLint, and production build on pull requests and pushes to main/master. Placeholder environment values are used for build-time configuration only.
- Staging deployment and integration test runbook covering isolated services, secret configuration, provider webhooks, security and concurrency test cases, and production release gates.
- Read-only SQL reconciliation queries for order/payment amount and state mismatches, webhook processing errors, and pending/failed notification outbox items.
- Additional smoke test for the runbook, reconciliation queries, and CI workflow.

### Not verified / still required
- CI has not run on GitHub because this package has not been pushed to a connected repository.
- Local dependency installation timed out, so project typecheck, lint, and production build are not verified.
- Reconciliation SQL has not been executed against a Supabase database. It is an operator-run diagnostic, not an automated reconciliation service.
- No staging host, credentials, payment-provider webhooks, email sender, domain DNS, or production deployment has been configured.
