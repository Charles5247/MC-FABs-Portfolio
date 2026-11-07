# Deploy the main site to Vercel

Create a standalone Vercel project for this folder. The admin app is a second project with its own URL and deployment history.

1. Push the repository to your Git provider.
2. In Vercel, choose Add New → Project and import the repository.
3. Name the project (for example, mcfabs-site). Set **Root Directory to mcfabs-site**.
4. Select Vite, Install Command `npm ci`, Build Command `npm run build`, Output Directory `dist`. Select Node.js 24.x.
5. Add the environment variables below to Production (and Preview if needed).
6. Deploy. Set your custom domain under project Settings → Domains if desired.
7. Once the final domain is known, update VITE_SITE_URL to that HTTPS origin and redeploy.

## Environment variables

| Variable | Value |
| --- | --- |
| VITE_SUPABASE_URL | Dedicated content project's Supabase URL |
| VITE_SUPABASE_ANON_KEY | Same project's public/anon key; never service-role |
| VITE_SITE_URL | Exact public production origin, no trailing slash |
| VITE_TICKETING_URL | Confirmed external ticketing URL |
| VITE_BOOKING_EMAIL | Verified booking inbox |
| VITE_WHATSAPP_NUMBER | Verified international number, digits only |
| VITE_INSTAGRAM_URL, VITE_X_URL, VITE_TIKTOK_URL, VITE_YOUTUBE_URL | Optional verified HTTPS profiles |

At least one booking channel is required to receive enquiries. Without one, the form only prepares a copyable brief and clearly says it has not been sent. With a channel, the visitor still presses Send in their email/WhatsApp app. There is no server-side lead storage or automatic email delivery.

Vite embeds VITE_ variables in the browser bundle at build time. Set them per Vercel project and redeploy after changes. Do not put private credentials in them.

## Backend and launch checks

Use the dedicated content Supabase project described in the repository README. The ticket platform remains separate. Apply the existing schema once to a new project; configure the public media bucket and the single manually provisioned admin account. Do not enable public registration: the existing CMS policies trust authenticated users as admins.

- Open /, /masterclass, /blog, and a published /blog/slug directly and refresh. The included vercel.json provides the SPA fallback.
- Test at phone and desktop widths. Confirm portraits load from bundled assets.
- Send a real test enquiry through each enabled channel and verify it arrives.
- Confirm the external ticket destination, event dates, and contact profiles.
- Publish content in the separate admin and confirm it appears publicly.
- Verify unconfigured credentials do not show a blank page.
- Update public/robots.txt and public/sitemap.xml to your actual domain. With real Supabase variables available, run `npm run build:sitemap` from this folder, then rebuild and redeploy. Repeat after publishing new blog URLs.
- Add only verified client quotes, logos, and statistics to src/lib/constants.js.

## Rollback

Use this project's Deployments page to promote a known-good deployment. This does not roll back Supabase content. Preview deployments use the database you configure; use a separate test database if changes must not affect production.

Official references: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [Monorepos](https://vercel.com/docs/monorepos), [Rewrites](https://vercel.com/docs/routing/rewrites).
