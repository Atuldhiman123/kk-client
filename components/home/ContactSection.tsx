'use client';

import { InstagramOutlined, MailOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

export function ContactSection({ contact }: { contact: ContactInfo }) {
  const instagramUrl = contact.instagram || 'https://www.instagram.com/astrologer__atul/';

  return (
    <section id="contact" className="bg-gradient-to-b from-orange-50/60 via-[#FFF9F2] to-[#FFF3E0]/70 py-20 border-t border-orange-200/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-655/10 px-4 py-1.5 text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            📞 Direct Reach
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl font-serif">Get In Touch</h2>
          <p className="mt-3 max-w-xl mx-auto text-base text-neutral-700 font-medium">
            Have a question before booking? Feel free to reach out directly via phone, email, WhatsApp, or Instagram.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          <a
            href={telLink(contact.phone)}
            className="group flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-xs transition hover:border-orange-400 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition group-hover:scale-110">
              <PhoneOutlined className="text-xl text-orange-600" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Phone Support</div>
              <div className="mt-0.5 text-base font-bold text-neutral-900 group-hover:text-orange-600 transition">
                {contact.phone}
              </div>
            </div>
          </a>

          <a
            href={waLink(contact.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-xs transition hover:border-emerald-400 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:scale-110">
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
            className="group flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-xs transition hover:border-pink-400 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 transition group-hover:scale-110">
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
            className="group flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-xs transition hover:border-orange-400 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition group-hover:scale-110">
              <MailOutlined className="text-xl text-orange-600" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Email Query</div>
              <div className="mt-0.5 text-base font-bold text-neutral-900 group-hover:text-orange-600 transition">
                {contact.email}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
