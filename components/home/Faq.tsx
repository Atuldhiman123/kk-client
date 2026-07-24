'use client';

import { Collapse } from 'antd';
import type { Faq as FaqType } from '@/lib/types';

export function Faq({ faqs }: { faqs: FaqType[] }) {
  return (
    <section id="faq" className="bg-amber-50/40">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-neutral-900">
          Frequently Asked Questions
        </h2>
        <Collapse
          className="mt-10 bg-white"
          items={faqs.map((faq, index) => ({
            key: index,
            label: <span className="font-medium">{faq.question}</span>,
            children: <p className="text-neutral-600">{faq.answer}</p>,
          }))}
        />
      </div>
    </section>
  );
}
