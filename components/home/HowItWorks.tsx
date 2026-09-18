'use client';

import type { HowItWorksStep } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

export function HowItWorks({ steps }: { steps: HowItWorksStep[] }) {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-b from-[#FFF3E0] via-[#FFE0B2]/40 to-[#FFF8E1]/50 py-8 sm:py-16 md:py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            ⚡ {t.how_it_works.badge}
          </span>
          <h2 className="mt-2 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 font-serif">
            {t.how_it_works.title}
          </h2>
          <p className="mt-1.5 sm:mt-3 max-w-xl mx-auto text-xs sm:text-base text-neutral-700 font-medium">
            {t.how_it_works.subtitle}
          </p>
        </div>

        {/* 2x2 Grid on Mobile, 4 Columns on Desktop */}
        <div className="mt-5 sm:mt-12 grid grid-cols-2 gap-2.5 sm:gap-6 lg:grid-cols-4">
          {t.how_it_works.steps.map((step) => (
            <div
              key={step.step}
              className="relative flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-white/90 border border-orange-200/80 shadow-2xs hover:shadow-xs transition"
            >
              <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-sm sm:text-xl font-extrabold text-white shadow-xs">
                {step.step}
              </div>
              <h3 className="mt-2 sm:mt-3 text-xs sm:text-base font-bold text-neutral-900 font-serif leading-tight">
                {step.title}
              </h3>
              <p className="mt-1 text-[10.5px] sm:text-xs leading-snug text-neutral-600 font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
