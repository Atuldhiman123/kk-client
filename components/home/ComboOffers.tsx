'use client';

import type { ComboOffer } from '@/lib/types';
import { ComboCard } from './ComboCard';
import { useLanguage } from '@/lib/i18n';

export function ComboOffers({ combos }: { combos: ComboOffer[] }) {
  const { t } = useLanguage();

  if (!combos || combos.length === 0) return null;

  return (
    <section id="combos" className="bg-gradient-to-b from-orange-100/40 via-amber-50/70 to-[#FFF3E0] py-12 sm:py-20 border-t border-orange-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            🏷️ {t.combos.badge}
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
            {t.combos.title}
          </h2>
          <p className="mt-2.5 sm:mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-700 font-medium">
            {t.combos.subtitle}
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </section>
  );
}
