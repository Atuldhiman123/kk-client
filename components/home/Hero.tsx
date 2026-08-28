import Link from 'next/link';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

export function Hero({ contact }: { contact: ContactInfo }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-200/80 via-amber-100/60 to-orange-50/40 py-16 sm:py-24 border-b border-orange-200/50">
      {/* Decorative gradient glow circles */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-amber-300/30 to-orange-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-orange-200/30 to-red-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-600/10 px-4 py-1.5 text-xs font-bold text-orange-950 shadow-2xs">
            <span>✨ 100% Authentic &amp; Confidential Vedic Guidance</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl font-serif">
            Astrologer <span className="text-orange-655 font-serif font-black">Atul</span>
          </h1>

          <p className="mt-2 text-xl font-semibold text-neutral-800">
            Master Vedic Astrologer &middot; 10+ Years Experience
          </p>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-650">
            Get personalized, highly accurate Kundli analysis and planetary remedies for career growth, marriage compatibility, love relationships, financial prosperity, and health.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-650 px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:scale-105 hover:from-orange-600 hover:to-red-750"
              style={{ color: '#ffffff' }}
            >
              <span className="text-white" style={{ color: '#ffffff' }}>🔮 Book Consultation</span>
            </Link>

            <Link
              href="#consultations"
              className="inline-flex items-center gap-2 rounded-full border border-orange-350 bg-white/70 px-6 py-3.5 text-sm font-bold text-neutral-800 shadow-xs transition hover:border-orange-500 hover:bg-orange-50/50"
            >
              Explore Services
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-500">
            <span>Direct Queries:</span>
            {contact.phone && (
              <a
                href={telLink(contact.phone)}
                className="inline-flex items-center gap-1.5 hover:text-orange-650 transition"
              >
                📞 Call Now
              </a>
            )}
            <span className="text-neutral-300">|</span>
            {contact.whatsapp && (
              <a
                href={waLink(contact.whatsapp, "Hi, I would like to book a Kundli consultation.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-emerald-650 transition"
              >
                💬 WhatsApp Chat
              </a>
            )}
          </div>

          <div className="mt-8 flex items-center gap-6 border-t border-orange-200 pt-6">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-lg">⭐⭐⭐⭐⭐</span>
              <span className="text-sm font-bold text-neutral-900">4.9 / 5.0 Rating</span>
            </div>
            <div className="h-4 w-px bg-orange-300" />
            <span className="text-sm font-semibold text-neutral-705">12,000+ Satisfied Clients</span>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            {/* Floating Kundli Scroll Badge */}
            <div className="absolute -top-5 -left-5 overflow-hidden rounded-2xl border-2 border-orange-300 bg-[#FFFDF9] p-1.5 shadow-lg transition duration-200 hover:scale-105 hidden sm:block z-10">
              <img
                src="/images/kundli-scroll.jpg"
                alt="Vedic Kundli Scroll"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="text-[8px] font-black uppercase text-orange-700 text-center mt-1">Janam Kundli</div>
            </div>

            <div className="h-72 w-72 overflow-hidden rounded-3xl border-4 border-orange-400/80 shadow-2xl transition hover:scale-102 sm:h-96 sm:w-96">
              <img
                src="/astrologer-atul.jpg"
                alt="Astrologer Atul"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 sm:-left-5 sm:right-auto rounded-2xl border border-orange-100 bg-white/95 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <img
                  src="/images/kundli-scroll.jpg"
                  alt="Scroll icon"
                  className="flex h-10 w-10 shrink-0 object-cover rounded-xl border border-orange-200"
                />
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
