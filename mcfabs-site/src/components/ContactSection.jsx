import { useState } from 'react'
import { CONTACT } from '../lib/constants'

/**
 * Contact/booking section. WhatsApp + email quick links, plus a simple
 * contact form. There is no backend endpoint for this form (no server in
 * this static React app) — submitting builds a pre-filled mailto: link so
 * the message still reaches Faith's inbox via the visitor's own mail client.
 */
export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | success | error

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error')
      return
    }

    const subject = encodeURIComponent(`Booking inquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`
    setStatus('success')
  }

  return (
    <section id="contact" className="bg-ink py-16 text-paper sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="eyebrow text-spark-gold">Get in Touch</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">Book Faith for Your Next Event</h2>
        <p className="mt-4 text-blush">
          TODO: [Confirm whether rates are shared publicly — default is
          &ldquo;request a quote&rdquo; until told otherwise.]
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-marquee-pink px-6 py-3 font-semibold text-paper hover:bg-marquee-pink/85"
          >
            Message on WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="rounded-sm border border-paper/30 px-6 py-3 font-semibold text-paper hover:border-spark-gold hover:text-spark-gold"
          >
            Email Faith
          </a>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
          <div>
            <label htmlFor="contact-name" className="eyebrow block text-blush">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-sm border border-paper/20 bg-transparent px-4 py-3 text-paper placeholder:text-paper/40"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="eyebrow block text-blush">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-sm border border-paper/20 bg-transparent px-4 py-3 text-paper placeholder:text-paper/40"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="contact-message" className="eyebrow block text-blush">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="mt-2 w-full rounded-sm border border-paper/20 bg-transparent px-4 py-3 text-paper placeholder:text-paper/40"
              placeholder="Tell Faith about your event&hellip;"
            />
          </div>

          <button
            type="submit"
            className="rounded-sm bg-spark-gold px-6 py-3 font-semibold text-ink hover:bg-spark-gold/85"
          >
            Send Message
          </button>

          <div role="status" aria-live="polite">
            {status === 'success' && (
              <p className="text-blush">
                Thanks! Your email app should now open with your message ready to send.
              </p>
            )}
            {status === 'error' && (
              <p className="text-marquee-pink">Please fill in your name, email, and message.</p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
