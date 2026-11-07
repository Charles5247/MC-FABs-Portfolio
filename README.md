# MC FABS — Public Site and Content Studio

Two independent React 19 / Vite applications for Faith Abah (MC FABS), sharing a dedicated Supabase content backend.

| Application | Directory | Purpose | Deployment Guides |
| --- | --- | --- | --- |
| **Public Portfolio** | `mcfabs-site` | Public portfolio, booking form, masterclass, and journal | [Main Site Deployment Guide](#main-site-deployment-mcfabs-site) |
| **Admin Content Studio** | `mcfabs-admin` | Private CMS for gallery, blog drafts, events & announcements | [Admin Deployment Guide](#admin-content-studio-deployment-mcfabs-admin) |

> **Monorepo Architecture Notice:**
> Create two independent projects/services on your hosting platform by importing this repository twice: one rooted in `mcfabs-site` and one rooted in `mcfabs-admin`. Each site builds its own `dist` output, configures its own domain and environment variables, and can be deployed or rolled back independently. Never deploy the repository root or combine both into a single build.

---

## Local Development

Requirements: Node.js 20.x or 24.x.

### 1. Public Portfolio (`mcfabs-site`)
```sh
cd mcfabs-site
npm ci
npm run dev
```
Runs at: **http://localhost:5173**

### 2. Admin Content Studio (`mcfabs-admin`)
```sh
cd mcfabs-admin
npm ci
npm run dev
```
Runs at: **http://localhost:5174**

*(On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`.)*

Run linting with `npm run lint` and production builds with `npm run build` inside each respective directory.

---

## Environment Variables Matrix

### Main Site (`mcfabs-site/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Dedicated content project's Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase public/anon API key (never service role) |
| `VITE_SITE_URL` | Yes | Exact production origin (e.g., `https://mcfabs.com`), no trailing slash |
| `VITE_TICKETING_URL` | Yes | Destination URL for masterclass ticket purchases |
| `VITE_BOOKING_EMAIL` | Optional* | Verified booking contact email |
| `VITE_WHATSAPP_NUMBER` | Optional* | Verified WhatsApp number (country code + number, digits only) |
| `VITE_INSTAGRAM_URL` | Optional | Verified Instagram profile link |
| `VITE_X_URL` | Optional | Verified X / Twitter profile link |
| `VITE_TIKTOK_URL` | Optional | Verified TikTok profile link |
| `VITE_YOUTUBE_URL` | Optional | Verified YouTube channel link |

*\* At least one booking contact method (`VITE_BOOKING_EMAIL` or `VITE_WHATSAPP_NUMBER`) is required to receive client enquiries.*

### Admin Studio (`mcfabs-admin/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Same dedicated Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Same project's public/anon API key |
| `VITE_PUBLIC_SITE_URL` | Yes | Exact production origin of the public site |

---

## Deployment Guides

Detailed instructions to deploy both applications to **Vercel**, **Netlify**, or **Render**.

### Main Site Deployment (`mcfabs-site`)

#### Option A: Vercel

1. Log into [Vercel](https://vercel.com/) and click **Add New... → Project**.
2. Select your Git repository.
3. Configure the project:
   - **Project Name**: `mcfabs-site`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and choose `mcfabs-site`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
4. Add all environment variables from the `mcfabs-site` matrix above.
5. Click **Deploy**. SPA rewrites are handled by [`mcfabs-site/vercel.json`](mcfabs-site/vercel.json).
6. Under **Settings → Domains**, assign your production domain and ensure `VITE_SITE_URL` matches.

#### Option B: Netlify

1. Log into [Netlify](https://app.netlify.com/) and click **Add new site → Import an existing project**.
2. Select your Git provider and the repository.
3. In **Build settings**:
   - **Base directory**: `mcfabs-site`
   - **Build command**: `npm run build`
   - **Publish directory**: `mcfabs-site/dist` (or `dist`)
4. In **Site configuration → Environment variables**, add all `mcfabs-site` variables.
5. Click **Deploy site**.
   - Single-page application deep linking is handled by [`mcfabs-site/public/_redirects`](mcfabs-site/public/_redirects).
6. In **Domain management**, configure your custom domain.

#### Option C: Render

1. Log into [Render](https://dashboard.render.com/) and select **New + → Static Site**.
2. Connect your Git repository.
3. Set the build parameters:
   - **Name**: `mcfabs-site`
   - **Branch**: `main`
   - **Root Directory**: `mcfabs-site`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment**, add `NODE_VERSION: 22` along with the required `VITE_*` variables.
5. Under **Redirects/Rewrites**, create the SPA fallback rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

### Admin Content Studio Deployment (`mcfabs-admin`)

#### Option A: Vercel

1. In [Vercel](https://vercel.com/), click **Add New... → Project** and select the same repository again.
2. Configure the project:
   - **Project Name**: `mcfabs-admin`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and choose `mcfabs-admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
3. Add the three required environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_PUBLIC_SITE_URL`).
4. Click **Deploy**.
   - SPA rewrites and the `X-Robots-Tag: noindex, nofollow` header are automatically configured via [`mcfabs-admin/vercel.json`](mcfabs-admin/vercel.json).
5. Assign a subdomain in **Settings → Domains** (e.g., `admin.mcfabs.com`).

#### Option B: Netlify

1. In [Netlify](https://app.netlify.com/), click **Add new site → Import an existing project** with the repository.
2. Set build configuration:
   - **Base directory**: `mcfabs-admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `mcfabs-admin/dist` (or `dist`)
3. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_PUBLIC_SITE_URL` under **Environment variables**.
4. Click **Deploy site**.
   - SPA rewrites are provided by [`mcfabs-admin/public/_redirects`](mcfabs-admin/public/_redirects).
   - Search engine blocking (`X-Robots-Tag: noindex, nofollow`) is configured via [`mcfabs-admin/public/_headers`](mcfabs-admin/public/_headers).
5. Add your custom subdomain in **Domain management**.

#### Option C: Render

1. In [Render](https://dashboard.render.com/), choose **New + → Static Site**.
2. Configure the site:
   - **Name**: `mcfabs-admin`
   - **Root Directory**: `mcfabs-admin`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Under **Environment**, set `NODE_VERSION: 22` and the admin `VITE_*` variables.
4. Under **Redirects/Rewrites**, add the SPA rewrite rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
5. Under **Headers**, prevent search indexing:
   - **Path**: `/*`
   - **Name**: `X-Robots-Tag`
   - **Value**: `noindex, nofollow`
6. Click **Create Static Site**.

---

## Supabase Configuration & Authentication Setup

1. **Dedicated Project**: Use a dedicated Supabase project for these two applications. Do not share credentials with the external ticketing platform.
2. **Database Schema**: For a new database, run [`supabase/migration.sql`](supabase/migration.sql) once in the Supabase SQL Editor.
3. **Storage Bucket**: Create a public Storage bucket named `media` for photo uploads.
4. **Auth Access Control**:
   - In **Authentication → Providers → Email**: Disable **Enable Signup** (public registrations must stay disabled). Disable anonymous sign-in.
   - In **Authentication → Users**: Manually create administrator account(s). Existing RLS policies grant CMS mutation privileges to authenticated accounts; all registered accounts in this project are trusted administrators.
5. **Auth URL Configuration**:
   - Set the admin production origin (e.g. `https://admin.mcfabs.com` or `https://mcfabs-admin.vercel.app`) as the Supabase Auth **Site URL**.
   - Add exact redirect URLs under **Redirect URLs** (e.g., `https://admin.mcfabs.com/**` and `http://localhost:5174/**`).
6. **Key Safety**: Use only the public `anon` key in client applications. Never embed or expose the `service_role` key.

---

## Client Enquiries & Content Workflow

- **Public Site**: Responsive portrait-led homepage, service cards, masterclass details, journal, gallery, booking FAQs, and event brief generator.
- **Client Brief**: Collects service, name, email, event date, location, budget, and event details. It prepares a structured message for email or WhatsApp. Visitors send the message in their chosen app; the website does not store leads or dispatch emails automatically.
- **Admin Studio**: Manages gallery images, journal drafts/publications, announcements, and masterclass editions. Deletion prompts protect against accidental data removal. Editing published posts retains the original publication date.

---

## Pre-Launch & Verification Checklist

- [ ] **Public Site Deep Links**: Open `/`, `/masterclass`, `/blog`, and a published `/blog/:slug` directly in the browser and refresh to verify SPA rewrites work.
- [ ] **Admin Protected Routes**: Navigate to `/dashboard` while signed out; ensure redirect to `/login` occurs.
- [ ] **Admin Auth**: Log into the admin portal using the manually created Supabase credentials and verify session persistence.
- [ ] **Contact Channels**: Send a test enquiry via WhatsApp and Email to confirm routing.
- [ ] **Sitemap Generation**: Run `npm run build:sitemap` inside `mcfabs-site/` with live Supabase credentials, then commit and deploy updated `public/sitemap.xml` and `public/robots.txt`.
- [ ] **Security Headers**: Verify the admin site responds with `X-Robots-Tag: noindex, nofollow` on page responses.
