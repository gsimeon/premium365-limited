-- READ-ONLY operational queries. Run from the trusted Supabase SQL Editor.
-- These queries expose customer/order details to whoever runs them; handle output as confidential.

-- 1. Orders whose payment/order state may require review.
select
  o.id as order_id,
  o.created_at,
  o.email,
  o.status as order_status,
  o.currency as order_currency,
  o.total_minor as order_total_minor,
  p.provider,
  p.status as payment_status,
  p.amount_minor as payment_amount_minor,
  p.currency as payment_currency,
  p.provider_session_id,
  p.provider_payment_id,
  p.updated_at as payment_updated_at
from public.orders o
left join public.payments p on p.order_id = o.id
where
  (o.status in ('paid','processing','shipped','completed') and coalesce(p.status, '') <> 'paid')
  or (p.status = 'paid' and (p.amount_minor <> o.total_minor or p.currency <> o.currency))
  or (o.status = 'pending_payment' and o.created_at < now() - interval '45 minutes')
order by o.created_at asc;

-- 2. Provider events that failed processing or have not been marked processed.
select
  provider,
  provider_event_id,
  event_type,
  received_at,
  processed_at,
  processing_error
from public.provider_events
where processed_at is null or processing_error is not null
order by received_at asc;

-- 3. Order confirmation notifications awaiting delivery or marked failed.
select
  id,
  order_id,
  status,
  attempts,
  last_error,
  created_at,
  sent_at
from public.order_notification_outbox
where status in ('pending','failed')
order by created_at asc;

-- 4. Payments that were marked paid while the corresponding order was not advanced.
select
  p.id as payment_id,
  p.order_id,
  p.provider,
  p.provider_payment_id,
  p.status as payment_status,
  o.status as order_status,
  p.updated_at
from public.payments p
join public.orders o on o.id = p.order_id
where p.status = 'paid'
  and o.status not in ('paid','processing','shipped','completed','refunded')
order by p.updated_at asc;
