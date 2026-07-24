'use client';

import { StarFilled } from '@ant-design/icons';
import type { Testimonial } from '@/lib/types';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900">What Our Clients Say</h2>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial.name} className="rounded-2xl border border-neutral-200 p-6">
            <div className="flex gap-0.5" style={{ color: '#B8860B' }}>
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <StarFilled key={i} />
              ))}
            </div>
            <p className="mt-3 text-sm text-neutral-700">&ldquo;{testimonial.review}&rdquo;</p>
            <div className="mt-4 text-sm font-semibold text-neutral-900">{testimonial.name}</div>
            {testimonial.location && (
              <div className="text-xs text-neutral-500">{testimonial.location}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
