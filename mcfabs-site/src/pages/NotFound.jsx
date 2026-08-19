import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found | Faith Abah (Mc Fabs)"
        description="The page you're looking for doesn't exist."
        path="/404"
      />
      <main id="main-content" className="flex min-h-[60vh] flex-col items-center justify-center bg-paper px-4 text-center">
        <h1 className="font-display text-4xl text-ink">Page Not Found</h1>
        <p className="mt-3 text-ink/70">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/" className="mt-6 rounded-sm bg-marquee-pink px-6 py-3 font-semibold text-paper">
          Back to Home
        </Link>
      </main>
    </>
  )
}
