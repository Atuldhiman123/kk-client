import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getHome } from '@/lib/api';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const home = await getHome().catch(() => null);

  return (
    <>
      <Header contact={home?.contact} />
      <main className="flex-1">{children}</main>
      <Footer contact={home?.contact} />
    </>
  );
}
