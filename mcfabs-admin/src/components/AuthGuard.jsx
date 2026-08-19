import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="p-8 text-ink">Loading&hellip;</div>
  if (!session) return <Navigate to="/" replace />
  return children
}

export function RedirectIfAuthed({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <div className="p-8 text-ink">Loading&hellip;</div>
  if (session) return <Navigate to="/dashboard" replace />
  return children
}
