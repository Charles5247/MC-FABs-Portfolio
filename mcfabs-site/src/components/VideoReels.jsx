import { useState, useRef, useEffect, useCallback } from 'react'
import {
  EVENT_VIDEO_REELS,
  MASTERCLASS_VIDEO_REELS,
} from '../lib/constants'
import { parseVideoSource } from '../lib/videoUtils'

export default function VideoReels({
  type = 'events',
  heading = 'Fabs in Action',
  eyebrow = 'Live Video Reels',
  description = 'Experience the atmosphere, spontaneous crowd connection, and stage mastery Faith Abah brings to every room.',
  reels: customReels,
}) {
  const defaultReels = type === 'masterclass' ? MASTERCLASS_VIDEO_REELS : EVENT_VIDEO_REELS
  const reels = customReels || defaultReels
  const scrollContainerRef = useRef(null)
  const [activeReel, setActiveReel] = useState(null)

  const close = useCallback(() => setActiveReel(null), [])

  useEffect(() => {
    if (!activeReel) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [activeReel, close])

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return
    const offset = direction === 'left' ? -340 : 340
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const parsedSource = activeReel?.videoUrl ? parseVideoSource(activeReel.videoUrl) : null

  return (
    <section className="bg-ink py-16 text-paper sm:py-24" aria-labelledby="reels-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-spark-gold">{eyebrow}</p>
            <h2 id="reels-heading" className="mt-3 font-display text-3xl sm:text-4xl">
              {heading}
            </h2>
            {description && <p className="mt-3 max-w-2xl text-blush/80">{description}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper transition hover:border-marquee-pink hover:bg-marquee-pink/10"
              aria-label="Scroll reels left"
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper transition hover:border-marquee-pink hover:bg-marquee-pink/10"
              aria-label="Scroll reels right"
            >
              &#8594;
            </button>
          </div>
        </div>

        {/* Reels Horizontal Scroll Track */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          aria-label="Video reels carousel. Use arrow keys to navigate."
          className="mt-10 flex gap-5 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-paper/20 focus:outline-none"
        >
          {reels.map((reel) => (
            <article
              key={reel.id}
              className="group relative flex-none w-[260px] sm:w-[280px] aspect-[9/16] rounded-xl overflow-hidden border border-paper/15 bg-gradient-to-b from-plum/60 via-ink to-ink transition duration-300 hover:border-marquee-pink/60 hover:shadow-2xl hover:shadow-marquee-pink/10"
            >
              {/* Thumbnail Background */}
              {reel.thumbnail ? (
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-plum/80 via-ink to-black"
                  aria-hidden="true"
                />
              )}

              {/* Shading overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 transition duration-300 group-hover:from-black/95"
                aria-hidden="true"
              />

              {/* Top Tags */}
              <div className="relative z-10 flex items-center justify-between p-4">
                <span className="rounded-full bg-marquee-pink/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-paper backdrop-blur-sm">
                  {reel.category}
                </span>
                <span className="rounded-md bg-black/60 px-2 py-0.5 text-xs font-mono text-paper/90 backdrop-blur-sm">
                  {reel.duration}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <button
                type="button"
                onClick={() => setActiveReel(reel)}
                className="absolute inset-0 z-20 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-spark-gold"
                aria-label={`Play video reel: ${reel.title}`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/20 text-paper backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:bg-marquee-pink group-hover:text-paper shadow-lg">
                  <svg className="ml-1 h-7 w-7 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>

              {/* Bottom Details */}
              <div className="relative z-10 mt-auto p-4">
                <p className="text-xs font-medium text-spark-gold">{reel.subtitle}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-paper leading-snug line-clamp-2">
                  {reel.title}
                </h3>
                {reel.highlight && (
                  <p className="mt-2 text-xs text-blush/80 line-clamp-2">
                    {reel.highlight}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Video Lightbox Modal — Plays Directly On The Site */}
      {activeReel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeReel.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-full max-w-md sm:max-w-xl md:max-w-3xl overflow-hidden rounded-2xl border border-paper/20 bg-ink p-4 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-20 rounded-full bg-paper/10 p-2 text-paper transition hover:bg-marquee-pink"
              aria-label="Close video player"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player or Teaser */}
            {parsedSource ? (
              <div className="overflow-hidden rounded-lg bg-black aspect-video sm:aspect-[16/9]">
                {parsedSource.type === 'video' ? (
                  <video
                    src={parsedSource.src}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    src={parsedSource.src}
                    title={activeReel.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-paper/10 bg-plum/30 p-8 text-center sm:p-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-marquee-pink/20 text-marquee-pink">
                  <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <h4 className="mt-4 font-display text-2xl text-paper">{activeReel.title}</h4>
                <p className="mt-2 text-sm text-spark-gold">{activeReel.subtitle}</p>
                <p className="mt-4 max-w-md text-sm text-blush/80">
                  {activeReel.highlight}
                </p>
                <p className="mt-3 text-xs text-blush/60">
                  Reel footage will stream here directly once the video links are connected.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-sm bg-marquee-pink px-6 py-2.5 text-sm font-semibold text-paper transition hover:bg-marquee-pink/85"
                >
                  Back to Site
                </button>
              </div>
            )}

            {/* Reel Metadata in Modal */}
            <div className="mt-4 flex items-center justify-between text-sm text-blush/80">
              <span className="font-semibold text-paper">{activeReel.title}</span>
              <span className="font-mono text-xs">{activeReel.duration}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
