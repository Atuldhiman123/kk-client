'use client';

import { CheckCircleFilled } from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';

export function WhyChooseUs({ items }: { items: string[] }) {
  const { t, locale } = useLanguage();

  const displayItems = locale === 'hi' ? t.why_choose_us.items : (items && items.length > 0 ? items : t.why_choose_us.items);

  return (
    <section id="why-choose-us" className="bg-gradient-to-b from-[#FFF8E1]/50 via-[#FFFDF9] to-orange-50/30 py-8 sm:py-16 md:py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            💎 {t.why_choose_us.badge}
          </span>
          <h2 className="mt-2 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
            {t.why_choose_us.title}
          </h2>
          <p className="mt-1.5 sm:mt-3 max-w-xl mx-auto text-xs sm:text-base text-neutral-700 font-medium">
            {t.why_choose_us.subtitle}
          </p>
        </div>

        {/* 2-column grid on mobile, 3-column on desktop */}
        <div className="mt-5 sm:mt-10 grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 sm:gap-3.5 rounded-xl sm:rounded-2xl border border-orange-200/85 bg-[#FFFDF9] p-2.5 sm:p-4 shadow-2xs transition hover:border-orange-400 hover:bg-[#FFF8E1]/30 hover:shadow-xs"
            >
              <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-orange-100 text-orange-700">
                <CheckCircleFilled className="text-sm sm:text-base text-orange-600" />
              </div>
              <span className="text-[11px] sm:text-xs md:text-sm font-bold text-neutral-900 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
