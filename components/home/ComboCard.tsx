import Link from 'next/link';
import type { ComboOffer } from '@/lib/types';
import { formatInr } from '@/lib/format';

export function ComboCard({ combo }: { combo: ComboOffer }) {
  const savings = combo.originalPrice - Number(combo.discountedPrice);

  return (
    <div className="flex flex-col rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: '#F3D98B' }}>
      <h3 className="text-lg font-semibold text-neutral-900">{combo.name}</h3>
      {combo.description && <p className="mt-1 text-sm text-neutral-600">{combo.description}</p>}

      <ul className="mt-3 flex flex-wrap gap-2">
        {combo.categories.map(({ category }) => (
          <li
            key={category.id}
            className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-neutral-700"
          >
            {category.name}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-xl font-bold text-neutral-900">{formatInr(combo.discountedPrice)}</span>
        <span className="text-sm text-neutral-400 line-through">{formatInr(combo.originalPrice)}</span>
      </div>
      {savings > 0 && (
        <span className="mt-1 text-sm font-medium text-green-700">Save {formatInr(savings)}</span>
      )}

      <Link
        href={`/?combo=${combo.slug}#booking`}
        className="mt-4 rounded-full py-2 text-center text-sm font-semibold text-white"
        style={{ backgroundColor: '#B8860B' }}
      >
        Book Now
      </Link>
    </div>
  );
}
