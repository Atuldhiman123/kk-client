'use client';

import Link from 'next/link';
import { PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { waLink } from '@/lib/contact';

export function Header({ contact }: { contact?: ContactInfo }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">
          Astro<span style={{ color: '#B8860B' }}>Consult</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 sm:flex">
          <Link href="/#consultations" className="hover:text-neutral-950">
            Consultations
          </Link>
          <Link href="/#combos" className="hover:text-neutral-950">
            Combo Offers
          </Link>
          <Link href="/gemstones" className="hover:text-neutral-950">
            Gemstones
          </Link>
          <Link href="/#testimonials" className="hover:text-neutral-950">
            Testimonials
          </Link>
          <Link href="/#faq" className="hover:text-neutral-950">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {contact?.phone && (
            <a
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="hidden items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:border-neutral-300 sm:inline-flex"
            >
              <PhoneOutlined /> Call
            </a>
          )}
          {contact?.whatsapp && (
            <a
              href={waLink(contact.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-white"
              style={{ backgroundColor: '#25D366' }}
            >
              <WhatsAppOutlined /> WhatsApp
            </a>
          )}
          <Link
            href="/#booking"
            className="hidden rounded-full px-4 py-1.5 text-sm font-semibold text-white sm:inline-flex"
            style={{ backgroundColor: '#B8860B' }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
