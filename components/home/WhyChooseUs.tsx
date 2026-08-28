'use client';

import { CheckCircleFilled } from '@ant-design/icons';

export function WhyChooseUs({ items }: { items: string[] }) {
  return (
    <section id="why-choose-us" className="bg-gradient-to-b from-[#FFF8E1]/50 via-[#FFFDF9] to-orange-50/30 py-20 border-t border-orange-200/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-655/10 px-4 py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            💎 Our Commitment
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl font-serif">
            Why Choose Kundli Kendra
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-base text-neutral-700 font-medium">
            Trusted by thousands of clients across India and globally for reliable Vedic guidance.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl border border-orange-200/85 bg-[#FFFDF9] p-5 shadow-xs transition hover:border-orange-400 hover:bg-[#FFF8E1]/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <CheckCircleFilled className="text-xl text-orange-600" />
              </div>
              <span className="text-sm font-bold text-neutral-900 leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
