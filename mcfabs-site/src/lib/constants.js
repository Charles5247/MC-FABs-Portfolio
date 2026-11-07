export const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;
export const TICKETING_URL = import.meta.env.VITE_TICKETING_URL || 'https://fabs-masterclass.onrender.com';
export const BRAND = { name: 'Faith Abah', stageName: 'Mc Fabs', tagline: 'Find Your Voice. Own the Stage. Create Impact.', roleLine: 'MC · Brand Host · Media Personality · Masterclass Coach', location: 'Kano, Nigeria' };
// Supply verified contact details at build time. Never send enquiries to placeholder addresses.
export const CONTACT = {
  email: import.meta.env.VITE_BOOKING_EMAIL || '',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER ? 'https://wa.me/' + import.meta.env.VITE_WHATSAPP_NUMBER.replace(/\D/g, '') : '',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
  x: import.meta.env.VITE_X_URL || '',
  tiktok: import.meta.env.VITE_TIKTOK_URL || '',
  youtube: import.meta.env.VITE_YOUTUBE_URL || '',
};
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
export const NAV_LINKS = [{label:'About',href:'/#about'}, {label:'Services',href:'/#services'}, {label:'Masterclass',href:'/masterclass'}, {label:'Journal',href:'/blog'}, {label:'Book Faith ↗',href:'/#contact'}];
export const SOCIALS = [{label:'Instagram',url:CONTACT.instagram}, {label:'X',url:CONTACT.x}, {label:'TikTok',url:CONTACT.tiktok}, {label:'YouTube',url:CONTACT.youtube}].filter(s => s.url);
export const DEFAULT_OG_IMAGE = '/og-default.jpg';
