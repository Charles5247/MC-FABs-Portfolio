import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

// This sidebar/layout is built fresh for the admin app — it intentionally
// does NOT import, reuse, or copy the public site's Nav/Footer components.
// The two apps are separate repos with separate component trees by design.
const LINKS = [
  { to: '/dashboard/gallery', label: 'Gallery' },
  { to: '/dashboard/announcements', label: 'Announcements' },
  { to: '/dashboard/blog', label: 'Blog' },
  { to: '/dashboard/masterclass', label: 'Masterclass Editions' },
]

export default function DashboardLayout() {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-row items-center justify-between bg-ink p-4 text-paper md:w-64 md:flex-col md:items-stretch md:justify-start md:p-6">
        <div>
          <p className="eyebrow text-spark-gold">Faith Abah — Admin</p>
          <nav className="mt-2 hidden flex-col gap-1 md:mt-6 md:flex" aria-label="Dashboard">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-sm px-3 py-2 text-sm ${
                    isActive ? 'bg-marquee-pink text-paper' : 'text-paper/70 hover:bg-white/10'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="eyebrow rounded-sm border border-paper/30 px-3 py-2 md:mt-8"
        >
          Log out
        </button>
      </aside>

      {/* Mobile top nav (visible < md) */}
      <nav
        className="flex gap-2 overflow-x-auto bg-plum p-3 md:hidden"
        aria-label="Dashboard (mobile)"
      >
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `eyebrow whitespace-nowrap rounded-sm px-3 py-2 ${
                isActive ? 'bg-marquee-pink text-paper' : 'text-paper/80'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="flex-1 bg-paper p-6">
        <Outlet />
      </main>
    </div>
  )
}
