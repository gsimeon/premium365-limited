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
