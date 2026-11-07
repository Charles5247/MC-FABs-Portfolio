import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import StatusBanner from '../components/StatusBanner'

const empty = {
  internal_name: '', title: '', message: '', link_url: '', button_label: '',
  placement: 'sitewide', active: false, starts_at: '', ends_at: '', image_url: '',
}

export default function AnnouncementsManager() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState(null)
  const [file, setFile] = useState(null)

  const load = async () => {
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    if (error) setStatus({ type: 'error', message: error.message })
    else setRows(data ?? [])
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let image_url = form.image_url
      if (file) {
        const path = `announcements/${Date.now()}-${file.name}`
        const { error: upErr } = await supabase.storage.from('media').upload(path, file)
        if (upErr) throw upErr
        image_url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl
      }
      const payload = { ...form, image_url, starts_at: form.starts_at || null, ends_at: form.ends_at || null }
      if (editingId) {
        const { error } = await supabase.from('announcements').update(payload).eq('id', editingId)
        if (error) throw error
        setStatus({ type: 'success', message: 'Announcement updated.' })
      } else {
        const { error } = await supabase.from('announcements').insert(payload)
        if (error) throw error
        setStatus({ type: 'success', message: 'Announcement created.' })
      }
      setForm(empty); setFile(null); setEditingId(null); load()
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  const edit = (row) => {
    setEditingId(row.id)
    setForm({ ...empty, ...row, starts_at: row.starts_at?.slice(0, 16) || '', ends_at: row.ends_at?.slice(0, 16) || '' })
  }

  const toggleActive = async (row) => {
    await supabase.from('announcements').update({ active: !row.active }).eq('id', row.id)
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) setStatus({ type: 'error', message: error.message })
    else { setStatus({ type: 'success', message: 'Announcement deleted.' }); load() }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Announcements / Popups</h1>
      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} className="mt-4 max-w-xl space-y-3 border border-ink/10 bg-white p-4">
        <input aria-label="Internal name (admin-only)" placeholder="Internal name (admin-only)" required value={form.internal_name}
          onChange={(e) => setForm((f) => ({ ...f, internal_name: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <input aria-label="Public title" placeholder="Public title" value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <textarea aria-label="Message" placeholder="Message" value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <input aria-label="Link URL" placeholder="Link URL" value={form.link_url}
          onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <input aria-label="Button label" placeholder="Button label" value={form.button_label}
          onChange={(e) => setForm((f) => ({ ...f, button_label: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block text-sm" />
        <select value={form.placement} onChange={(e) => setForm((f) => ({ ...f, placement: e.target.value }))}
          className="w-full border border-ink/20 px-3 py-2">
          <option value="sitewide">Sitewide</option>
          <option value="masterclass">Masterclass page only</option>
        </select>
        <div className="flex gap-3">
          <label className="eyebrow text-ink/70">Starts
            <input type="datetime-local" value={form.starts_at}
              onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
              className="mt-1 block border border-ink/20 px-2 py-1" />
          </label>
          <label className="eyebrow text-ink/70">Ends
            <input type="datetime-local" value={form.ends_at}
              onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))}
              className="mt-1 block border border-ink/20 px-2 py-1" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active}
            onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          Active
        </label>
        <div className="flex gap-2">
          <button type="submit" className="rounded-sm bg-marquee-pink px-5 py-2.5 font-semibold text-paper">
            {editingId ? 'Save Changes' : 'Create Announcement'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}
              className="rounded-sm border border-ink/20 px-5 py-2.5">Cancel</button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between border border-ink/10 bg-white p-3">
            <div>
              <p className="font-semibold text-ink">{row.internal_name} {row.active && <span className="ml-2 text-xs text-emerald-600">ACTIVE</span>}</p>
              <p className="text-xs text-ink/50">{row.placement}</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button onClick={() => toggleActive(row)} className="border border-ink/20 px-2 py-1">
                {row.active ? 'Disable' : 'Enable'}
              </button>
              <button onClick={() => edit(row)} className="border border-ink/20 px-2 py-1">Edit</button>
              <button onClick={() => remove(row.id)} className="border border-marquee-pink/40 px-2 py-1 text-marquee-pink">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
