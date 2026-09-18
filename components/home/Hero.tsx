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
  CheckCircleFilled,
} from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { PhoneIcon } from '@/components/icons/PhoneIcon';
import { waLink, telLink } from '@/lib/contact';
import { useLanguage } from '@/lib/i18n';

const ZODIAC_ORBIT_SIGNS = [
  { name: 'Mesha', hi: 'मेष', symbol: '♈', bg: 'bg-rose-500', text: 'text-white', glow: 'rgba(244,63,94,0.7)' },
  { name: 'Vrishabha', hi: 'वृषभ', symbol: '♉', bg: 'bg-emerald-500', text: 'text-white', glow: 'rgba(16,185,129,0.7)' },
  { name: 'Mithuna', hi: 'मिथुन', symbol: '♊', bg: 'bg-amber-400', text: 'text-neutral-900', glow: 'rgba(251,191,36,0.7)' },
  { name: 'Karka', hi: 'कर्क', symbol: '♋', bg: 'bg-sky-400', text: 'text-neutral-900', glow: 'rgba(56,189,248,0.7)' },
  { name: 'Simha', hi: 'सिंह', symbol: '♌', bg: 'bg-orange-500', text: 'text-white', glow: 'rgba(249,115,22,0.7)' },
  { name: 'Kanya', hi: 'कन्या', symbol: '♍', bg: 'bg-teal-500', text: 'text-white', glow: 'rgba(20,184,166,0.7)' },
  { name: 'Tula', hi: 'तुला', symbol: '♎', bg: 'bg-purple-500', text: 'text-white', glow: 'rgba(168,85,247,0.7)' },
  { name: 'Vrischika', hi: 'वृश्चिक', symbol: '♏', bg: 'bg-red-600', text: 'text-white', glow: 'rgba(220,38,38,0.7)' },
  { name: 'Dhanu', hi: 'धनु', symbol: '♐', bg: 'bg-yellow-500', text: 'text-neutral-900', glow: 'rgba(234,179,8,0.7)' },
  { name: 'Makara', hi: 'मकर', symbol: '♑', bg: 'bg-indigo-500', text: 'text-white', glow: 'rgba(99,102,241,0.7)' },
  { name: 'Kumbha', hi: 'कुंभ', symbol: '♒', bg: 'bg-cyan-500', text: 'text-white', glow: 'rgba(6,182,212,0.7)' },
  { name: 'Meena', hi: 'मीन', symbol: '♓', bg: 'bg-pink-500', text: 'text-white', glow: 'rgba(236,72,153,0.7)' },
];

export function Hero({ contact }: { contact: ContactInfo }) {
  const { t } = useLanguage();

  const statCards = [
    { icon: <UserOutlined />, value: '12,000+', label: t.hero.stats_happy },
    { icon: <StarFilled />, value: '4.9/5.0', label: t.hero.stats_rating },
    { icon: <SafetyCertificateOutlined />, value: '100%', label: t.hero.stats_privacy },
  ];

  const trustFeatures = [
    { icon: <UserOutlined />, title: t.hero.trust.personalized_title, desc: t.hero.trust.personalized_desc },
    { icon: <GlobalOutlined />, title: t.hero.trust.remedies_title, desc: t.hero.trust.remedies_desc },
    { icon: <LockOutlined />, title: t.hero.trust.confidential_title, desc: t.hero.trust.confidential_desc },
    { icon: <CalendarOutlined />, title: t.hero.trust.appointments_title, desc: t.hero.trust.appointments_desc },
  ];

  const trustBadgesList = [
    t.hero.trust_badges.authentic,
    t.hero.trust_badges.experience,
    t.hero.trust_badges.practical,
    t.hero.trust_badges.direct,
  ];

  const cosmicPills = [
    { icon: '✨', label: t.hero.pills.nakshatra_label, sub: t.hero.pills.nakshatra_sub },
    { icon: '♈', label: t.hero.pills.rashi_label, sub: t.hero.pills.rashi_sub },
    { icon: '🪐', label: t.hero.pills.graha_label, sub: t.hero.pills.graha_sub },
    { icon: '🔮', label: t.hero.pills.chakra_label, sub: t.hero.pills.chakra_sub },
  ];

  const StatColumn = ({ mobile }: { mobile?: boolean }) => (
    <div
      className={
        mobile
          ? 'mt-4 grid grid-cols-3 divide-x divide-orange-100 rounded-2xl border border-orange-100/90 bg-orange-50/80 shadow-xs md:hidden'
          : 'relative z-0 -mr-12 lg:-mr-14 hidden w-28 shrink-0 flex-col divide-y divide-orange-100/80 overflow-hidden rounded-2xl border border-amber-200/80 bg-white/85 backdrop-blur-md shadow-xl md:flex'
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
    <section className="relative overflow-hidden border-b border-orange-100 pt-4 pb-10 sm:py-14 md:py-16">
      {/* Background with zodiac element sky & radiant depth */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-zodiac-bg.jpg"
          alt="Zodiac Element Vedic Background"
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Soft atmospheric gradient overlay for readability & premium glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50/85 via-orange-50/70 to-amber-950/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-amber-950/40 pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:gap-10 md:items-center">
          {/* Left: Copy & Mobile Integrated Visual */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Desktop-only top badge and title */}
            <div className="hidden md:block">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-900 sm:text-xs">
                <span className="text-orange-500">✨</span>
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="mt-3 sm:mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight text-neutral-900">
                {t.hero.title_prefix}{' '}
                <span className="text-orange-600">{t.hero.title_name}</span>
              </h1>

              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-neutral-800">
                <span>{t.hero.astrologer_role}</span>
                <span className="text-orange-400">&bull;</span>
                <span className="text-orange-600">{t.hero.experience}</span>
              </p>
            </div>

            {/* Mobile-Only Circular Celestial Astrologer Showcase with Large Portrait & Elegant Zodiac Orbit */}
            <div className="relative mt-1 mb-2 w-full max-w-[340px] xs:max-w-[360px] mx-auto md:hidden">
              {/* Cosmic Aura & Rotating Orbit Wheel */}
              <div className="relative h-[275px] xs:h-[295px] w-full flex items-center justify-center overflow-visible">
                {/* Background Cosmic Glow Aura */}
                <div className="absolute inset-0 m-auto h-[240px] w-[240px] xs:h-[260px] xs:w-[260px] rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/25 to-amber-900/20 blur-xl pointer-events-none" />

                {/* Outer Celestial Orbit Guide Rings */}
                <div className="absolute inset-0 m-auto h-[250px] w-[250px] xs:h-[270px] xs:w-[270px] rounded-full border border-amber-400/45 border-dashed pointer-events-none" />
                <div className="absolute inset-0 m-auto h-[230px] w-[230px] xs:h-[248px] xs:w-[248px] rounded-full border border-amber-300/25 pointer-events-none" />

                {/* Rotating 12 Zodiac & Nakshatra Orbit Wheel (Elegant Golden Cosmic Theme) */}
                <div
                  className="absolute inset-0 m-auto h-[250px] w-[250px] xs:h-[270px] xs:w-[270px] rounded-full animate-spin-slow pointer-events-none"
                  style={{ animationDuration: '34s' }}
                >
                  {ZODIAC_ORBIT_SIGNS.map((sign, idx) => {
                    const angle = idx * 30; // 360 / 12 = 30 deg
                    const radius = 125; // px for orbit radius (balanced)
                    return (
                      <div
                        key={sign.name}
                        className="absolute top-1/2 left-1/2 -mt-3.5 -ml-3.5 xs:-mt-3.5 xs:-ml-3.5 flex items-center justify-center"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                        }}
                      >
                        <div
                          className="h-7 w-7 xs:h-7.5 xs:w-7.5 rounded-full bg-[#081728]/95 text-amber-300 flex items-center justify-center text-xs xs:text-sm font-bold shadow-[0_0_10px_rgba(245,158,11,0.4)] border border-amber-400/70 drop-shadow-xs transition-transform"
                          title={`${sign.name} (${sign.hi})`}
                        >
                          <span>{sign.symbol}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Center: Large Astrologer Atul Circular Portrait */}
                <div className="relative z-10 h-[180px] w-[180px] xs:h-[196px] xs:w-[196px] rounded-full border-[3.5px] border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.45)] overflow-hidden bg-[#071322] shrink-0">
                  <img
                    src="/images/hero-person-3d-nakshatra.webp"
                    alt="Astrologer Atul - Senior Vedic Astrologer"
                    className="h-full w-full object-cover object-top scale-105"
                  />
                  {/* Subtle golden ring edge highlight */}
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-amber-300/60 pointer-events-none" />
                </div>

                {/* Top-Right Floating Rating Badge */}
                <div className="absolute top-1 right-0 xs:top-1.5 xs:right-1 z-20">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-amber-900 border border-amber-300 shadow-md">
                    <StarFilled className="text-amber-500 text-[10.5px]" />
                    <span>4.9 (12k+)</span>
                  </span>
                </div>

                {/* Bottom-Right Floating Experience Pill */}
                <div className="absolute bottom-1 right-0 xs:bottom-1.5 xs:right-1 z-20">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-0.5 text-[9.5px] xs:text-[10px] font-black text-white shadow-md border border-white/60">
                    {t.hero.experience}
                  </span>
                </div>
              </div>

              {/* Astrologer Name & Credentials Header on Mobile */}
              <div className="text-center mt-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 mb-1 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-[10px] xs:text-[11px] font-bold text-emerald-800">
                    {t.hero.live_booking}
                  </span>
                </div>

                <h1 className="font-serif text-2xl xs:text-3xl font-extrabold text-neutral-900 leading-tight">
                  <span>{t.hero.title_prefix} </span>
                  <span className="text-orange-600">
                    {t.hero.title_name}
                  </span>
                </h1>

                <p className="text-xs xs:text-[13px] font-bold text-amber-900/90 mt-0.5">
                  {t.hero.astrologer_role}
                </p>
              </div>
            </div>

            {/* Dual CTA Buttons (Placed right in top fold on Mobile) */}
            <div className="mt-2 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full sm:w-auto px-1 xs:px-0">
              <Link
                href="/ai-astrologer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:from-amber-600 hover:to-red-600 whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                <SafetyCertificateOutlined className="text-sm sm:text-base text-amber-200" />
                <span style={{ color: '#ffffff' }}>{t.hero.gemstone_hook.cta}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    window.dispatchEvent(new CustomEvent('open-booking-drawer'));
                  } else {
                    const el = document.getElementById('booking');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 20;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    } else {
                      window.location.hash = 'booking';
                    }
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-orange-400 bg-white px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-orange-800 shadow-sm transition hover:bg-orange-50 hover:border-orange-500 whitespace-nowrap cursor-pointer"
              >
                <CalendarOutlined className="text-sm sm:text-base" />
                <span>{t.hero.book_btn}</span>
              </button>
            </div>

            {/* Quick Direct Connect */}
            <div className="mt-2.5 sm:mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-neutral-500">{t.hero.connect}</span>
              {contact.phone && (
                <a
                  href={telLink(contact.phone)}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 font-semibold text-neutral-800 transition hover:border-orange-300 hover:text-orange-700 text-xs shadow-2xs"
                >
                  <PhoneIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-800" /> {t.nav.call}
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={waLink(contact.whatsapp, 'Hi, I would like to book a Kundli consultation.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 font-semibold text-emerald-800 transition hover:border-emerald-400 hover:text-emerald-700 text-xs shadow-2xs"
                >
                  <WhatsAppOutlined className="text-emerald-600" /> {t.nav.whatsapp}
                </a>
              )}
            </div>

            {/* Trust Bullet Tags */}
            <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center justify-center md:justify-start gap-1 xs:gap-1.5 sm:gap-2">
              {trustBadgesList.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-50/90 border border-amber-200 px-2 py-0.5 xs:px-2.5 text-[9.5px] xs:text-[10px] sm:text-xs font-bold text-amber-900 shadow-2xs whitespace-nowrap"
                >
                  <CheckCircleFilled className="text-emerald-600 text-[9.5px] xs:text-[10px] sm:text-xs" />
                  {badge}
                </span>
              ))}
            </div>

            {/* Headline & Subtitle */}
            <div className="mt-2 sm:mt-3 px-1 xs:px-0">
              <h3 className="text-xs xs:text-sm md:text-lg font-black text-orange-950/90 leading-snug">
                {t.hero.headline}
              </h3>
              <p className="mt-1 sm:mt-2 max-w-lg text-[11px] xs:text-xs sm:text-base leading-relaxed text-neutral-700">
                {t.hero.subtitle}
              </p>
            </div>

            {/* Mobile Stat Bar */}
            <div className="w-full md:hidden">
              <StatColumn mobile />
            </div>
          </div>

          {/* Right: Desktop Visual with 3D Celestial Nakshatra Orbit & Circular Astrologer Portrait */}
          <div className="hidden md:flex flex-col items-end gap-6">
            <div className="flex items-center mt-0 md:mr-2 lg:mr-4 gap-2 lg:gap-5">
              <StatColumn />

              {/* Grand Celestial Orbit Showcase */}
              <div className="relative z-10 h-[380px] w-[380px] lg:h-[440px] lg:w-[440px] flex items-center justify-center overflow-visible">
                {/* Background Cosmic Glow Aura */}
                <div className="absolute inset-0 m-auto h-[320px] w-[320px] lg:h-[380px] lg:w-[380px] rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/25 to-amber-900/20 blur-2xl pointer-events-none" />

                {/* Outer Celestial Orbit Guide Rings */}
                <div className="absolute inset-0 m-auto h-[345px] w-[345px] lg:h-[400px] lg:w-[400px] rounded-full border border-amber-400/50 border-dashed pointer-events-none" />
                <div className="absolute inset-0 m-auto h-[320px] w-[320px] lg:h-[370px] lg:w-[370px] rounded-full border border-amber-300/30 pointer-events-none" />

                {/* Rotating 12 Zodiac & Nakshatra Orbit Wheel */}
                <div
                  className="absolute inset-0 m-auto h-[345px] w-[345px] lg:h-[400px] lg:w-[400px] rounded-full animate-spin-slow pointer-events-none z-20"
                  style={{ animationDuration: '36s' }}
                >
                  {ZODIAC_ORBIT_SIGNS.map((sign, idx) => {
                    const angle = idx * 30; // 360 / 12 = 30 deg
                    return (
                      <div
                        key={sign.name}
                        className="absolute top-1/2 left-1/2 -mt-4 -ml-4 lg:-mt-4.5 lg:-ml-4.5 flex items-center justify-center [transform:rotate(var(--rot))_translateY(-172px)_rotate(var(--inv-rot))] lg:[transform:rotate(var(--rot))_translateY(-200px)_rotate(var(--inv-rot))]"
                        style={
                          {
                            '--rot': `${angle}deg`,
                            '--inv-rot': `-${angle}deg`,
                          } as React.CSSProperties
                        }
                      >
                        <div
                          className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-[#081728]/95 text-amber-300 flex items-center justify-center text-xs lg:text-sm font-bold shadow-[0_0_12px_rgba(245,158,11,0.45)] border border-amber-400/80 drop-shadow-sm transition-transform"
                          title={`${sign.name} (${sign.hi})`}
                        >
                          <span>{sign.symbol}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Center: Astrologer Atul Circular Portrait */}
                <div className="relative z-10 h-[240px] w-[240px] lg:h-[280px] lg:w-[280px] rounded-full border-[4px] border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.5)] overflow-hidden bg-[#071322] shrink-0">
                  <img
                    src="/images/hero-person-3d-nakshatra.webp"
                    alt="Astrologer Atul - Senior Vedic Astrologer"
                    className="h-full w-full object-cover object-top scale-105"
                  />
                  {/* Subtle golden ring edge highlight */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-inset ring-amber-300/60 pointer-events-none" />
                </div>

                {/* Instant Slot Booking badge */}
                <div className="absolute -bottom-2 right-0 lg:-bottom-3 lg:right-2 z-30 flex items-center gap-2.5 rounded-2xl border border-emerald-900/40 bg-[#14241a]/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl sm:px-4 sm:py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-amber-300 sm:h-9 sm:w-9">
                    <ClockCircleOutlined />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white sm:text-sm">
                      {t.hero.instant_slot}
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-amber-100/70 sm:text-[11px]">{t.hero.instant_slot_sub}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Feature Strip - Single Row Cards */}
        <div className="mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl border border-orange-100 bg-gradient-to-b from-orange-50/90 via-[#FFFDF9] to-amber-50/50 p-3.5 sm:p-6 shadow-xs">
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

