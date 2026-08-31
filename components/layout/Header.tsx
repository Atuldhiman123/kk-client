'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhoneOutlined, WhatsAppOutlined, MenuOutlined, CloseOutlined, InstagramOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

export function Header({ contact }: { contact: ContactInfo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const instagramUrl = contact.instagram || 'https://www.instagram.com/astrologer__atul/';

  return (
    <header className="sticky top-0 z-50 border-b border-orange-200 bg-orange-50/90 shadow-xs backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-650 shadow-sm text-white shrink-0">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </span>
          <span className="font-serif tracking-tight text-neutral-900">
            Kundli <span className="text-orange-600 font-extrabold">Kendra</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-bold uppercase tracking-wider md:flex">
          <Link href="/#consultations" className="text-orange-950/95 transition duration-150 hover:text-orange-655">
            Consultations
          </Link>
          <Link href="/#combos" className="text-orange-950/95 transition duration-150 hover:text-orange-655">
            Combo Offers
          </Link>
          <Link href="/gemstones" className="text-orange-950/95 transition duration-150 hover:text-orange-655">
            Gemstones
          </Link>
          <Link href="/#why-choose-us" className="text-orange-950/95 transition duration-150 hover:text-orange-655">
            Why Us
          </Link>
          <Link href="/#testimonials" className="text-orange-950/95 transition duration-150 hover:text-orange-655">
            Reviews
          </Link>
          <Link href="/#faq" className="text-orange-950/95 transition duration-150 hover:text-orange-655">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-900 transition hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-600"
            aria-label="Instagram"
          >
            <InstagramOutlined className="text-[15px]" />
          </a>
          {contact.phone && (
            <a
              href={telLink(contact.phone)}
              className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-900 transition hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-600"
              aria-label="Call"
            >
              <PhoneOutlined className="text-[14px]" />
            </a>
          )}
          {contact.whatsapp && (
            <a
              href={waLink(contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-900 transition hover:border-orange-400 hover:bg-orange-50/50 hover:text-orange-600"
              aria-label="WhatsApp"
            >
              <WhatsAppOutlined className="text-[15px]" />
            </a>
          )}
          <Link
            href="/#booking"
            className="rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-650 px-4.5 py-2 text-xs font-bold text-white shadow-xs hover:from-orange-600 hover:to-red-750 transition duration-150 shrink-0 ml-1"
            style={{ color: '#ffffff' }}
          >
            <span className="text-white" style={{ color: '#ffffff' }}>Book Now</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-orange-950 hover:bg-orange-100/50 md:hidden ml-1"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <CloseOutlined className="text-lg" /> : <MenuOutlined className="text-lg" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-orange-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-3 font-medium text-neutral-800">
            <Link
              href="/#consultations"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-orange-50 text-neutral-750 hover:text-orange-600 transition"
            >
              Consultations
            </Link>
            <Link
              href="/#combos"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-orange-50 text-neutral-755 hover:text-orange-600 transition"
            >
              Combo Offers
            </Link>
            <Link
              href="/gemstones"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-orange-50 text-neutral-755 hover:text-orange-600 transition"
            >
              Gemstones
            </Link>
            <Link
              href="/#why-choose-us"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-orange-50 text-neutral-755 hover:text-orange-600 transition"
            >
              Why Us
            </Link>
            <Link
              href="/#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-orange-50 text-neutral-755 hover:text-orange-600 transition"
            >
              Reviews
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-orange-50 text-neutral-755 hover:text-orange-600 transition"
            >
              FAQ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
