'use client';

import Link from 'next/link';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, WhatsAppOutlined, InstagramOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { telLink, waLink } from '@/lib/contact';

export function Footer({ contact }: { contact: ContactInfo }) {
  const year = new Date().getFullYear();
  const instagramUrl = contact.instagram || 'https://www.instagram.com/astrologer__atul/';

  return (
    <footer className="border-t border-orange-300 bg-gradient-to-b from-[#FFF3E0] to-[#FFE0B2] text-orange-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-orange-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600 text-white text-lg shadow-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </span>
            <span className="font-serif">
              Kundli <span className="text-orange-700 font-extrabold">Kendra</span>
            </span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-orange-900 font-medium">
            Personalized, 100% confidential Vedic astrology consultations for career, marriage, love, wealth, health and business.
            Rooted in authentic Kundli analysis and practical remedies.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {contact.whatsapp && (
              <a
                href={waLink(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-90"
                style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              >
                <WhatsAppOutlined /> Connect on WhatsApp
              </a>
            )}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-pink-650 to-red-650 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-90"
              style={{ color: '#ffffff' }}
            >
              <InstagramOutlined /> Follow on Instagram
            </a>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-bold uppercase tracking-wider text-orange-950">Quick Navigation</div>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/#consultations" className="transition hover:text-red-700">
                Consultation Categories
              </Link>
            </li>
            <li>
              <Link href="/#combos" className="transition hover:text-red-700">
                Combo Packages
              </Link>
            </li>
            <li>
              <Link href="/gemstones" className="transition hover:text-red-700">
                Certified Gemstones
              </Link>
            </li>
            <li>
              <Link href="/#why-choose-us" className="transition hover:text-red-700">
                Why Choose Us
              </Link>
            </li>
            <li>
              <Link href="/#testimonials" className="transition hover:text-red-700">
                Client Reviews
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="transition hover:text-red-700">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-orange-950">
          <div className="font-bold uppercase tracking-wider text-orange-950">Contact Information</div>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={telLink(contact.phone)} className="flex items-center gap-2.5 transition hover:text-red-700">
                <PhoneOutlined className="text-orange-700" /> {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 transition hover:text-red-700">
                <MailOutlined className="text-orange-700" /> {contact.email}
              </a>
            </li>
            <li>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition hover:text-red-700">
                <InstagramOutlined className="text-pink-600" /> @astrologer__atul
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <EnvironmentOutlined className="mt-1 text-orange-700" />
              <span className="leading-snug text-orange-900 font-medium">{contact.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-orange-300/40 py-6 text-center text-xs text-orange-900 font-semibold">
        © {year} Kundli Kendra. All rights reserved. &middot; 100% Confidential & Private Guidance.
      </div>
    </footer>
  );
}
