'use client';

import { StarFilled } from '@ant-design/icons';
import type { Testimonial } from '@/lib/types';
import { useLanguage, getLocalizedTestimonial } from '@/lib/i18n';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { locale, t } = useLanguage();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="bg-gradient-to-b from-orange-50/30 via-amber-50/60 to-orange-100/40 py-12 sm:py-20 border-t border-orange-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            💬 {t.testimonials.badge}
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
            {t.testimonials.title}
          </h2>
          <p className="mt-2.5 sm:mt-3 max-w-xl mx-auto text-sm sm:text-base text-neutral-700 font-medium">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-5 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => {
            const locTestimonial = getLocalizedTestimonial(testimonial, locale);

            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl border border-orange-200/80 bg-[#FFFDF9] p-5 sm:p-7 shadow-xs transition hover:border-orange-400 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: locTestimonial.rating || 5 }).map((_, i) => (
                        <StarFilled key={i} className="text-sm sm:text-base" />
                      ))}
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-emerald-700 border border-emerald-200">
                      {t.testimonials.verified_booking}
                    </span>
                  </div>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-neutral-700 italic">
                    &ldquo;{locTestimonial.review}&rdquo;
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 flex items-center gap-3 border-t border-orange-100 pt-4">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-50 text-orange-700 font-bold text-xs sm:text-sm border border-orange-200 shrink-0">
                    {locTestimonial.name[0]}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900">{locTestimonial.name}</div>
                    {locTestimonial.location && (
                      <div className="text-[11px] sm:text-xs text-neutral-500 font-medium">{locTestimonial.location}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
