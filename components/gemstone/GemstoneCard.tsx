import Link from 'next/link';
import Image from 'next/image';
import type { Gemstone } from '@/lib/types';
import { formatInr } from '@/lib/format';

export function GemstoneCard({ gemstone }: { gemstone: Gemstone }) {
  const imageUrl = gemstone.image ?? gemstone.images[0]?.imageUrl;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-48 w-full bg-neutral-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={gemstone.name} fill unoptimized className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">💎</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-neutral-900">{gemstone.name}</h3>
        {gemstone.shortDescription && (
          <p className="mt-1 flex-1 text-sm text-neutral-600">{gemstone.shortDescription}</p>
        )}
        <div className="mt-3 font-semibold text-neutral-900">{formatInr(gemstone.price)}</div>
        <Link
          href={`/gemstones/${gemstone.slug}`}
          className="mt-4 rounded-full py-2 text-center text-sm font-semibold text-white"
          style={{ backgroundColor: '#B8860B' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
