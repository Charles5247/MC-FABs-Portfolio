import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '../lib/supabase'
import StatusBanner from '../components/StatusBanner'

const empty = { title: '', slug: '', excerpt: '', content: '', cover_image: '', cover_alt: '', published: false }
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

export default function BlogEditor() {
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)
  const [slugTouched, setSlugTouched] = useState(false)

  const load = async () => {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (error) setStatus({ type: 'error', message: error.message })
    else setPosts(data ?? [])
  }
  useEffect(() => { load() }, [])

  const handleTitleChange = (title) => {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let cover_image = form.cover_image
      if (file) {
        const path = `blog/${Date.now()}-${file.name}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, file)
        if (upErr) throw upErr
        cover_image = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
      }
      const payload = {
        ...form, cover_image,
        published_at: form.published ? (form.published_at || new Date().toISOString()) : null,
      }
      if (editingId) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingId)
        if (error) throw error
        setStatus({ type: 'success', message: 'Post updated.' })
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload)
        if (error) throw error
        setStatus({ type: 'success', message: 'Post created.' })
      }
      setForm(empty); setFile(null); setEditingId(null); setSlugTouched(false); load()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  const edit = (post) => {
    setEditingId(post.id)
    setSlugTouched(true)
    setForm({ ...empty, ...post })
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) setStatus({ type: 'error', message: error.message })
    else { setStatus({ type: 'success', message: 'Post deleted.' }); load() }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Blog</h1>
      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 border border-ink/10 bg-white p-4">
          <input aria-label="Title" placeholder="Title" required value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full border border-ink/20 px-3 py-2" />
          <input aria-label="Slug" placeholder="Slug" required value={form.slug}
            onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: e.target.value })) }}
            className="w-full border border-ink/20 px-3 py-2" />
          <textarea aria-label="Excerpt" placeholder="Excerpt" value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2" />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block text-sm" />
          <input aria-label="Cover image alt text" placeholder="Cover image alt text" value={form.cover_alt}
            onChange={(e) => setForm((f) => ({ ...f, cover_alt: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2" />
          <textarea aria-label="Content (Markdown)" placeholder="Content (Markdown)" rows={12} value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full border border-ink/20 px-3 py-2 font-mono text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
            Published (visible on public site)
          </label>
          <div className="flex gap-2">
            <button type="submit" className="rounded-sm bg-marquee-pink px-5 py-2.5 font-semibold text-paper">
              {editingId ? 'Save Changes' : 'Create Post'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(empty); setSlugTouched(false) }}
                className="rounded-sm border border-ink/20 px-5 py-2.5">Cancel</button>
            )}
          </div>
        </div>

        <div className="border border-ink/10 bg-white p-4">
          <p className="eyebrow text-ink/50">Live Preview</p>
          <h2 className="mt-2 font-display text-2xl text-ink">{form.title || 'Untitled post'}</h2>
          <div className="prose mt-3 max-w-none text-ink/80">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || '_Nothing to preview yet._'}</ReactMarkdown>
          </div>
        </div>
      </form>

      <h2 className="mt-10 font-display text-xl text-ink">All Posts ({posts.length})</h2>
      <div className="mt-3 space-y-2">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between border border-ink/10 bg-white p-3">
            <div>
              <p className="font-semibold text-ink">{post.title} {post.published ? <span className="ml-2 text-xs text-emerald-600">PUBLISHED</span> : <span className="ml-2 text-xs text-ink/40">DRAFT</span>}</p>
              <p className="text-xs text-ink/50">/{post.slug}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={() => edit(post)} className="border border-ink/20 px-2 py-1">Edit</button>
              <button onClick={() => remove(post.id)} className="border border-marquee-pink/40 px-2 py-1 text-marquee-pink">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
