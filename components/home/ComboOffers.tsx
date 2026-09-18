'use client';

import { useRef, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { ComboOffer } from '@/lib/types';
import { ComboCard } from './ComboCard';
import { useLanguage } from '@/lib/i18n';

export function ComboOffers({ combos }: { combos: ComboOffer[] }) {
  const { t } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!combos || combos.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320;
    const scrollAmount = direction === 'left' ? -cardWidth - 16 : cardWidth + 16;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320;
    const index = Math.round(scrollLeft / (cardWidth + 16));
    setActiveIndex(Math.min(Math.max(0, index), combos.length - 1));
  };

  const scrollToIndex = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320;
    sliderRef.current.scrollTo({ left: index * (cardWidth + 16), behavior: 'smooth' });
    setActiveIndex(index);
  };

  return (
    <section id="combos" className="bg-gradient-to-b from-orange-100/40 via-amber-50/70 to-[#FFF3E0] py-8 sm:py-16 md:py-20 border-t border-orange-200/50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="rounded-full bg-orange-600/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
              🏷️ {t.combos.badge}
            </span>
            <h2 className="mt-2 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
              {t.combos.title}
            </h2>
            <p className="mt-1.5 sm:mt-2 max-w-2xl text-xs sm:text-base text-neutral-700 font-medium">
              {t.combos.subtitle}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-300 bg-white text-orange-900 shadow-xs transition hover:bg-orange-50 hover:border-orange-500 cursor-pointer"
              aria-label="Previous Slide"
            >
              <LeftOutlined className="text-sm" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-300 bg-white text-orange-900 shadow-xs transition hover:bg-orange-50 hover:border-orange-500 cursor-pointer"
              aria-label="Next Slide"
            >
              <RightOutlined className="text-sm" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Track with Equal Height Cards */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="mt-6 sm:mt-10 flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0"
        >
          {combos.map((combo) => (
            <div
              key={combo.id}
              className="w-[85vw] max-w-[320px] sm:w-[360px] shrink-0 snap-center flex flex-col h-auto"
            >
              <ComboCard combo={combo} />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {combos.map((_, i) => (
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
