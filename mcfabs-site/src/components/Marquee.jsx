import { EVENT_CATEGORIES } from '../lib/constants'

/**
 * Auto-scrolling ticker strip of event categories. Pauses on hover/focus.
 * Respects prefers-reduced-motion via the .animate-marquee utility defined
 * in index.css (animation disabled entirely under that media query).
 * The list is duplicated once so the CSS translateX(-50%) loop is seamless.
 */
export default function Marquee() {
  const items = EVENT_CATEGORIES

  return (
    <div
      className="group overflow-hidden border-y border-spark-gold/40 bg-plum py-4"
      role="region"
      aria-label="Event categories Faith hosts"
    >
      <div className="flex w-max animate-marquee gap-8 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="eyebrow whitespace-nowrap text-blush"
            aria-hidden={i >= items.length ? 'true' : undefined}
          >
            {item} <span className="mx-4 text-spark-gold">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  )
}
