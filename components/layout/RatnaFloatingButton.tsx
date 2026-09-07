'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';

export function RatnaFloatingButton() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Do not show the floating CTA when the user is already on the AI Astrologer consultation page or admin pages
  if (pathname === '/ai-astrologer' || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-40">
      <Link
        href="/ai-astrologer"
        className="group flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 px-3 py-2 sm:px-4 sm:py-2.5 text-white shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-300/60"
        style={{ color: '#ffffff' }}
      >
        <span className="text-base sm:text-lg">💎</span>
        <span className="text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: '#ffffff' }}>
          {t.nav.gemstone_nav_short}
        </span>
      </Link>
    </div>
  );
}
