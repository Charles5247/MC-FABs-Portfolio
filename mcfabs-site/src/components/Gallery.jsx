import { useEffect, useState, useCallback } from 'react'
import { useAsync } from '../hooks/useAsync'
import { fetchGalleryImages } from '../lib/api'

/**
 * Responsive photo grid with an interactive on-site lightbox.
 * Photos are viewed directly on the site without navigating away.
 *
 * @param {Object} props
 * @param {string} [props.tag] - Filter images by tag ("general" | "masterclass").
 * @param {string} [props.heading] - Section heading text.
 * @param {string} [props.eyebrow] - Small label above heading.
 */
export default function Gallery({
  tag,
  heading = 'Gallery',
  eyebrow = 'In the Room',
}) {
  const { data: images, loading, error } = useAsync(() => fetchGalleryImages({ tag }), [tag])
  const [activeIndex, setActiveIndex] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const INITIAL_COUNT = 12
  const visibleImages = images ? (showAll ? images : images.slice(0, INITIAL_COUNT)) : []
  const hasMore = images && images.length > INITIAL_COUNT

  const close = useCallback(() => setActiveIndex(null), [])

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null || !images ? i : (i + 1) % images.length))
  }, [images])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null || !images ? i : (i - 1 + images.length) % images.length))
  }, [images])

  useEffect(() => {
    if (activeIndex === null) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [activeIndex, close, goNext, goPrev])

  return (
    <section className="bg-paper py-16 sm:py-24" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-marquee-pink">{eyebrow}</p>
            <h2 id="gallery-heading" className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              {heading}
            </h2>
          </div>
          {images && images.length > 0 && (
            <p className="text-sm font-medium text-ink/60">
              Showing {visibleImages.length} of {images.length} photos
            </p>
          )}
        </div>

        {loading && (
          <div
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            aria-busy="true"
            aria-live="polite"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-md bg-ink/10" />
            ))}
            <span className="sr-only">Loading gallery photos&hellip;</span>
          </div>
        )}

        {!loading && error && (
          <p role="alert" className="mt-8 rounded-sm border border-marquee-pink/40 bg-marquee-pink/5 p-4 text-ink/80">
            We couldn&apos;t load the gallery right now. Please refresh the page or try again shortly.
          </p>
        )}

        {!loading && !error && images && images.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {visibleImages.map((img, i) => (
                <button
                  key={img.id || i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="group relative aspect-square overflow-hidden rounded-md bg-ink/10 focus-visible:outline focus-visible:outline-3 focus-visible:outline-spark-gold"
                  aria-label={`Open photo: ${img.alt_text || img.caption || 'gallery image'}`}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || img.caption || ''}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-ink/20 opacity-0 transition duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-2 right-2 rounded-full bg-black/60 p-1.5 text-paper opacity-0 transition group-hover:opacity-100">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-2 rounded-sm border border-ink/20 bg-paper px-6 py-3 font-semibold text-ink transition hover:border-marquee-pink hover:text-marquee-pink"
                >
                  {showAll ? 'Show Fewer Photos' : `View All ${images.length} Photos`}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Interactive Fullscreen On-Site Lightbox */}
      {activeIndex !== null && images && images[activeIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          {/* Top Bar with Counter and Close */}
          <div className="absolute left-4 top-4 z-20 text-sm font-medium text-paper/80">
            {activeIndex + 1} / {images.length}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              close()
            }}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-paper transition hover:bg-marquee-pink"
            aria-label="Close photo viewer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-paper/10 text-paper transition hover:bg-marquee-pink sm:left-6"
            aria-label="Previous photo"
          >
            &#8592;
          </button>

          {/* Active Image */}
          <figure
            className="flex max-h-[85vh] max-w-4xl flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeIndex].image_url}
              alt={images[activeIndex].alt_text || images[activeIndex].caption || ''}
              className="max-h-[75vh] w-auto max-w-full rounded-md object-contain shadow-2xl"
            />
            {images[activeIndex].caption && (
              <figcaption className="mt-3 text-center text-sm text-blush">
                {images[activeIndex].caption}
              </figcaption>
            )}
          </figure>

          {/* Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-paper/10 text-paper transition hover:bg-marquee-pink sm:right-6"
            aria-label="Next photo"
          >
            &#8594;
          </button>
        </div>
      )}
    </section>
  )
}
