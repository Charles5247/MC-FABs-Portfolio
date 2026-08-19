import { useEffect, useState } from 'react'
import { fetchActiveAnnouncement } from '../lib/api'

// NOTE: intentionally sessionStorage, not localStorage — a dismissed popup
// should stay hidden only for the current browser session/tab, and should
// be eligible to show again on the visitor's next visit (e.g. a new
// masterclass poster next week). Do not change this to localStorage.
const dismissedKey = (id) => `mcfabs_popup_dismissed_${id}`

/**
 * Sitewide or page-scoped announcement popup. Fetches the single active
 * announcement (if any) for the given placement and renders it as a
 * dismissible modal. Renders nothing while loading, on error, when there is
 * no active announcement, or when the visitor already dismissed this exact
 * announcement earlier in the session.
 *
 * @param {Object} props
 * @param {'sitewide' | 'masterclass'} props.placement
 */
export default function AnnouncementPopup({ placement }) {
  const [announcement, setAnnouncement] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let active = true
    fetchActiveAnnouncement(placement)
      .then((data) => {
        if (!active) return
        if (data && sessionStorage.getItem(dismissedKey(data.id))) {
          setAnnouncement(null)
        } else {
          setAnnouncement(data)
        }
      })
      .catch(() => {
        if (active) setAnnouncement(null)
      })
    return () => {
      active = false
    }
  }, [placement])

  if (!announcement || dismissed) return null

  const handleDismiss = () => {
    sessionStorage.setItem(dismissedKey(announcement.id), '1')
    setDismissed(true)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="announcement-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-4"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-md bg-paper p-6 text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-sm border border-ink/20 px-2 py-1 text-sm"
          aria-label="Dismiss announcement"
        >
          &times;
        </button>

        {announcement.image_url && (
          <img
            src={announcement.image_url}
            alt={announcement.title || 'Announcement'}
            className="mb-4 w-full object-cover"
          />
        )}

        {announcement.title && (
          <h2 id="announcement-title" className="font-display text-2xl">
            {announcement.title}
          </h2>
        )}

        {announcement.message && <p className="mt-3 text-ink/80">{announcement.message}</p>}

        {announcement.link_url && (
          <a
            href={announcement.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-sm bg-marquee-pink px-5 py-2.5 font-semibold text-paper hover:bg-marquee-pink/85"
          >
            {announcement.button_label || 'Learn More'}
          </a>
        )}
      </div>
    </div>
  )
}
