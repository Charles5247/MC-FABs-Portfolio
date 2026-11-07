import BookingFaq from '../components/BookingFaq'
import Seo from '../components/Seo'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import About from '../components/About'
import RoleBlocksSection from '../components/RoleBlocksSection'
import StatsBar from '../components/StatsBar'
import Gallery from '../components/Gallery'
import VideoReels from '../components/VideoReels'
import MasterclassSpotlight from '../components/MasterclassSpotlight'
import BlogTeaser from '../components/BlogTeaser'
import Testimonials from '../components/Testimonials'
import PressStrip from '../components/PressStrip'
import ContactSection from '../components/ContactSection'
import AnnouncementPopup from '../components/AnnouncementPopup'
import { BRAND, SITE_URL, CONTACT } from '../lib/constants'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: BRAND.name,
    alternateName: BRAND.stageName,
    jobTitle: 'Master of Ceremonies, Brand Host & Media Personality',
    url: SITE_URL,
    sameAs: [CONTACT.instagram, CONTACT.x, CONTACT.tiktok, CONTACT.youtube].filter(Boolean),
  }

  return (
    <>
      <Seo
        title="Faith Abah (Mc Fabs) | MC, Brand Host & Media Personality — Kano, Nigeria"
        description="Faith Abah, known as Mc Fabs, is a Kano-based Master of Ceremonies, brand host, and media personality. Find Your Voice. Own the Stage. Create Impact."
        path="/"
        jsonLd={jsonLd}
      />
      <AnnouncementPopup placement="sitewide" />
      <main id="main-content">
        {/* Hero renders the page's single <h1> (Faith Abah's name) */}
        <Hero />
        <Marquee />
        <About />
        <RoleBlocksSection />
        <StatsBar />
        <Gallery tag="general" heading="Moments On Stage" eyebrow="Gallery" />
        <VideoReels
          type="events"
          heading="Fabs in Action"
          eyebrow="Live Video Reels"
          description="Watch Faith Abah bring stage energy, poise, and unforgettable hosting presence to live stages across Nigeria."
        />
        <MasterclassSpotlight />
        <BlogTeaser />
        <Testimonials />
        <PressStrip />
        <BookingFaq />
        <ContactSection />
      </main>
    </>
  )
}
