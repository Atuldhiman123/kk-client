import { Suspense } from 'react';
import { getGemstones } from '@/lib/api';
import { GemstoneCard } from '@/components/gemstone/GemstoneCard';
import { GemstoneSearch, GemstonePagination } from '@/components/gemstone/GemstoneFilters';

const PAGE_SIZE = 12;

export const metadata = {
  title: 'Certified Gemstones | Kundli Kendra',
  description: 'Browse 100% natural, lab-certified gemstones recommended for your birth chart and planetary alignments.',
};

export default async function GemstonesPage(props: PageProps<'/gemstones'>) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;

  const result = await getGemstones({ search, page, limit: PAGE_SIZE });

  return (
    <div className="bg-gradient-to-b from-orange-100/50 via-amber-50/80 to-[#FFF3E0]/40 py-10 sm:py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            💎 100% Authentic &amp; Unheated
          </span>
          <h1 className="mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 font-serif">
            Certified Gemstones
          </h1>
          <p className="mt-2.5 sm:mt-3 max-w-2xl mx-auto text-sm sm:text-base text-neutral-600">
            Handpicked, lab-certified natural gemstones tuned for planetary strength (Surya, Guru, Shani, Budh) and astrological remedies.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 max-w-md mx-auto">
          <Suspense fallback={null}>
            <GemstoneSearch />
          </Suspense>
        </div>

        {result.items.length === 0 ? (
          <div className="mt-12 text-center py-10 sm:py-12 rounded-3xl border border-dashed border-orange-300 bg-white p-4">
            <p className="text-base sm:text-lg font-bold text-neutral-800">No gemstones found matching your search.</p>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">Try searching for &quot;Ruby&quot;, &quot;Sapphire&quot;, &quot;Pukhraj&quot;, or &quot;Emerald&quot;.</p>
          </div>
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
