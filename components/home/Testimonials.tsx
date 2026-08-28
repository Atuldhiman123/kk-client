'use client';

import { StarFilled } from '@ant-design/icons';
import type { Testimonial } from '@/lib/types';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="bg-gradient-to-b from-orange-50/30 via-amber-50/60 to-orange-100/40 py-20 border-t border-orange-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-655/10 px-4 py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            💬 Verified Feedback
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl font-serif">
            What Our Clients Say
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-base text-neutral-700 font-medium">
            Read genuine reviews from people who found direction and clarity through our astrological consultations.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col justify-between rounded-3xl border border-orange-200/80 bg-[#FFFDF9] p-7 shadow-xs transition hover:border-orange-400 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <StarFilled key={i} className="text-base" />
                    ))}
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    Verified Booking
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600 italic">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-orange-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-700 font-bold text-sm border border-orange-200">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">{testimonial.name}</div>
                  {testimonial.location && (
                    <div className="text-xs text-neutral-500 font-medium">{testimonial.location}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
