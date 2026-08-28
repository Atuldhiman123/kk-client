import Link from 'next/link';
import Image from 'next/image';
import type { Gemstone } from '@/lib/types';
import { formatInr } from '@/lib/format';

export function GemstoneCard({ gemstone }: { gemstone: Gemstone }) {
  const imageUrl = gemstone.image ?? gemstone.images[0]?.imageUrl;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl">
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-b from-amber-50 to-neutral-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={gemstone.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">💎</div>
        )}
        <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-amber-800 shadow-2xs backdrop-blur-xs">
          ✨ Lab Certified
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-neutral-900 group-hover:text-amber-700 transition font-serif">
          {gemstone.name}
        </h3>
        {gemstone.shortDescription && (
          <p className="mt-2 flex-1 text-xs leading-relaxed text-neutral-600 line-clamp-2">
            {gemstone.shortDescription}
          </p>
        )}

        <div className="mt-5 flex items-baseline justify-between border-t border-neutral-100 pt-4">
          <div>
            <div className="text-xs text-neutral-500 font-medium">Starting Price</div>
            <div className="text-2xl font-extrabold text-neutral-900">{formatInr(gemstone.price)}</div>
          </div>
        </div>

        <Link
          href={`/gemstones/${gemstone.slug}`}
          className="mt-4 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 py-3 text-center text-xs font-bold text-white shadow-xs transition hover:from-orange-600 hover:to-orange-700"
        >
          View Gemstone &rarr;
        </Link>
      </div>
    </div>
  );
}
