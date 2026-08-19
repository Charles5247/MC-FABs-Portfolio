# MC FABS Web Presence — Public Site + Admin CMS

Two separate Vite/React/Tailwind/Supabase apps for Faith Abah ("Mc Fabs"):

| App | Folder | Deploy target | Purpose |
|---|---|---|---|
| Public site | `mcfabs-site/` | `mcfabs.onrender.com` | Home, Masterclass, Blog (public, read-only) |
| Admin CMS | `mcfabs-admin/` | `mcfabs-admin.onrender.com` | Faith's private content dashboard |

Both use the **same new, dedicated Supabase project** (see `supabase/migration.sql`).
This project is completely separate from the existing ticketing platform
(`fabs-masterclass.onrender.com`) — no shared tables, credentials, or DB
connection. The only link is a plain hyperlink from the public site out to
the ticketing platform.

## 1. Supabase setup (one project, shared by both apps)

1. Create a new Supabase project (separate from the ticketing platform's project).
2. SQL Editor → paste and run `supabase/migration.sql` once. This creates
   `gallery_images`, `announcements`, `blog_posts`, `masterclass_editions`,
   their RLS policies, and storage policies.
3. Storage → New bucket → name it `media`, **Public bucket = ON**.
4. Authentication → Users → **Add user manually** (email/password) — this is
   Faith's single admin account. Do not enable public sign-ups.
5. Authentication → URL Configuration → add both
   `https://mcfabs.onrender.com` and `https://mcfabs-admin.onrender.com` to
   Site URL / Redirect URLs so Supabase Auth and CORS work for both origins.
6. Project Settings → API → copy the **Project URL** and **anon/public key**
   — you'll use the same two values in both apps' `.env` files. Never use
   the service-role key in either app.

## 2. Run locally

Each app is independent — install and run separately:

```bash
cd mcfabs-site
cp .env.example .env   # fill in your Supabase URL/anon key
npm install
npm run dev             # http://localhost:5173

cd ../mcfabs-admin
cp .env.example .env   # same Supabase URL/anon key
npm install
npm run dev             # http://localhost:5174
```

## 3. Build & deploy to Render (two separate services)

For **each** app, create a separate Render **Static Site** (or Web Service
serving the `dist/` output):

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variables: set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  (both apps), plus `VITE_SITE_URL` / `VITE_TICKETING_URL` (site) or
  `VITE_PUBLIC_SITE_URL` (admin) — see each app's `.env.example`.
- `mcfabs-site` → deploy as `mcfabs.onrender.com`
- `mcfabs-admin` → deploy as `mcfabs-admin.onrender.com`

Since this is a client-side SPA (React Router), configure Render's rewrite
rule `/*  →  /index.html` (200) for both services so deep links work.

## 4. Where to plug in real content

- **Bio, stats, testimonials, roles, socials, contact info**: all in
  `mcfabs-site/src/lib/constants.js`, each marked with `TODO:` comments.
- **Gallery photos, blog posts, popups, masterclass editions**: managed
  entirely from the admin app once deployed and logged in — no code changes
  needed.
- **Hero image / favicon / default OG image**: placeholder flat-design
  assets live in `mcfabs-site/public/` (`hero-placeholder.svg`,
  `favicon*.png/.ico`, `og-default.jpg`). Replace with real photography when
  available.

## 5. Sitemap maintenance

`mcfabs-site/public/sitemap.xml` ships with the static routes only. Blog
post URLs are dynamic (stored in Supabase). After publishing new posts, run:

```bash
cd mcfabs-site
node scripts/generate-sitemap.js
```

This regenerates `public/sitemap.xml` with every published post included.
Commit and redeploy afterward. (See the comment in `sitemap.xml` itself.)

## 6. Keeping design tokens in sync

`shared/tokens.css` is the source of truth for brand colors/fonts. It is
duplicated at `mcfabs-site/src/styles/tokens.css` and
`mcfabs-admin/src/styles/tokens.css` because these are two independent Vite
projects with no shared build tooling. If you change a token, copy
`shared/tokens.css` into both locations manually.

## 7. Project structure

```
mcfabs-site/    Public site — Home, Masterclass, Blog (anon key, read-only)
mcfabs-admin/   Admin dashboard — Gallery/Announcements/Blog/Masterclass CMS
supabase/       migration.sql — shared DB schema + RLS, run once
shared/         tokens.css — canonical design tokens (duplicated into both apps)
```

## Notes on scope

- The admin app's nav/layout (`DashboardLayout.jsx`) is built fresh and does
  **not** import or copy the public site's `Nav`/`Footer` components — they
  are separate repos, separate component trees, by design.
- The admin app is excluded from SEO: `robots.txt` disallow-all + a
  `noindex, nofollow` meta tag in `index.html`.
- The announcement popup dismissal uses `sessionStorage` (not
  `localStorage`) intentionally — see the comment in
  `mcfabs-site/src/components/AnnouncementPopup.jsx`.
- Masterclass edition data on the public site is entered manually in the
  admin app; it is never synced automatically from the ticketing platform.
