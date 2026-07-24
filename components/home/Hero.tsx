import Link from 'next/link';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

export function Hero({ contact }: { contact: ContactInfo }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#B8860B' }}>
            Vedic Astrology &amp; Kundli Consultation
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Astrologer Name
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Vedic Astrology Expert &middot; 10+ Years of Experience
          </p>
          <p className="mt-4 max-w-lg text-neutral-600">
            Personalized, confidential consultations to guide you towards clarity in career,
            marriage, love, business, health and more — rooted in traditional Vedic astrology.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#booking"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: '#B8860B' }}
            >
              Book Consultation
            </Link>
            <a
              href={telLink(contact.phone)}
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-800"
            >
              Call Now
            </a>
            <a
              href={waLink(contact.whatsapp, "Hi, I'd like to book an astrology consultation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: '#25D366' }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div
            className="flex h-64 w-64 items-center justify-center rounded-full text-7xl shadow-inner sm:h-80 sm:w-80"
            style={{ background: 'linear-gradient(135deg, #FDE68A, #B8860B)' }}
            aria-hidden
          >
            🔮
          </div>
        </div>
      </div>
    </section>
  );
}
