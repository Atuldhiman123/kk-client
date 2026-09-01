'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  UserOutlined,
  StarFilled,
  SafetyCertificateOutlined,
  GlobalOutlined,
  LockOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

const statCards = [
  { icon: <UserOutlined />, value: '12,000+', label: 'Happy Clients' },
  { icon: <StarFilled />, value: '4.9/5.0', label: 'Client Rating' },
  { icon: <SafetyCertificateOutlined />, value: '100%', label: 'Privacy Guaranteed' },
];

const trustFeatures = [
  { icon: <UserOutlined />, title: 'Personalized Readings', desc: 'Tailored predictions based on your unique Kundli.' },
  { icon: <GlobalOutlined />, title: 'Accurate Remedies', desc: 'Practical and effective guidance for real-life problems.' },
  { icon: <LockOutlined />, title: 'Confidential & Secure', desc: 'Your privacy and trust are our priority.' },
  { icon: <CalendarOutlined />, title: 'Flexible Appointments', desc: 'Book at your convenience with easy scheduling.' },
];

const cosmicPills = [
  { icon: '✨', label: '27 Nakshatras', sub: 'Ashwini to Revati' },
  { icon: '♈', label: '12 Rashis', sub: 'Zodiac Constellations' },
  { icon: '🪐', label: '9 Grahas', sub: 'Planetary Gochar' },
  { icon: '🔮', label: '3D Bha-Chakra', sub: 'Vedic Ephemeris' },
];

export function Hero({ contact }: { contact: ContactInfo }) {
  const StatColumn = ({ mobile }: { mobile?: boolean }) => (
    <div
      className={
        mobile
          ? 'mt-4 grid grid-cols-3 divide-x divide-orange-100 rounded-2xl border border-orange-100/90 bg-orange-50/80 shadow-xs md:hidden'
          : 'relative z-20 -mr-14 hidden w-28 shrink-0 flex-col divide-y divide-orange-100 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/80 shadow-xl md:flex'
      }
    >
      {statCards.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center gap-0.5 sm:gap-1 px-1.5 py-2 sm:px-2 sm:py-2.5 text-center">
          <span className="text-orange-500 text-xs sm:text-sm">{stat.icon}</span>
          <span className="text-xs sm:text-sm font-extrabold text-neutral-900 leading-tight">{stat.value}</span>
          <span className="w-full min-w-0 text-[8px] sm:text-[9px] font-semibold uppercase tracking-wide text-neutral-500 leading-tight">{stat.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden border-b border-orange-100 pt-5 pb-10 sm:py-16 md:py-20">
      {/* Background with layered 3D cosmic nakshatra depth */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-section-bg.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Subtle 3D celestial sphere texture layer */}
        <div
          className="absolute inset-0 opacity-15 mix-blend-multiply bg-center bg-cover pointer-events-none"
          style={{ backgroundImage: 'url(/images/vedic-3d-nakshatra-bg.jpg)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10 md:items-center">
          {/* Left: Copy & Mobile Integrated Visual */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Desktop-only top badge and title (rendered on mobile inside the cinematic card) */}
            <div className="hidden md:block">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-900 sm:text-xs">
                <span className="text-orange-500">✨</span>
                <span>100% Authentic Vedic Guidance</span>
              </div>

              <h1 className="mt-3 sm:mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.85] tracking-tight text-neutral-900">
                Astrologer{' '}
                <span className="text-orange-500">Atul</span>
              </h1>

              <p className="mt-0 flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-neutral-800">
                <span>Master Vedic Astrologer</span>
                <span className="text-orange-400">&bull;</span>
                <span className="text-orange-600">10+ Years Experience</span>
              </p>
            </div>

            {/* Mobile-Only Cinematic 3D Celestial & Astrologer Hero Showcase */}
            <div className="relative my-2.5 w-full overflow-hidden rounded-3xl border-2 border-amber-400/90 shadow-2xl shadow-orange-950/20 md:hidden bg-[#06111d]">
              <div className="relative h-80 xs:h-88 w-full">
                {/* 3D Celestial Sphere & Astrologer Portrait */}
                <img
                  src="/images/hero-person-3d-nakshatra.jpg"
                  alt="Astrologer Atul with 3D Nakshatras & Rashis Sphere"
                  className="h-full w-full object-cover object-top"
                />

                {/* Faded softer bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050e18]/80 via-[#050e18]/15 via-25% to-transparent" />

                {/* Top Floating Badge (Rating only) */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold text-amber-300 border border-amber-400/40 shadow-md">
                    <StarFilled className="text-amber-400 text-[10px]" />
                    <span>4.9 (12k+)</span>
                  </span>
                </div>

                {/* Overlaid Title & Credentials */}
                <div className="absolute bottom-2.5 left-3.5 right-3.5 z-10 text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-wide text-emerald-300 drop-shadow-md">
                      Live &bull; Instant Slot Booking in 2 mins
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-semibold text-amber-200 drop-shadow-sm leading-tight">Master Vedic Astrologer</div>
                      <h1 className="font-serif text-2xl xs:text-3xl font-extrabold leading-none drop-shadow-md m-0">
                        <span style={{ color: '#ffffff' }}>Astrologer </span>
                        <span style={{ color: '#FACC15' }} className="text-yellow-400 font-extrabold">Atul</span>
                      </h1>
                    </div>

                    <div className="rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 px-3 py-1 text-[10px] font-extrabold text-white shadow-xs shrink-0 drop-shadow-xs">
                      10+ Yrs Exp
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Cosmic Nakshatra & Rashi Mini Highlights Pill Row */}
            <div className="grid grid-cols-4 gap-1.5 w-full my-2 md:hidden">
              {cosmicPills.map((pill) => (
                <div
                  key={pill.label}
                  className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-orange-200/80 bg-gradient-to-b from-white via-orange-50/50 to-amber-50/70 shadow-2xs text-center"
                >
                  <span className="text-xs">{pill.icon}</span>
                  <span className="text-[10px] font-extrabold text-neutral-900 leading-tight mt-0.5">{pill.label}</span>
                  <span className="text-[8px] text-neutral-500 font-medium leading-tight line-clamp-1">{pill.sub}</span>
                </div>
              ))}
            </div>

            <p className="mt-1 sm:mt-4 max-w-lg text-xs xs:text-sm sm:text-base leading-relaxed text-neutral-600">
              Get personalized, highly accurate Kundli analysis and practical planetary remedies for career, marriage, love, wealth, and health.
            </p>

            <div className="mt-3.5 sm:mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-row items-center justify-center md:justify-start sm:gap-3 w-full sm:w-auto">
              <Link
                href="#booking"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-3.5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition hover:from-orange-600 hover:to-red-700 whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                <CalendarOutlined />
                <span style={{ color: '#ffffff' }}>Book Consultation</span>
              </Link>

              <Link
                href="#consultations"
                className="inline-flex items-center justify-center gap-1 rounded-full border border-orange-300 bg-gradient-to-b from-white to-white px-3 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-orange-700 transition hover:from-orange-50 hover:to-orange-50 whitespace-nowrap"
              >
                Explore Services <span>&rarr;</span>
              </Link>
            </div>

            <div className="mt-3 sm:mt-5 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-neutral-500">Connect:</span>
              {contact.phone && (
                <a
                  href={telLink(contact.phone)}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-gradient-to-b from-white to-white px-3 py-1 sm:px-3.5 sm:py-1.5 font-semibold text-neutral-800 transition hover:border-orange-300 hover:text-orange-700 text-xs"
                >
                  <PhoneOutlined /> Call
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={waLink(contact.whatsapp, 'Hi, I would like to book a Kundli consultation.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-gradient-to-b from-white to-white px-3 py-1 sm:px-3.5 sm:py-1.5 font-semibold text-neutral-800 transition hover:border-emerald-300 hover:text-emerald-700 text-xs"
                >
                  <WhatsAppOutlined /> WhatsApp
                </a>
              )}
            </div>

            {/* Mobile Stat Bar */}
            <div className="w-full md:hidden">
              <StatColumn mobile />
            </div>
          </div>

          {/* Right: Desktop Visual with 3D Celestial Nakshatra Sphere */}
          <div className="hidden md:flex flex-col items-end gap-6">
            <div className="flex items-center mt-0 md:mr-6 lg:mr-10">
              <StatColumn />

              {/* Image + badges */}
              <div className="relative z-10">
                {/* Portrait */}
                <div className="h-80 w-80 overflow-hidden rounded-[28px] border-2 border-amber-300 shadow-2xl sm:h-96 sm:w-96 sm:rounded-[32px] md:h-[26rem] md:w-[26rem] lg:h-[28rem] lg:w-[28rem] bg-[#06111d]">
                  <img
                    src="/images/hero-person-3d-nakshatra.jpg"
                    alt="Astrologer Atul with 3D Nakshatras & Rashis Sphere"
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {/* Instant Slot Booking badge */}
                <div className="absolute -bottom-4 right-2 z-20 flex items-center gap-2.5 rounded-2xl border border-emerald-900/40 bg-[#14241a] px-3.5 py-2.5 shadow-xl sm:-bottom-5 sm:right-4 sm:px-4 sm:py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-amber-300 sm:h-9 sm:w-9">
                    <ClockCircleOutlined />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white sm:text-sm">
                      Instant Slot Booking
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-amber-100/70 sm:text-[11px]">Select date &amp; time in 2 mins</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Feature Strip - Single Row Cards on Mobile */}
        <div className="mt-8 sm:mt-16 rounded-2xl sm:rounded-3xl border border-orange-100 bg-gradient-to-b from-orange-50/90 via-[#FFFDF9] to-amber-50/50 p-3.5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 rounded-xl sm:rounded-2xl border border-orange-100/90 bg-white/95 p-3 sm:p-4 shadow-2xs transition-all hover:border-orange-300 hover:shadow-xs"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-base sm:text-lg text-orange-600 shadow-2xs">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
                    {feature.title}
                  </div>
                  <div className="mt-0.5 text-[11px] sm:text-xs leading-snug text-neutral-500">
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
