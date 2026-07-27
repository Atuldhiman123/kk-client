'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhoneOutlined, WhatsAppOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

export function Header({ contact }: { contact?: ContactInfo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-lg shadow-sm">
            🔮
          </span>
          <span>
            Astro<span className="text-amber-600">Consult</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-neutral-700 md:flex">
          <Link href="/#consultations" className="transition hover:text-amber-600">
            Consultations
          </Link>
          <Link href="/#combos" className="transition hover:text-amber-600">
            Combo Offers
          </Link>
          <Link href="/gemstones" className="transition hover:text-amber-600">
            Gemstones
          </Link>
          <Link href="/#why-choose-us" className="transition hover:text-amber-600">
            Why Us
          </Link>
          <Link href="/#testimonials" className="transition hover:text-amber-600">
            Reviews
          </Link>
          <Link href="/#faq" className="transition hover:text-amber-600">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {contact?.phone && (
            <a
              href={telLink(contact.phone)}
              className="hidden items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-amber-400 hover:bg-amber-50 lg:inline-flex"
            >
              <PhoneOutlined className="text-amber-600" /> Call
            </a>
          )}
          {contact?.whatsapp && (
            <a
              href={waLink(contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:opacity-95 sm:inline-flex"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsAppOutlined /> WhatsApp
            </a>
          )}
          <Link
            href="/#booking"
            className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:from-amber-600 hover:to-amber-700"
          >
            Book Now
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <CloseOutlined className="text-lg" /> : <MenuOutlined className="text-lg" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-amber-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-3 font-medium text-neutral-800">
            <Link
              href="/#consultations"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-amber-50"
            >
              Consultations
            </Link>
            <Link
              href="/#combos"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-amber-50"
            >
              Combo Offers
            </Link>
            <Link
              href="/gemstones"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-amber-50"
            >
              Gemstones
            </Link>
            <Link
              href="/#why-choose-us"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-amber-50"
            >
              Why Us
            </Link>
            <Link
              href="/#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-amber-50"
            >
              Reviews
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-amber-50"
            >
              FAQ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
