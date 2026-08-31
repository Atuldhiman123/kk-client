'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

export function Hero({ contact }: { contact: ContactInfo }) {
  // Reusable 3D Astrologer Portrait Visual
  const AstrologerVisual = ({ isMobile }: { isMobile?: boolean }) => (
    <div className={`relative max-w-full preserve-3d group transition-transform duration-500 hover:rotate-y-[-6deg] hover:rotate-x-[4deg] ${isMobile ? 'my-3.5' : ''}`}>
      {/* 3D Rotating Background Zodiac Ring */}
      <div className={`absolute rounded-full border border-dashed border-amber-400/40 animate-spin-slow pointer-events-none opacity-70 ${
        isMobile ? '-inset-3.5 sm:-inset-5' : '-inset-8 md:-inset-10'
      }`} />
      <div className={`absolute rounded-full border border-orange-500/30 pointer-events-none animate-pulse-glow ${
        isMobile ? '-inset-2' : '-inset-4 md:-inset-5'
      }`} />

      {/* Floating 3D Janam Kundli Scroll Badge */}
      <div className={`absolute overflow-hidden rounded-xl sm:rounded-2xl border-2 border-amber-400/80 bg-[#150a05]/95 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105 z-20 animate-float ${
        isMobile ? '-top-2.5 -left-2.5 p-1' : '-top-5 -left-5 p-1.5'
      }`}>
        <img
          src="/images/kundli-scroll.jpg"
          alt="Vedic Kundli Scroll"
          className={`rounded-lg sm:rounded-xl object-cover border border-amber-500/40 ${
            isMobile ? 'h-9 w-9 sm:h-11 sm:w-11' : 'h-16 w-16'
          }`}
        />
        <div className={`font-black uppercase text-amber-400 text-center ${
          isMobile ? 'text-[6.5px] mt-0.5' : 'text-[8px] mt-1'
        }`}>
          Janam Kundli
        </div>
      </div>

      {/* Astrologer Portrait in 3D Glass Frame */}
      <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-amber-400/70 shadow-[0_15px_40px_rgba(245,158,11,0.3)] transition-all duration-300 mx-auto bg-gradient-to-b from-amber-950/40 to-black/80 ${
        isMobile ? 'h-40 w-40 sm:h-52 sm:w-52' : 'h-80 w-80 md:h-96 md:w-96'
      }`}>
        <img
          src="/astrologer-atul.jpg"
          alt="Astrologer Atul"
          className="h-full w-full object-cover object-top filter brightness-105 contrast-105 transition duration-500 group-hover:scale-103"
        />
        {/* Subtle gold inner rim ring */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-amber-300/40 pointer-events-none" />
      </div>

      {/* 3D Floating Bottom Booking Badge */}
      <div className={`absolute right-0 left-0 mx-auto rounded-xl sm:rounded-2xl border border-amber-300/80 bg-[#1c0d06]/95 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.75)] z-20 ${
        isMobile
          ? '-bottom-2.5 w-[88%] sm:w-auto p-1.5 sm:p-2 sm:-left-3 sm:right-auto'
          : '-bottom-4 sm:-left-6 sm:right-auto p-3 sm:p-4 w-auto'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/images/kundli-scroll.jpg"
            alt="Scroll icon"
            className={`shrink-0 object-cover rounded-lg border border-amber-400/50 ${
              isMobile ? 'h-6 w-6 sm:h-8 sm:w-8' : 'h-10 w-10'
            }`}
          />
          <div>
            <div className={`font-bold text-white leading-tight flex items-center gap-1.5 ${
              isMobile ? 'text-[10px] sm:text-xs' : 'text-xs'
            }`}>
              <span>Instant Slot Booking</span>
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            </div>
            <div className={`text-amber-200/80 mt-0.5 ${
              isMobile ? 'text-[8.5px] sm:text-[10px]' : 'text-[11px]'
            }`}>
              Select date &amp; time in 2 mins
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-[#0c0704] py-6 sm:py-12 md:py-24 border-b border-amber-900/30">
      {/* 1. Celestial Cosmic Zodiac Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-cosmic-bg.jpg"
          alt="Cosmic Zodiac Astrological Background"
          fill
          priority
          unoptimized
          className="object-cover object-center sm:object-right-top scale-105 transition-transform duration-1000"
        />
        {/* Layered dark atmospheric & nebula gradients for rich text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0704]/95 via-[#130a05]/85 to-[#0b0604]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0704]/70 via-transparent to-[#0c0704]/90" />
        {/* Subtle radial cosmic glow lights */}
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-amber-500/15 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-orange-600/20 blur-3xl" />
      </div>

      {/* 2. Main Hero Content & 3D Interactive Layout */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-6 sm:gap-10 md:grid-cols-2 md:items-center px-4 sm:px-6 lg:px-8">
        <div>
          {/* Luminous Vedic Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 backdrop-blur-md px-2.5 sm:px-3.5 py-1 text-[10px] sm:text-xs font-bold text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <span className="text-amber-300">✨</span>
            <span>100% Authentic Vedic Guidance</span>
          </div>

          <h1 className="mt-2.5 sm:mt-3 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif leading-tight">
            Astrologer <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 font-serif font-black drop-shadow-[0_2px_10px_rgba(249,115,22,0.4)]">Atul</span>
          </h1>

          <p className="mt-1 sm:mt-1.5 text-xs sm:text-base md:text-lg font-semibold text-amber-100/90 flex flex-wrap items-center gap-1.5">
            <span>Master Vedic Astrologer</span>
            <span className="text-amber-500">&middot;</span>
            <span className="text-amber-300">10+ Years Exp.</span>
          </p>

          {/* Mobile-Only 3D Astrologer Visual (Proportional & Compact) */}
          <div className="flex md:hidden justify-center perspective-1000">
            <AstrologerVisual isMobile />
          </div>

          <p className="mt-2.5 sm:mt-3 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-amber-100/80 line-clamp-2 sm:line-clamp-none">
            Get personalized, highly accurate Kundli analysis and practical planetary remedies for career, marriage, love, wealth, and health.
          </p>

          {/* Action CTAs - Responsive Side-by-Side on Mobile */}
          <div className="mt-3.5 sm:mt-6 flex flex-row items-center gap-2 sm:gap-3.5">
            <Link
              href="#booking"
              className="flex-1 sm:flex-none group relative inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(249,115,22,0.5)] transition-all duration-200 hover:scale-102 text-center"
              style={{ color: '#ffffff' }}
            >
              <span className="text-white flex items-center gap-1.5" style={{ color: '#ffffff' }}>
                <span>🔮</span> Book Now
              </span>
            </Link>

            <Link
              href="#consultations"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-full border border-amber-400/40 bg-white/10 backdrop-blur-md px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:border-amber-300 hover:bg-white/20 text-center"
            >
              Services &rarr;
            </Link>
          </div>

          {/* Quick Direct Queries */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-[10.5px] sm:text-xs font-bold text-amber-200/80">
            <span className="text-neutral-400">Direct:</span>
            {contact.phone && (
              <a
                href={telLink(contact.phone)}
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-100 transition rounded-full bg-white/5 border border-amber-400/20 px-2 py-0.5 backdrop-blur-xs"
              >
                📞 Call
              </a>
            )}
            <span className="text-amber-500/40">|</span>
            {contact.whatsapp && (
              <a
                href={waLink(contact.whatsapp, "Hi, I would like to book a Kundli consultation.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-200 transition rounded-full bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 backdrop-blur-xs"
              >
                💬 WhatsApp
              </a>
            )}
          </div>

          {/* Ratings & Trust Indicator */}
          <div className="mt-3.5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-5 border-t border-amber-500/20 pt-3 sm:pt-4">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-xs sm:text-sm">⭐⭐⭐⭐⭐</span>
              <span className="text-[11px] sm:text-xs font-bold text-white">4.9/5.0</span>
            </div>
            <div className="h-3 w-px bg-amber-500/30" />
            <span className="text-[11px] sm:text-xs font-semibold text-amber-200/80">
              12,000+ Clients
            </span>
          </div>
        </div>

        {/* Desktop-Only 3D Visual Section (Right Column) */}
        <div className="hidden md:flex justify-end perspective-1000">
          <AstrologerVisual />
        </div>
      </div>
    </section>
  );
}
