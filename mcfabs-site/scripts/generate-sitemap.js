#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml with the fixed routes plus every currently
 * published blog post slug, read directly from Supabase.
 *
 * Usage:
 *   node scripts/generate-sitemap.js
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be set (reads
 * from process.env, or from a local .env file if you run this via
 * `npm run build:sitemap` with a tool like dotenv — for simplicity this
 * script reads a .env file itself if present).
 *
 * Run this manually whenever a blog post is published, then commit/redeploy
 * so the updated sitemap.xml ships with the next build. This is the "manual
 * or build-step task" referenced in public/sitemap.xml and the README.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

function loadDotEnv() {
  const envPath = join(projectRoot, '.env')
  if (!existsSync(envPath)) return
  const contents = readFileSync(envPath, 'utf-8')
  for (const line of contents.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    value = value.replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

async function main() {
  loadDotEnv()

  const siteUrl = (process.env.VITE_SITE_URL || 'https://mcfabs.onrender.com').replace(/\/$/, '')
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Set them in .env before running this script.'
    )
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('published', true)

  if (error) {
    console.error('Failed to fetch published posts:', error.message)
    process.exit(1)
  }

  const staticRoutes = ['/', '/masterclass', '/blog']
  const postRoutes = (data ?? []).map((p) => `/blog/${p.slug}`)

  const urls = [...staticRoutes, ...postRoutes]
    .map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n  </url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  writeFileSync(join(projectRoot, 'public', 'sitemap.xml'), xml, 'utf-8')
  console.log(`sitemap.xml regenerated with ${urls.split('<url>').length - 1} URLs.`)
}

main()
