import { createClient } from "@supabase/supabase-js";

// Same Supabase project as mcfabs-site. This app uses the anon key + a
// signed-in Supabase Auth session (the single admin account) for all writes.
// RLS policies grant write access only to the `authenticated` role — see
// supabase/migration.sql at the repo root. No service-role key is used here.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If either env var is missing, export null instead of calling createClient
// with empty strings — @supabase/supabase-js throws "supabaseUrl is required."
// / "supabaseKey is required." at module load, which crashes the whole app
// and renders a blank white page. AuthContext handles a null client by
// showing a clear configuration error instead of a blank page.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

if (!supabase) {
  // eslint-disable-next-line no-console
  console.warn(
    "[mcfabs-admin] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.",
  );
}
