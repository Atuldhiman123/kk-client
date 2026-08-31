'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Drawer } from 'antd';
import {
  CalendarOutlined,
  AppstoreOutlined,
  TagsOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
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
    <div className="flex min-h-screen flex-col sm:flex-row bg-neutral-50">
      {/* Mobile Top Admin Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5 sm:hidden sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-neutral-900">
          <img
            src="/images/logo.png"
            alt="Kundli Kendra Logo"
            className="h-7 w-7 rounded-lg object-cover border border-amber-300"
          />
          <span className="text-sm font-serif">Admin Workspace</span>
        </div>
        <Button
          type="text"
          icon={<MenuOutlined className="text-lg" />}
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Toggle Admin Menu"
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Admin Workspace"
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        bodyStyle={{ padding: 16 }}
      >
        <div className="flex flex-col h-full justify-between">
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
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

          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-4 font-semibold border border-neutral-100 mt-6"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </Drawer>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white p-5 sm:flex justify-between">
        <div>
          <div className="flex items-center gap-2.5 px-2 text-xl font-bold tracking-tight text-neutral-900">
            <img
              src="/images/logo.png"
              alt="Kundli Kendra Logo"
              className="h-9 w-9 rounded-xl object-cover border border-amber-300"
            />
            <span className="font-serif">
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

      <main className="min-w-0 flex-1 p-3.5 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
