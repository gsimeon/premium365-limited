-- Reliable order-confirmation outbox and refund audit fields.
create table if not exists public.order_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  notification_type text not null check (notification_type in ('order_confirmation')),
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_id, notification_type)
);
alter table public.order_notification_outbox enable row level security;
-- No client policies: only the service-role server can read or update this outbox.

create or replace function public.payment_mark_paid(
  p_order_id uuid, p_provider text, p_provider_session_id text, p_provider_payment_id text, p_event_id text, p_event_type text
) returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare v_event_id uuid; v_order public.orders%rowtype; v_item record;
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'Not authorised'; end if;
  insert into public.provider_events(provider,provider_event_id,event_type) values(p_provider,p_event_id,p_event_type)
  on conflict(provider,provider_event_id) do nothing returning id into v_event_id;
  if v_event_id is null then
    -- A retry may be needed to deliver an email that failed after payment was recorded.
    insert into public.order_notification_outbox(order_id,notification_type)
      values(p_order_id,'order_confirmation') on conflict(order_id,notification_type) do nothing;
    return false;
  end if;
  select * into v_order from public.orders where id=p_order_id for update;
  if not found then update public.provider_events set processing_error='Order not found',processed_at=now() where id=v_event_id; raise exception 'Order not found'; end if;
  if v_order.status in ('paid','processing','shipped','completed') then
    insert into public.order_notification_outbox(order_id,notification_type) values(p_order_id,'order_confirmation') on conflict(order_id,notification_type) do nothing;
    update public.provider_events set processed_at=now() where id=v_event_id; return false;
  end if;
  if v_order.status <> 'pending_payment' then update public.provider_events set processing_error='Order is not awaiting payment',processed_at=now() where id=v_event_id; return false; end if;
  update public.payments set status='paid', provider_payment_id=coalesce(p_provider_payment_id,provider_payment_id), provider_session_id=coalesce(p_provider_session_id,provider_session_id), updated_at=now()
    where order_id=p_order_id and provider=p_provider and (provider_session_id=p_provider_session_id or provider_session_id is null);
  if not found then update public.provider_events set processing_error='Matching payment record not found',processed_at=now() where id=v_event_id; raise exception 'Matching payment record not found'; end if;
  for v_item in select oi.product_id,oi.quantity from public.order_items oi join public.products p on p.id=oi.product_id where oi.order_id=p_order_id and p.fulfilment_type <> 'supplier_fulfilled' loop
    update public.inventory set quantity_on_hand=quantity_on_hand-v_item.quantity, quantity_reserved=quantity_reserved-v_item.quantity, updated_at=now()
      where product_id=v_item.product_id and quantity_reserved>=v_item.quantity and quantity_on_hand>=v_item.quantity;
    if not found then raise exception 'Reserved inventory invariant failed for product %',v_item.product_id; end if;
  end loop;
  update public.orders set status='paid',updated_at=now() where id=p_order_id;
  insert into public.order_notification_outbox(order_id,notification_type) values(p_order_id,'order_confirmation') on conflict(order_id,notification_type) do nothing;
  update public.provider_events set processed_at=now() where id=v_event_id;
  return true;
exception when others then
  update public.provider_events set processing_error=left(sqlerrm,1000),processed_at=now() where provider=p_provider and provider_event_id=p_event_id;
  raise;
end; $$;
revoke all on function public.payment_mark_paid(uuid,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.payment_mark_paid(uuid,text,text,text,text,text) to service_role;
