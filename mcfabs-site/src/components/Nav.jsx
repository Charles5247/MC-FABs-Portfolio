import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS, BRAND } from '../lib/constants'

/**
 * Sticky site navigation. Renders a horizontal link row on desktop and a
 * hamburger-triggered panel on mobile. Fully keyboard-navigable: the toggle
 * button exposes aria-expanded/aria-controls, and the mobile panel traps
 * nothing but is reachable via Tab in document order (simple, robust choice
 * for a short link list).
 */
export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const isBlogArea = location.pathname.startsWith('/blog')
  const isMasterclass = location.pathname.startsWith('/masterclass')

  const resolveHref = (href) => {
    // Home-page in-page anchors only work when we're already on "/".
    if (href.startsWith('/#') && (isBlogArea || isMasterclass)) {
      return href // React Router + browser will still navigate to "/" then hash
    }
    return href
  }

  return (
    <header className="sticky top-0 z-50 bg-ink text-paper border-b border-white/10">
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Primary"
      >
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-wide text-paper hover:text-marquee-pink"
        >
          {BRAND.stageName.toUpperCase()}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={resolveHref(link.href)}
                className="eyebrow text-paper/80 transition hover:text-marquee-pink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex items-center justify-center rounded-sm border border-paper/30 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav-panel"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M4 4L18 18M18 4L4 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path d="M2 5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 11H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M2 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-nav-panel" className="border-t border-white/10 px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={resolveHref(link.href)}
                  className="eyebrow block text-paper/80"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
