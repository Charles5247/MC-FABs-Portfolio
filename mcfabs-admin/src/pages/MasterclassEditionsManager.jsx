import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import StatusBanner from '../components/StatusBanner'

const empty = { title: '', event_date: '', venue: '', blurb: '', status: 'upcoming', poster_image: '', poster_alt: '', ticket_link_override: '' }

export default function MasterclassEditionsManager() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)

  const load = async () => {
    const { data, error } = await supabase.from('masterclass_editions').select('*').order('event_date', { ascending: false })
    if (error) setStatus({ type: 'error', message: error.message })
    else setRows(data ?? [])
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let poster_image = form.poster_image
      if (file) {
        const path = `masterclass/${Date.now()}-${file.name}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, file)
        if (upErr) throw upErr
        poster_image = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
      }
      const payload = { ...form, poster_image, event_date: form.event_date || null }
      if (editingId) {
        const { error } = await supabase.from('masterclass_editions').update(payload).eq('id', editingId)
        if (error) throw error
        setStatus({ type: 'success', message: 'Edition updated.' })
      } else {
        const { error } = await supabase.from('masterclass_editions').insert(payload)
        if (error) throw error
        setStatus({ type: 'success', message: 'Edition created.' })
      }
      setForm(empty); setFile(null); setEditingId(null); load()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  const edit = (row) => { setEditingId(row.id); setForm({ ...empty, ...row, event_date: row.event_date || '' }) }

  const remove = async (id) => {
    const { error } = await supabase.from('masterclass_editions').delete().eq('id', id)
    if (error) setStatus({ type: 'error', message: error.message })
    else { setStatus({ type: 'success', message: 'Edition deleted.' }); load() }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Masterclass Editions</h1>
      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="mt-4 max-w-xl space-y-3 border border-ink/10 bg-white p-4">
        <input placeholder="Title" required value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <input type="date" value={form.event_date}
          onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <input placeholder="Venue" value={form.venue}
          onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <textarea placeholder="Blurb" value={form.blurb}
          onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2">
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block text-sm" />
        <input placeholder="Poster alt text" value={form.poster_alt}
          onChange={(e) => setForm((f) => ({ ...f, poster_alt: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <input placeholder="Ticket link override (optional — defaults to fabs-masterclass.onrender.com)" value={form.ticket_link_override}
          onChange={(e) => setForm((f) => ({ ...f, ticket_link_override: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <div className="flex gap-2">
          <button type="submit" className="rounded-sm bg-marquee-pink px-5 py-2.5 font-semibold text-paper">
            {editingId ? 'Save Changes' : 'Create Edition'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}
              className="rounded-sm border border-ink/20 px-5 py-2.5">Cancel</button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between border border-ink/10 bg-white p-3">
            <div>
              <p className="font-semibold text-ink">{row.title} <span className="ml-2 text-xs text-ink/50">{row.status}</span></p>
              <p className="text-xs text-ink/50">{row.event_date} &middot; {row.venue}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={() => edit(row)} className="border border-ink/20 px-2 py-1">Edit</button>
              <button onClick={() => remove(row.id)} className="border border-marquee-pink/40 px-2 py-1 text-marquee-pink">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
