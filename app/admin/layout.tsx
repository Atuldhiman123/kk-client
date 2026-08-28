'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'antd';
import {
  CalendarOutlined,
  AppstoreOutlined,
  TagsOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { clearAdminToken, getAdminToken } from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/admin/bookings', label: 'Bookings', icon: <CalendarOutlined /> },
  { href: '/admin/categories', label: 'Consultation Categories', icon: <AppstoreOutlined /> },
  { href: '/admin/combo-offers', label: 'Combo Offers', icon: <TagsOutlined /> },
  { href: '/admin/gemstones', label: 'Gemstones', icon: <GiftOutlined /> },
  { href: '/admin/availability', label: 'Availability', icon: <ClockCircleOutlined /> },
  { href: '/admin/payment-config', label: 'Payment Config', icon: <SettingOutlined /> },
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
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white p-5 sm:flex justify-between">
        <div>
          <div className="flex items-center gap-2 px-2 text-xl font-bold tracking-tight text-neutral-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-sm shadow-xs">
              🔮
            </span>
            <span>
              Kundli <span style={{ color: '#B8860B' }}>Kendra</span>
            </span>
          </div>
          <div className="px-2 mt-1 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            Admin Workspace
          </div>

          <nav className="mt-8 flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-amber-50 text-amber-900 shadow-xs border-l-4 border-amber-600 pl-2.5'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                  }`}
                >
                  <span className={`text-base transition-colors ${active ? 'text-amber-600' : 'text-neutral-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-5 font-semibold border border-neutral-100 hover:bg-red-50/50"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </aside>

      <main className="min-w-0 flex-1 p-8">{children}</main>
    </div>
  );
}
