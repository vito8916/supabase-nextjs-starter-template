Below is a robust Profiles table schema for Supabase (Postgres)

```sql
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
```

Why these columns

- id: Primary key that matches `auth.users.id`. Using `on delete cascade` keeps profile rows in sync when a user is deleted.
- full_name: Human-friendly display name populated from `raw_user_meta_data` on sign-up. Nullable to avoid blocking registration.
- avatar_url: Public URL (or storage path) to a profile image. Kept as `text` so you can store absolute URLs or bucket paths.
- bio: Short free-form text for user bios or roles.
- status: Lightweight lifecycle state for the profile (`active` by default). Useful for soft moderation, deactivation, or onboarding gates without deleting the row.
- email: Convenience copy of the auth email. This enables profile-level lookups and denormalized views without always joining `auth.users`. Indexing on `lower(email)` supports case-insensitive search.
- phone: Optional phone contact. Not unique by default to avoid collisions with shared/temporary numbers.
- stripe_customer_id / stripe_subscription_id: Denormalized billing linkage keys if you use Stripe. Storing them here simplifies cross-table joins from app logic.
- created_at / updated_at: Auditing and sorting. `updated_at` is maintained by a generic trigger to keep modification timestamps accurate.

Indexes
- status index: Fast filters for admin consoles or queries like "all active profiles".
- lower(email) index: Case-insensitive lookup by email (Postgres can’t use a plain index for `lower(email)` predicates).

Triggers
- `tg_set_updated_at`: Centralized `updated_at` maintenance, reusable across tables.
- `handle_new_user`: SECURITY DEFINER function that creates a profile row as soon as a user is inserted into `auth.users`. It’s idempotent and isolated from client inserts, which keeps RLS tight.

RLS policies
- Read/Update own row only: `using (auth.uid() = id)` (and `with check`) enforces true per-user isolation. We do not allow direct client `INSERT` — provisioning happens via the trigger, reducing attack surface.

Notes and options you can tweak

- Email uniqueness: If your app requires unique emails at the profile level, add `unique (lower(email))` with a partial index to skip nulls.
- Additional identity fields: You can add `username text unique` (with a lowercase functional index) for vanity URLs or mentions.
- Status as enum: For stronger contracts, replace `status text` with an enum (`create type profile_status as enum (...)`) and a default.
- PII handling: If you need to mask or encrypt `email`/`phone`, consider pgcrypto (`pgp_sym_encrypt`) or move sensitive fields behind service-role only views.
- Avatar storage policy: If you store bucket keys instead of public URLs, keep the value small and derive public URLs at read time; consider a storage policy that constrains access to `auth.uid()` paths.
- Backfilling existing users: When enabling this in an existing project, run a one-time insert into `public.profiles` for rows missing from `auth.users` to avoid null references.
- Admin access: For admin dashboards, either create a dedicated role with broader policies, or expose a `SECURITY DEFINER` RPC that performs privileged reads/updates.
- Soft delete: If you need reversible deletions, add `deleted_at timestamptz` and update your RLS to exclude deleted rows (e.g., `using (... and deleted_at is null)`).