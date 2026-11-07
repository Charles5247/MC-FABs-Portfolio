import { ROLE_BLOCKS } from '../lib/constants'
export default function RoleBlocksSection() {
  return <section id="services" className="services-section"><div className="section-wrap">
    <div className="section-heading"><div><p className="eyebrow text-marquee-pink">Ways to work together</p><h2>The occasion is yours.<br />The energy is ours.</h2></div><p>Choose the support your event needs. Every brief starts with a conversation about your audience and what matters to you.</p></div>
    <div className="service-grid">{ROLE_BLOCKS.map((role, i) => <article className="service-card" key={role.title}><span className="service-number">0{i + 1}</span><h3>{role.title}</h3><p>{role.description}</p><a href={'/?service=' + encodeURIComponent(role.title) + '#contact'}>Discuss your brief ↗</a></article>)}</div>
  </div></section>
}