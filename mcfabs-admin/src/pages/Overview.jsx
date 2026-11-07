import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
const sections = [
  { table: 'gallery_images', title: 'Gallery photos', path: 'gallery', description: 'Show the energy of your events with a curated photo collection.' },
  { table: 'blog_posts', title: 'Journal posts', path: 'blog', description: 'Share your perspective. Write a draft or publish your next story.' },
  { table: 'masterclass_editions', title: 'Masterclass editions', path: 'masterclass', description: 'Keep dates, venues, and ticket links up to date.' },
  { table: 'announcements', title: 'Announcements', path: 'announcements', description: 'Highlight a launch, an upcoming event, or an important update.' },
]
export default function Overview() {
  const [counts, setCounts] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true

    async function load() {
      try {
        if (!supabase) throw new Error('Content connection is not configured.')
        const results = await Promise.all(sections.map(async section => {
          const { count, error } = await supabase.from(section.table).select('*', { count: 'exact', head: true })
          if (error) throw error
          return [section.table, count ?? 0]
        }))
        if (active) setCounts(Object.fromEntries(results))
      } catch { if (active) setError('Content totals could not be loaded. Check your connection and try again.') }
      finally { if (active) setLoading(false) }
    }
    load()
    return () => { active = false }
  }, [revision])
  return <div className="overview"><p className="eyebrow text-marquee-pink">Your content studio</p><h1>Welcome back.</h1><p className="overview-intro">Keep your presence fresh. Your next great client experience starts here.</p>
    <div className="overview-banner"><div><p className="eyebrow">Make your next move</p><h2>Give your audience something to talk about.</h2><p>Publish a story, share an event moment, or announce your next masterclass.</p></div><Link to="/dashboard/blog">Open the journal editor ↗</Link></div>
    <div className="overview-heading"><h2>Content at a glance</h2><button type="button" onClick={() => { setLoading(true); setError(''); setRevision(v => v + 1) }} disabled={loading}>{loading ? 'Refreshing…' : 'Refresh totals'}</button></div>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    <div className="overview-grid">{sections.map(section => <Link className="overview-card" key={section.table} to={'/dashboard/' + section.path}><span>{section.title}</span><strong>{loading ? '…' : error ? '—' : counts[section.table]}</strong><p>{section.description}</p><b>Manage content ↗</b></Link>)}</div>
    <div className="editorial-note"><h2>A quick publishing check</h2><p>Use descriptive image alt text, check ticket links, and preview your public site after making changes. Journal totals include drafts; only published posts appear to visitors.</p></div>
  </div>
}