import { TESTIMONIALS } from '../lib/constants'

export default function Testimonials() {
  return (
    <section className="bg-plum py-16 sm:py-24" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="eyebrow text-spark-gold">Kind Words</p>
        <h2 id="testimonials-heading" className="mt-3 font-display text-3xl text-paper sm:text-4xl">
          What People Say
        </h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="border border-dashed border-spark-gold/50 p-6">
              <blockquote className="font-display text-lg text-paper">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-blush">
                <span className="font-semibold text-paper">{t.name}</span>
                {t.role && <span> &middot; {t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
