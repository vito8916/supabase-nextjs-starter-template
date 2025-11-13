/*
PROFILES TABLE
(this table is required for the Supabase Auth service to work;
it is not a generic user table)
*/

-- === 1) Table (keeps your columns; adds a couple of small hardening tweaks) ===
create table if not exists public.profiles (
                                               id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    avatar_url text,
    bio text,
    status text default 'active',
    email text,                          -- can add unique later if you want
    phone text,
    stripe_customer_id text,
    stripe_subscription_id text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
    );

-- Optional helpful indexes
create index if not exists profiles_status_idx on public.profiles(status);
create index if not exists profiles_email_idx on public.profiles(lower(email));

-- === 2) Generic updated_at trigger (reusable) ===
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
    before update on public.profiles
    for each row execute procedure public.tg_set_updated_at();

-- === 3) New-user bootstrap trigger (SECURITY DEFINER; writes into public.profiles) ===
-- IMPORTANT FIX: insert into public.profiles (not public.users)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
insert into public.profiles (id, full_name, avatar_url, email, created_at, updated_at)
values (
           new.id,
           coalesce(new.raw_user_meta_data->>'full_name', null),
           coalesce(new.raw_user_meta_data->>'avatar_url', null),
           new.email,
           now(),
           now()
       )
    on conflict (id) do nothing; -- idempotent if the trigger fires more than once

return new;
end;
$$;

-- Recreate the trigger on auth.users (fires after a user is created)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- === 4) RLS (enable + least-privilege policies) ===
alter table public.profiles enable row level security;

-- Select own row
drop policy if exists "Can view own profile data." on public.profiles;
create policy "Can view own profile data."
  on public.profiles
  for select
                      using (auth.uid() = id);

-- Update own row
drop policy if exists "Can update own profile data." on public.profiles;
create policy "Can update own profile data."
  on public.profiles
  for update
                      using (auth.uid() = id)
      with check (auth.uid() = id);

-- Note: We DON'T add an INSERT policy on profiles because the insert is performed
-- by a SECURITY DEFINER function via the auth.users trigger.
-- (If you later want to allow self-service inserts, add a strict INSERT policy.)

/*
PRODUCT TABLE
(this is just an example of a table to use as a reference for your own project)
*/

-- 0) Required extension
create extension if not exists pgcrypto;

-- 1) Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'project_visibility') then
create type project_visibility as enum ('private', 'public');
end if;

  if not exists (select 1 from pg_type where typname = 'project_status') then
create type project_status as enum ('active', 'inactive', 'completed', 'canceled', 'archived');
end if;
end $$;

-- 2) Table
create table if not exists public.projects (
                                               id           uuid primary key default gen_random_uuid(),

    -- Core
    name         text not null check (length(btrim(name)) > 0),
    description  text,

    -- Ownership
    owner_id     uuid not null references auth.users(id) on delete cascade,

    -- Visibility & status
    visibility   project_visibility not null default 'private',
    status       project_status not null default 'active',

    -- System timestamps
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
    );

-- 3) Trigger
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
    before update on public.projects
    for each row execute procedure public.tg_set_updated_at();

-- 4) Indexes
create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists projects_visibility_idx on public.projects(visibility);
create index if not exists projects_status_idx on public.projects(status);

-- 5) RLS
alter table public.projects enable row level security;

-- Select
drop policy if exists "projects_read" on public.projects;
create policy "projects_read"
on public.projects
for select
                    to authenticated
                    using (
                    visibility = 'public'
                    or owner_id = auth.uid()
                    );

-- Insert
drop policy if exists "projects_insert" on public.projects;
create policy "projects_insert"
on public.projects
for insert
to authenticated
with check (owner_id = auth.uid());

-- Update
drop policy if exists "projects_update" on public.projects;
create policy "projects_update"
on public.projects
for update
                                to authenticated
                                using (owner_id = auth.uid())
    with check (owner_id = auth.uid());

-- Delete
drop policy if exists "projects_delete" on public.projects;
create policy "projects_delete"
on public.projects
for delete
to authenticated
using (owner_id = auth.uid());

