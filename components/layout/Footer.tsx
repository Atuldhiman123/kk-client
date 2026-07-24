'use client';

import Link from 'next/link';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { telLink } from '@/lib/contact';

export function Footer({ contact }: { contact?: ContactInfo }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-neutral-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="text-lg font-semibold text-neutral-900">
            Astro<span style={{ color: '#B8860B' }}>Consult</span>
          </div>
          <p className="mt-2 max-w-xs text-sm text-neutral-600">
            Personalized astrology consultations for career, marriage, love, business, health and
            more.
          </p>
        </div>

        <div className="text-sm text-neutral-600">
          <div className="font-semibold text-neutral-900">Quick Links</div>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/#about" className="hover:text-neutral-900">
                About
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-neutral-900">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/gemstones" className="hover:text-neutral-900">
                Gemstones
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-neutral-900">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-neutral-900">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        {contact && (
          <div className="text-sm text-neutral-600">
            <div className="font-semibold text-neutral-900">Contact</div>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={telLink(contact.phone)} className="flex items-center gap-2 hover:text-neutral-900">
                  <PhoneOutlined /> {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-neutral-900">
                  <MailOutlined /> {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <EnvironmentOutlined className="mt-0.5" /> {contact.address}
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-black/5 py-4 text-center text-xs text-neutral-500">
        © {year} AstroConsult. All rights reserved.
      </div>
    </footer>
  );
}
