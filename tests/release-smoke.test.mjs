import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) => readFile(join(root, path), 'utf8');

test('database migrations are numbered 001 through 009', async () => {
  const names = (await readdir(join(root, 'supabase/migrations'))).filter((name) => name.endsWith('.sql')).sort();
  assert.deepEqual(names.map((name) => name.slice(0, 3)), ['001','002','003','004','005','006','007','008','009']);
});

test('checkout database functions are restricted to service_role', async () => {
  const sql = await read('supabase/migrations/008_checkout_reservations.sql');
  assert.match(sql, /revoke all on function public\.checkout_create_order[\s\S]*?from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.checkout_create_order[\s\S]*?to service_role/i);
  assert.match(sql, /grant execute on function public\.payment_mark_paid[\s\S]*?to service_role/i);
});

test('order confirmation outbox has a uniqueness guard and no client policy', async () => {
  const sql = await read('supabase/migrations/009_notifications_refunds.sql');
  assert.match(sql, /unique\(order_id, notification_type\)/i);
  assert.match(sql, /alter table public\.order_notification_outbox enable row level security/i);
  assert.match(sql, /insert into public\.order_notification_outbox[\s\S]*?on conflict\(order_id,notification_type\) do nothing/i);
});

test('security headers and provider-side refund confirmation checks are present', async () => {
  const config = await read('next.config.ts');
  const actions = await read('src/app/admin/orders/actions.ts');
  assert.match(config, /X-Content-Type-Options/);
  assert.match(config, /X-Frame-Options/);
  assert.match(config, /Strict-Transport-Security/);
  assert.match(actions, /refund\.status !== "succeeded"/);
  assert.match(actions, /refund\.status !== "COMPLETED"/);
});

test('confirmation email is sent only from server-side code and uses the outbox', async () => {
  const sender = await read('src/lib/email/order-confirmation.ts');
  assert.match(sender, /order_notification_outbox/);
  assert.match(sender, /api\.resend\.com\/emails/);
  assert.match(sender, /EMAIL_PROVIDER_API_KEY/);
});


test('staging runbook and read-only reconciliation queries exist', async () => {
  const runbook = await read('STAGING_DEPLOYMENT.md');
  const reconciliation = await read('supabase/operations/payment-reconciliation.sql');
  const workflow = await read('.github/workflows/ci.yml');
  assert.match(runbook, /dedicated Supabase project for staging/i);
  assert.match(runbook, /Do not treat the browser return URL as proof of payment/i);
  assert.match(reconciliation, /select[\s\S]*from public\.provider_events/i);
  assert.match(reconciliation, /order_notification_outbox/i);
  assert.match(workflow, /npm run typecheck/);
  assert.match(workflow, /npm run lint/);
  assert.match(workflow, /npm run build/);
});
