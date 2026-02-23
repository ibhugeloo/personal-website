# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server on localhost:3000
npm run build    # production build (validates TypeScript + generates static pages)
npm run lint     # ESLint
```

No test suite. Use `npm run build` to validate changes before pushing.

## Stack

- **Next.js 16** App Router, React 19, TypeScript
- **Tailwind CSS v4** (PostCSS plugin, no `tailwind.config.js`)
- **shadcn/ui** components (Radix UI primitives) in `src/components/ui/`
- **Supabase** (`@supabase/supabase-js` + `@supabase/ssr`) for database and auth

## Architecture

### Client vs Server components

Pages that need CRUD (homelab, trail, notes, projects) are `"use client"` components — they import Supabase directly and manage their own state. Static/read-only pages (home, investing, services, business, goal) are server components and can export `metadata` directly.

Because "use client" pages can't export `metadata`, each has a sibling `layout.tsx` in the same folder that exports the page's metadata.

### Auth pattern

`AuthProvider` (in `src/context/auth-context.tsx`) wraps the entire app in `layout.tsx`. It exposes `{ user, signIn, signOut }` via `useAuth()`. CRUD buttons and admin controls only render when `user !== null`. No public signup — accounts are created via the Supabase dashboard.

Middleware (`middleware.ts`) refreshes the Supabase session cookie on every request.

### CRUD pages pattern

All 4 CRUD pages (homelab, trail, notes, projects) follow the same structure:
- `useMemo(() => createClient(), [])` for a stable Supabase client instance
- `isMounted` flag in `useEffect` to avoid setState on unmounted components
- States: `isLoading`, `fetchError`, `isSaving`, `formError`
- `window.confirm()` before any delete
- Modal with backdrop click-to-close (`onClick` on overlay + `stopPropagation` on content)
- `ascending: false` sort order on all queries

### Navigation

All nav items are defined in `src/lib/nav.ts` and imported by both `src/components/sidebar.tsx` and `src/components/mobile-nav.tsx`. Add new routes there first.

### Supabase tables

| Table | Used by |
|---|---|
| `homelab_services` | `/homelab` |
| `trail_gear` | `/trail` |
| `notes` | `/notes` |
| `projects` | `/projects` |

All tables have RLS: `SELECT` is public (anon), `INSERT`/`UPDATE`/`DELETE` require `auth.role() = 'authenticated'`.

## Environment variables

Required in `.env.local` (and in Coolify environment variables for production):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://idriss-bhugeloo.labkreol.re
```

## Deployment

Hosted on **Coolify** (self-hosted). Push to `main` on GitHub (`ibhugeloo/personal-website`) triggers a redeploy. No Vercel.
