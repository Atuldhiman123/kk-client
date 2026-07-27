import { Suspense } from 'react';
import { getGemstones } from '@/lib/api';
import { GemstoneCard } from '@/components/gemstone/GemstoneCard';
import { GemstoneSearch, GemstonePagination } from '@/components/gemstone/GemstoneFilters';

const PAGE_SIZE = 12;

export const metadata = {
  title: 'Certified Gemstones | AstroConsult',
  description: 'Browse 100% natural, lab-certified gemstones recommended for your birth chart and planetary alignments.',
};

export default async function GemstonesPage(props: PageProps<'/gemstones'>) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

  const result = await getGemstones({ search, page, limit: PAGE_SIZE });

  return (
    <div className="bg-gradient-to-b from-amber-50/50 via-white to-faf8f5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
            💎 100% Authentic &amp; Unheated
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            Certified Gemstones
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-base text-neutral-600">
            Handpicked, lab-certified natural gemstones tuned for planetary strength (Surya, Guru, Shani, Budh) and astrological remedies.
          </p>
        </div>

        <div className="mt-10 max-w-md mx-auto">
          <Suspense fallback={null}>
            <GemstoneSearch />
          </Suspense>
        </div>

        {result.items.length === 0 ? (
          <div className="mt-16 text-center py-12 rounded-3xl border border-dashed border-amber-300 bg-white">
            <p className="text-lg font-bold text-neutral-800">No gemstones found matching your search.</p>
            <p className="text-sm text-neutral-500 mt-1">Try searching for &quot;Ruby&quot;, &quot;Sapphire&quot;, &quot;Pukhraj&quot;, or &quot;Emerald&quot;.</p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((gemstone) => (
              <GemstoneCard key={gemstone.id} gemstone={gemstone} />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Suspense fallback={null}>
            <GemstonePagination total={result.total} pageSize={PAGE_SIZE} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
