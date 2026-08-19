import { createClient } from '@supabase/supabase-js'

// Same Supabase project as mcfabs-site. This app uses the anon key + a
// signed-in Supabase Auth session (the single admin account) for all writes.
// RLS policies grant write access only to the `authenticated` role — see
// supabase/migration.sql at the repo root. No service-role key is used here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[mcfabs-admin] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
