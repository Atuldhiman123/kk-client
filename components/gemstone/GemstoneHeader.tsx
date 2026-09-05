'use client';

import { useLanguage } from '@/lib/i18n';

export function GemstoneHeader() {
  const { t } = useLanguage();

  return (
    <div className="text-center">
      <span className="rounded-full bg-orange-600/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
        {t.gemstones_page.badge}
      </span>
      <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 font-serif">
        {t.gemstones_page.title}
      </h1>
      <p className="mt-2.5 sm:mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 font-medium">
        {t.gemstones_page.subtitle}
      </p>
    </div>
  );
}

export function GemstoneEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="mt-12 text-center py-10 sm:py-12 rounded-3xl border border-dashed border-orange-300 bg-white p-4">
      <p className="text-base sm:text-lg font-bold text-neutral-800">{t.gemstones_page.not_found_title}</p>
      <p className="text-xs sm:text-sm text-neutral-500 mt-1">{t.gemstones_page.not_found_hint}</p>
    </div>
  );
}
