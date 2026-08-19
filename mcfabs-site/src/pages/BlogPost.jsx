import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Seo from '../components/Seo'
import { useAsync } from '../hooks/useAsync'
import { fetchPostBySlug } from '../lib/api'
import { formatDate } from '../lib/formatDate'
import { BRAND, DEFAULT_OG_IMAGE } from '../lib/constants'

export default function BlogPost() {
  const { slug } = useParams()
  const { data: post, loading, error } = useAsync(() => fetchPostBySlug(slug), [slug])

  if (loading) {
    return (
      <main id="main-content" className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6" aria-busy="true" aria-live="polite">
          <div className="h-8 w-1/3 animate-pulse bg-ink/10" />
          <div className="mt-4 h-10 w-2/3 animate-pulse bg-ink/10" />
          <div className="mt-6 aspect-video animate-pulse bg-ink/10" />
          <span className="sr-only">Loading post&hellip;</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main id="main-content" className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p role="alert" className="text-ink/70">
            We couldn&apos;t load this post right now. Please try again shortly.
          </p>
          <Link to="/blog" className="mt-4 inline-block text-marquee-pink underline">
            Back to Blog
          </Link>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main id="main-content" className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl text-ink">Post Not Found</h1>
          <p className="mt-3 text-ink/70">
            This post doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <Link to="/blog" className="mt-4 inline-block text-marquee-pink underline">
            Back to Blog
          </Link>
        </div>
      </main>
    )
  }

  const description = post.excerpt || `${post.title} — ${BRAND.stageName} blog.`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.published_at || post.created_at,
    image: post.cover_image || DEFAULT_OG_IMAGE,
    author: {
      '@type': 'Person',
      name: BRAND.name,
    },
  }

  return (
    <>
      <Seo
        title={`${post.title} | ${BRAND.stageName} Blog`}
        description={description}
        path={`/blog/${post.slug}`}
        image={post.cover_image || DEFAULT_OG_IMAGE}
        type="article"
        jsonLd={jsonLd}
      />
      <main id="main-content" className="bg-paper py-16 sm:py-24">
        <article className="mx-auto max-w-2xl px-4 sm:px-6">
          <Link to="/blog" className="eyebrow text-marquee-pink hover:underline">
            &larr; Back to Blog
          </Link>

          <p className="eyebrow mt-6 text-ink/60">
            {formatDate(post.published_at || post.created_at)}
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">{post.title}</h1>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.cover_alt || ''}
              className="mt-8 aspect-video w-full object-cover"
            />
          )}

          <div className="prose prose-lg mt-8 max-w-none text-ink/90 prose-headings:font-display prose-a:text-marquee-pink">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          <Link to="/blog" className="mt-10 inline-block eyebrow text-marquee-pink hover:underline">
            &larr; Back to Blog
          </Link>
        </article>
      </main>
    </>
  )
}
