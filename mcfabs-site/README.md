# MC FABS — Public Portfolio Site (`mcfabs-site`)

The public-facing portfolio website for Faith Abah (MC FABS), built with React 19, Vite, and Tailwind CSS. Connects to a dedicated Supabase content backend for gallery items, journal/blog posts, masterclass events, and announcements.

---

## Quick Start (Local Development)

1. Navigate to this directory:
   ```sh
   cd mcfabs-site
   ```
2. Copy environment variables:
   ```sh
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*
3. Install dependencies and start the dev server:
   ```sh
   npm ci
   npm run dev
   ```
   The site runs by default at `http://localhost:5173`.

---

## Environment Variables

Configure these in `.env` locally and in your hosting dashboard for production:

| Variable | Description | Example / Note |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public / anon API key | `eyJhbGciOi...` (Never use service role) |
| `VITE_SITE_URL` | Public production URL (no trailing slash) | `https://mcfabs.com` |
| `VITE_TICKETING_URL` | External masterclass ticketing link | `https://fabs-masterclass.onrender.com` |
| `VITE_BOOKING_EMAIL` | Verified booking inbox | `bookings@mcfabs.com` |
| `VITE_WHATSAPP_NUMBER` | Booking WhatsApp (country code + number, digits only) | `2348012345678` |
| `VITE_INSTAGRAM_URL` | *(Optional)* Instagram profile URL | `https://instagram.com/mcfabs` |
| `VITE_X_URL` | *(Optional)* X / Twitter profile URL | `https://x.com/mcfabs` |
| `VITE_TIKTOK_URL` | *(Optional)* TikTok profile URL | `https://tiktok.com/@mcfabs` |
| `VITE_YOUTUBE_URL` | *(Optional)* YouTube channel URL | `https://youtube.com/@mcfabs` |

> **Note:** At least one booking channel (`VITE_BOOKING_EMAIL` or `VITE_WHATSAPP_NUMBER`) must be configured to receive client enquiries.

---

## Deployment Guides

Because this repository is a monorepo containing both the public site (`mcfabs-site`) and admin studio (`mcfabs-admin`), **deploy each application as an independent project/site targeting its specific root directory.**

### Option 1: Deploying to Vercel (Recommended)

1. **Import Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New...** → **Project**.
   - Select the Git repository containing `MC-FABs-Portfolio`.
2. **Configure Project Settings**:
   - **Project Name**: `mcfabs-site` (or your preferred site name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `mcfabs-site`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
   - **Node.js Version**: `20.x` or `24.x` (in Project Settings → General)
3. **Environment Variables**:
   - Add all variables listed in the [Environment Variables](#environment-variables) table under **Environment Variables**.
4. **Deploy**:
   - Click **Deploy**. SPA routing rewrites are automatically handled via [`vercel.json`](./vercel.json).
5. **Custom Domain**:
   - Under **Settings → Domains**, assign your production domain (e.g. `mcfabs.com`). Ensure `VITE_SITE_URL` matches this domain.

---

### Option 2: Deploying to Netlify

1. **Import Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com/) → **Add new site** → **Import an existing project**.
   - Connect your Git provider and choose the repository.
2. **Build & Deploy Configuration**:
   - **Base directory**: `mcfabs-site`
   - **Build command**: `npm run build`
   - **Publish directory**: `mcfabs-site/dist` (or `dist` if base directory is set to `mcfabs-site`)
3. **Environment Variables**:
   - In **Site configuration → Environment variables**, add all the required `VITE_*` keys.
4. **Single-Page Application (SPA) Routing**:
   - SPA routing is already preconfigured via [`public/_redirects`](./public/_redirects) (`/* /index.html 200`), ensuring deep links (like `/blog/:slug` or `/masterclass`) do not return 404 on refresh.
5. **Deploy & Set Domain**:
   - Click **Deploy site**. Configure your custom domain under **Domain management**.

---

### Option 3: Deploying to Render

1. **Create Static Site**:
   - Go to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Static Site**.
   - Connect and select your GitHub/GitLab repository.
2. **Configure Settings**:
   - **Name**: `mcfabs-site`
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `mcfabs-site`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. **Environment Variables**:
   - In the **Environment** tab, add:
     - `NODE_VERSION`: `22` (or `24`)
     - All the required `VITE_*` variables.
4. **SPA Rewrite Rule (Crucial)**:
   - Navigate to **Redirects/Rewrites** in the Render site dashboard.
   - Click **Add Rule**:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
5. **Deploy**:
   - Click **Save Changes** / **Manual Deploy** → **Deploy latest commit**.

---

## Post-Deployment Checklist

- [ ] Test root URL (`/`) and navigate through Services, Gallery, Journal, Masterclass, and Booking.
- [ ] Direct page refresh: Open `/masterclass` or a published `/blog/<slug>` and reload the browser to ensure SPA rewrites route correctly.
- [ ] Test the Booking brief submission via Email and WhatsApp.
- [ ] Generate the updated sitemap for production:
  ```sh
  npm run build:sitemap
  ```
  Ensure `public/robots.txt` and `public/sitemap.xml` are committed or deployed with your final domain.
