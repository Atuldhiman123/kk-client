'use client';

import { MailOutlined, EnvironmentOutlined, PhoneOutlined, WhatsAppOutlined } from '@ant-design/icons';
import type { ContactInfo } from '@/lib/types';
import { telLink, waLink } from '@/lib/contact';

export function ContactSection({ contact }: { contact: ContactInfo }) {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900">Get In Touch</h2>
        <p className="mt-2 text-neutral-600">
          Have a question before booking? Reach out directly.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href={telLink(contact.phone)}
          className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 hover:border-neutral-300"
        >
          <PhoneOutlined className="text-xl" style={{ color: '#B8860B' }} />
          <div>
            <div className="text-sm font-semibold text-neutral-900">Phone</div>
            <div className="text-sm text-neutral-600">{contact.phone}</div>
          </div>
        </a>

        <a
          href={waLink(contact.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 hover:border-neutral-300"
        >
          <WhatsAppOutlined className="text-xl" style={{ color: '#25D366' }} />
          <div>
            <div className="text-sm font-semibold text-neutral-900">WhatsApp</div>
            <div className="text-sm text-neutral-600">{contact.whatsapp}</div>
          </div>
        </a>

        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 hover:border-neutral-300"
        >
          <MailOutlined className="text-xl" style={{ color: '#B8860B' }} />
          <div>
            <div className="text-sm font-semibold text-neutral-900">Email</div>
            <div className="text-sm text-neutral-600">{contact.email}</div>
          </div>
        </a>

        <a
          href={contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 hover:border-neutral-300"
        >
          <EnvironmentOutlined className="text-xl" style={{ color: '#B8860B' }} />
          <div>
            <div className="text-sm font-semibold text-neutral-900">Office Address</div>
            <div className="text-sm text-neutral-600">{contact.address}</div>
          </div>
        </a>
      </div>
    </section>
  );
}
