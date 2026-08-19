import { useEffect } from 'react'
import { SITE_URL, DEFAULT_OG_IMAGE } from '../lib/constants'

/**
 * Lightweight per-page SEO manager: sets <title>, meta description,
 * canonical link, Open Graph, Twitter card tags, and an optional JSON-LD
 * structured-data block. No external dependency (react-helmet, etc.) —
 * just direct DOM head manipulation, cleaned up on unmount/route change.
 *
 * @param {Object} props
 * @param {string} props.title - Full <title> text.
 * @param {string} props.description - Meta description.
 * @param {string} [props.path] - Path (e.g. "/masterclass") for canonical + og:url.
 * @param {string} [props.image] - Absolute or root-relative OG/Twitter image URL.
 * @param {string} [props.type] - og:type, defaults to "website".
 * @param {Object} [props.jsonLd] - A JSON-LD object (or array of objects) to embed.
 */
export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  jsonLd,
}) {
  useEffect(() => {
    const url = new URL(path, SITE_URL).toString()
    const absoluteImage = image.startsWith('http') ? image : new URL(image, SITE_URL).toString()

    document.title = title

    const upsertMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
      return el
    }

    const upsertLink = (rel, href) => {
      let el = document.head.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
      return el
    }

    const managedTags = []

    managedTags.push(upsertMeta('name', 'description', description))
    managedTags.push(upsertLink('canonical', url))

    // Open Graph
    managedTags.push(upsertMeta('property', 'og:title', title))
    managedTags.push(upsertMeta('property', 'og:description', description))
    managedTags.push(upsertMeta('property', 'og:type', type))
    managedTags.push(upsertMeta('property', 'og:url', url))
    managedTags.push(upsertMeta('property', 'og:image', absoluteImage))

    // Twitter / X card
    managedTags.push(upsertMeta('name', 'twitter:card', 'summary_large_image'))
    managedTags.push(upsertMeta('name', 'twitter:title', title))
    managedTags.push(upsertMeta('name', 'twitter:description', description))
    managedTags.push(upsertMeta('name', 'twitter:image', absoluteImage))

    // JSON-LD structured data
    let scriptEl = null
    if (jsonLd) {
      scriptEl = document.createElement('script')
      scriptEl.type = 'application/ld+json'
      scriptEl.text = JSON.stringify(jsonLd)
      document.head.appendChild(scriptEl)
    }

    return () => {
      if (scriptEl) scriptEl.remove()
      // Meta/canonical tags are left in place and simply overwritten by the
      // next page's Seo instance — removing them would cause a flash of
      // missing tags during route transitions.
    }
  }, [title, description, path, image, type, jsonLd])

  return null
}
