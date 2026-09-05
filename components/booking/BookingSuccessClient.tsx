'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import type { Booking, ContactInfo } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { telLink, waLink } from '@/lib/contact';
import { useLanguage, getLocalizedCategoryName, getLocalizedComboTitle } from '@/lib/i18n';

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Paid: 'bg-green-100 text-green-800',
  Failed: 'bg-red-100 text-red-800',
};

interface Props {
  booking: Booking;
  contact: ContactInfo;
}

export function BookingSuccessClient({ booking, contact }: Props) {
  const { locale, t } = useLanguage();

  const consultationName = booking.category
    ? getLocalizedCategoryName(booking.category, locale)
    : booking.comboOffer
    ? `${getLocalizedComboTitle(booking.comboOffer, locale)} (${t.booking.badge_combo})`
    : '-';

  const paymentStatus = booking.payments[0]?.status ?? booking.paymentStatus;

  const localizedPaymentStatus = locale === 'hi'
    ? paymentStatus === 'Paid'
      ? 'सफल (Paid)'
      : paymentStatus === 'Pending'
      ? 'सत्यापन प्रक्रियाधीन (Pending)'
      : 'असफल (Failed)'
    : paymentStatus;

  const whatsappMessage = locale === 'hi'
    ? `नमस्ते Kundli Kendra, मैंने परामर्श बुक किया है!\n\n📌 Booking ID: ${booking.id}\n👤 नाम: ${booking.user.name}\n📅 दिनांक: ${dayjs(booking.bookingDate).format('DD MMM YYYY')}\n⏰ समय: ${booking.slotTime}\n✨ परामर्श: ${consultationName}\n💰 शुल्क: ${formatInr(booking.amount)}`
    : `Hi Kundli Kendra, I have booked a consultation!\n\n📌 Booking ID: ${booking.id}\n👤 Name: ${booking.user.name}\n📅 Date: ${dayjs(booking.bookingDate).format('DD MMM YYYY')}\n⏰ Time: ${booking.slotTime}\n✨ Session: ${consultationName}\n💰 Fee: ${formatInr(booking.amount)}`;

  return (
    <div className="mx-auto max-w-2xl px-3.5 py-10 sm:py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl sm:rounded-3xl border border-neutral-200 bg-white p-5 sm:p-8 text-center shadow-md">
        <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100 text-2xl sm:text-3xl">
          ✅
        </div>
        <h1 className="mt-4 text-xl sm:text-2xl font-bold text-neutral-900 font-serif">
          {t.booking_success_page.title}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {t.booking_success_page.subtitle_prefix} <span className="font-semibold text-neutral-800">{booking.user.name}</span>
          {t.booking_success_page.subtitle_suffix}
        </p>

        <div className="mt-6 sm:mt-8 overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 text-left bg-neutral-50/50">
          {[
            [t.booking_success_page.booking_id, booking.id],
            [t.booking_success_page.consultation, consultationName],
            [t.booking_success_page.date, dayjs(booking.bookingDate).format('DD MMM YYYY')],
            [t.booking_success_page.time, booking.slotTime],
            [t.booking_success_page.amount, formatInr(booking.amount)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center border-b border-neutral-200/60 px-3.5 sm:px-4 py-2.5 sm:py-3 last:border-0">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium">{label}</span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-900 text-right truncate max-w-[60%]">{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3">
            <span className="text-xs sm:text-sm text-neutral-500 font-medium">{t.booking_success_page.payment_status}</span>
            <span
              className={`rounded-full px-2.5 sm:px-3 py-0.5 text-xs font-semibold ${
                PAYMENT_STATUS_STYLES[paymentStatus] ?? 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {localizedPaymentStatus}
            </span>
          </div>
        </div>

        {booking.user?.email && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-orange-50/80 border border-orange-200/70 px-4 py-2.5 text-xs sm:text-sm text-orange-950">
            <span>📧</span>
            <span>
              {t.booking_success_page.email_sent_to} <strong className="font-semibold">{booking.user.email}</strong>
            </span>
          </div>
        )}

        {contact && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
            <a
              href={waLink(contact.whatsapp, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition-transform hover:scale-102 active:scale-98"
              style={{ backgroundColor: '#25D366' }}
            >
              <span aria-hidden>💬</span> {t.booking_success_page.whatsapp_contact_btn}
            </a>
            <a
              href={telLink(contact.phone)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs hover:border-orange-400 transition-colors"
            >
              <span aria-hidden>📞</span> {t.booking_success_page.call_now_btn}
            </a>
          </div>
        )}

        <div className="mt-7 pt-4 border-t border-neutral-100 flex justify-center">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1.5 transition-colors"
          >
            {t.booking_success_page.back_to_home}
          </Link>
        </div>
      </div>
    </div>
  );
}
