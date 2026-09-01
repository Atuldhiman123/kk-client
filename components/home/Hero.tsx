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

export function Hero({ contact }: { contact: ContactInfo }) {
  const StatColumn = ({ mobile }: { mobile?: boolean }) => (
    <div
      className={
        mobile
          ? 'grid grid-cols-3 divide-x divide-orange-100 rounded-2xl border border-orange-100 bg-orange-50/70 shadow-md md:hidden'
          : 'relative z-20 -mr-14 hidden w-28 shrink-0 flex-col divide-y divide-orange-100 overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/80 shadow-xl md:flex'
      }
    >
      {statCards.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center gap-1 px-2 py-2.5 text-center">
          <span className="text-orange-500">{stat.icon}</span>
          <span className="text-sm font-extrabold text-neutral-900">{stat.value}</span>
          <span className="w-full min-w-0 text-[9px] font-semibold uppercase tracking-wide text-neutral-500">{stat.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden border-b border-orange-100 py-10 sm:py-16 md:py-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-section-bg.png"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-900 sm:text-xs">
              <span className="text-orange-500">✨</span>
              <span>100% Authentic Vedic Guidance</span>
            </div>

            <h1 className="mt-3 sm:mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.85] tracking-tight text-neutral-900">
              Astrologer
              <br />
              <span className="text-orange-500">Atul</span>
            </h1>

            <p className="mt-0 flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-neutral-800">
              <span>Master Vedic Astrologer</span>
              <span className="text-orange-400">&bull;</span>
              <span className="text-orange-600">10+ Years Experience</span>
            </p>

            <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-neutral-600">
              Get personalized, highly accurate Kundli analysis and practical planetary remedies for career, marriage, love, wealth, and health.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="#booking"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/25 transition hover:from-orange-600 hover:to-red-700"
                style={{ color: '#ffffff' }}
              >
                <CalendarOutlined />
                <span style={{ color: '#ffffff' }}>Book Consultation</span>
              </Link>

              <Link
                href="#consultations"
                className="inline-flex items-center gap-1.5 rounded-full border border-orange-300 bg-gradient-to-b from-white to-white px-5 py-3 text-sm font-bold text-orange-700 transition hover:from-orange-50 hover:to-orange-50"
              >
                Explore Services <span>&rarr;</span>
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 text-sm">
              <span className="font-semibold text-neutral-500">Connect Directly:</span>
              {contact.phone && (
                <a
                  href={telLink(contact.phone)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-gradient-to-b from-white to-white px-3.5 py-1.5 font-semibold text-neutral-800 transition hover:border-orange-300 hover:text-orange-700"
                >
                  <PhoneOutlined /> Call
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={waLink(contact.whatsapp, 'Hi, I would like to book a Kundli consultation.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-gradient-to-b from-white to-white px-3.5 py-1.5 font-semibold text-neutral-800 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <WhatsAppOutlined /> WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="flex flex-col items-center gap-6 md:items-end">
            <div className="flex items-center mt-6 md:mt-0 md:mr-6 lg:mr-10">
              <StatColumn />

              {/* Image + badges */}
              <div className="relative z-10">
                {/* Portrait */}
                <div className="h-80 w-80 overflow-hidden rounded-[28px] border-2 border-amber-300 shadow-2xl sm:h-96 sm:w-96 sm:rounded-[32px] md:h-[26rem] md:w-[26rem] lg:h-[28rem] lg:w-[28rem]">
                  <img
                    src="/images/hero-person.png"
                    alt="Astrologer Atul"
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

            <StatColumn mobile />
          </div>
        </div>

        {/* Trust Feature Strip */}
        <div className="mt-14 rounded-2xl border border-orange-100 bg-orange-50/70 p-5 shadow-sm sm:mt-16 sm:p-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {trustFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-200 text-lg text-orange-600">
                  {feature.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">{feature.title}</div>
                  <div className="mt-0.5 text-xs leading-snug text-neutral-500">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
