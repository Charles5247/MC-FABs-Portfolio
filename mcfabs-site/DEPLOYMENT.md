# Deploying the Main Site (`mcfabs-site`)

This guide covers deploying the public portfolio site for Faith Abah (MC FABS) to **Vercel**, **Netlify**, or **Render**.

> **Important:** This site is deployed as a standalone project targeting the `mcfabs-site` folder. The admin content studio (`mcfabs-admin`) is deployed as an entirely separate site/project with its own URL, settings, and deployment history.

---

## Required Environment Variables

Configure these variables in your hosting provider's dashboard under Environment Variables:

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Dedicated content project's Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Content project's public/anon key (never use service-role key) |
| `VITE_SITE_URL` | Exact public production origin without trailing slash (e.g. `https://mcfabs.com`) |
| `VITE_TICKETING_URL` | Destination URL for external masterclass ticket sales |
| `VITE_BOOKING_EMAIL` | Verified booking inbox address |
| `VITE_WHATSAPP_NUMBER` | Verified international WhatsApp number (country code + number, digits only) |
| `VITE_INSTAGRAM_URL` | *(Optional)* Profile URL |
| `VITE_X_URL` | *(Optional)* Profile URL |
| `VITE_TIKTOK_URL` | *(Optional)* Profile URL |
| `VITE_YOUTUBE_URL` | *(Optional)* Profile URL |

> *Note:* At least one booking contact method (`VITE_BOOKING_EMAIL` or `VITE_WHATSAPP_NUMBER`) is required before launching, otherwise the contact form only prepares a copyable brief and alerts the user that it has not been sent.

---

## 1. Deploying to Vercel

1. Push your code to your Git provider (GitHub, GitLab, Bitbucket).
2. Go to [Vercel](https://vercel.com/dashboard) and click **Add New... → Project**.
3. Select your repository.
4. Set configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `mcfabs-site`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
   - **Node.js Version**: `20.x` or `24.x` (under Project Settings → General)
5. Add all required environment variables under **Environment Variables**.
6. Click **Deploy**.
7. Single-page application rewrites are pre-configured in [`vercel.json`](./vercel.json).
8. Once deployed, add your custom domain in **Settings → Domains** and verify `VITE_SITE_URL` matches.

---

## 2. Deploying to Netlify

1. In the [Netlify Dashboard](https://app.netlify.com/), click **Add new site → Import an existing project**.
2. Authorize and choose your Git repository.
3. Configure build settings:
   - **Base directory**: `mcfabs-site`
   - **Build command**: `npm run build`
   - **Publish directory**: `mcfabs-site/dist` (or `dist`)
4. Add all required `VITE_*` environment variables in **Site configuration → Environment variables**.
5. Click **Deploy site**.
6. SPA routing is automatically maintained by [`public/_redirects`](./public/_redirects) (`/* /index.html 200`), ensuring page refreshes on subroutes do not result in 404s.
7. Configure custom domain in **Domain management**.

---

## 3. Deploying to Render

1. In the [Render Dashboard](https://dashboard.render.com/), click **New + → Static Site**.
2. Connect your Git repository.
3. Configure site settings:
   - **Name**: `mcfabs-site`
   - **Branch**: `main`
   - **Root Directory**: `mcfabs-site`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. In the **Environment** tab:
   - Add `NODE_VERSION`: `22` (or `24`)
   - Add all required `VITE_*` environment variables.
5. In the **Redirects/Rewrites** tab, add an SPA fallback rewrite:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

## Launch Verification

- Direct route refreshes: Open `/`, `/masterclass`, `/blog`, and a published `/blog/:slug` directly in the browser and refresh.
- Enquiries: Test sending an enquiry through both email and WhatsApp channels.
- External Links: Confirm that the masterclass ticket button routes to the correct external ticketing system.
- Sitemap: With production variables in place, run `npm run build:sitemap`, commit, and redeploy.
