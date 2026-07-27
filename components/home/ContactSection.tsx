'use client';

import { MailOutlined, EnvironmentOutlined, PhoneOutlined, WhatsAppOutlined, InstagramOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { telLink, waLink } from '@/lib/contact';

export function ContactSection({ contact }: { contact: ContactInfo }) {
  const instagramUrl = contact.instagram || 'https://www.instagram.com/astrologer__atul/';

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
          📞 Direct Reach
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">Get In Touch</h2>
        <p className="mt-3 max-w-xl mx-auto text-base text-neutral-600">
          Have a question before booking? Feel free to reach out directly via phone, email, WhatsApp, or Instagram.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        <a
          href={telLink(contact.phone)}
          className="group flex items-center gap-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-xs transition hover:border-amber-400 hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition group-hover:scale-110">
            <PhoneOutlined className="text-xl text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Phone Support</div>
            <div className="mt-0.5 text-base font-bold text-neutral-900 group-hover:text-amber-600 transition">
              {contact.phone}
            </div>
          </div>
        </a>

        <a
          href={waLink(contact.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-xs transition hover:border-emerald-400 hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition group-hover:scale-110">
            <WhatsAppOutlined className="text-xl text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">WhatsApp Chat</div>
            <div className="mt-0.5 text-base font-bold text-neutral-900 group-hover:text-emerald-600 transition">
              {contact.whatsapp}
            </div>
          </div>
        </a>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-3xl border border-pink-200 bg-white p-6 shadow-xs transition hover:border-pink-400 hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 transition group-hover:scale-110">
            <InstagramOutlined className="text-xl text-pink-600" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Instagram Profile</div>
            <div className="mt-0.5 text-base font-bold text-neutral-900 group-hover:text-pink-600 transition">
              @astrologer__atul
            </div>
          </div>
        </a>

        <a
          href={`mailto:${contact.email}`}
          className="group flex items-center gap-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-xs transition hover:border-amber-400 hover:shadow-md"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition group-hover:scale-110">
            <MailOutlined className="text-xl text-amber-600" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email Query</div>
            <div className="mt-0.5 text-base font-bold text-neutral-900 group-hover:text-amber-600 transition">
              {contact.email}
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
