import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export function RequireAuth({ children }) {
  const { session, loading, configError } = useAuth();
  if (loading) return <div className="p-8 text-ink">Loading&hellip;</div>;
  if (configError) return <ConfigError />;
  if (!session) return <Navigate to="/" replace />;
  return children;
}

export function RedirectIfAuthed({ children }) {
  const { session, loading, configError } = useAuth();
  if (loading) return <div className="p-8 text-ink">Loading&hellip;</div>;
  if (configError) return <ConfigError />;
  if (session) return <Navigate to="/dashboard" replace />;
  return children;
}

function ConfigError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-md text-center">
        <p className="eyebrow text-spark-gold">Configuration Error</p>
        <h1 className="mt-2 font-display text-2xl text-paper">
          Supabase is not configured
        </h1>
        <p className="mt-4 text-blush">
          Copy{" "}
          <code className="rounded-sm bg-paper/10 px-2 py-1">.env.example</code>{" "}
          to <code className="rounded-sm bg-paper/10 px-2 py-1">.env</code> and
          fill in your Supabase project credentials (VITE_SUPABASE_URL and
          VITE_SUPABASE_ANON_KEY), then restart the dev server.
        </p>
      </div>
    </div>
  );
}
