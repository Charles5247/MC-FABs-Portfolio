import { Link } from "react-router-dom";
import { NAV_LINKS, SOCIALS, BRAND, TICKETING_URL } from "../lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink md:items-center  text-paper/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl text-paper">
              {BRAND.name} | MC FABS
            </p>
            <p className="mt-2 text-sm">{BRAND.roleLine}</p>
            <p className="mt-1 text-sm">{BRAND.location}</p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-blush">Navigate</p>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="hover:text-marquee-pink">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={TICKETING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-marquee-pink"
                >
                  Masterclass Tickets
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-blush">Follow Us On</p>
            <ul className="mt-3 grid gap-4">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-marquee-pink"
                    aria-label={`${BRAND.stageName} on ${s.label}`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 md:py-0 border-t border-white/20 grid md:items-center gap-4 md:grid-cols-2">
          <p className="mb-0 pt-6 text-xs text-paper/50">
            &copy; {year} {BRAND.name} ({BRAND.stageName}). | All rights
            reserved.
          </p>
          <p className="mb-0 pt-6 text-xs text-paper/50">
            Developed By |
            <a href="https://caxietechnologies.com"> CAXiE Technologies Ltd</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
