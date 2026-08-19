import { ABOUT_PARAGRAPHS } from '../lib/constants'

export default function About() {
  return (
    <section id="about" className="bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="eyebrow text-marquee-pink">About</p>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          The Voice Behind the Stage
        </h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
          {ABOUT_PARAGRAPHS.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
