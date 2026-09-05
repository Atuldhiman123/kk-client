'use client';

import Link from 'next/link';
import { ClockCircleOutlined, StarFilled, CheckCircleFilled, ThunderboltFilled } from '@ant-design/icons';
import type { ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { categoryIcon } from '@/lib/category-icons';
import { useLanguage, getLocalizedCategoryName, getLocalizedCategoryDesc, getLocalizedCategoryTags } from '@/lib/i18n';

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
  if (clean.includes('property') || clean.includes('land') || clean.includes('vastu')) {
    return '/images/categories/property.jpg';
  }
  if (clean.includes('settlement') || clean.includes('foreign') || clean.includes('travel')) {
    return '/images/categories/travel.jpg';
  }
  if (clean.includes('matching') || clean.includes('kundli-matching')) {
    return '/images/categories/matching.jpg';
  }
  if (clean.includes('child') || clean.includes('birth') || clean.includes('santan')) {
    return '/images/categories/child.jpg';
  }
  if (clean.includes('finance') || clean.includes('wealth') || clean.includes('money')) {
    return '/images/categories/wealth.jpg';
  }
  if (clean.includes('family') || clean.includes('problems') || clean.includes('home')) {
    return '/images/categories/family.jpg';
  }
  if (clean.includes('gemstone') || clean.includes('ratna')) {
    return '/images/vedic-3d-sphere.jpg';
  }
  if (clean.includes('muhurat') || clean.includes('timing')) {
    return '/images/aarti.jpg';
  }
  if (clean.includes('full') || clean.includes('analysis') || clean.includes('reading') || clean.includes('life')) {
    return '/images/kundli-scroll.jpg';
  }
  return '/images/vedic-3d-nakshatra-bg.jpg';
}

export function CategoryCard({ category }: { category: ConsultationCategory }) {
  const { locale, t } = useLanguage();
  const currentPriceNum = Number(category.price);
  const origPriceNum = category.originalPrice;
  const savings = origPriceNum && origPriceNum > currentPriceNum ? origPriceNum - currentPriceNum : 0;
  const discountPercent = origPriceNum && origPriceNum > currentPriceNum ? Math.round((savings / origPriceNum) * 100) : 0;
  
  const localizedName = getLocalizedCategoryName(category, locale);
  const localizedDesc = getLocalizedCategoryDesc(category, locale);
  const tags = getLocalizedCategoryTags(category.slug, locale);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-orange-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-400 hover:shadow-xl relative">
      {/* Top Banner with Image & Astrotalk-style Badge Overlays */}
      <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-orange-100 shrink-0">
        <img
          src={categoryImage(category.slug)}
          alt={localizedName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Soft dark-gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10.5px] font-black text-amber-300 border border-amber-400/40 shadow-xs">
            <StarFilled className="text-amber-400 text-xs" />
            <span>4.9 (1.5k+)</span>
          </div>

          {discountPercent > 0 ? (
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-orange-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
              <ThunderboltFilled className="text-[10px]" />
              <span>{discountPercent}% {t.consultations.card.off}</span>
            </div>
          ) : (
            <div className="rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
              {t.consultations.card.verified}
            </div>
          )}
        </div>

        {/* Category Icon Emblem Badge (Bottom Corner of Image) */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2 z-10">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md text-xl text-orange-600 shadow-md border-2 border-orange-200">
            {categoryIcon(category.slug)}
          </div>
          <div className="text-white">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 block leading-none">
              {t.consultations.card.vedic_guidance}
            </span>
            <span className="text-xs font-bold text-white drop-shadow-xs truncate block max-w-[170px]">
              {t.consultations.card.live_session}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 transition group-hover:text-orange-600 m-0 leading-tight">
              {localizedName}
            </h3>
          </div>

          {localizedDesc && (
            <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-neutral-600 line-clamp-2">
              {localizedDesc}
            </p>
          )}

          {/* Astrotalk-style Feature Highlights / Topic Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-0.5 text-[10.5px] font-semibold text-orange-900 border border-orange-200/70"
              >
                <CheckCircleFilled className="text-emerald-600 text-[9px]" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Booking Action Row */}
        <div className="mt-4 pt-3.5 border-t border-orange-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 mb-0.5">
              <ClockCircleOutlined className="text-orange-500" />
              <span>{category.durationMinutes} {t.consultations.card.duration_suffix}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-neutral-950">
                {formatInr(category.price)}
              </span>
              {origPriceNum && origPriceNum > currentPriceNum && (
                <span className="text-xs font-semibold text-neutral-400 line-through">
                  {formatInr(origPriceNum)}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/?category=${category.slug}#booking`}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-md transition-all duration-200 hover:from-orange-600 hover:to-red-700 hover:shadow-lg hover:scale-[1.03] active:scale-95 shrink-0"
            style={{ color: '#ffffff' }}
          >
            <span className="text-white font-bold" style={{ color: '#ffffff' }}>{t.consultations.card.book_now} &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

