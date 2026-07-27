'use client';

import Link from 'next/link';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, WhatsAppOutlined, InstagramOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { telLink, waLink } from '@/lib/contact';

export function Footer({ contact }: { contact?: ContactInfo }) {
  const year = new Date().getFullYear();
  const instagramUrl = contact?.instagram || 'https://www.instagram.com/astrologer__atul/';

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-lg shadow-sm">
              🔮
            </span>
            <span>
              Kundli <span className="text-amber-500">Kendra</span>
            </span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
            Personalized, 100% confidential Vedic astrology consultations for career, marriage, love, wealth, health and business.
            Rooted in authentic Kundli analysis and practical remedies.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {contact?.whatsapp && (
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-90"
              style={{ color: '#ffffff' }}
            >
              <InstagramOutlined /> Follow on Instagram
            </a>
          </div>
        </div>

        <div className="text-sm">
          <div className="font-semibold uppercase tracking-wider text-amber-500">Quick Navigation</div>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/#consultations" className="transition hover:text-amber-400">
                Consultation Categories
              </Link>
            </li>
            <li>
              <Link href="/#combos" className="transition hover:text-amber-400">
                Combo Packages
              </Link>
            </li>
            <li>
              <Link href="/gemstones" className="transition hover:text-amber-400">
                Certified Gemstones
              </Link>
            </li>
            <li>
              <Link href="/#why-choose-us" className="transition hover:text-amber-400">
                Why Choose Us
              </Link>
            </li>
            <li>
              <Link href="/#testimonials" className="transition hover:text-amber-400">
                Client Reviews
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="transition hover:text-amber-400">
                Frequently Asked Questions
              </Link>
            </li>
          </ul>
        </div>

        {contact && (
          <div className="text-sm">
            <div className="font-semibold uppercase tracking-wider text-amber-500">Contact Information</div>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={telLink(contact.phone)} className="flex items-center gap-2.5 transition hover:text-amber-400">
                  <PhoneOutlined className="text-amber-500" /> {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 transition hover:text-amber-400">
                  <MailOutlined className="text-amber-500" /> {contact.email}
                </a>
              </li>
              <li>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 transition hover:text-amber-400">
                  <InstagramOutlined className="text-pink-500" /> @astrologer__atul
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <EnvironmentOutlined className="mt-1 text-amber-500" />
                <span className="leading-snug">{contact.address}</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        © {year} Kundli Kendra. All rights reserved. &middot; 100% Confidential & Private Guidance.
      </div>
    </footer>
  );
}
