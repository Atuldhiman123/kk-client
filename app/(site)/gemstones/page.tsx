import { Suspense } from 'react';
import { getGemstones } from '@/lib/api';
import { GemstoneCard } from '@/components/gemstone/GemstoneCard';
import { GemstoneSearch, GemstonePagination } from '@/components/gemstone/GemstoneFilters';

const PAGE_SIZE = 12;

export const metadata = {
  title: 'Gemstones | AstroConsult',
  description: 'Browse authentic, certified gemstones recommended for your birth chart.',
};

export default async function GemstonesPage(props: PageProps<'/gemstones'>) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

  const result = await getGemstones({ search, page, limit: PAGE_SIZE });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Gemstones</h1>
        <p className="mt-2 text-neutral-600">
          Authentic, certified gemstones recommended for your birth chart.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={null}>
          <GemstoneSearch />
        </Suspense>
      </div>

      {result.items.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">No gemstones found.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {result.items.map((gemstone) => (
            <GemstoneCard key={gemstone.id} gemstone={gemstone} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Suspense fallback={null}>
          <GemstonePagination total={result.total} pageSize={PAGE_SIZE} />
        </Suspense>
      </div>
    </div>
  );
}
