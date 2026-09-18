'use client';

import { useRef, useState } from 'react';
import { StarFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Testimonial } from '@/lib/types';
import { useLanguage, getLocalizedTestimonial } from '@/lib/i18n';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { locale, t } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 300;
    const scrollAmount = direction === 'left' ? -cardWidth - 16 : cardWidth + 16;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 300;
    const index = Math.round(scrollLeft / (cardWidth + 16));
    setActiveIndex(Math.min(Math.max(0, index), testimonials.length - 1));
  };

  const scrollToIndex = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 300;
    sliderRef.current.scrollTo({ left: index * (cardWidth + 16), behavior: 'smooth' });
    setActiveIndex(index);
  };

  return (
    <section id="testimonials" className="bg-gradient-to-b from-orange-50/30 via-amber-50/60 to-orange-100/40 py-8 sm:py-16 md:py-20 border-t border-orange-200/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="rounded-full bg-orange-600/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
              💬 {t.testimonials.badge}
            </span>
            <h2 className="mt-2 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
              {t.testimonials.title}
            </h2>
            <p className="mt-1.5 sm:mt-2 max-w-xl text-xs sm:text-base text-neutral-700 font-medium">
              {t.testimonials.subtitle}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-300 bg-white text-orange-900 shadow-xs transition hover:bg-orange-50 hover:border-orange-500 cursor-pointer"
              aria-label="Previous Review"
            >
              <LeftOutlined className="text-sm" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-300 bg-white text-orange-900 shadow-xs transition hover:bg-orange-50 hover:border-orange-500 cursor-pointer"
              aria-label="Next Review"
            >
              <RightOutlined className="text-sm" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Track */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="mt-6 sm:mt-10 flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0"
        >
          {testimonials.map((testimonial, idx) => {
            const locTestimonial = getLocalizedTestimonial(testimonial, locale);

            return (
              <div
                key={idx}
                className="w-[85vw] max-w-[330px] sm:w-[360px] shrink-0 snap-center flex flex-col justify-between rounded-3xl border border-orange-200/80 bg-[#FFFDF9] p-4.5 sm:p-7 shadow-xs transition hover:border-orange-400 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: locTestimonial.rating || 5 }).map((_, i) => (
                        <StarFilled key={i} className="text-xs sm:text-sm" />
                      ))}
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 border border-emerald-200">
                      {t.testimonials.verified_booking}
                    </span>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-700 italic">
                    &ldquo;{locTestimonial.review}&rdquo;
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 flex items-center gap-3 border-t border-orange-100 pt-3.5">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-50 text-orange-700 font-bold text-xs sm:text-sm border border-orange-200 shrink-0">
                    {locTestimonial.name[0]}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-neutral-900">{locTestimonial.name}</div>
                    {locTestimonial.location && (
                      <div className="text-[10px] sm:text-xs text-neutral-500 font-medium">{locTestimonial.location}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? 'w-6 bg-orange-600' : 'w-2 bg-orange-200 hover:bg-orange-300'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
