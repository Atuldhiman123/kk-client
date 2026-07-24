'use client';

import { CheckCircleFilled } from '@ant-design/icons';

export function WhyChooseUs({ items }: { items: string[] }) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900">Why Choose Us</h2>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-xl border border-neutral-200 p-4">
            <CheckCircleFilled style={{ color: '#B8860B' }} className="mt-0.5 text-lg" />
            <span className="text-sm font-medium text-neutral-800">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
