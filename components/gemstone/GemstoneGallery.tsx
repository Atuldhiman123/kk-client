'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { GemstoneImage } from '@/lib/types';

export function GemstoneGallery({
  images,
  fallbackImage,
  name,
}: {
  images: GemstoneImage[];
  fallbackImage: string | null;
  name: string;
}) {
  const gallery = images.length > 0 ? images.map((i) => i.imageUrl) : fallbackImage ? [fallbackImage] : [];
  const [active, setActive] = useState(0);

  if (gallery.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl bg-neutral-100 text-6xl">
        💎
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-neutral-100 sm:h-96">
        <Image src={gallery[active]} alt={name} fill unoptimized className="object-cover" />
      </div>
      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2">
          {gallery.map((src, index) => (
            <button
              key={src}
              onClick={() => setActive(index)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                index === active ? 'border-amber-500' : 'border-transparent'
              }`}
            >
              <Image src={src} alt={`${name} ${index + 1}`} fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
