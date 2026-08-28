import Link from 'next/link';
import type { ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { categoryIcon } from '@/lib/category-icons';

function categoryImage(slug: string): string {
  const clean = slug.toLowerCase();
  
  if (clean.includes('career') && clean.includes('business')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('career')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('business')) {
    return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('marriage') || clean.includes('compatibility')) {
    return 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('love') || clean.includes('relationship')) {
    return 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('health') || clean.includes('wellbeing')) {
    return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('education') || clean.includes('study')) {
    return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('property') || clean.includes('land')) {
    return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('settlement') || clean.includes('foreign') || clean.includes('travel')) {
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('matching') || clean.includes('kundli-matching')) {
    return 'https://images.unsplash.com/photo-1543168256-418811576f13?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('child') || clean.includes('birth')) {
    return 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('finance') || clean.includes('wealth') || clean.includes('money')) {
    return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('family') || clean.includes('problems') || clean.includes('home')) {
    return 'https://images.unsplash.com/photo-1609234656388-0ff363383899?auto=format&fit=crop&w=600&q=80';
  }
  if (clean.includes('full-life') || clean.includes('reading') || clean.includes('life')) {
    return '/images/kundli-scroll.jpg';
  }
  return 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80';
}

export function CategoryCard({ category }: { category: ConsultationCategory }) {
  const currentPriceNum = Number(category.price);
  const origPriceNum = category.originalPrice;
  const savings = origPriceNum && origPriceNum > currentPriceNum ? origPriceNum - currentPriceNum : 0;
  const discountPercent = origPriceNum && origPriceNum > currentPriceNum ? Math.round((savings / origPriceNum) * 100) : 0;

  return (
    <div className="relative group flex flex-col justify-between overflow-hidden rounded-3xl border border-orange-200/80 bg-[#FFFDF9] shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-orange-450 hover:shadow-md h-full">
      {/* Top Image Banner */}
      <div className="relative h-30 w-full overflow-hidden bg-orange-50 shrink-0">
        <img
          src={categoryImage(category.slug)}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
          loading="lazy"
        />
        {/* Subtle gradient overlay to fade into bottom card */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9] via-transparent to-black/10" />

        {/* Floating Duration and Discount Badges */}
        <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
          <span className="rounded-full bg-white/90 backdrop-blur-xs border border-orange-100 px-2 py-0.5 text-[8.5px] font-extrabold text-orange-955 shadow-2xs">
            ⏱️ {category.durationMinutes} min
          </span>
        </div>
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-3 rounded-full bg-red-600 px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider text-white shadow-sm">
            🔥 {discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Bottom Content Area */}
      <div className="flex-1 p-4.5 pt-3.5 flex flex-col justify-between bg-[#FFFDF9]">
        <div className="relative">
          {/* Floating Category Icon (Offset overlapping the image) */}
          <div className="absolute -top-9 left-1 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/70 text-xl shadow-md border border-orange-200/50">
            {categoryIcon(category.slug)}
          </div>

          <div className="pl-12">
            <h3 className="text-sm font-extrabold tracking-tight text-neutral-900 group-hover:text-orange-700 transition font-serif leading-tight">
              {category.name}
            </h3>
            {category.description && (
              <p className="mt-1 text-[10.5px] leading-snug text-neutral-500 font-medium line-clamp-2 h-8">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 flex items-center justify-between border-t border-orange-100 pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-neutral-900">{formatInr(category.price)}</span>
            {origPriceNum && origPriceNum > currentPriceNum && (
              <span className="text-[10px] font-semibold text-neutral-400 line-through">
                {formatInr(origPriceNum)}
              </span>
            )}
          </div>

          <Link
            href={`/?category=${category.slug}#booking`}
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-3.5 py-1.5 text-[10px] font-bold text-white shadow-xs transition duration-150 shrink-0"
            style={{ color: '#ffffff' }}
          >
            <span className="text-white" style={{ color: '#ffffff' }}>Book Now &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
