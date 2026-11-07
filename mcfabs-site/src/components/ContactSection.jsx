import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CONTACT, ROLE_BLOCKS } from '../lib/constants'
export default function ContactSection() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('')
  const [brief, setBrief] = useState('')
  const ready = Boolean(CONTACT.email || CONTACT.whatsapp)
  function submit(event) {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    const text = 'Event enquiry from ' + data.name + '\nEmail: ' + data.email + '\nService: ' + data.service + '\nDate: ' + (data.date || 'To be confirmed') + '\nLocation: ' + data.location + '\nBudget: ' + (data.budget || 'To discuss') + '\n\n' + data.message
    setBrief(text)
    if (!ready) { setStatus('Your brief is ready below. Booking contact details will be available soon; this enquiry has not been sent.'); return }
    if (data.channel === 'whatsapp' && CONTACT.whatsapp) {
      window.location.assign(CONTACT.whatsapp + '?text=' + encodeURIComponent(text))
    } else {
      window.location.href = 'mailto:' + CONTACT.email + '?subject=' + encodeURIComponent('Event enquiry: ' + data.service) + '&body=' + encodeURIComponent(text)
    }
    setStatus('Your messaging app will open with your brief. Please send it there to complete your enquiry. Your booking is not yet confirmed.')
  }
  return <section id="contact" className="contact-section"><div className="section-wrap contact-layout">
    <div><p className="eyebrow text-spark-gold">Let’s make it memorable</p><h2>Your next event.<br /><em>A lasting impression.</em></h2><p>Tell me what you have in mind. We’ll discuss the details, check availability, and shape a hosting experience around your occasion.</p><div className="contact-steps"><p><span>01</span> Share your event brief</p><p><span>02</span> Discuss availability &amp; a quote</p><p><span>03</span> Confirm the details together</p></div>{CONTACT.email && <a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a>}</div>
    <form className="booking-form" onSubmit={submit}>
      <h3>Start the conversation</h3><p className="form-description">A few details help us make the most of our first conversation.</p>
      <div className="form-grid"><label>Your name<input name="name" autoComplete="name" required maxLength={120} placeholder="Full name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label>
      <label>What do you need?<select name="service" defaultValue={ROLE_BLOCKS.some(r => r.title === params.get('service')) ? params.get('service') : ''} required><option value="" disabled>Select a service</option>{ROLE_BLOCKS.map(r => <option key={r.title}>{r.title}</option>)}<option>Masterclass enquiry</option><option>Other collaboration</option></select></label>
      <label>Event date (optional)<input name="date" type="date" /></label>
      <label>City / venue<input name="location" required maxLength={200} placeholder="Where is it happening?" /></label><label>Budget (optional)<input name="budget" maxLength={100} placeholder="Amount and currency" /></label></div>
      <label>Tell me about your event<textarea name="message" required rows={4} maxLength={3000} placeholder="Your audience, event format, and what you’d love to create…" /></label>
      {ready && <label>Send with<select name="channel">{CONTACT.email && <option value="email">Email</option>}{CONTACT.whatsapp && <option value="whatsapp">WhatsApp</option>}</select></label>}
      <button className="button-primary" type="submit">{ready ? 'Prepare my enquiry ↗' : 'Prepare my event brief ↗'}</button><p className="form-description">{ready ? 'Opens your email or WhatsApp app. Nothing is sent until you choose to send.' : 'Booking contact details are being updated. You can prepare and copy your brief for later.'} Your details are not stored on this website.</p>
      <p role="status">{status}</p>{brief && <label>Your prepared brief<textarea readOnly rows={7} value={brief} onFocus={e => e.target.select()} /><span className="form-description">Select the text to copy or save it.</span></label>}
    </form>
  </div></section>
}