import { Link } from 'react-router-dom'
import { useAsync } from '../hooks/useAsync'
import { fetchLatestPosts } from '../lib/api'
import { formatDate } from '../lib/formatDate'

export default function BlogTeaser() {
  const { data: posts, loading, error } = useAsync(() => fetchLatestPosts(3), [])

  return (
    <section className="bg-paper py-16 sm:py-24" aria-labelledby="blog-teaser-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-marquee-pink">From the Blog</p>
            <h2 id="blog-teaser-heading" className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Latest Reads
            </h2>
          </div>
          <Link to="/blog" className="eyebrow text-ink underline hover:text-marquee-pink">
            View all posts
          </Link>
        </div>

        {loading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-3" aria-busy="true" aria-live="polite">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-ink/10" />
            ))}
            <span className="sr-only">Loading latest posts&hellip;</span>
          </div>
        )}

        {!loading && error && (
          <p role="alert" className="mt-8 text-ink/70">
            We couldn&apos;t load the latest posts right now.
          </p>
        )}

        {!loading && !error && posts && posts.length === 0 && (
          <p className="mt-8 text-ink/60">
            TODO: [No posts published yet — the first post will appear here once published from
            the admin dashboard.]
          </p>
        )}

        {!loading && !error && posts && posts.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {posts.map((post) => (
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
                    {formatDate(post.published_at || post.created_at) || 'Draft'}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-ink">{post.title}</h3>
                  {post.excerpt && <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
