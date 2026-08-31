'use client';

import { InstagramOutlined, MailOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { waLink, telLink } from '@/lib/contact';

export function ContactSection({ contact }: { contact: ContactInfo }) {
  const instagramUrl = contact.instagram || 'https://www.instagram.com/astrologer__atul/';

  return (
    <section id="contact" className="bg-gradient-to-b from-orange-50/60 via-[#FFF9F2] to-[#FFF3E0]/70 py-8 sm:py-16 md:py-20 border-t border-orange-200/50">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-orange-600/10 px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-orange-950 uppercase tracking-wider border border-orange-300">
            📞 Direct Reach
          </span>
          <h2 className="mt-1.5 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 font-serif">
            Get In Touch
          </h2>
          <p className="mt-1 sm:mt-2 max-w-lg mx-auto text-xs sm:text-sm md:text-base text-neutral-600 font-medium">
            Have a question before booking? Feel free to reach out directly via phone, WhatsApp, Instagram, or email.
          </p>
        </div>

        {/* 2-Column Compact Grid on Mobile / 2-Column on Desktop */}
        <div className="mx-auto mt-5 sm:mt-10 grid max-w-4xl grid-cols-2 gap-2.5 sm:gap-5">
          <a
            href={telLink(contact.phone)}
            className="group flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-4 rounded-2xl sm:rounded-3xl border border-orange-100 bg-white p-3 sm:p-5 shadow-2xs transition hover:border-orange-400 hover:shadow-md"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-50 text-orange-600 transition group-hover:scale-110">
              <PhoneOutlined className="text-base sm:text-xl text-orange-600" />
            </div>
            <div className="min-w-0 flex-1 w-full">
              <div className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">Phone</div>
              <div className="mt-0.5 text-xs sm:text-sm md:text-base font-bold text-neutral-900 group-hover:text-orange-600 transition truncate">
                {contact.phone}
              </div>
            </div>
          </a>

          <a
            href={waLink(contact.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-4 rounded-2xl sm:rounded-3xl border border-orange-100 bg-white p-3 sm:p-5 shadow-2xs transition hover:border-emerald-400 hover:shadow-md"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:scale-110">
              <WhatsAppOutlined className="text-base sm:text-xl text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1 w-full">
              <div className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">WhatsApp</div>
              <div className="mt-0.5 text-xs sm:text-sm md:text-base font-bold text-neutral-900 group-hover:text-emerald-600 transition truncate">
                {contact.whatsapp}
              </div>
            </div>
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-4 rounded-2xl sm:rounded-3xl border border-orange-100 bg-white p-3 sm:p-5 shadow-2xs transition hover:border-pink-400 hover:shadow-md"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-pink-50 text-pink-600 transition group-hover:scale-110">
              <InstagramOutlined className="text-base sm:text-xl text-pink-600" />
            </div>
            <div className="min-w-0 flex-1 w-full">
              <div className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">Instagram</div>
              <div className="mt-0.5 text-xs sm:text-sm md:text-base font-bold text-neutral-900 group-hover:text-pink-600 transition truncate">
                @astrologer__atul
              </div>
            </div>
          </a>

          <a
            href={`mailto:${contact.email}`}
            className="group flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-4 rounded-2xl sm:rounded-3xl border border-orange-100 bg-white p-3 sm:p-5 shadow-2xs transition hover:border-orange-400 hover:shadow-md"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-50 text-orange-600 transition group-hover:scale-110">
              <MailOutlined className="text-base sm:text-xl text-orange-600" />
            </div>
            <div className="min-w-0 flex-1 w-full">
              <div className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400">Email</div>
              <div className="mt-0.5 text-xs sm:text-sm md:text-base font-bold text-neutral-900 group-hover:text-orange-600 transition truncate">
                {contact.email}
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
