import Link from 'next/link';
import type { ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { categoryIcon } from '@/lib/category-icons';

export function CategoryCard({ category }: { category: ConsultationCategory }) {
  const currentPriceNum = Number(category.price);
  const origPriceNum = category.originalPrice;
  const savings = origPriceNum && origPriceNum > currentPriceNum ? origPriceNum - currentPriceNum : 0;
  const discountPercent = origPriceNum && origPriceNum > currentPriceNum ? Math.round((savings / origPriceNum) * 100) : 0;

  return (
    <div className="relative group flex flex-col rounded-3xl border border-amber-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl">
      {discountPercent > 0 && (
        <div className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-r from-red-600 to-amber-600 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-xs">
          🔥 {discountPercent}% OFF
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 text-3xl shadow-inner group-hover:scale-110 transition">
          {categoryIcon(category.slug)}
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
          ⏱️ {category.durationMinutes} min
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold tracking-tight text-neutral-900 group-hover:text-amber-700 transition">
        {category.name}
      </h3>

      {category.description && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{category.description}</p>
      )}

      <div className="mt-6 border-t border-neutral-100 pt-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Consultation Fee</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-neutral-900">{formatInr(category.price)}</span>
          {origPriceNum && origPriceNum > currentPriceNum && (
            <span className="text-sm font-medium text-neutral-400 line-through">
              {formatInr(origPriceNum)}
            </span>
          )}
        </div>
        {savings > 0 && (
          <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
            <span>🏷️</span> Offer Applied — Save {formatInr(savings)}
          </div>
        )}
      </div>

      <Link
        href={`/?category=${category.slug}#booking`}
        className="mt-5 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-center text-sm font-bold text-white shadow-xs transition hover:from-amber-600 hover:to-amber-700"
      >
        Book Consultation &rarr;
      </Link>
    </div>
  );
}
