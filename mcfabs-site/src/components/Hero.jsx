import { Link } from 'react-router-dom'
import portrait from '../fabs.jpg'
export default function Hero() {
  return <section id="home" className="hero-section"><div className="hero-layout">
    <div className="hero-copy"><p className="eyebrow text-spark-gold">Faith Abah · MC FABS · Kano, Nigeria</p>
      <h1>A remarkable event starts with <em>the right voice.</em></h1>
      <p className="hero-intro">From the first welcome to the final applause. Hosting, brand storytelling, and stage presence that put your audience at the heart of the moment.</p>
      <div className="hero-actions"><a className="button-primary" href="#contact">Let’s plan your event ↗</a><Link className="button-outline" to="/masterclass">Explore the masterclass</Link></div>
      <div className="hero-note">✦ Your occasion. Your audience. A memorable experience.</div>
    </div><figure className="hero-portrait"><img src={portrait} alt="Faith Abah, MC FABS" width="600" height="800" fetchPriority="high" /><figcaption><span className="eyebrow">Meet your host</span><strong>Faith Abah</strong><span>MC · Brand Host · Media Personality</span></figcaption></figure>
  </div></section>
}