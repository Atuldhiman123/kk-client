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
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 px-4 py-10 sm:py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-orange-950 group">
            <img
              src="/images/logo.png"
              alt="Kundli Kendra Logo"
              className="h-10 w-10 rounded-xl object-cover border border-amber-400/80 shadow-xs transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-serif">
              Kundli <span className="text-orange-700 font-extrabold">Kendra</span>
            </span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-orange-900 font-medium">
            Personalized, 100% confidential Vedic astrology consultations for career, marriage, love, wealth, health and business.
            Rooted in authentic Kundli analysis and practical remedies.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
            {contact.whatsapp && (
              <a
                href={waLink(contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:opacity-90"
                style={{ backgroundColor: '#25D366', color: '#ffffff' }}
              >
                <WhatsAppOutlined /> Connect on WhatsApp
              </a>
            )}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-pink-600 to-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:opacity-90"
              style={{ color: '#ffffff' }}
            >
              <InstagramOutlined /> Follow on Instagram
            </a>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-bold uppercase tracking-wider text-orange-950 text-xs sm:text-sm">Quick Navigation</div>
          <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5">
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

        {contact && (
          <div className="text-sm text-orange-950">
            <div className="font-bold uppercase tracking-wider text-orange-950 text-xs sm:text-sm">Contact Information</div>
            <ul className="mt-3 sm:mt-4 space-y-2.5 sm:space-y-3">
              <li>
                <a href={telLink(contact.phone)} className="flex items-center gap-2.5 transition hover:text-red-700 break-all">
                  <PhoneOutlined className="text-orange-700 shrink-0" /> <span>{contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 transition hover:text-red-700 break-all">
                  <MailOutlined className="text-orange-700 shrink-0" /> <span>{contact.email}</span>
                </a>
              </li>
              <li>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition hover:text-red-700">
                  <InstagramOutlined className="text-pink-600 shrink-0" /> <span>@astrologer__atul</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <EnvironmentOutlined className="mt-1 text-orange-700 shrink-0" />
                <span className="leading-snug text-orange-900 font-medium">{contact.address}</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-orange-300/40 py-5 text-center text-xs text-orange-900 font-semibold px-4">
        © {year} Kundli Kendra. All rights reserved. &middot; 100% Confidential &amp; Private Guidance.
      </div>
    </footer>
  );
}
