import { Suspense } from 'react';
import { getGemstones } from '@/lib/api';
import { GemstoneCard } from '@/components/gemstone/GemstoneCard';
import { GemstoneSearch, GemstonePagination } from '@/components/gemstone/GemstoneFilters';
import { GemstoneHeader, GemstoneEmptyState } from '@/components/gemstone/GemstoneHeader';

const PAGE_SIZE = 12;

export const metadata = {
  title: 'Certified Gemstones | Kundli Kendra',
  description: 'Browse 100% natural, lab-certified gemstones recommended for your birth chart and planetary alignments.',
};

export default async function GemstonesPage(props: { searchParams: Promise<{ search?: string; page?: string }> }) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

  const result = await getGemstones({ search, page, limit: PAGE_SIZE });

  return (
    <div className="bg-gradient-to-b from-orange-100/50 via-amber-50/80 to-[#FFF3E0]/40 py-10 sm:py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GemstoneHeader />

        <div className="mt-8 sm:mt-10 max-w-md mx-auto">
          <Suspense fallback={null}>
            <GemstoneSearch />
          </Suspense>
        </div>

        {result.items.length === 0 ? (
          <GemstoneEmptyState />
        ) : (
          <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-5 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((gemstone) => (
              <GemstoneCard key={gemstone.id} gemstone={gemstone} />
            ))}
          </div>
        )}

        <div className="mt-10 sm:mt-12 flex justify-center">
          <Suspense fallback={null}>
            <GemstonePagination total={result.total} pageSize={PAGE_SIZE} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
