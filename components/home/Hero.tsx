import Link from 'next/link';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

export function Hero({ contact }: { contact: ContactInfo }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/60 via-amber-50/40 to-faf8f5 py-16 sm:py-24">
      {/* Decorative gradient glow circles */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-amber-300/30 to-amber-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-amber-200/40 to-amber-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/80 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-2xs">
            <span>✨ 100% Authentic &amp; Confidential Vedic Guidance</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Astrologer <span className="text-amber-600">Atul</span>
          </h1>

          <p className="mt-2 text-xl font-semibold text-neutral-800">
            Master Vedic Astrologer &middot; 10+ Years Experience
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-700">
            Get personalized, highly accurate Kundli analysis and planetary remedies for career growth, marriage compatibility, love relationships, financial prosperity, and health.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:scale-105 hover:from-amber-700 hover:to-amber-800"
              style={{ color: '#ffffff' }}
            >
              <span className="text-white" style={{ color: '#ffffff' }}>🔮 Book Consultation</span>
            </Link>

            <Link
              href="#consultations"
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 shadow-xs transition hover:border-amber-500 hover:bg-amber-50"
            >
              Explore Services
            </Link>

            <a
              href={telLink(contact.phone)}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3.5 text-sm font-semibold text-neutral-800 shadow-xs transition hover:border-neutral-400 hover:bg-neutral-50"
            >
              📞 Call Now
            </a>

            <a
              href={waLink(contact.whatsapp, "Hi, I would like to book a Kundli consultation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:opacity-95"
              style={{ backgroundColor: '#25D366', color: '#ffffff' }}
            >
              <span className="text-white" style={{ color: '#ffffff' }}>💬 WhatsApp</span>
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 border-t border-amber-200/60 pt-6">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-lg">⭐⭐⭐⭐⭐</span>
              <span className="text-sm font-bold text-neutral-900">4.9 / 5.0 Rating</span>
            </div>
            <div className="h-4 w-px bg-amber-300" />
            <span className="text-sm font-semibold text-neutral-700">12,000+ Satisfied Clients</span>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="h-72 w-72 overflow-hidden rounded-3xl border-4 border-amber-300/80 shadow-2xl transition hover:scale-102 sm:h-96 sm:w-96">
              <img
                src="/astrologer-atul.jpg"
                alt="Astrologer Atul"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold">
                  📜
                </span>
                <div>
                  <div className="text-xs font-bold text-neutral-900">Instant Online Slot Booking</div>
                  <div className="text-xs text-neutral-600">Select date &amp; time in 2 minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
