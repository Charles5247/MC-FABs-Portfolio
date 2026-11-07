import portrait from '../Fabs-sit.jpg'
import { ABOUT_PARAGRAPHS } from "../lib/constants";

export default function About() {
  return (
    <section
      id="about"
      className="bg-paper grid py-16 md:items-center sm:py-24 md:grid-cols-2"
    >
      <div className="order-1 flex justify-center md:order-1">
        <img
          src={portrait} loading="lazy"
          alt="Faith Abah (Mc Fabs), Master of Ceremonies and Brand Host — cutout portrait"
          className="h-auto w-full max-w-sm rounded-lg"
          width="600"
          height="800"
        />
      </div>
      <div className="mx-auto order-2 max-w-3xl px-4 md:order-2 sm:px-6">
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
  );
}
