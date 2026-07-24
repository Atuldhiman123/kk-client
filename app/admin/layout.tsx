'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'antd';
import { clearAdminToken, getAdminToken } from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/categories', label: 'Consultation Categories' },
  { href: '/admin/combo-offers', label: 'Combo Offers' },
  { href: '/admin/gemstones', label: 'Gemstones' },
  { href: '/admin/availability', label: 'Availability' },
  { href: '/admin/payment-config', label: 'Payment Config' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time auth presence check on mount/nav
      setChecked(true);
      return;
    }
    if (!getAdminToken()) {
      router.replace('/admin/login');
      return;
    }
    setChecked(true);
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return null;
  }

  const handleLogout = () => {
    clearAdminToken();
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white p-4 sm:block">
        <div className="px-2 text-lg font-semibold text-neutral-900">
          Astro<span style={{ color: '#B8860B' }}>Consult</span>
        </div>
        <div className="px-2 text-xs text-neutral-400">Admin Panel</div>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                pathname.startsWith(item.href)
                  ? 'bg-amber-50 text-neutral-900'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button className="mt-6 w-full" onClick={handleLogout}>
          Log Out
        </Button>
      </aside>

      <main className="min-w-0 flex-1 p-6">{children}</main>
    </div>
  );
}
