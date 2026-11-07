# MC FABS — public site and content studio

Two independent React / Vite applications for Faith Abah (MC FABS), sharing a dedicated Supabase content backend.

| App | Folder | Vercel project root | Guide |
| --- | --- | --- | --- |
| Public portfolio | mcfabs-site | mcfabs-site | [Main site deployment](mcfabs-site/DEPLOYMENT.md) |
| Private content studio | mcfabs-admin | mcfabs-admin | [Admin deployment](mcfabs-admin/DEPLOYMENT.md) |

**Create two Vercel projects by importing this repository twice.** Each builds its own dist folder, has its own domain and environment variables, and can be deployed or rolled back independently. Do not deploy the repository root or combine both apps into one deployment.

## Local development

Use Node.js 24.x. In each app folder, copy .env.example to .env, fill in the values, then run:

```sh
npm ci
npm run dev
```

Public site: http://localhost:5173. Admin: http://localhost:5174.
On Windows PowerShell with script execution disabled, use npm.cmd instead of npm.

Build each app with `npm run build`; lint with `npm run lint`.

## Dedicated Supabase backend

1. Use a dedicated project for these two applications, separate from the ticketing platform.
2. For a new database only, run supabase/migration.sql once through the SQL editor.
3. Create a public Storage bucket named media.
4. Disable public sign-up and anonymous sign-ins. Create the trusted admin user manually in Authentication → Users. The existing RLS policies grant CMS writes to authenticated users: all accounts in this project must be trusted administrators.
5. Set the admin production origin as Supabase Auth Site URL and add the exact redirect URLs needed for admin authentication.
6. Set the same Supabase URL and public/anon key in both apps. Never expose a service-role key in either application.

The external ticketing platform remains a plain outbound link. Its users, payments, database, and credentials are separate.

## Client enquiries and content

- Public site: responsive portrait-led home page, service cards, masterclass, journal, gallery, booking FAQs, and an event brief form.
- The form collects service, name, email, event date, location, budget, and event details. It prepares a message for email or WhatsApp. The visitor must send the message in that app; the website does not save leads or automatically send email.
- Configure VITE_BOOKING_EMAIL and/or VITE_WHATSAPP_NUMBER before launch. With neither set, visitors can only prepare a copyable brief. No enquiry is reported as sent.
- Only configured social links are shown. Unverified statistics, testimonials, and logos remain hidden.
- Static brand and service copy lives in mcfabs-site/src/lib/constants.js.
- Admin manages gallery images, journal drafts/publications, announcements, and masterclass editions. Overview shows database content totals and quick management links.
- Deletion prompts protect against accidental removal. Editing published journal posts retains their original publication date.

## Production checklist

Follow both deployment guides, including environment variables, separate root directories, auth setup, and deep-link checks. Supply verified contacts, event details, and approved brand content. Regenerate the sitemap for the final public domain after publishing blog URLs, and update robots.txt.

Both apps include Vercel SPA rewrites. The admin also sends a noindex header; authentication and RLS provide actual access control.

No new database schema is needed for this redesign. No production deployment or live database mutation is performed by the local changes.
