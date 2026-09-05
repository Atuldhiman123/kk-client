'use client';

import Link from 'next/link';
import type { ComboOffer } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { useLanguage, getLocalizedComboTitle, getLocalizedComboDesc, getLocalizedCategoryName } from '@/lib/i18n';

export function ComboCard({ combo }: { combo: ComboOffer }) {
  const { locale, t } = useLanguage();
  const savings = combo.originalPrice - Number(combo.discountedPrice);
  const localizedTitle = getLocalizedComboTitle(combo, locale);
  const localizedDesc = getLocalizedComboDesc(combo, locale);

  return (
    <div className="relative flex flex-col justify-between rounded-3xl border-2 border-orange-300 bg-gradient-to-b from-amber-50/60 to-[#FFFDF9] p-5 sm:p-7 shadow-md transition-all hover:scale-101 hover:shadow-xl">
      <div className="absolute -top-3 right-4 sm:right-6 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3 sm:px-3.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-white shadow-xs">
        🔥 {t.combos.special_savings}
      </div>

      <div>
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-serif">{localizedTitle}</h3>
        {localizedDesc && (
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-700 font-medium">
            {localizedDesc}
          </p>
        )}

        <div className="mt-4 flex-1">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
            {t.combos.includes_sessions}
          </div>
          <ul className="flex flex-wrap gap-1.5 sm:gap-2">
            {combo.categories.map(({ category }) => (
              <li
                key={category.id}
                className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-white px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-neutral-800 shadow-2xs"
              >
                <span>✨</span> {getLocalizedCategoryName(category, locale)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 border-t border-orange-200/60 pt-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                {formatInr(combo.discountedPrice)}
              </span>
              <span className="text-xs sm:text-sm font-medium text-neutral-400 line-through">
                {formatInr(combo.originalPrice)}
              </span>
            </div>
            {savings > 0 && (
              <div className="mt-0.5 text-xs font-bold text-emerald-700">
                {t.combos.you_save} {formatInr(savings)}!
              </div>
            )}
          </div>
        </div>

        <Link
          href={`/?combo=${combo.slug}#booking`}
          className="mt-4 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-white shadow-xs transition hover:from-orange-600 hover:to-red-700"
          style={{ color: '#ffffff' }}
        >
          <span className="text-white font-bold" style={{ color: '#ffffff' }}>{t.combos.claim_combo}</span>
        </Link>
      </div>
    </div>
  );
}
