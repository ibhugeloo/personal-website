# idriss-bhugeloo.labkreol.re

Site personnel d'Idriss Bhugeloo — ingenieur telecom et systemes base a La Reunion.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** (PostCSS plugin)
- **shadcn/ui** (composants Radix UI)
- **Supabase** (base de donnees, auth, RLS)
- **PostHog** (analytics)

## Pages

| Route | Description |
|---|---|
| `/` | Accueil — presentation, badge disponibilite, liens rapides |
| `/notes` | Notes personnelles (CRUD) |
| `/projects` | Projets techniques (CRUD) |
| `/investing` | Portefeuille d'investissement |
| `/services` | Offre de services (dev web, NAS) |
| `/business` | Systm.re — revente materiel tech |
| `/goal` | Goal.re — projet textile |
| `/trail` | Equipement trail (CRUD) |
| `/homelab` | Services homelab Proxmox (CRUD) |

## Developpement

```bash
npm install
npm run dev       # serveur dev sur localhost:3000
npm run build     # build production (valide TypeScript + pages statiques)
npm run lint      # ESLint
```

## Variables d'environnement

Creer un fichier `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://idriss-bhugeloo.labkreol.re
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

## Architecture

- Pages statiques (home, services, investing, business, goal) = Server Components
- Pages CRUD (notes, projects, homelab, trail) = Client Components avec Supabase direct
- Auth via `AuthProvider` — pas de signup public, comptes crees via dashboard Supabase
- Navigation centralisee dans `src/lib/nav.ts`

## Deploiement

Self-hosted sur **Coolify**. Push sur `main` declenche un redeploy automatique.
