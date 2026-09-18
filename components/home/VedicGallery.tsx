'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';

export function VedicGallery() {
  const { t } = useLanguage();

  const practiceConfig = [
    {
      image: '/images/kundli-scroll.webp',
      position: 'object-center',
    },
    {
      image: '/images/puja.webp',
      position: 'object-[center_12%]',
    },
    {
      image: '/images/yellow-sapphire.webp',
      position: 'object-center',
    },
    {
      image: '/images/globe.webp',
      position: 'object-[center_20%]',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#FFF8E1]/40 via-[#FFFDF9] to-orange-50/20 py-8 sm:py-16 md:py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center mb-5 sm:mb-12">
          <span className="rounded-full bg-orange-600/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            ✨ {t.gallery.badge}
          </span>
          <h2 className="mt-2 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
            {t.gallery.title}
          </h2>
          <p className="mt-1.5 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-base text-neutral-700 font-medium">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* 2-Column Grid on Mobile, 4-Column on Desktop */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-4">
          {t.gallery.practices.map((practice, index) => {
            const config = practiceConfig[index] || { image: '/images/kundli-scroll.webp', position: 'object-center' };
            return (
              <div
                key={practice.title}
                className="group flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-orange-200/80 bg-[#FFFDF9] overflow-hidden shadow-2xs transition duration-200 hover:-translate-y-1 hover:border-orange-400 hover:shadow-xs"
              >
                <div className="relative h-28 xs:h-32 sm:h-52 w-full overflow-hidden bg-orange-50">
                  <img
                    src={config.image}
                    alt={practice.title}
                    className={`h-full w-full object-cover ${config.position} transition-transform duration-500 group-hover:scale-105`}
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20 pointer-events-none" />
                  <span className="absolute top-2 left-2 rounded-full bg-orange-600/95 backdrop-blur-xs px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs border border-white/20">
                    {practice.badge}
                  </span>
                </div>
                <div className="flex-1 p-2.5 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-orange-700 truncate">
                      {practice.subtitle}
                    </div>
                    <h3 className="mt-0.5 sm:mt-1 text-xs sm:text-base font-bold text-neutral-900 group-hover:text-orange-700 transition font-serif leading-tight">
                      {practice.title}
                    </h3>
                    <p className="mt-1 text-[10.5px] sm:text-xs leading-snug text-neutral-600 font-medium line-clamp-3">
                      {practice.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
