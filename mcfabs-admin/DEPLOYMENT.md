# Deploying the Admin Content Studio (`mcfabs-admin`)

This guide covers deploying the private content management studio for Faith Abah (MC FABS) to **Vercel**, **Netlify**, or **Render**.

> **Important:** This is a **separate project/site**, not a subroute inside the public portfolio site. Import the repository a second time and set the root directory to `mcfabs-admin`.

---

## Required Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Dedicated content project's Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | Public / anon API key (never use service-role key) |
| `VITE_PUBLIC_SITE_URL` | Main public site's production origin (e.g. `https://mcfabs.com`) |

---

## Supabase Auth Configuration

Before deploying:
1. Under **Authentication → URL Configuration**:
   - **Site URL**: Enter the admin production origin (e.g., `https://admin.mcfabs.com`).
   - **Redirect URLs**: Add both `https://admin.mcfabs.com/**` and `http://localhost:5174/**`.
2. Under **Authentication → Providers → Email**:
   - Disable **Enable Signup** (public registration must be disabled).
   - Disable anonymous sign-ins.
3. Under **Authentication → Users**:
   - Manually provision only trusted admin accounts. RLS grants full editing privileges to authenticated users in this dedicated project.

---

## 1. Deploying to Vercel

1. Push your repository to Git.
2. In [Vercel](https://vercel.com/dashboard), click **Add New... → Project**.
3. Select the repository (imported as a separate project).
4. Configure settings:
   - **Project Name**: `mcfabs-admin`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `mcfabs-admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
   - **Node.js Version**: `20.x` or `24.x`
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PUBLIC_SITE_URL`
6. Click **Deploy**.
   - SPA route rewrites and search engine blocking (`X-Robots-Tag: noindex, nofollow`) are pre-configured in [`vercel.json`](./vercel.json).
7. Under **Settings → Domains**, assign your admin domain or subdomain (e.g., `admin.mcfabs.com`).

---

## 2. Deploying to Netlify

1. In [Netlify](https://app.netlify.com/), click **Add new site → Import an existing project**.
2. Select your repository.
3. Configure build settings:
   - **Base directory**: `mcfabs-admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `mcfabs-admin/dist` (or `dist`)
4. In **Site configuration → Environment variables**, add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_PUBLIC_SITE_URL`.
5. Click **Deploy site**.
   - SPA rewrites are provided by [`public/_redirects`](./public/_redirects).
   - Search indexing prevention (`X-Robots-Tag: noindex, nofollow`) is configured via [`public/_headers`](./public/_headers).
6. Configure custom domain in **Domain management** and update Supabase Site URL.

---

## 3. Deploying to Render

1. In [Render](https://dashboard.render.com/), click **New + → Static Site**.
2. Connect the Git repository.
3. Configure site settings:
   - **Name**: `mcfabs-admin`
   - **Root Directory**: `mcfabs-admin`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. In the **Environment** tab:
   - Add `NODE_VERSION`: `22` (or `24`)
   - Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_PUBLIC_SITE_URL`.
5. In the **Redirects/Rewrites** tab, add the SPA rewrite rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. In the **Headers** tab, prevent search engine indexing:
   - **Path**: `/*`
   - **Name**: `X-Robots-Tag`
   - **Value**: `noindex, nofollow`
7. Click **Create Static Site**.

---

## Post-Deployment Verification

- Unauthenticated route check: Navigate to `/dashboard` directly while signed out; ensure redirect to `/login`.
- Login: Authenticate with the manually created Supabase credentials.
- Deep links & refreshes: Refresh the browser on `/dashboard/blog` to verify SPA rewrites work.
- Content updates: Test creating and updating gallery items, journal posts, announcements, and masterclass details.
- Header check: Confirm response headers include `X-Robots-Tag: noindex, nofollow`.
