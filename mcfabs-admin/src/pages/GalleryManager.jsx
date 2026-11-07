import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import StatusBanner from '../components/StatusBanner'

const BUCKET = 'media'

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [altText, setAltText] = useState('')
  const [tags, setTags] = useState('general')
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) setStatus({ type: 'error', message: error.message })
    else setImages(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setStatus(null)
    try {
      const path = `gallery/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file)
      if (uploadError) throw uploadError
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)

      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean)
      const { error: insertError } = await supabase.from('gallery_images').insert({
        image_url: pub.publicUrl,
        caption,
        alt_text: altText,
        tags: tagList.length ? tagList : ['general'],
        sort_order: images.length,
      })
      if (insertError) throw insertError

      setStatus({ type: 'success', message: 'Image uploaded and added to the gallery.' })
      setFile(null)
      setCaption('')
      setAltText('')
      setTags('general')
      load()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this image from the gallery? This cannot be undone.')) return
    const { error } = await supabase.from('gallery_images').delete().eq('id', id)
    if (error) setStatus({ type: 'error', message: error.message })
    else {
      setStatus({ type: 'success', message: 'Image deleted.' })
      load()
    }
  }

  const move = async (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= images.length) return
    const a = images[index]
    const b = images[newIndex]
    await supabase.from('gallery_images').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('gallery_images').update({ sort_order: a.sort_order }).eq('id', b.id)
    load()
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Gallery</h1>
      <StatusBanner status={status} />

      <form onSubmit={handleUpload} className="mt-4 max-w-lg space-y-3 border border-ink/10 bg-white p-4">
        <div>
          <label className="eyebrow block text-ink/70">Image file</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            required
            className="mt-1 block w-full text-sm"
          />
        </div>
        <div>
          <label className="eyebrow block text-ink/70">Caption (optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 w-full border border-ink/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="eyebrow block text-ink/70">Alt text (required for accessibility)</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            required
            className="mt-1 w-full border border-ink/20 px-3 py-2"
          />
        </div>
        <div>
          <label className="eyebrow block text-ink/70">Tags (comma-separated, e.g. general, masterclass)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 w-full border border-ink/20 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-sm bg-marquee-pink px-5 py-2.5 font-semibold text-paper disabled:opacity-60"
        >
          {uploading ? 'Uploading\u2026' : 'Upload Image'}
        </button>
      </form>

      <h2 className="mt-8 font-display text-xl text-ink">Current Images ({images.length})</h2>
      {loading ? (
        <p className="mt-3 text-ink/60">Loading&hellip;</p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {images.map((img, i) => (
            <div key={img.id} className="border border-ink/10 bg-white p-3">
              <img src={img.image_url} alt={img.alt_text} className="aspect-square w-full object-cover" />
              <p className="mt-2 text-xs text-ink/60">{img.caption}</p>
              <p className="text-xs text-ink/40">tags: {(img.tags || []).join(', ')}</p>
              <div className="mt-2 flex gap-2 text-xs">
                <button onClick={() => move(i, -1)} className="border border-ink/20 px-2 py-1">↑</button>
                <button onClick={() => move(i, 1)} className="border border-ink/20 px-2 py-1">↓</button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="border border-marquee-pink/40 px-2 py-1 text-marquee-pink"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
