# MC FABS — Admin Content Studio (`mcfabs-admin`)

The private content management studio for Faith Abah (MC FABS), built with React 19, Vite, and Tailwind CSS. Connects to the shared Supabase content backend to manage gallery assets, announcements, journal articles, and masterclass sessions.

---

## Quick Start (Local Development)

1. Navigate to this directory:
   ```sh
   cd mcfabs-admin
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
   The admin studio runs by default at `http://localhost:5174`.

---

## Environment Variables

| Variable | Description | Example / Note |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Dedicated content project's Supabase URL | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public / anon API key | `eyJhbGciOi...` (Never use service role) |
| `VITE_PUBLIC_SITE_URL` | Main public site's production origin | `https://mcfabs.com` |

> **Security Note:** Never expose the Supabase `service_role` key in client applications. The admin interface uses standard client authentication and Supabase Row Level Security (RLS). All accounts in this Supabase project must be trusted administrators.

---

## Supabase Authentication Configuration

Before deploying, configure your Supabase project:
1. In **Authentication → URL Configuration**:
   - **Site URL**: Set to your production admin domain (e.g., `https://admin.mcfabs.com` or `https://mcfabs-admin.vercel.app`).
   - **Redirect URLs**: Add both local development (`http://localhost:5174/**`) and production origins (`https://admin.mcfabs.com/**`).
2. In **Authentication → Providers → Email**:
   - Disable **Enable Signup** (public registration must be disabled).
   - Disable anonymous sign-ins.
3. In **Authentication → Users**:
   - Manually create the administrator user account using **Add User → Create User**.

---

## Deployment Guides

Deploy the admin app as an independent project separate from the public portfolio site.

### Option 1: Deploying to Vercel (Recommended)

1. **Import Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New...** → **Project**.
   - Select the `MC-FABs-Portfolio` repository (imported a second time).
2. **Configure Project Settings**:
   - **Project Name**: `mcfabs-admin`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `mcfabs-admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
   - **Node.js Version**: `20.x` or `24.x`
3. **Environment Variables**:
   - Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_PUBLIC_SITE_URL`.
4. **Deploy**:
   - Click **Deploy**. SPA rewrites and the `X-Robots-Tag: noindex, nofollow` header are automatically applied from [`vercel.json`](./vercel.json).
5. **Set Admin Domain**:
   - Under **Settings → Domains**, assign your admin domain/subdomain (e.g. `admin.mcfabs.com`). Update Supabase Auth Redirect URLs accordingly.

---

### Option 2: Deploying to Netlify

1. **Import Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com/) → **Add new site** → **Import an existing project**.
   - Connect your Git provider and select the repository.
2. **Build & Deploy Configuration**:
   - **Base directory**: `mcfabs-admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `mcfabs-admin/dist` (or `dist` if base directory is set to `mcfabs-admin`)
3. **Environment Variables**:
   - Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_PUBLIC_SITE_URL`.
4. **SPA Rewrites & Security Headers**:
   - Already configured in `mcfabs-admin/public/`:
     - [`_redirects`](./public/_redirects): `/* /index.html 200` (prevents 404 on direct route refresh).
     - [`_headers`](./public/_headers): Sets `X-Robots-Tag: noindex, nofollow` to prevent search engine indexing.
5. **Deploy**:
   - Click **Deploy site**. Update your Supabase Auth Site URL with the assigned Netlify domain.

---

### Option 3: Deploying to Render

1. **Create Static Site**:
   - Go to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Static Site**.
   - Select your repository.
2. **Configure Settings**:
   - **Name**: `mcfabs-admin`
   - **Root Directory**: `mcfabs-admin`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. **Environment Variables**:
   - `NODE_VERSION`: `22` (or `24`)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PUBLIC_SITE_URL`
4. **SPA Rewrite & Security Header Rules**:
   - Navigate to **Redirects/Rewrites**:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
   - Navigate to **Headers**:
     - **Path**: `/*`
     - **Name**: `X-Robots-Tag`
     - **Value**: `noindex, nofollow`
5. **Deploy**:
   - Click **Save Changes** / **Manual Deploy**.

---

## Post-Deployment Verification

- [ ] Unauthenticated redirect: Visiting `/dashboard` while signed out redirects to `/login`.
- [ ] Authentication: Log in with the manually created Supabase credentials.
- [ ] Session refresh: Refresh the page on `/dashboard/blog` to verify SPA rewrites maintain state without 404.
- [ ] Content management: Test creating or editing an announcement, journal post, or gallery item.
- [ ] Sign out: Confirm logging out clears the session and returns to login.
