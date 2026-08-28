import Link from 'next/link';
import type { ComboOffer } from '@/lib/types';
import { formatInr } from '@/lib/format';

export function ComboCard({ combo }: { combo: ComboOffer }) {
  const savings = combo.originalPrice - Number(combo.discountedPrice);

  return (
    <div className="relative flex flex-col rounded-3xl border-2 border-orange-300 bg-gradient-to-b from-amber-50/60 to-[#FFFDF9] p-7 shadow-md transition-all hover:scale-102 hover:shadow-xl">
      <div className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-r from-orange-500 to-red-650 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-xs">
        🔥 Special Savings
      </div>

      <h3 className="text-xl font-bold text-neutral-900 font-serif">{combo.name}</h3>
      {combo.description && <p className="mt-2 text-sm leading-relaxed text-neutral-700 font-medium">{combo.description}</p>}

      <div className="mt-4 flex-1">
        <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">Includes Sessions:</div>
        <ul className="flex flex-wrap gap-2">
          {combo.categories.map(({ category }) => (
            <li
              key={category.id}
              className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-white px-3 py-1 text-xs font-semibold text-neutral-800 shadow-2xs"
            >
              <span>✨</span> {category.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-baseline justify-between border-t border-orange-200/60 pt-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-neutral-900">{formatInr(combo.discountedPrice)}</span>
            <span className="text-sm font-medium text-neutral-400 line-through">{formatInr(combo.originalPrice)}</span>
          </div>
          {savings > 0 && (
            <div className="mt-0.5 text-xs font-bold text-emerald-650">
              You Save {formatInr(savings)}!
            </div>
          )}
        </div>
      </div>

      <Link
        href={`/?combo=${combo.slug}#booking`}
        className="mt-5 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-650 py-3 text-center text-sm font-bold text-white shadow-xs transition hover:from-orange-600 hover:to-red-750"
        style={{ color: '#ffffff' }}
      >
        <span className="text-white" style={{ color: '#ffffff' }}>Claim Combo Package &rarr;</span>
      </Link>
    </div>
  );
}
