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
    <div className="relative h-full w-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border-2 border-orange-300 bg-gradient-to-b from-amber-50/60 to-[#FFFDF9] p-4 sm:p-5 shadow-md transition-all hover:scale-101 hover:shadow-xl">
      <div className="absolute -top-2.5 right-3 sm:right-5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-2.5 sm:px-3 py-0.5 text-[9.5px] sm:text-xs font-extrabold uppercase tracking-wider text-white shadow-xs">
        🔥 {t.combos.special_savings}
      </div>

      <div>
        <h3 className="font-serif text-lg sm:text-xl font-black text-neutral-950 leading-tight pr-14 tracking-tight">{localizedTitle}</h3>
        {localizedDesc && (
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-600 line-clamp-2">
            {localizedDesc}
          </p>
        )}

        <div className="mt-2.5">
          <div className="text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider text-orange-950/70 mb-1">
            {t.combos.includes_sessions}
          </div>
          <ul className="flex flex-wrap gap-1 sm:gap-1.5">
            {combo.categories.map(({ category }) => (
              <li
                key={category.id}
                className="inline-flex items-center gap-1 rounded-full border border-orange-200/80 bg-white/95 px-2.5 py-0.5 text-[10.5px] sm:text-xs font-bold text-neutral-800 shadow-2xs"
              >
                <span className="text-orange-500">✨</span> {getLocalizedCategoryName(category, locale)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3.5 sm:mt-4 border-t border-orange-200/60 pt-2.5 sm:pt-3">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-neutral-900">
                {formatInr(combo.discountedPrice)}
              </span>
              <span className="text-xs sm:text-sm font-medium text-neutral-400 line-through">
                {formatInr(combo.originalPrice)}
              </span>
            </div>
            {savings > 0 && (
              <div className="mt-0.5 text-[11px] sm:text-xs font-bold text-emerald-700">
                {t.combos.you_save} {formatInr(savings)}!
              </div>
            )}
          </div>
        </div>

        <Link
          href={`/?combo=${combo.slug}#booking`}
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('select-booking-combo', { detail: { comboSlug: combo.slug } }));
              const el = document.getElementById('booking');
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 20;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }
          }}
          className="mt-2.5 sm:mt-3 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 py-2 sm:py-2.5 text-center text-xs sm:text-sm font-bold text-white shadow-xs transition hover:from-orange-600 hover:to-red-700 cursor-pointer"
          style={{ color: '#ffffff' }}
        >
          <span className="text-white font-bold" style={{ color: '#ffffff' }}>{t.combos.claim_combo}</span>
        </Link>
      </div>
    </div>
  );
}
