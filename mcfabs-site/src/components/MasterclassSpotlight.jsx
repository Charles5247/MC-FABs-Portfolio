import { Link } from 'react-router-dom'
import { BRAND } from '../lib/constants'

export default function MasterclassSpotlight() {
  return (
    <section className="bg-marquee-pink py-16 sm:py-20" aria-labelledby="masterclass-spotlight-heading">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="eyebrow text-ink/70">MC FABS Exclusive</p>
        <h2 id="masterclass-spotlight-heading" className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          {BRAND.tagline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink/80">
          TODO: [One-sentence teaser about the Masterclass — who it's for and what they'll walk
          away with.]
        </p>
        <Link
          to="/masterclass"
          className="mt-6 inline-block rounded-sm bg-ink px-6 py-3 font-semibold text-paper transition hover:bg-ink/85"
        >
          Explore the Masterclass
        </Link>
      </div>
    </section>
  )
}
