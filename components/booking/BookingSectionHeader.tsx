'use client';

import { useLanguage } from '@/lib/i18n';

export function BookingSectionHeader() {
  const { t } = useLanguage();

  return (
    <div className="text-center">
      <span className="rounded-full bg-orange-600/10 px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
        {t.booking_section.badge}
      </span>
      <h2 className="mt-1.5 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 font-serif">
        {t.booking_section.title}
      </h2>
      <p className="mt-1 sm:mt-2 text-xs sm:text-base text-neutral-700 font-medium max-w-lg mx-auto">
        {t.booking_section.subtitle}
      </p>
    </div>
  );
}
