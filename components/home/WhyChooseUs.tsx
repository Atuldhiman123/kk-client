'use client';

import { CheckCircleFilled } from '@ant-design/icons';

export function WhyChooseUs({ items }: { items: string[] }) {
  return (
    <section id="why-choose-us" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
          💎 Our Commitment
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Why Choose Kundli Kendra
        </h2>
        <p className="mt-3 max-w-xl mx-auto text-base text-neutral-600">
          Trusted by thousands of clients across India and globally for reliable Vedic guidance.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs transition hover:border-amber-400 hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <CheckCircleFilled className="text-xl text-amber-600" />
            </div>
            <span className="text-sm font-bold text-neutral-900 leading-snug">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
