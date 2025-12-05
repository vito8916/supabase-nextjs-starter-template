# SupaNext Starter Kit 2

Welcome to SupaNext kit 2! This documentation will help you understand the project structure, components, and how to use them effectively.

## Overview

A Next.js + Supabase starter focused on shipping productivity. It includes a production-ready App Router setup, Supabase auth integration, middleware-based route protection, a dashboard shell, and Tailwind v4 + shadcn/ui components.

<!-- image cover -->
<p align="center">
  <img src="public/assets/images/bento-features.png" alt="Bento Features Preview" style="max-width: 100%; border-radius: 0.75rem; box-shadow: 0 4px 24px rgba(0,0,0,.07)">
</p>

## Motivation

I work at a small company with only three engineers, so efficiency is key. In early 2025, I had to launch two new projects while also developing Rulesforai.app. They all shared a similar stack, and at the same time, one of my colleagues needed to create a back office for each one.

That's when I thought, "Why repeat the same thing over and over again?"
From that idea, Supanext Kit 2 was born: a ready-to-use template that reduces configurations, installations, and headaches. The goal is simple: to help you get started faster and focus on building, not configuring.

## Features
- Complete user authentication flow (sign up, sign in, forgot password, update password, confirm email)
- Landing page with additional sections.
- Dashboard with sidebar and nav.
- Profile settings (update profile info, update password, theme toggle, dark mode toggle)
- Project page (CRUD operations on a table) to use as a template for your own.
- Next.js Cache Components.
- Experimental staleTimes (dynamic, static) for Improving caching and navigation.
- Easy to Customise using https://tweakcn.com/editor/theme

## Tech Stack
- Next.js 16 (App Router) + CacheComponents + React 19.2 + TypeScript
- Supabase auth with SSR cookie pass-through (`@supabase/ssr`) + JWT signing keys
- Tailwind CSS v4 via `@tailwindcss/postcss`; global styles in `app/globals.css`
- ESLint flat config extending `next/core-web-vitals` and `next/typescript`
- Vitest for unit tests
- Path alias `@/*` (see `tsconfig.json`)

## Requirements

- Node.js 18+ (LTS recommended)
- npm (repository includes `package-lock.json`)
- A Supabase project (for auth)

## Setup

1) Clone the repository
```bash
git clone https://github.com/vito8916/supabase-nextjs-starter-template.git
```

1.1) Install dependencies
```bash
npm install
```

2) Environment variables
Create `.env.local` in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Notes:
- The app intentionally gates Supabase-dependent behavior behind env checks. If the two required vars are not present, the UI will still load and middleware will skip auth enforcement.

3) Supabase set up. [See how](#supabase-setup)

4) Supabase Auth Emails Configuration. See how [See how](#supabase-auth-email-configuration)

5) Run the dev server
```bash
npm run dev
```
The app starts on http://localhost:3000 (Turbopack).

## Scripts

Defined in `package.json`:
- `npm run dev` – Next dev with Turbopack on port 3000
- `npm run build` – Production build
- `npm run start` – Start the production server
- `npm run lint` – Lint with ESLint (flat config)
- `npm run test` – Run Vitest once
- `npm run test:watch` – Run Vitest in watch mode

## Environment Variables

Required at runtime when enabling Supabase auth:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Auth & Middleware

- Entry: `middleware.ts` delegates to `lib/supabase/middleware.updateSession()`.
- Behavior when env vars are present:
  - Unauthenticated users are redirected from protected routes to `/login`.
  - Authenticated users are redirected away from `/login` and `/sign-up` to `/dashboard`.
- Public routes (current list): `/login`, `/sign-up`, `/forgot-password`, `/update-password`, `/sign-up-success`, `/error`, any path under `/auth`. The home route `/` is also treated as public by a special-case check.
- Matcher excludes: `_next/static`, `_next/image`, `favicon.ico`, and common image extensions.

See:
- `middleware.ts`
- `lib/supabase/middleware.ts`
- `lib/utils.ts`

## Supabase Setup
You must have a Supabase project with the new API keys and JWT Signing Keys. (free tier is fine).
Go to https://supabase.com/ and create a new project.

NOTE: This project is using the new API keys and the new JWT Signing Key. If you're using the legacy JWT-based API keys (anon, service role secrete) and the legacy JWT secret, watch the Supabase official video tutorial to learn how to change to these new way to work with Supabase.
[How to roll your Supabase project's keys over to JWT Signing Keys](https://youtu.be/rwnOal_xRtM?si=TV35LfHDBcbhW4C5)

## Database Schema
You can find the database schema in `supabase/schema.sql`
We have three tables:
- profiles
- products

These tables are required for the app to work. But you can add more tables as you need.
Only the `profiles` table is required for the app to work. Products is optional. but keep in mind that you will have to remove the code related to it.

I Highly recommend you to run the `supabase/schema.sql` into the SQL Editor in Supabase Dashboard.

## Supabase Auth Email Configuration

### Confirmation Email Configuration

In order to use the email authentication feature, you need to configure the email provider in the Supabase dashboard.
In Supabase dashboard, go to Authentication -> Email -> Confirm sign up.

Replace the email content with:

```aiignore
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your mail</a></p>
```

### Reset Password Email Configuration
In order to use the email reset password feature, you need to configure the email provider in the Supabase dashboard.
In Supabase dashboard, go to Authentication -> Email -> Reset password.

Replace the email content with:

```aiignore
<h2>Reset Password</h2>

<p>Follow this link to reset the password for your user:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/update-password">Reset Password</a></p>
```

## Project Structure

High-level folders:
```
app/
  (protected)/            # Authenticated-only layouts and pages (e.g., dashboard)
  actions/                # Server Actions (auth, settings, etc.)
  page.tsx                # Landing / marketing page
components/
  auth/                   # Auth forms
  dashboard/              # Sidebar, nav, etc.
  settings/               # Profile / password forms
  ui/                     # shadcn/ui components
hooks/
lib/
  supabase/               # SSR/CSR clients, middleware integration
  validations-schemas/    # Zod schemas
  utils.ts
middleware.ts             # Next.js middleware entry
postcss.config.mjs        # Tailwind v4 via @tailwindcss/postcss
eslint.config.mjs         # ESLint flat config
next.config.ts
public/
types/                    # TypeScript types
```

## Entry Points

- App router root: `app/page.tsx`
- Protected area example: `app/(protected)/dashboard/page.tsx`

## Development Notes

- Path alias: `@/*` and `@/public/*` (see `tsconfig.json`)
- Tailwind v4: Utilities-first; configure via `postcss.config.mjs`; global styles in `app/globals.css`
- Prefer Server Components by default; add `"use client"` only when needed

## Deployment

- Works well on platforms like Vercel. Ensure the same env vars are set in the host environment:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
  - `NEXT_PUBLIC_SITE_URL` (set to your production origin)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvito8916%2Fsupabase-nextjs-starter-template)

## License

MIT — see `LICENSE.txt`.

## TODOs

- Update to Next.js 16 and React 19.2 👍
- Implement Cache Components 👍
- Implement Resend and React Email
- Stripe Subscription Integration

