import { BRAND, TICKETING_URL, SOCIALS } from '../lib/constants'

export default function Hero() {
  return (
    <section id="home" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <div className="order-2 md:order-1">
          <p className="eyebrow text-spark-gold">Kano, Nigeria</p>
          <h1 className="mt-3 font-display text-5xl leading-tight sm:text-6xl md:text-7xl">
            {BRAND.name.toUpperCase()}
          </h1>
          <p className="mt-4 text-lg text-blush">{BRAND.roleLine}</p>

          <ul className="mt-6 flex gap-5" aria-label="Follow Faith Abah on social media">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow text-paper/70 transition hover:text-marquee-pink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-sm bg-marquee-pink px-6 py-3 font-semibold text-paper transition hover:bg-marquee-pink/85"
            >
              Book Faith
            </a>
            <a
              href={TICKETING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-spark-gold px-6 py-3 font-semibold text-spark-gold transition hover:bg-spark-gold hover:text-ink"
            >
              Join the Masterclass
            </a>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          <img
            src="/hero-placeholder.svg"
            alt="Faith Abah (Mc Fabs), Master of Ceremonies and Brand Host — cutout portrait"
            className="h-auto w-full max-w-sm"
            width="600"
            height="800"
          />
        </div>
      </div>
    </section>
  )
}
