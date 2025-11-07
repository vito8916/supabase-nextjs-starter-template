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


/*
USER_LOGINS TABLE
(this is just an example of a table to use as a reference for your own project)
*/

-- Create enum type for login status
CREATE TYPE public.login_status AS ENUM ('success', 'failed', 'blocked', 'suspicious');

-- Drop existing table if you want to recreate (CAUTION: This will delete data)
-- DROP TABLE IF EXISTS public.user_logins CASCADE;

-- Create improved user_logins table with UUID primary key
CREATE TABLE public.user_logins (
                                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                    user_id UUID NULL,
                                    user_name VARCHAR(255) NOT NULL,
                                    email VARCHAR(255) NOT NULL,
                                    ip_address INET NOT NULL,
                                    device_info JSONB NOT NULL DEFAULT '{}',
                                    login_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                    status public.login_status NOT NULL DEFAULT 'success',
                                    failure_reason TEXT NULL,
                                    session_id UUID NULL,
                                    location JSONB NULL,
                                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                                    CONSTRAINT user_logins_user_id_fkey
                                        FOREIGN KEY (user_id)
                                            REFERENCES auth.users (id)
                                            ON DELETE CASCADE
);

-- Add table comment
COMMENT ON TABLE public.user_logins IS 'Tracks all user login attempts (successful and failed)';
COMMENT ON COLUMN public.user_logins.device_info IS 'JSON containing browser, OS, device type, etc.';
COMMENT ON COLUMN public.user_logins.location IS 'JSON containing country, city, region from IP lookup';

-- Create indexes for better query performance
CREATE INDEX idx_user_logins_user_id ON public.user_logins USING BTREE (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_user_logins_email ON public.user_logins USING BTREE (email);
CREATE INDEX idx_user_logins_login_time ON public.user_logins USING BTREE (login_time DESC);
CREATE INDEX idx_user_logins_status ON public.user_logins USING BTREE (status);
CREATE INDEX idx_user_logins_ip_address ON public.user_logins USING BTREE (ip_address);
CREATE INDEX idx_user_logins_session_id ON public.user_logins USING BTREE (session_id) WHERE session_id IS NOT NULL;

-- Composite index for common query patterns
CREATE INDEX idx_user_logins_user_time ON public.user_logins USING BTREE (user_id, login_time DESC);
CREATE INDEX idx_user_logins_email_time ON public.user_logins USING BTREE (email, login_time DESC);

-- GIN index for JSONB columns
CREATE INDEX idx_user_logins_device_info ON public.user_logins USING GIN (device_info);
CREATE INDEX idx_user_logins_location ON public.user_logins USING GIN (location);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_logins
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Users can view their own login history
CREATE POLICY "Users can view their own login history"
  ON public.user_logins
  FOR SELECT
                 TO authenticated
                 USING (auth.uid() = user_id);

-- Policy: Service role has full access (for backend operations)
CREATE POLICY "Service role has full access"
  ON public.user_logins
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can insert their own login records
CREATE POLICY "Users can insert their own login records"
  ON public.user_logins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Optional: Create a view for recent login activity
CREATE OR REPLACE VIEW public.recent_login_activity AS
SELECT
    ul.id,
    ul.user_id,
    ul.email,
    ul.ip_address,
    ul.device_info->>'browser' AS browser,
    ul.device_info->>'os' AS os,
    ul.location->>'country' AS country,
    ul.location->>'city' AS city,
    ul.login_time,
    ul.status,
    ul.failure_reason
FROM public.user_logins ul
ORDER BY ul.login_time DESC
    LIMIT 100;

-- Grant permissions on the view
GRANT SELECT ON public.recent_login_activity TO authenticated;

-- Optional: Create function to clean up old login records (data retention)
CREATE OR REPLACE FUNCTION public.cleanup_old_login_records(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
deleted_count INTEGER;
BEGIN
DELETE FROM public.user_logins
WHERE login_time < NOW() - (retention_days || ' days')::INTERVAL;

GET DIAGNOSTICS deleted_count = ROW_COUNT;
RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a function to get login statistics
CREATE OR REPLACE FUNCTION public.get_login_stats(p_user_id UUID, days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  total_logins BIGINT,
  successful_logins BIGINT,
  failed_logins BIGINT,
  unique_ips BIGINT,
  last_login TIMESTAMPTZ
) AS $$
BEGIN
RETURN QUERY
SELECT
    COUNT(*)::BIGINT AS total_logins,
    COUNT(*) FILTER (WHERE status = 'success')::BIGINT AS successful_logins,
    COUNT(*) FILTER (WHERE status IN ('failed', 'blocked'))::BIGINT AS failed_logins,
    COUNT(DISTINCT ip_address)::BIGINT AS unique_ips,
    MAX(login_time) AS last_login
FROM public.user_logins
WHERE user_id = p_user_id
  AND login_time >= NOW() - (days_back || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;