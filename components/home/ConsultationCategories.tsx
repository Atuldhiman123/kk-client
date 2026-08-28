import type { ConsultationCategory } from '@/lib/types';
import { CategoryCard } from './CategoryCard';

export function ConsultationCategories({ categories }: { categories: ConsultationCategory[] }) {
  return (
    <section id="consultations" className="bg-gradient-to-b from-orange-50/50 via-amber-50/80 to-orange-100/40 py-20 border-t border-orange-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-4 py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            🔮 Specialized Guidance
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl font-serif">
            Consultation Categories
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-neutral-700 font-medium">
            Select your area of interest to receive tailored birth chart readings, predictions, and authentic Vedic remedies.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
