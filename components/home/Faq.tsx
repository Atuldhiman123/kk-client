'use client';

import { Collapse } from 'antd';
import type { Faq as FaqType } from '@/lib/types';
import { useLanguage, getLocalizedFaq } from '@/lib/i18n';

export function Faq({ faqs }: { faqs: FaqType[] }) {
  const { locale, t } = useLanguage();

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="bg-gradient-to-b from-orange-100/40 via-[#FFF8E1]/60 to-[#FFF3E0]/50 py-12 sm:py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            ❓ {t.faq.badge}
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
            {t.faq.title}
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-neutral-700 font-medium max-w-xl mx-auto">
            {t.faq.subtitle}
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <Collapse
            accordion
            className="overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-300 bg-white shadow-md text-left"
            items={faqs.map((faq, index) => {
              const locFaq = getLocalizedFaq(faq, locale);
              return {
                key: index,
                label: (
                  <span className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                    {locFaq.question}
                  </span>
                ),
                children: <p className="text-xs sm:text-sm leading-relaxed text-neutral-700">{locFaq.answer}</p>,
              };
            })}
          />
        </div>
      </div>
    </section>
  );
}
