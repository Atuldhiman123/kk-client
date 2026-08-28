'use client';

import { Collapse } from 'antd';
import type { Faq as FaqType } from '@/lib/types';

export function Faq({ faqs }: { faqs: FaqType[] }) {
  return (
    <section id="faq" className="bg-gradient-to-b from-orange-100/40 via-[#FFF8E1]/60 to-[#FFF3E0]/50 py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-655/10 px-4 py-1.5 text-xs font-bold text-orange-955 uppercase tracking-wider border border-orange-300">
            ❓ Common Doubts
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl font-serif">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-neutral-700 font-medium">
            Everything you need to know about our astrological consultations, remedies, and online slot bookings.
          </p>
        </div>

        <div className="mt-10">
          <Collapse
            accordion
            className="overflow-hidden rounded-3xl border border-orange-300 bg-white shadow-md"
            items={faqs.map((faq, index) => ({
              key: index,
              label: (
                <span className="text-base font-bold text-neutral-900">
                  {faq.question}
                </span>
              ),
              children: <p className="text-sm leading-relaxed text-neutral-700">{faq.answer}</p>,
            }))}
          />
        </div>
      </div>
    </section>
  );
}
