'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { waLink } from '@/lib/contact';
import type { ContactInfo } from '@/lib/types';

interface GemstoneGuidanceHeroProps {
  contact?: ContactInfo;
}

export function GemstoneGuidanceHero({ contact }: GemstoneGuidanceHeroProps) {
  const { t, locale } = useLanguage();
  const router = useRouter();

  const gh = t.gemstones_page.guidance_hero;

  const defaultContact: ContactInfo = contact || {
    phone: '+91 93171 17001',
    whatsapp: '+91 93171 17001',
    email: 'kundlikendra1998@gmail.com',
    address: 'Office Address, City, State, India',
    mapsUrl: 'https://maps.google.com',
  };

  const whatsappConsultationUrl = waLink(
    defaultContact.whatsapp,
    locale === 'hi'
      ? 'नमस्ते, मुझे कुंडली अनुसार सही रत्न परामर्श चाहिए।'
      : 'Namaste, I would like to consult for my lucky gemstone.'
  );

  return (
    <section className="relative overflow-hidden bg-[#FFFDF8] pt-6 pb-12 sm:pt-10 sm:pb-16 border-b border-orange-200/50">
      {/* Mobile Background Watermark: Gemstone Kundli Mandala Image (Positioned behind Headline) */}
      <div className="lg:hidden absolute top-2 xs:top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[320px] xs:w-[360px] sm:w-[420px] aspect-square pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div className="relative w-full h-full opacity-[0.22] mix-blend-multiply [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_80%)]">
          <Image
            src="/images/gemstone-chart-mandala.jpg"
            alt=""
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-300/80 bg-orange-50/90 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-orange-900 shadow-2xs">
              <span className="text-orange-600">✨</span>
              <span>{gh.badge}</span>
            </div>

            <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 leading-[1.15]">
              {gh.title_start}{' '}
              <span className="font-serif italic font-bold text-amber-700">
                {gh.title_highlight}
              </span>{' '}
              {gh.title_end}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
              {gh.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => router.push('/ai-astrologer')}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 font-bold text-white px-7 py-3.5 text-sm shadow-md hover:scale-[1.02] transition cursor-pointer border-none"
              >
                {gh.check_gemstone}
              </button>
              <button
                type="button"
                onClick={() => router.push('/consultations')}
                className="w-full sm:w-auto rounded-full border-2 border-orange-300 bg-white font-bold text-neutral-800 px-6 py-3 text-sm hover:border-orange-500 transition cursor-pointer"
              >
                {gh.book_consultation}
              </button> 
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-200/80">
              <Image
                src="/images/gemstone-chart-mandala.jpg"
                alt="Vedic Kundli & Gemstones"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
