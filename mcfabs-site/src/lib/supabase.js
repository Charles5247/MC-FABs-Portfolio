import { createClient } from '@supabase/supabase-js'

// This app uses the anon/public key ONLY. It is read-only against Supabase —
// RLS policies (see supabase/migration.sql at the repo root) restrict the
// anon role to published/active rows. Never import a service-role key here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loudly in dev so misconfigured env vars are obvious, without
  // crashing the whole app in production (public marketing site).
  // eslint-disable-next-line no-console
  console.warn(
    '[mcfabs-site] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env and fill in your Supabase project credentials.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    // Public site never signs a user in — disable session persistence so no
    // auth machinery runs on this read-only, public-facing app.
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
