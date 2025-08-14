## SupaNext Starter Kit 2

Build your next SaaS or internal tool with ease. SupaNext Starter Kit 2 combines a production-ready Next.js App Router setup with Supabase authentication, a clean dashboard shell, ShadCN + Tailwind UI components, and a complete settings experience so you can ship faster.

### Highlights
- **End-to-end auth**: Email/password sign up, sign in, password reset, update password, and email OTP confirmation via Supabase.
- **Protected routes**: Middleware-enforced route protection with smart redirects.
- **Dashboard shell**: Responsive sidebar, breadcrumbs, and header out of the box.
- **Account settings**: Profile and password forms powered by React Hook Form and Zod.
- **Theme + toasts**: Dark/light mode with `next-themes` and app-wide toasts via `sonner`.
- **Type-safe**: TypeScript-first with strict, readable code.

### Tech Stack
- **Core**: Next.js 15 (App Router), React 19, TypeScript 5
- **Auth + Data**: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- **UI/UX**: Tailwind CSS v4, shadcn/ui primitives (Radix UI), `lucide-react`, `sonner`, `next-themes`
- **Forms + Validation**: React Hook Form, Zod
- **Testing**: Vitest

---

## Quick Start

### 1) Prerequisites
- Node.js 18+ (LTS recommended)
- A Supabase project (free tier is fine)

### 2) Install dependencies
```bash
npm install
# or: pnpm install | yarn | bun install
```

### 3) Configure environment variables
Create a `.env.local` in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# Optional but recommended for correct redirects in auth flows
NEXT_PUBLIC_SITE_URL=http://localhost:3002
```

Notes:
- Only public variables are required because this app uses Supabase’s SSR helpers which manage cookies securely.
- If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` is missing, auth middleware gracefully no-ops to let you explore the UI.

### 4) Run the app
```bash
npm run dev
```
The dev server runs on `http://localhost:3002` (see `package.json`).

---

## What You Get

### Authentication
- Email/password sign up and sign in
- Forgot password and update password flows
- Email OTP confirmation handler at `app/auth/confirm/route.ts`
- SSR/CSR-safe Supabase clients: `lib/supabase/server.ts` and `lib/supabase/client.ts`

### Route Protection
- Centralized logic in `lib/supabase/middleware.ts` wired through `middleware.ts`
- Public routes: `/`, `/login`, `/sign-up`, `/forgot-password`, `/update-password`, `/sign-up-success`, `/error`
- Unauthenticated access to protected paths redirects to `/login`
- Authenticated users navigating to `/login` or `/sign-up` are redirected to `/dashboard`

### Dashboard Shell
- App sidebar, breadcrumbs, header, and responsive layout in `app/(protected)/layout.tsx`
- Ready-to-extend `app/(protected)/dashboard/page.tsx`

### Settings Experience
- `Profile` tab: Update `full_name` and `bio` (stored in Supabase auth user metadata)
- `Password` tab: Update password with Zod-enforced strength checks
- `Theme` tab: Toggle dark/light mode via `next-themes`

### Landing Page
- Clean hero, navbar, and footer under `components/landing/*` and `app/page.tsx`

---

## Project Structure

```
app/
  (auth)/                 # Public auth pages (login, sign-up, forgot/update password)
  (protected)/            # Authenticated-only layouts and pages (dashboard, settings)
  actions/                # Server Actions (auth, settings, users)
  auth/confirm/route.ts   # Email OTP confirmation handler
components/
  auth/                   # Auth forms
  dashboard/              # Sidebar, breadcrumbs, user nav
  settings/               # Profile, password, appearance forms
  ui/                     # shadcn/ui components
lib/
  supabase/               # SSR/CSR clients and auth-aware middleware
  validations-schemas/    # Zod schemas for auth and settings
  utils.ts                # Helpers (classnames, date formatting, etc.)
```

---

## Environment Variables

- **Required**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (Supabase anon key)

- **Recommended**
  - `NEXT_PUBLIC_SITE_URL` (used to craft redirect URLs in auth flows)

If you run without the required Supabase vars, middleware skips auth enforcement so you can explore the UI.

---

## Supabase Notes

This starter primarily uses Supabase Auth and stores user-facing profile fields in the auth user’s metadata. There is also an optional `profiles` table utility in `app/actions/users-actions.ts` you can adopt if you prefer a dedicated table for richer profiles.

Optional example table (adjust to your needs):
```sql
-- Create a profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  status text default 'active',
  email text,
  phone text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Enable RLS and add policies for row ownership before production.
alter table profiles enable row level security;
create policy "Can view own profile data." on profiles for select using (auth.uid() = id);
create policy "Can update own profile data." on profiles for update using (auth.uid() = id);

```
This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
```sql
-- Create a tigger to Automatically create a profile entry
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

```

Optional Profiles to Auth User sync trigger. This is really Helpful to sync the Auth User when profile information Changes Through the Dashboard 
```sql
CREATE OR REPLACE FUNCTION public.sync_profile_to_auth_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
  -- Only run when one of these really changed
  IF  OLD.full_name   IS DISTINCT FROM NEW.full_name
   OR OLD.avatar_url  IS DISTINCT FROM NEW.avatar_url
   OR OLD.phone       IS DISTINCT FROM NEW.phone
  THEN
    UPDATE auth.users
    SET
      -- merge in the new full_name & avatar_url into the JSON metadata
      raw_user_meta_data = (
        (
          jsonb_set(
            jsonb_set(
              COALESCE(raw_user_meta_data::jsonb, '{}'::jsonb),
              '{full_name}',
              to_jsonb(NEW.full_name),
              true
            ),
            '{avatar_url}',
            to_jsonb(NEW.avatar_url),
            true
          )
        )::json
      ),
      -- update the phone column on auth.users too
      phone = NEW.phone
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Wire up the trigger on your profiles table
CREATE TRIGGER on_profile_updated
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (
    OLD.full_name  IS DISTINCT FROM NEW.full_name
 OR OLD.avatar_url IS DISTINCT FROM NEW.avatar_url
 OR OLD.phone      IS DISTINCT FROM NEW.phone
  )
  EXECUTE FUNCTION public.sync_profile_to_auth_user();

```

---

## Scripts

- `npm run dev` – Start dev server with Turbopack on port 3002
- `npm run build` – Production build
- `npm run start` – Run production build
- `npm run lint` – Lint with ESLint
- `npm run test` / `npm run test:watch` – Run Vitest

---

## Routing Overview

- Public
  - `/` – Marketing/landing
  - `/login`, `/sign-up`, `/forgot-password`, `/update-password`, `/sign-up-success`, `/error`

- Protected
  - `/dashboard`
  - `/settings` (Profile, Password, Theme tabs)

Auth is enforced by middleware; see `lib/supabase/middleware.ts`.

---

## Extending the Starter

- **Add social auth**: Wire Supabase OAuth providers and connect to the existing auth UI buttons.
- **Persist richer profiles**: Adopt the `profiles` table and store additional fields beyond auth metadata.
- **Add billing**: Integrate Stripe and persist IDs on the user record or `profiles`.
- **Enhance testing**: Flesh out Vitest with unit and integration tests for server actions.

---

## Deployment

This project works great on Vercel. Set the same environment variables in your hosting provider:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SITE_URL` (point to your live URL)

Middleware and Supabase SSR helpers are edge-friendly, but review your plan/limits for production.

---

## Contributing

Issues and PRs are welcome. Please keep changes focused and consistent with the code style. Run `npm run lint` and `npm run test` before submitting.

---

## License

Add your preferred license (e.g., MIT) in a `LICENSE` file at the project root.
