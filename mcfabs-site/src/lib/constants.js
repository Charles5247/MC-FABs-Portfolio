export const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;
export const TICKETING_URL = import.meta.env.VITE_TICKETING_URL || 'https://fabs-masterclass.onrender.com';
export const BRAND = {
  name: 'Faith Abah',
  stageName: 'Mc Fabs',
  tagline: 'Find Your Voice. Own the Stage. Create Impact.',
  roleLine: 'MC · Brand Host · Media Personality · Masterclass Coach',
  location: 'Kano, Nigeria',
};

// Supply verified contact details at build time. Never send enquiries to placeholder addresses.
export const CONTACT = {
  email: import.meta.env.VITE_BOOKING_EMAIL || '',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER ? 'https://wa.me/' + import.meta.env.VITE_WHATSAPP_NUMBER.replace(/\D/g, '') : '',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
  x: import.meta.env.VITE_X_URL || '',
  tiktok: import.meta.env.VITE_TIKTOK_URL || '',
  youtube: import.meta.env.VITE_YOUTUBE_URL || '',
};

// Curated Video Reels for MC FABS in action at live events
export const EVENT_VIDEO_REELS = [
  {
    id: 'event-reel-1',
    title: 'Grand Entrance & Room Energy',
    subtitle: 'Luxury Wedding Reception',
    category: 'Wedding MC',
    duration: '0:45',
    thumbnail: 'https://lh3.googleusercontent.com/d/1tVSdQov3Y8T71mAT5S5_mX3iXTWUpKux',
    videoUrl: '', // Will stream directly on-site once Drive video link is pasted
    highlight: 'Opening welcome & hyping the grand entrance',
  },
  {
    id: 'event-reel-2',
    title: 'Commanding the Room & Protocol Flow',
    subtitle: 'Annual Corporate Excellence Gala',
    category: 'Corporate Host',
    duration: '1:10',
    thumbnail: 'https://lh3.googleusercontent.com/d/1KWOhyDdNrD4MVpOCoh05LePdcjJOUhYA',
    videoUrl: '',
    highlight: 'Award presentation & executive transitions',
  },
  {
    id: 'event-reel-3',
    title: 'Crowd Hype & High-Energy Celebration',
    subtitle: 'Reception After-Party',
    category: 'Stage Energy',
    duration: '0:55',
    thumbnail: 'https://lh3.googleusercontent.com/d/1hL8L3tP7Rc2Oro4ShO-ApzYCMXzxVtTG',
    videoUrl: '',
    highlight: 'Dance floor engagement & bridal hype',
  },
  {
    id: 'event-reel-4',
    title: 'Brand Storytelling & Live Activation',
    subtitle: 'Product Launch & Media Night',
    category: 'Brand Activation',
    duration: '1:05',
    thumbnail: 'https://lh3.googleusercontent.com/d/1jUZuspRFSVI120-Av1oikyMHN5LsNcB-',
    videoUrl: '',
    highlight: 'Audience connection & on-stage dialogue',
  },
];

// Curated Video Reels for Masterclass 1.0 sessions & coaching
export const MASTERCLASS_VIDEO_REELS = [
  {
    id: 'mc-reel-1',
    title: 'Owning the Stage: Presence & Poise',
    subtitle: 'Masterclass 1.0 Keynote Breakdown',
    category: 'Stage Presence',
    duration: '0:50',
    thumbnail: 'https://lh3.googleusercontent.com/d/1Tfv5kN9rioFwSvC023hFe6TNudlzZqwc',
    videoUrl: '', // Will stream directly on-site once Drive video link is pasted
    highlight: 'Posture, entrance, and holding the spotlight',
  },
  {
    id: 'mc-reel-2',
    title: 'Voice Projection & Microphone Technique',
    subtitle: 'Hands-on Vocal Coaching',
    category: 'Voice Training',
    duration: '1:15',
    thumbnail: 'https://lh3.googleusercontent.com/d/1JwX_UU-7sE9yTdGqS5UcDf8VhgYLtHGT',
    videoUrl: '',
    highlight: 'Tonal control, pacing, and room resonance',
  },
  {
    id: 'mc-reel-3',
    title: 'Student Live Stage Drill & Breakthrough',
    subtitle: 'Interactive Student Simulation',
    category: 'Live Practice',
    duration: '1:00',
    thumbnail: 'https://lh3.googleusercontent.com/d/1-NS9aipP0DAP-HTyXkMSEWNxFdITI53C',
    videoUrl: '',
    highlight: 'Overcoming stage fright in real-time',
  },
  {
    id: 'mc-reel-4',
    title: 'The Art of the Event Flow',
    subtitle: 'Programme Scripting & Transition Secrets',
    category: 'Event Mastery',
    duration: '0:45',
    thumbnail: 'https://lh3.googleusercontent.com/d/1aLO8sHxQ4BmvOAMTcS3xMxX-MKbRC2vl',
    videoUrl: '',
    highlight: 'Handling unexpected timeline shifts with grace',
  },
];

// Publish only verified statistics and testimonials.
export const STATS = [];
export const TESTIMONIALS = [];
export const PRESS_LOGOS = [];
export const ROLE_BLOCKS = [
  { title: 'Master of Ceremonies', description: 'A warm welcome, a confident flow, and a room that feels connected. Hosting for weddings, corporate occasions, conferences, and celebrations.', clients: [] },
  { title: 'Brand Hosting', description: 'Give your launch or activation a human voice. Bring your message into the room with hosting built around your brand and its audience.', clients: [] },
  { title: 'Media & On-Air', description: 'Make space for conversations that matter. Explore presenting, interviews, and media collaborations with Faith.', clients: [] },
];
export const ABOUT_PARAGRAPHS = [
  'Meet Faith Abah, known as MC FABS: a Kano-based master of ceremonies, brand host, and media personality.',
  'A great event is about more than a microphone. It is about making people feel welcome, giving every moment its place, and bringing your vision into the room.',
  'From event hosting to the MC FABS masterclass, the invitation is simple: find your voice, own the stage, and create impact.',
];
export const EVENT_CATEGORIES = ['Weddings', 'Corporate Events', 'Brand Activations', 'Award Nights', 'Product Launches', 'Conferences'];
export const RATES_PUBLIC = false;
export const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Masterclass', href: '/masterclass' },
  { label: 'Journal', href: '/blog' },
  { label: 'Book Faith ↗', href: '/#contact' },
];
export const SOCIALS = [
  { label: 'Instagram', url: CONTACT.instagram },
  { label: 'X', url: CONTACT.x },
  { label: 'TikTok', url: CONTACT.tiktok },
  { label: 'YouTube', url: CONTACT.youtube },
].filter((s) => s.url);
export const DEFAULT_OG_IMAGE = '/og-default.jpg';
