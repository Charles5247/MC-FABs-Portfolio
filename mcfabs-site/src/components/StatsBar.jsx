import { STATS } from '../lib/constants'

export default function StatsBar() {
  if (!STATS.length) return null
  return (
    <section className="bg-ink py-12" aria-label="Faith Abah in numbers">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 text-center sm:grid-cols-3 sm:px-6">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-4xl text-marquee-pink sm:text-5xl">{stat.value}</p>
            <p className="eyebrow mt-2 text-blush">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
