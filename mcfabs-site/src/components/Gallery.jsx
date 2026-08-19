import { useEffect, useState, useCallback } from 'react'
import { useAsync } from '../hooks/useAsync'
import { fetchGalleryImages } from '../lib/api'

/**
 * Responsive photo grid pulled from the admin-managed gallery table, with a
 * keyboard-accessible lightbox. Handles loading / empty / error states.
 *
 * @param {Object} props
 * @param {string} [props.tag] - Filter gallery_images by this tag (e.g. "masterclass").
 * @param {string} [props.heading] - Section heading text.
 * @param {string} [props.eyebrow] - Small label above the heading.
 */
export default function Gallery({ tag, heading = 'Gallery', eyebrow = 'In the Room' }) {
  const { data: images, loading, error } = useAsync(() => fetchGalleryImages({ tag }), [tag])
  const [activeIndex, setActiveIndex] = useState(null)

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
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, close, goNext, goPrev])

  return (
    <section className="bg-paper py-16 sm:py-24" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-marquee-pink">{eyebrow}</p>
        <h2 id="gallery-heading" className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          {heading}
        </h2>

        {loading && (
          <div
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            aria-busy="true"
            aria-live="polite"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-ink/10" />
            ))}
            <span className="sr-only">Loading gallery photos&hellip;</span>
          </div>
        )}

        {!loading && error && (
          <p role="alert" className="mt-8 rounded-sm border border-marquee-pink/40 bg-marquee-pink/5 p-4 text-ink/80">
            We couldn&apos;t load the gallery right now. Please refresh the page or try again shortly.
          </p>
        )}

        {!loading && !error && images && images.length === 0 && (
          <p className="mt-8 text-ink/60">
            TODO: [Gallery photos coming soon — upload images from the admin dashboard.]
          </p>
        )}

        {!loading && !error && images && images.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="group aspect-square overflow-hidden bg-ink/5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-spark-gold"
                aria-label={`Open photo: ${img.alt_text || img.caption || 'gallery image'}`}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text || img.caption || ''}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {activeIndex !== null && images && images[activeIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              close()
            }}
            className="absolute right-4 top-4 rounded-sm border border-paper/40 px-3 py-2 text-paper"
            aria-label="Close photo viewer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-sm border border-paper/40 px-3 py-2 text-paper sm:left-6"
            aria-label="Previous photo"
          >
            &#8592;
          </button>

          <figure className="max-h-[85vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeIndex].image_url}
              alt={images[activeIndex].alt_text || images[activeIndex].caption || ''}
              className="max-h-[75vh] w-full object-contain"
            />
            {images[activeIndex].caption && (
              <figcaption className="mt-3 text-center text-blush">
                {images[activeIndex].caption}
              </figcaption>
            )}
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border border-paper/40 px-3 py-2 text-paper sm:right-6"
            aria-label="Next photo"
          >
            &#8594;
          </button>
        </div>
      )}
    </section>
  )
}
