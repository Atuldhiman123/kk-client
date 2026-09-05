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
import { waLink, telLink } from '@/lib/contact';
import { useLanguage } from '@/lib/i18n';

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
    <section className="relative overflow-hidden border-b border-orange-100 pt-4 pb-10 sm:py-14 md:py-16">
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
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="mt-3 sm:mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.05] tracking-tight text-neutral-900">
                {t.hero.title_prefix}{' '}
                <span className="text-orange-600 underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-4">{t.hero.title_name}</span>
              </h1>

              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-neutral-800">
                <span>{t.hero.astrologer_role}</span>
                <span className="text-orange-400">&bull;</span>
                <span className="text-orange-600">{t.hero.experience}</span>
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
                      {t.hero.live_booking}
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-semibold text-amber-200 drop-shadow-sm leading-tight">{t.hero.astrologer_role}</div>
                      <h1 className="font-serif text-2xl xs:text-3xl font-extrabold leading-none drop-shadow-md m-0">
                        <span style={{ color: '#ffffff' }}>{t.hero.title_prefix} </span>
                        <span style={{ color: '#FACC15' }} className="text-yellow-400 font-extrabold">{t.hero.title_name}</span>
                      </h1>
                    </div>

                    <div className="rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 px-3 py-1 text-[10px] font-extrabold text-white shadow-xs shrink-0 drop-shadow-xs">
                      {t.hero.experience}
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

            {/* Main Headline & Subtitle */}
            <div className="mt-2 sm:mt-3">
              <h3 className="text-sm sm:text-base md:text-lg font-black text-orange-950/90 leading-snug">
                {t.hero.headline}
              </h3>
              <p className="mt-1 sm:mt-2 max-w-lg text-xs xs:text-sm sm:text-base leading-relaxed text-neutral-700">
                {t.hero.subtitle}
              </p>
            </div>

            {/* Trust Bullet Tags */}
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
              {trustBadgesList.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-50/90 border border-amber-200 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-900 shadow-2xs"
                >
                  <CheckCircleFilled className="text-emerald-600 text-[10px] sm:text-xs" />
                  {badge}
                </span>
              ))}
            </div>

            {/* Dual CTA Buttons */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/ai-astrologer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:from-amber-600 hover:to-red-600 whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                <span>💎</span>
                <span style={{ color: '#ffffff' }}>{t.hero.gemstone_hook.cta}</span>
              </Link>

              <Link
                href="#booking"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-orange-400 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-orange-800 shadow-sm transition hover:bg-orange-50 hover:border-orange-500 whitespace-nowrap"
              >
                <CalendarOutlined />
                <span>{t.hero.book_btn}</span>
              </Link>
            </div>

            {/* Quick Direct Connect */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-neutral-500">{t.hero.connect}</span>
              {contact.phone && (
                <a
                  href={telLink(contact.phone)}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 font-semibold text-neutral-800 transition hover:border-orange-300 hover:text-orange-700 text-xs shadow-2xs"
                >
                  <PhoneOutlined /> {t.nav.call}
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

