-- Checkout/order transitions are intentionally restricted to the server-side service role.
-- This migration supports GBP only; shipping and tax are zero until production rules are configured.
create or replace function public.checkout_create_order(
  p_email text,
  p_user_id uuid,
  p_items jsonb,
  p_shipping_address jsonb,
  p_customer_note text default null
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_order_id uuid := gen_random_uuid();
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_available integer;
  v_subtotal bigint := 0;
  v_line bigint;
  v_currency text := 'GBP';
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'Not authorised'; end if;
  if p_email is null or length(trim(p_email)) < 5 or length(p_email) > 320 then raise exception 'A valid customer email is required'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 30 then raise exception 'Cart must contain between 1 and 30 distinct products'; end if;
  if exists (select 1 from jsonb_array_elements(p_items) as elem(value) group by value->>'productId' having count(*) > 1) then raise exception 'Duplicate cart lines are not allowed'; end if;

  insert into public.orders(id, user_id, email, status, currency, subtotal_minor, shipping_minor, tax_minor, total_minor, shipping_address, customer_note)
  values (v_order_id, p_user_id, lower(trim(p_email)), 'pending_payment', v_currency, 0, 0, 0, 0, p_shipping_address, left(coalesce(p_customer_note,''),1000));

  for v_item in select value from jsonb_array_elements(p_items) loop
    if coalesce(v_item->>'productId','') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then raise exception 'Invalid product identifier'; end if;
    if coalesce(v_item->>'quantity','') !~ '^[0-9]+$' then raise exception 'Invalid quantity'; end if;
    v_qty := (v_item->>'quantity')::integer;
    if v_qty < 1 or v_qty > 20 then raise exception 'Quantity must be between 1 and 20'; end if;
    select * into v_product from public.products where id=(v_item->>'productId')::uuid and status='active' for share;
    if not found then raise exception 'One or more products are no longer available'; end if;
    if v_product.currency <> v_currency then raise exception 'Only GBP products are currently supported'; end if;
    if v_product.fulfilment_type <> 'supplier_fulfilled' then
      select quantity_on_hand - quantity_reserved into v_available from public.inventory where product_id=v_product.id for update;
      if not found or v_available < v_qty then raise exception 'Insufficient stock for: %', v_product.name; end if;
      update public.inventory set quantity_reserved=quantity_reserved+v_qty, updated_at=now() where product_id=v_product.id;
    end if;
    v_line := v_product.price_minor * v_qty;
    if v_line > 2000000000 - v_subtotal then raise exception 'Order total exceeds supported limit'; end if;
    v_subtotal := v_subtotal + v_line;
    insert into public.order_items(order_id, product_id, product_name_snapshot, sku_snapshot, quantity, unit_price_minor, line_total_minor)
    values (v_order_id, v_product.id, v_product.name, v_product.sku, v_qty, v_product.price_minor, v_line::integer);
  end loop;

  update public.orders set subtotal_minor=v_subtotal::integer, total_minor=v_subtotal::integer, updated_at=now() where id=v_order_id;
  return jsonb_build_object('order_id',v_order_id,'currency',v_currency,'subtotal_minor',v_subtotal,'total_minor',v_subtotal);
end; $$;

create or replace function public.checkout_release_order(p_order_id uuid, p_reason text default 'payment_failed') returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_item record;
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'Not authorised'; end if;
  if not exists(select 1 from public.orders where id=p_order_id and status='pending_payment' for update) then return; end if;
  for v_item in select oi.product_id, oi.quantity from public.order_items oi join public.products p on p.id=oi.product_id where oi.order_id=p_order_id and p.fulfilment_type <> 'supplier_fulfilled' loop
    update public.inventory set quantity_reserved=greatest(0,quantity_reserved-v_item.quantity), updated_at=now() where product_id=v_item.product_id;
  end loop;
  update public.orders set status=case when p_reason='cancelled' then 'cancelled'::public.order_status else 'payment_failed'::public.order_status end, updated_at=now() where id=p_order_id and status='pending_payment';
  update public.payments set status='failed', updated_at=now() where order_id=p_order_id and status in ('created','pending');
end; $$;

create or replace function public.payment_mark_paid(
  p_order_id uuid, p_provider text, p_provider_session_id text, p_provider_payment_id text, p_event_id text, p_event_type text
) returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
declare v_event_id uuid; v_order public.orders%rowtype; v_item record;
begin
  if coalesce(auth.role(), '') <> 'service_role' then raise exception 'Not authorised'; end if;
  insert into public.provider_events(provider,provider_event_id,event_type) values(p_provider,p_event_id,p_event_type)
  on conflict(provider,provider_event_id) do nothing returning id into v_event_id;
  if v_event_id is null then return false; end if;
  select * into v_order from public.orders where id=p_order_id for update;
  if not found then update public.provider_events set processing_error='Order not found',processed_at=now() where id=v_event_id; raise exception 'Order not found'; end if;
  if v_order.status in ('paid','processing','shipped','completed') then update public.provider_events set processed_at=now() where id=v_event_id; return false; end if;
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
  update public.provider_events set processed_at=now() where id=v_event_id;
  return true;
exception when others then
  update public.provider_events set processing_error=left(sqlerrm,1000),processed_at=now() where provider= p_provider and provider_event_id=p_event_id;
  raise;
end; $$;

revoke all on function public.checkout_create_order(text,uuid,jsonb,jsonb,text) from public, anon, authenticated;
revoke all on function public.checkout_release_order(uuid,text) from public, anon, authenticated;
revoke all on function public.payment_mark_paid(uuid,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.checkout_create_order(text,uuid,jsonb,jsonb,text) to service_role;
grant execute on function public.checkout_release_order(uuid,text) to service_role;
grant execute on function public.payment_mark_paid(uuid,text,text,text,text,text) to service_role;
