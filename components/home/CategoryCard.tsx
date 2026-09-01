'use client';

import Link from 'next/link';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { categoryIcon } from '@/lib/category-icons';

function categoryImage(slug: string): string {
  const clean = slug.toLowerCase();

  if (clean.includes('career') && clean.includes('business')) {
    return '/images/categories/career.jpg';
  }
  if (clean.includes('career')) {
    return '/images/categories/career.jpg';
  }
  if (clean.includes('business')) {
    return '/images/categories/business.jpg';
  }
  if (clean.includes('marriage') || clean.includes('compatibility')) {
    return '/images/categories/marriage.jpg';
  }
  if (clean.includes('love') || clean.includes('relationship')) {
    return '/images/categories/love.jpg';
  }
  if (clean.includes('health') || clean.includes('wellbeing')) {
    return '/images/categories/health.jpg';
  }
  if (clean.includes('education') || clean.includes('study')) {
    return '/images/categories/education.jpg';
  }
  if (clean.includes('property') || clean.includes('land')) {
    return '/images/categories/property.jpg';
  }
  if (clean.includes('settlement') || clean.includes('foreign') || clean.includes('travel')) {
    return '/images/categories/travel.jpg';
  }
  if (clean.includes('matching') || clean.includes('kundli-matching')) {
    return '/images/categories/matching.jpg';
  }
  if (clean.includes('child') || clean.includes('birth')) {
    return '/images/categories/child.jpg';
  }
  if (clean.includes('finance') || clean.includes('wealth') || clean.includes('money')) {
    return '/images/categories/wealth.jpg';
  }
  if (clean.includes('family') || clean.includes('problems') || clean.includes('home')) {
    return '/images/categories/family.jpg';
  }
  if (clean.includes('full-life') || clean.includes('reading') || clean.includes('life')) {
    return '/images/kundli-scroll.jpg';
  }
  return '/images/categories/default.jpg';
}

export function CategoryCard({ category }: { category: ConsultationCategory }) {
  const currentPriceNum = Number(category.price);
  const origPriceNum = category.originalPrice;
  const savings = origPriceNum && origPriceNum > currentPriceNum ? origPriceNum - currentPriceNum : 0;
  const discountPercent = origPriceNum && origPriceNum > currentPriceNum ? Math.round((savings / origPriceNum) * 100) : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-100/90 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg">
      {/* Top Image Banner */}
      <div className="relative h-28 sm:h-44 w-full overflow-hidden bg-orange-50 shrink-0">
        <img
          src={categoryImage(category.slug)}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 rounded-full bg-red-600 px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
            {discountPercent}% Off
          </div>
        )}
      </div>

      {/* Floating Category Icon (overlapping image/content boundary) */}
      <div className="relative flex justify-center">
        <div className="absolute -top-6 sm:-top-8 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-xl sm:text-2xl text-orange-600 shadow-md">
          {categoryIcon(category.slug)}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-3.5 pb-3 pt-6 sm:px-5 sm:pb-4 sm:pt-9 text-center">
        <h3 className="font-serif text-base sm:text-xl font-bold text-neutral-900 transition group-hover:text-orange-700 m-0 leading-tight">
          {category.name}
        </h3>
        <div className="mx-auto mt-1 sm:mt-1.5 h-0.5 w-5 sm:w-6 rounded-full bg-orange-400" />

        {category.description && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-snug sm:leading-relaxed text-neutral-500 line-clamp-2">
            {category.description}
          </p>
        )}

        <div className="mt-2.5 sm:mt-3.5 flex items-center justify-between gap-1.5 sm:gap-2 border-t border-orange-100/80 pt-2.5 sm:pt-3">
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-neutral-500 shrink-0">
            <ClockCircleOutlined className="text-orange-500 text-[10px] sm:text-xs" />
            <span>{category.durationMinutes} min</span>
          </span>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-base sm:text-lg font-black text-neutral-900">{formatInr(category.price)}</span>
              {origPriceNum && origPriceNum > currentPriceNum && (
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-400 line-through">
                  {formatInr(origPriceNum)}
                </span>
              )}
            </div>

            <Link
              href={`/?category=${category.slug}#booking`}
              className="inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-bold text-white shadow-xs transition duration-150 hover:from-orange-600 hover:to-orange-700 shrink-0 whitespace-nowrap"
              style={{ color: '#ffffff' }}
            >
              <span className="text-white" style={{ color: '#ffffff' }}>Book Now &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
