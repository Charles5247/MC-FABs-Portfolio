const questions = [
  ['How do I book Faith for an event?', 'Share your date, venue, event type, and a short brief below. Availability, scope, and a tailored quote are confirmed in conversation before your booking is final.'],
  ['How much does hosting cost?', 'Quotes depend on the format, location, duration, and preparation your event needs. Include your budget range in the brief so we can discuss the right fit.'],
  ['Can I enquire about an event outside Kano?', 'Yes. Include the city and venue in your enquiry so travel requirements and availability can be discussed.'],
  ['Where can I find masterclass dates and tickets?', 'Visit the Masterclass page for published editions. Ticket links open the separate ticketing platform, where you can check event details and registration options.'],
]
export default function BookingFaq() {
  return <section className="faq-section"><div className="section-wrap faq-layout"><div><p className="eyebrow text-marquee-pink">Before we begin</p><h2>A few good<br />questions.</h2></div><div>{questions.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
}