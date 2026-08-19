import Seo from '../components/Seo'
import Gallery from '../components/Gallery'
import AnnouncementPopup from '../components/AnnouncementPopup'
import { useAsync } from '../hooks/useAsync'
import { fetchMasterclassEditions } from '../lib/api'
import { formatDate } from '../lib/formatDate'
import { BRAND, TICKETING_URL } from '../lib/constants'

function EditionCard({ edition }) {
  const ticketUrl = edition.ticket_link_override || TICKETING_URL
  const dateLabel = formatDate(edition.event_date)

  return (
    <article className="grid gap-4 border border-ink/10 bg-white/60 p-5 sm:grid-cols-[160px_1fr]">
      {edition.poster_image ? (
        <img
          src={edition.poster_image}
          alt={edition.poster_alt || `${edition.title} poster`}
          className="h-40 w-full object-cover sm:h-full"
        />
      ) : (
        <div className="hidden h-full items-center justify-center bg-ink/5 sm:flex" aria-hidden="true" />
      )}
      <div>
        <p className="eyebrow text-marquee-pink">
          {edition.status === 'upcoming' ? 'Upcoming Edition' : 'Past Edition'}
        </p>
        <h3 className="mt-1 font-display text-2xl text-ink">{edition.title}</h3>
        <p className="mt-1 text-sm text-ink/60">
          {[dateLabel, edition.venue].filter(Boolean).join(' · ')}
        </p>
        {edition.blurb && <p className="mt-3 text-ink/80">{edition.blurb}</p>}
        {edition.status === 'upcoming' && (
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-sm bg-marquee-pink px-5 py-2.5 font-semibold text-paper hover:bg-marquee-pink/85"
          >
            Get Your Ticket
          </a>
        )}
      </div>
    </article>
  )
}

export default function Masterclass() {
  const { data, loading, error } = useAsync(fetchMasterclassEditions, [])

  return (
    <>
      <Seo
        title="MC FABS Exclusive Masterclass | Find Your Voice. Own the Stage. Create Impact."
        description="Join the MC FABS Exclusive Masterclass with Faith Abah — hands-on coaching for MCs, hosts, and brand voices ready to find their voice and own the stage."
        path="/masterclass"
      />
      <AnnouncementPopup placement="masterclass" />
      <main id="main-content">
        <section className="bg-ink py-16 text-paper sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="eyebrow text-spark-gold">MC FABS Exclusive</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl">{BRAND.tagline}</h1>
            <div className="mt-6 space-y-4 text-left text-blush sm:text-center">
              <p>
                TODO: [Paragraph 1 — what the Masterclass is: format, duration, what's covered.]
              </p>
              <p>TODO: [Paragraph 2 — who it's for: aspiring MCs, hosts, speakers, brand voices.]</p>
              <p>
                TODO: [Paragraph 3 — what attendees walk away with; tie back to the tagline.]
              </p>
            </div>
            <a
              href={TICKETING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-sm bg-marquee-pink px-8 py-4 font-semibold text-paper transition hover:bg-marquee-pink/85"
            >
              Get Your Ticket on fabs-masterclass
            </a>
          </div>
        </section>

        <Gallery tag="masterclass" heading="Masterclass Moments" eyebrow="Past Editions" />

        <section className="bg-plum py-16 text-paper sm:py-24" aria-labelledby="editions-heading">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="eyebrow text-spark-gold">Editions</p>
            <h2 id="editions-heading" className="mt-3 font-display text-3xl sm:text-4xl">
              Past &amp; Upcoming Editions
            </h2>

            {loading && (
              <div className="mt-8 space-y-4" aria-busy="true" aria-live="polite">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse bg-paper/10" />
                ))}
                <span className="sr-only">Loading masterclass editions&hellip;</span>
              </div>
            )}

            {!loading && error && (
              <p role="alert" className="mt-8 text-blush">
                We couldn&apos;t load masterclass editions right now. Please try again shortly.
              </p>
            )}

            {!loading && !error && data && (
              <div className="mt-8 space-y-6">
                {data.upcoming.length === 0 && data.past.length === 0 && (
                  <p className="text-blush">
                    TODO: [No editions added yet — upcoming and past masterclass editions will
                    appear here once entered in the admin dashboard.]
                  </p>
                )}
                {data.upcoming.map((edition) => (
                  <EditionCard key={edition.id} edition={edition} />
                ))}
                {data.past.map((edition) => (
                  <EditionCard key={edition.id} edition={edition} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
