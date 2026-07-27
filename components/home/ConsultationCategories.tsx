import type { ConsultationCategory } from '@/lib/types';
import { CategoryCard } from './CategoryCard';

export function ConsultationCategories({ categories }: { categories: ConsultationCategory[] }) {
  return (
    <section id="consultations" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
          🔮 Specialized Guidance
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Consultation Categories
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-base text-neutral-600">
          Select your area of interest to receive tailored birth chart readings, predictions, and authentic Vedic remedies.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
