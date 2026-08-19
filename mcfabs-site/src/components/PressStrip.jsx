import { PRESS_LOGOS } from '../lib/constants'

/**
 * Press/brand logos strip. Only renders when PRESS_LOGOS has entries, per
 * the brief ("only renders if logos exist").
 */
export default function PressStrip() {
  if (!PRESS_LOGOS || PRESS_LOGOS.length === 0) return null

  return (
    <section className="bg-paper py-12" aria-label="Press and brand mentions">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-center text-ink/50">As Seen With</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-10 opacity-80">
          {PRESS_LOGOS.map((logo) => (
            <a
              key={logo.name}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={logo.name}
            >
              <img src={logo.logoUrl} alt={logo.name} className="h-8 w-auto grayscale" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
