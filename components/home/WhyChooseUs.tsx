'use client';

import { CheckCircleFilled } from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';

export function WhyChooseUs({ items }: { items: string[] }) {
  const { t, locale } = useLanguage();

  const displayItems = locale === 'hi' ? t.why_choose_us.items : (items && items.length > 0 ? items : t.why_choose_us.items);

  return (
    <section id="why-choose-us" className="bg-gradient-to-b from-[#FFF8E1]/50 via-[#FFFDF9] to-orange-50/30 py-12 sm:py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            💎 {t.why_choose_us.badge}
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
            {t.why_choose_us.title}
          </h2>
          <p className="mt-2.5 sm:mt-3 max-w-xl mx-auto text-sm sm:text-base text-neutral-700 font-medium">
            {t.why_choose_us.subtitle}
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-3.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3.5 sm:gap-4 rounded-2xl border border-orange-200/85 bg-[#FFFDF9] p-4 sm:p-5 shadow-xs transition hover:border-orange-400 hover:bg-[#FFF8E1]/30 hover:shadow-md"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <CheckCircleFilled className="text-lg sm:text-xl text-orange-600" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
