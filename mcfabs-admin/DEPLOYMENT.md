# Deploy the admin app to Vercel

This is a **separate Vercel project**, not a route inside the public site.

1. Import the same Git repository again using Add New → Project.
2. Give it a distinct name, for example mcfabs-admin.
3. Set **Root Directory to mcfabs-admin**.
4. Select Vite, Install Command `npm ci`, Build Command `npm run build`, Output Directory `dist`, and Node.js 24.x.
5. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the same dedicated content project used by the public site.
6. Add VITE_PUBLIC_SITE_URL with the main site's production HTTPS origin.
7. Deploy. Optionally attach a separate admin subdomain in Settings → Domains.
8. In Supabase Auth URL Configuration, use the admin origin as Site URL and allow the exact admin redirect URLs you use. Disable public sign-up and anonymous sign-in. Manually create only trusted admin accounts.

Never expose a service-role key. The existing schema gives authenticated accounts CMS privileges, so this project must not contain ordinary customer accounts. The public ticketing platform must retain its separate database. Robots exclusions and the X-Robots-Tag header prevent indexing; access control comes from Supabase Auth and database/storage RLS.

## Verification

- Visit /dashboard in a signed-out browser: it must redirect to login.
- Sign in with the manually provisioned admin account.
- Check Overview totals, refresh them, and use each management link.
- Create a draft journal post; verify it is absent from the public site.
- Publish a test post and verify it appears. Confirm editing it preserves its original publication date.
- Upload a photo and verify its public display and alt text.
- Check announcement schedules and masterclass ticket links.
- Open /dashboard/blog directly and refresh: the included SPA rewrite must keep the route working.
- Test mobile navigation and the View public site link.
- Log out, then confirm protected routes redirect again.

Each Vercel project has its own variables, domains, deployment history, and rollback. A Git push can trigger both projects, but each builds independently from its configured folder. Roll back this project from its Deployments page without changing the public deployment. Database edits are not rolled back by Vercel.

Official references: [Vercel monorepos](https://vercel.com/docs/monorepos), [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).
