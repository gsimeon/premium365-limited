create extension if not exists pgcrypto;
create type public.app_role as enum ('customer','staff','admin');
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, role public.app_role not null default 'customer', created_at timestamptz not null default now(), updated_at timestamptz not null default now());
alter table public.profiles enable row level security;
create or replace function public.current_app_role() returns public.app_role language sql stable security definer set search_path=public as $$ select role from public.profiles where id=auth.uid() $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,full_name) values(new.id, coalesce(new.raw_user_meta_data->>'full_name','')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create policy "profile owner can read own profile" on public.profiles for select to authenticated using (id=auth.uid());
-- Profile updates are intentionally disabled until a safe server-side update path is implemented.
