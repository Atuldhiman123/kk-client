'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PhoneOutlined, WhatsAppOutlined, MenuOutlined, CloseOutlined, InstagramOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header({ contact }: { contact: ContactInfo }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const instagramUrl = contact.instagram || 'https://www.instagram.com/astrologer__atul/';

  return (
    <header className="sticky top-0 z-50 border-b border-orange-200/80 bg-[#FFFDF9]/95 shadow-xs backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-5 sm:py-2.5 lg:px-8 gap-2">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-neutral-900 group shrink-0">
          <img
            src="/images/logo.png"
            alt="Kundli Kendra Logo"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-1.5 border-amber-400/80 shadow-xs transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-serif tracking-tight text-[15px] sm:text-lg whitespace-nowrap leading-none">
            {t.nav.brand_name} <span className="text-orange-600 font-black">{t.nav.brand_highlight}</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4.5 text-[11px] xl:text-xs font-bold uppercase tracking-wider">
          <Link
            href="/ai-astrologer"
            className="flex items-center gap-1 text-orange-700 transition duration-150 hover:text-orange-900 bg-gradient-to-r from-amber-100/90 to-orange-100/90 px-2.5 xl:px-3 py-1 rounded-full border border-orange-300 shadow-2xs font-extrabold whitespace-nowrap"
          >
            <span>💎</span>
            <span className="whitespace-nowrap">{t.nav.gemstone_nav_short}</span>
          </Link>
          <Link href="/#consultations" className="text-orange-950/90 transition duration-150 hover:text-orange-600 whitespace-nowrap">
            {t.nav.consultations}
          </Link>
          <Link href="/#combos" className="text-orange-950/90 transition duration-150 hover:text-orange-600 whitespace-nowrap">
            {t.nav.combos}
          </Link>
          <Link href="/gemstones" className="text-orange-950/90 transition duration-150 hover:text-orange-600 whitespace-nowrap">
            {t.nav.gemstones}
          </Link>
          <Link href="/#why-choose-us" className="text-orange-950/90 transition duration-150 hover:text-orange-600 whitespace-nowrap">
            {t.nav.why_us}
          </Link>
          <Link href="/#testimonials" className="text-orange-950/90 transition duration-150 hover:text-orange-600 whitespace-nowrap">
            {t.nav.reviews}
          </Link>
          <Link href="/#faq" className="text-orange-950/90 transition duration-150 hover:text-orange-600 whitespace-nowrap">
            {t.nav.faq}
          </Link>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher Pill */}
          <LanguageSwitcher variant="header" />

          {contact && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-900 transition hover:border-pink-400 hover:text-pink-600 shadow-2xs"
              aria-label="Instagram"
            >
              <InstagramOutlined className="text-[14px]" />
            </a>
          )}
          {contact?.phone && (
            <a
              href={telLink(contact.phone)}
              className="hidden xl:flex h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-900 transition hover:border-orange-400 hover:text-orange-600 shadow-2xs"
              aria-label="Call"
            >
              <PhoneOutlined className="text-[13px]" />
            </a>
          )}
          {contact.whatsapp && (
            <a
              href={waLink(contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300 bg-white text-emerald-600 shadow-2xs transition hover:border-emerald-400 hover:bg-emerald-50/50"
              aria-label="WhatsApp"
            >
              <WhatsAppOutlined className="text-[15px]" />
            </a>
          )}

          {/* Book Now Button */}
          <Link
            href="/#booking"
            className="rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white shadow-xs hover:from-orange-600 hover:to-red-700 transition duration-150 whitespace-nowrap shrink-0"
            style={{ color: '#ffffff' }}
          >
            <span className="text-white whitespace-nowrap font-bold" style={{ color: '#ffffff' }}>
              {t.nav.book_now}
            </span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg p-1 text-orange-950 hover:bg-orange-100/60 lg:hidden ml-0.5 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <CloseOutlined className="text-base" /> : <MenuOutlined className="text-base" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-orange-200/70 bg-[#FFFDF9] px-4 py-4 shadow-lg lg:hidden">
          {/* Mobile Language Switcher */}
          <div className="mb-3">
            <LanguageSwitcher variant="mobile" />
          </div>

          <nav className="flex flex-col space-y-1 font-medium text-neutral-800">
            <Link
              href="/ai-astrologer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-orange-950 bg-gradient-to-r from-amber-100 to-orange-100 border border-orange-300 hover:bg-orange-200 transition"
            >
              <span className="flex items-center gap-1.5">
                <span>💎</span>
                <span>{t.nav.gemstone_nav}</span>
              </span>
              <span className="text-orange-600 font-bold">&rarr;</span>
            </Link>
            <Link
              href="/#consultations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              <span>🔮 {t.nav.consultations}</span>
              <span className="text-neutral-400">&rarr;</span>
            </Link>
            <Link
              href="/#combos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              <span>🏷️ {t.nav.combos}</span>
              <span className="text-neutral-400">&rarr;</span>
            </Link>
            <Link
              href="/gemstones"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              <span>💎 {t.nav.gemstones}</span>
              <span className="text-neutral-400">&rarr;</span>
            </Link>
            <Link
              href="/#why-choose-us"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              <span>⭐ {t.nav.why_us}</span>
              <span className="text-neutral-400">&rarr;</span>
            </Link>
            <Link
              href="/#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              <span>💬 {t.nav.reviews}</span>
              <span className="text-neutral-400">&rarr;</span>
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              <span>❓ {t.nav.faq}</span>
              <span className="text-neutral-400">&rarr;</span>
            </Link>
          </nav>

          {contact && (
            <div className="mt-4 border-t border-orange-100 pt-3.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">{t.nav.direct_contact}</div>
              <div className="grid grid-cols-3 gap-2">
                {contact.phone && (
                  <a
                    href={telLink(contact.phone)}
                    className="flex flex-col items-center justify-center rounded-xl border border-orange-100 bg-white p-2 text-neutral-800 shadow-2xs hover:border-orange-300"
                  >
                    <PhoneOutlined className="text-base text-orange-600" />
                    <span className="text-[10px] font-bold mt-1">{t.nav.call}</span>
                  </a>
                )}
                {contact.whatsapp && (
                  <a
                    href={waLink(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center rounded-xl border border-emerald-100 bg-white p-2 text-neutral-800 shadow-2xs hover:border-emerald-300"
                  >
                    <WhatsAppOutlined className="text-base text-emerald-600" />
                    <span className="text-[10px] font-bold mt-1">{t.nav.whatsapp}</span>
                  </a>
                )}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center rounded-xl border border-pink-100 bg-white p-2 text-neutral-800 shadow-2xs hover:border-pink-300"
                >
                  <InstagramOutlined className="text-base text-pink-600" />
                  <span className="text-[10px] font-bold mt-1">Instagram</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
