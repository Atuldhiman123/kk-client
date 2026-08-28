import type { ComboOffer } from '@/lib/types';
import { ComboCard } from './ComboCard';

export function ComboOffers({ combos }: { combos: ComboOffer[] }) {
  if (!combos || combos.length === 0) return null;

  return (
    <section id="combos" className="bg-gradient-to-b from-orange-100/40 via-amber-50/70 to-[#FFF3E0] py-20 border-t border-orange-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-4 py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            🏷️ Best Value Bundles
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl font-serif">
            Popular Combo Packages
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-neutral-700 font-medium">
            Combine multiple consultation topics into a single comprehensive session and save up to 30%.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </section>
  );
}
