import Link from 'next/link';
import type { ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { categoryIcon } from '@/lib/category-icons';

export function CategoryCard({ category }: { category: ConsultationCategory }) {
  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="text-3xl">{categoryIcon(category.slug)}</div>
      <h3 className="mt-3 text-lg font-semibold text-neutral-900">{category.name}</h3>
      {category.description && (
        <p className="mt-1 flex-1 text-sm text-neutral-600">{category.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
        <span>{category.durationMinutes} min</span>
        <span className="font-semibold text-neutral-900">{formatInr(category.price)}</span>
      </div>
      <Link
        href={`/?category=${category.slug}#booking`}
        className="mt-4 rounded-full py-2 text-center text-sm font-semibold text-white"
        style={{ backgroundColor: '#B8860B' }}
      >
        Book Now
      </Link>
    </div>
  );
}
