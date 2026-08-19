import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { useAsync } from '../hooks/useAsync'
import { fetchPublishedPosts } from '../lib/api'
import { formatDate } from '../lib/formatDate'

const PAGE_SIZE = 9

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const { data, loading, error } = useAsync(
    () => fetchPublishedPosts({ page, pageSize: PAGE_SIZE }),
    [page]
  )

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const goToPage = (p) => {
    setSearchParams(p === 1 ? {} : { page: String(p) })
  }

  return (
    <>
      <Seo
        title="Blog | Faith Abah (Mc Fabs)"
        description="Insights on hosting, brand voice, and stage presence from Faith Abah (Mc Fabs) — MC, brand host, and media personality based in Kano, Nigeria."
        path="/blog"
      />
      <main id="main-content" className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-marquee-pink">Blog</p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Words &amp; Insights</h1>

          {loading && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse bg-ink/10" />
              ))}
              <span className="sr-only">Loading blog posts&hellip;</span>
            </div>
          )}

          {!loading && error && (
            <p role="alert" className="mt-10 text-ink/70">
              We couldn&apos;t load blog posts right now. Please try again shortly.
            </p>
          )}

          {!loading && !error && data && data.posts.length === 0 && (
            <p className="mt-10 text-ink/60">
              TODO: [No posts published yet — check back soon for Faith&apos;s first post.]
            </p>
          )}

          {!loading && !error && data && data.posts.length > 0 && (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group block overflow-hidden border border-ink/10 bg-white/50 focus-visible:outline focus-visible:outline-3 focus-visible:outline-spark-gold"
                  >
                    <div className="aspect-video overflow-hidden bg-ink/5">
                      {post.cover_image && (
                        <img
                          src={post.cover_image}
                          alt={post.cover_alt || ''}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="eyebrow text-marquee-pink">
                        {formatDate(post.published_at || post.created_at)}
                      </p>
                      <h2 className="mt-2 font-display text-xl text-ink">{post.title}</h2>
                      {post.excerpt && <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  className="mt-10 flex items-center justify-center gap-4"
                  aria-label="Blog pagination"
                >
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="eyebrow rounded-sm border border-ink/20 px-4 py-2 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-ink/70">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="eyebrow rounded-sm border border-ink/20 px-4 py-2 disabled:opacity-40"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
    </>
  )
}
