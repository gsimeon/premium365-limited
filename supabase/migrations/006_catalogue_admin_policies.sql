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
