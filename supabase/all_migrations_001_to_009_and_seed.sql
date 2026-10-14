-- ==========================================
-- Premium 365 Limited: Complete Staging Schema
-- Migrations 001 through 009 + Seed Data
-- Target Project: ujrwzurzyeibtustvzcv
-- ==========================================



-- >>> Migration: 001_profiles_roles.sql <<<

create extension if not exists pgcrypto;
create type public.app_role as enum ('customer','staff','admin');
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, role public.app_role not null default 'customer', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.profiles enable row level security;
create or replace function public.current_app_role() returns public.app_role language sql stable security definer set search_path=public as $$ select role from public.profiles where id=auth.uid() $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,full_name) values(new.id, coalesce(new.raw_user_meta_data->>'full_name','')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create policy "profile owner can read own profile" on public.profiles for select to authenticated using (id=auth.uid());
-- Profile updates are intentionally disabled until a safe server-side update path is implemented.


-- >>> Migration: 002_catalogue_inventory.sql <<<

create table public.categories(id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, description text, is_active boolean not null default true, sort_order int not null default 0, created_at timestamptz not null default now());
create table public.suppliers(id uuid primary key default gen_random_uuid(), name text not null, contact_email text, notes text, is_active boolean not null default true, created_at timestamptz not null default now());
create table public.products(id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id), supplier_id uuid references public.suppliers(id), name text not null, slug text not null unique, summary text, description text, sku text unique, price_minor integer not null check(price_minor>=0), currency char(3) not null default 'GBP', condition text not null default 'new' check(condition in ('new','refurbished','used')), fulfilment_type text not null default 'owned_stock' check(fulfilment_type in ('owned_stock','supplier_fulfilled','mixed')), status text not null default 'draft' check(status in ('draft','active','archived')), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.product_images(id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, storage_path text not null, alt_text text not null, sort_order int not null default 0);
create table public.inventory(id uuid primary key default gen_random_uuid(), product_id uuid not null unique references public.products(id) on delete cascade, quantity_on_hand integer not null default 0 check(quantity_on_hand>=0), quantity_reserved integer not null default 0 check(quantity_reserved>=0 and quantity_reserved<=quantity_on_hand), reorder_level integer not null default 0 check(reorder_level>=0), updated_at timestamptz not null default now());
alter table public.categories enable row level security; alter table public.suppliers enable row level security; alter table public.products enable row level security; alter table public.product_images enable row level security; alter table public.inventory enable row level security;
create policy "public reads active categories" on public.categories for select to anon,authenticated using(is_active=true);
create policy "public reads active products" on public.products for select to anon,authenticated using(status='active');
create policy "public reads images for active products" on public.product_images for select to anon,authenticated using(exists(select 1 from public.products p where p.id=product_id and p.status='active'));
-- Inventory and supplier data intentionally have no public read policy. Admin writes should use server-side authorization.


-- >>> Migration: 003_orders_payments.sql <<<

create type public.order_status as enum ('pending_payment','paid','processing','shipped','completed','cancelled','refunded','payment_failed');
create table public.orders(id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), email text not null, status public.order_status not null default 'pending_payment', currency char(3) not null default 'GBP', subtotal_minor integer not null check(subtotal_minor>=0), shipping_minor integer not null default 0 check(shipping_minor>=0), tax_minor integer not null default 0 check(tax_minor>=0), total_minor integer not null check(total_minor>=0), shipping_address jsonb, billing_address jsonb, customer_note text, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.order_items(id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, product_id uuid references public.products(id), product_name_snapshot text not null, sku_snapshot text, quantity integer not null check(quantity>0), unit_price_minor integer not null check(unit_price_minor>=0), line_total_minor integer not null check(line_total_minor>=0));
create table public.payments(id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), provider text not null check(provider in ('stripe','paypal')), provider_session_id text, provider_payment_id text, status text not null default 'created', amount_minor integer not null check(amount_minor>=0), currency char(3) not null default 'GBP', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(provider,provider_payment_id));
create table public.shipments(id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id), carrier text, tracking_number text, tracking_url text, status text not null default 'preparing', shipped_at timestamptz, delivered_at timestamptz, created_at timestamptz not null default now());
alter table public.orders enable row level security; alter table public.order_items enable row level security; alter table public.payments enable row level security; alter table public.shipments enable row level security;
create policy "customers read their own orders" on public.orders for select to authenticated using(user_id=auth.uid());
create policy "customers read items of their own orders" on public.order_items for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "customers read payments of their own orders" on public.payments for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "customers read shipments of their own orders" on public.shipments for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid()));
-- No client insert/update/delete policies: trusted server actions/webhooks must own order and payment transitions. Guest-order lookup needs a separate unguessable access token design.


-- >>> Migration: 004_services_academy.sql <<<

create table public.services(id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, summary text not null, body text, is_active boolean not null default true, sort_order int not null default 0);
create table public.service_enquiries(id uuid primary key default gen_random_uuid(), name text not null, email text not null, enquiry_type text not null, message text not null, status text not null default 'new', created_at timestamptz not null default now());
create table public.courses(id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, summary text not null, description text, delivery_mode text not null default 'enquiry', is_published boolean not null default false);
create table public.course_enquiries(id uuid primary key default gen_random_uuid(), course_id uuid references public.courses(id), name text not null, email text not null, organisation text, message text, status text not null default 'new', created_at timestamptz not null default now());
alter table public.services enable row level security; alter table public.service_enquiries enable row level security; alter table public.courses enable row level security; alter table public.course_enquiries enable row level security;
create policy "public reads active services" on public.services for select to anon,authenticated using(is_active=true);
create policy "public reads published courses" on public.courses for select to anon,authenticated using(is_published=true);
-- No anonymous direct insert policies for enquiry tables; use a validated server action with rate limiting and spam protection.


-- >>> Migration: 005_audit_events.sql <<<

create table public.audit_logs(id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id), action text not null, entity_type text not null, entity_id text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create table public.provider_events(id uuid primary key default gen_random_uuid(), provider text not null check(provider in ('stripe','paypal')), provider_event_id text not null, event_type text not null, processed_at timestamptz, processing_error text, received_at timestamptz not null default now(), unique(provider,provider_event_id));
alter table public.audit_logs enable row level security; alter table public.provider_events enable row level security;
-- No client policies. Insert/update from trusted server code only. Verify webhook signatures before recording/processing events.


-- >>> Migration: 006_catalogue_admin_policies.sql <<<

-- Catalogue and inventory administration policies.
-- Roles must be granted by a trusted project owner; never promote users from the client.

create policy "staff can manage products" on public.products
  for all to authenticated
  using (public.current_app_role() in ('staff','admin'))
  with check (public.current_app_role() in ('staff','admin'));

create policy "staff can manage categories" on public.categories
  for all to authenticated
  using (public.current_app_role() in ('staff','admin'))
  with check (public.current_app_role() in ('staff','admin'));

create policy "staff can manage product images" on public.product_images
  for all to authenticated
  using (public.current_app_role() in ('staff','admin'))
  with check (public.current_app_role() in ('staff','admin'));

create policy "staff can read inventory" on public.inventory
  for select to authenticated
  using (public.current_app_role() in ('staff','admin'));

create policy "staff can manage inventory" on public.inventory
  for all to authenticated
  using (public.current_app_role() in ('staff','admin'))
  with check (public.current_app_role() in ('staff','admin'));

create policy "admins can manage suppliers" on public.suppliers
  for all to authenticated
  using (public.current_app_role() = 'admin')
  with check (public.current_app_role() = 'admin');

create policy "staff can append audit events" on public.audit_logs
  for insert to authenticated
  with check (
    actor_id = auth.uid()
    and public.current_app_role() in ('staff','admin')
  );

create policy "staff can read audit events" on public.audit_logs
  for select to authenticated
  using (public.current_app_role() in ('staff','admin'));

-- Useful catalogue query indexes.
create index if not exists products_status_created_idx on public.products(status, created_at desc);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists product_images_product_sort_idx on public.product_images(product_id, sort_order);


-- >>> Migration: 007_admin_catalogue_functions.sql <<<

-- Atomic catalogue writes with audit records. These functions run as the caller and
-- are protected by the table RLS policies in migration 006.
create or replace function public.admin_create_product(
  p_name text,
  p_slug text,
  p_summary text,
  p_description text,
  p_sku text,
  p_price_minor integer,
  p_currency text,
  p_condition text,
  p_fulfilment_type text,
  p_status text,
  p_category_id uuid,
  p_quantity_on_hand integer,
  p_reorder_level integer
) returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare new_id uuid;
begin
  if public.current_app_role() not in ('staff','admin') then
    raise exception 'Not authorised to create products' using errcode = '42501';
  end if;
  if p_price_minor < 0 or p_quantity_on_hand < 0 or p_reorder_level < 0 then
    raise exception 'Price and inventory values must not be negative' using errcode = '22023';
  end if;
  insert into public.products(name, slug, summary, description, sku, price_minor, currency, condition, fulfilment_type, status, category_id)
  values (trim(p_name), trim(p_slug), nullif(trim(p_summary), ''), nullif(trim(p_description), ''), nullif(trim(p_sku), ''), p_price_minor, upper(p_currency), p_condition, p_fulfilment_type, p_status, p_category_id)
  returning id into new_id;
  insert into public.inventory(product_id, quantity_on_hand, quantity_reserved, reorder_level)
  values (new_id, p_quantity_on_hand, 0, p_reorder_level);
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'product.created', 'product', new_id::text, jsonb_build_object('status', p_status, 'sku', nullif(trim(p_sku), '')));
  return new_id;
end;
$$;

create or replace function public.admin_update_product(
  p_id uuid,
  p_name text,
  p_slug text,
  p_summary text,
  p_description text,
  p_sku text,
  p_price_minor integer,
  p_condition text,
  p_fulfilment_type text,
  p_status text,
  p_category_id uuid
) returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if public.current_app_role() not in ('staff','admin') then
    raise exception 'Not authorised to update products' using errcode = '42501';
  end if;
  if p_price_minor < 0 then raise exception 'Price must not be negative' using errcode = '22023'; end if;
  update public.products set
    name = trim(p_name), slug = trim(p_slug), summary = nullif(trim(p_summary), ''),
    description = nullif(trim(p_description), ''), sku = nullif(trim(p_sku), ''),
    price_minor = p_price_minor, condition = p_condition, fulfilment_type = p_fulfilment_type,
    status = p_status, category_id = p_category_id, updated_at = now()
  where id = p_id;
  if not found then raise exception 'Product not found'; end if;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'product.updated', 'product', p_id::text, jsonb_build_object('status', p_status));
end;
$$;

create or replace function public.admin_update_inventory(
  p_product_id uuid,
  p_quantity_on_hand integer,
  p_reorder_level integer
) returns void
language plpgsql
security invoker
set search_path = public
as $$
declare current_reserved integer;
begin
  if public.current_app_role() not in ('staff','admin') then
    raise exception 'Not authorised to update inventory' using errcode = '42501';
  end if;
  if p_quantity_on_hand < 0 or p_reorder_level < 0 then
    raise exception 'Inventory values must not be negative' using errcode = '22023';
  end if;
  select quantity_reserved into current_reserved from public.inventory where product_id = p_product_id for update;
  if not found then raise exception 'Inventory record not found'; end if;
  if p_quantity_on_hand < current_reserved then
    raise exception 'On-hand quantity cannot be lower than currently reserved stock' using errcode = '22023';
  end if;
  update public.inventory set quantity_on_hand = p_quantity_on_hand, reorder_level = p_reorder_level, updated_at = now()
  where product_id = p_product_id;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), 'inventory.updated', 'product', p_product_id::text,
    jsonb_build_object('quantity_on_hand', p_quantity_on_hand, 'reorder_level', p_reorder_level));
end;
$$;

grant execute on function public.admin_create_product(text,text,text,text,text,integer,text,text,text,text,uuid,integer,integer) to authenticated;
grant execute on function public.admin_update_product(uuid,text,text,text,text,text,integer,text,text,text,uuid) to authenticated;
grant execute on function public.admin_update_inventory(uuid,integer,integer) to authenticated;


-- >>> Migration: 008_checkout_reservations.sql <<<

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


-- >>> Migration: 009_notifications_refunds.sql <<<

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


-- >>> Starter Seed Data <<<

insert into public.categories(name,slug,description,sort_order) values ('Computers & laptops','computers-laptops','Computers and laptops for work and study.',1),('Accessories','accessories','Essential peripherals and accessories.',2),('Networking & storage','networking-storage','Connectivity and storage essentials.',3),('Software & licences','software-licences','Software and licensing enquiries.',4),('Business technology','business-technology','Technology for business teams.',5) on conflict(slug) do nothing;
insert into public.services(name,slug,summary,sort_order) values ('Software development','software-development','Custom websites, applications and integrations.',1),('Cybersecurity','cybersecurity','Security reviews, risk reduction and practical guidance.',2),('Data analytics','data-analytics','Data preparation, reporting and business intelligence.',3),('Cloud engineering','cloud-engineering','Cloud architecture, migration and operational support.',4),('IT consulting','it-consulting','Technology advice and delivery support for organisations.',5) on conflict(slug) do nothing;
insert into public.courses(name,slug,summary,description,delivery_mode,is_published) values ('Cybersecurity foundations','cybersecurity-foundations','Build practical cybersecurity awareness and core skills.','Training availability is confirmed through an enquiry.','enquiry',true),('Data analysis with Power BI','data-analysis-power-bi','Turn business data into clear reporting and insights.','Training availability is confirmed through an enquiry.','enquiry',true),('Cloud engineering fundamentals','cloud-engineering-fundamentals','Understand core cloud engineering concepts and practices.','Training availability is confirmed through an enquiry.','enquiry',true) on conflict(slug) do nothing;
