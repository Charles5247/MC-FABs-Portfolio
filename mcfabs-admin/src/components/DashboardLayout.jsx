import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
const LINKS = [
  { to: '/dashboard', label: 'Overview', icon: '◈' },
  { to: '/dashboard/gallery', label: 'Gallery', icon: '▧' },
  { to: '/dashboard/announcements', label: 'Announcements', icon: '◉' },
  { to: '/dashboard/blog', label: 'Journal', icon: '≡' },
  { to: '/dashboard/masterclass', label: 'Masterclass', icon: '✦' },
]
export default function DashboardLayout() {
  const { signOut, session } = useAuth()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const location = useLocation()
  async function logout() {
    setBusy(true); setError('')
    try { const result = await signOut(); if (result.error) throw result.error }
    catch { setError('Could not log out. Please try again.') }
    finally { setBusy(false) }
  }
  return <div className="admin-shell"><aside className="admin-sidebar"><div className="admin-brand">MC FABS<span>CONTENT STUDIO</span></div><p className="eyebrow sidebar-label">Workspace</p><nav aria-label="Dashboard">{LINKS.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/dashboard'} className={({isActive}) => isActive ? 'active' : ''}><span aria-hidden="true">{link.icon}</span>{link.label}</NavLink>)}</nav><div className="admin-account"><p>{session?.user?.email}</p><button onClick={logout} disabled={busy}>{busy ? 'Logging out…' : 'Log out ↗'}</button>{error && <p role="alert">{error}</p>}</div></aside>
  <div className="admin-body"><header className="admin-topbar"><span>Workspace <span aria-hidden="true">/</span> <strong>{LINKS.find(l => l.to === location.pathname)?.label || 'Content'}</strong></span>{import.meta.env.VITE_PUBLIC_SITE_URL && <a href={import.meta.env.VITE_PUBLIC_SITE_URL} target="_blank" rel="noopener noreferrer">View public site ↗</a>}</header><main className="admin-content"><Outlet /></main></div></div>
}