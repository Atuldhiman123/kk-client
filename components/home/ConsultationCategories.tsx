import type { ConsultationCategory } from '@/lib/types';
import { CategoryCard } from './CategoryCard';

export function ConsultationCategories({ categories }: { categories: ConsultationCategory[] }) {
  return (
    <section id="consultations" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900">Consultation Categories</h2>
        <p className="mt-2 text-neutral-600">Choose the guidance you need — book in a few clicks.</p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
