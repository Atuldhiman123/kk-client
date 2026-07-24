import type { ComboOffer } from '@/lib/types';
import { ComboCard } from './ComboCard';

export function ComboOffers({ combos }: { combos: ComboOffer[] }) {
  if (combos.length === 0) return null;

  return (
    <section id="combos" className="bg-amber-50/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Combo Consultation Offers</h2>
          <p className="mt-2 text-neutral-600">Save more with bundled consultations.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      </div>
    </section>
  );
}
