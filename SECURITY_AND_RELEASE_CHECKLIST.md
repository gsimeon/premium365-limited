# Premium 365 Limited — staging verification checklist

This checklist is intentionally a release gate. Source code existing is not evidence that a live provider or database has been configured correctly.

## Database and access control
- [ ] Apply migrations 001–009 to a non-production Supabase project in numeric order.
- [ ] Confirm anonymous users can read only active/published catalogue data.
- [ ] Confirm anonymous/authenticated clients cannot write products, inventory, orders, payments, shipments, provider events, or notification outbox rows.
- [ ] Confirm only trusted server-role RPC calls can create orders, reserve/release stock, and mark payments paid.
- [ ] Test simultaneous checkouts for the final stock unit; exactly one order should reserve it.
- [ ] Confirm staff cannot promote their own role; role assignment remains an owner-controlled operation.

## Checkout and payments (test/sandbox only)
- [ ] Test Stripe successful, cancelled, expired, asynchronous success, and asynchronous failure flows.
- [ ] Test PayPal approval, capture, duplicate webhook, invalid signature, and amount/currency mismatch.
- [ ] Replay each webhook event; order/payment state must not be duplicated.
- [ ] Confirm browser redirects alone never mark an order as paid.
- [ ] Test failed provider session creation releases reservations.
- [ ] Test full refunds in provider test/sandbox accounts, including provider success followed by local database failure.
- [ ] Reconcile each test order against provider transaction state and the local payment/order records.

## Notifications
- [ ] Configure a verified Resend sender and EMAIL_PROVIDER_API_KEY.
- [ ] Confirm only successful payments create confirmation outbox work.
- [ ] Confirm a successful send marks the row sent and repeated webhook delivery does not send a second email.
- [ ] Confirm provider errors remain visible as pending/failed outbox records; implement and test a scheduled retry before production.

## UK commerce requirements
- [ ] Configure VAT/tax rules, delivery prices, delivery territories, and supplier-availability checks; current checkout shipping and tax are zero.
- [ ] Review consumer terms, returns/refunds, privacy notice, cookies/consent where applicable, and required company disclosures with a qualified adviser.
- [ ] Test product availability and condition descriptions, delivery promises, confirmation emails, and support contact details.

## App and operations
- [ ] Run `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build` in CI.
- [ ] Add automated unit/integration/end-to-end tests for critical purchase and admin flows.
- [ ] Verify security headers, rate limiting/abuse protection, dependency alerts, secrets handling, and admin MFA policy.
- [ ] Configure monitoring, alerting, database backups, and perform a restore test.
- [ ] Deploy to staging, verify HTTPS and DNS, then run the full purchase/refund journey.
- [ ] Do not add live payment credentials until all checks pass and the business has approved launch.
