// Central place for site-wide constants that don't require a code change to
// tweak content that IS meant to live in code (as opposed to Supabase-backed
// content like gallery/blog/announcements/masterclass editions, which is
// edited from the admin app).

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://mcfabs.onrender.com'

export const TICKETING_URL =
  import.meta.env.VITE_TICKETING_URL || 'https://fabs-masterclass.onrender.com'

export const BRAND = {
  name: 'Faith Abah',
  stageName: 'Mc Fabs',
  tagline: 'Find Your Voice. Own the Stage. Create Impact.',
  roleLine: 'MC · Brand Host · Media Personality · Masterclass Coach',
  location: 'Kano, Nigeria',
}

// TODO: [Replace with Faith's real social handles + booking contact once confirmed]
export const CONTACT = {
  email: 'hello@mcfabs.example', // TODO: [Faith's real booking email]
  whatsapp: 'https://wa.me/2340000000000', // TODO: [Faith's real WhatsApp number, intl format]
  instagram: 'https://instagram.com/mcfabs', // TODO: [confirm handle]
  x: 'https://x.com/mcfabs', // TODO: [confirm handle]
  tiktok: 'https://tiktok.com/@mcfabs', // TODO: [confirm handle]
  youtube: 'https://youtube.com/@mcfabs', // TODO: [confirm handle]
}

// TODO: [Replace placeholder stats once real numbers are confirmed]
export const STATS = [
  { label: 'Years Active', value: '5+' },
  { label: 'Events Hosted', value: '150+' },
  { label: 'Cities Covered', value: '10+' },
]

// TODO: [Replace with Faith's real role descriptions + client lists]
export const ROLE_BLOCKS = [
  {
    title: 'Master of Ceremonies',
    description:
      'TODO: [Short paragraph on Faith\u2019s MC experience — weddings, corporate events, ' +
      'brand activations, awards nights — the range and energy she brings to a room.]',
    clients: [], // TODO: [Add client/brand names once confirmed, e.g. 'Brand A', 'Brand B']
  },
  {
    title: 'Media & On-Air',
    description:
      'TODO: [Short paragraph on Faith\u2019s media/on-air work — radio, TV, podcast hosting, ' +
      'interviews — and the voice/presence she brings on camera and mic.]',
    clients: [],
  },
  {
    title: 'Brand Hosting',
    description:
      'TODO: [Short paragraph on Faith\u2019s brand hosting work — product launches, ' +
      'activations, influencer/brand ambassador appearances.]',
    clients: [],
  },
]

// TODO: [Replace placeholder bio paragraphs with Faith's real origin story]
export const ABOUT_PARAGRAPHS = [
  'TODO: [Paragraph 1 — Faith\u2019s origin story: how she found her voice and started hosting.]',
  'TODO: [Paragraph 2 — what makes her hosting style distinct; the "Find Your Voice. Own the ' +
    'Stage. Create Impact." philosophy in practice.]',
  'TODO: [Paragraph 3 — where she is today and what\u2019s next: the Masterclass, media work, ' +
    'brand partnerships.]',
]

// TODO: [Replace with real testimonials — name, role/company, quote]
export const TESTIMONIALS = [
  {
    quote: 'TODO: [Testimonial quote 1 — a client or attendee describing working with Faith.]',
    name: 'TODO: [Name]',
    role: 'TODO: [Role / Company]',
  },
  {
    quote: 'TODO: [Testimonial quote 2.]',
    name: 'TODO: [Name]',
    role: 'TODO: [Role / Company]',
  },
  {
    quote: 'TODO: [Testimonial quote 3.]',
    name: 'TODO: [Name]',
    role: 'TODO: [Role / Company]',
  },
]

// Press/brand logos — leave empty until real logos exist. The PressStrip
// component only renders when this array is non-empty, per the brief.
// TODO: [Add { name, logoUrl, url } entries once press mentions/brand logos are confirmed]
export const PRESS_LOGOS = []

// Event categories for the home page marquee ticker.
// TODO: [Confirm/expand the real list of event types Faith hosts]
export const EVENT_CATEGORIES = [
  'Weddings',
  'Corporate Events',
  'Brand Activations',
  'Award Nights',
  'Product Launches',
  'Conferences',
  'Concerts & Live Shows',
  'Private Parties',
]

// Rates policy — default to "request a quote" until told otherwise, per brief.
export const RATES_PUBLIC = false

export const NAV_LINKS = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Masterclass', href: '/masterclass' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
]

export const SOCIALS = [
  { label: 'Instagram', url: CONTACT.instagram, icon: 'instagram' },
  { label: 'X (Twitter)', url: CONTACT.x, icon: 'x' },
  { label: 'TikTok', url: CONTACT.tiktok, icon: 'tiktok' },
  { label: 'YouTube', url: CONTACT.youtube, icon: 'youtube' },
]

export const DEFAULT_OG_IMAGE = '/og-default.jpg'
