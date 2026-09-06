'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';

export function RatnaFloatingButton() {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <Link
        href="/ai-astrologer"
        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 px-4 py-3 text-white shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-300/60"
        style={{ color: '#ffffff' }}
      >
        <span className="text-lg">💎</span>
        <span className="text-xs sm:text-sm font-bold whitespace-nowrap" style={{ color: '#ffffff' }}>
          {t.nav.gemstone_nav_short}
        </span>
      </Link>
    </div>
  );
}
