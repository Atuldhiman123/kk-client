'use client';

import { useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import type { Booking, ContactInfo } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { telLink, waLink } from '@/lib/contact';
import { useLanguage, getLocalizedCategoryName, getLocalizedComboTitle } from '@/lib/i18n';

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Failed: 'bg-rose-100 text-rose-800 border-rose-200',
};

interface Props {
  booking: Booking;
  contact: ContactInfo;
}

export function BookingSuccessClient({ booking, contact }: Props) {
  const { locale, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const consultationName = booking.category
    ? getLocalizedCategoryName(booking.category, locale)
    : booking.comboOffer
    ? `${getLocalizedComboTitle(booking.comboOffer, locale)} (${t.booking.badge_combo})`
    : '-';

  const paymentStatus = booking.payments[0]?.status ?? booking.paymentStatus;

  const localizedPaymentStatus = locale === 'hi'
    ? paymentStatus === 'Paid'
      ? 'सफल (Paid) ✅'
      : paymentStatus === 'Pending'
      ? 'प्रक्रियाधीन (Pending)'
      : 'असफल (Failed)'
    : paymentStatus === 'Paid'
    ? 'Paid ✅'
    : paymentStatus;

  const handleCopyId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(booking.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = locale === 'hi'
    ? `नमस्ते Kundli Kendra, मैंने परामर्श बुक किया है!

📌 Booking ID: ${booking.id}
👤 नाम: ${booking.user.name}
📅 दिनांक: ${dayjs(booking.bookingDate).format('DD MMM YYYY')}
⏰ समय: ${booking.slotTime}
✨ परामर्श: ${consultationName}
💰 शुल्क: ${formatInr(booking.amount)}`
    : `Hi Kundli Kendra, I have booked a consultation!

📌 Booking ID: ${booking.id}
👤 Name: ${booking.user.name}
📅 Date: ${dayjs(booking.bookingDate).format('DD MMM YYYY')}
⏰ Time: ${booking.slotTime}
✨ Session: ${consultationName}
💰 Fee: ${formatInr(booking.amount)}`;

  return (
    <div className="mx-auto max-w-2xl px-3.5 py-8 sm:py-14 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-100 bg-white p-6 sm:p-10 text-center shadow-xl shadow-orange-950/5">
        
        {/* Top Decorative Gradient Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

        {/* Celebratory Icon */}
        <div className="mx-auto relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 ring-8 ring-emerald-50">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Badge */}
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {locale === 'hi' ? 'बुकिंग सफलतापूर्वक स्वीकृत' : 'Booking Confirmed'}
        </div>

        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-neutral-900 font-serif tracking-tight">
          {t.booking_success_page.title}
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
          {t.booking_success_page.subtitle_prefix}{' '}
          <span className="font-bold text-neutral-900">{booking.user.name}</span>
          {t.booking_success_page.subtitle_suffix}
        </p>

        {/* Details Card */}
        <div className="mt-6 sm:mt-8 overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/60 shadow-xs text-left">
          <div className="divide-y divide-neutral-200/60">
            {/* Booking ID with Copy button */}
            <div className="flex justify-between items-center px-4 py-3 sm:py-3.5 bg-white">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium flex items-center gap-1.5">
                <span>🆔</span> {t.booking_success_page.booking_id}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded max-w-[180px] sm:max-w-[240px] truncate">
                  {booking.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="cursor-pointer text-[11px] font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200/60 px-2 py-0.5 rounded transition-colors"
                  title="Copy ID"
                >
                  {copied ? (locale === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (locale === 'hi' ? 'कॉपी' : 'Copy')}
                </button>
              </div>
            </div>

            {/* Consultation Name */}
            <div className="flex justify-between items-center px-4 py-3 sm:py-3.5">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium flex items-center gap-1.5">
                <span>🕉️</span> {t.booking_success_page.consultation}
              </span>
              <span className="text-xs sm:text-sm font-bold text-orange-600 text-right truncate max-w-[65%]">
                {consultationName}
              </span>
            </div>

            {/* Date */}
            <div className="flex justify-between items-center px-4 py-3 sm:py-3.5 bg-white">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium flex items-center gap-1.5">
                <span>📅</span> {t.booking_success_page.date}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-900 text-right">
                {dayjs(booking.bookingDate).format('DD MMMM YYYY')}
              </span>
            </div>

            {/* Time Slot */}
            <div className="flex justify-between items-center px-4 py-3 sm:py-3.5">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium flex items-center gap-1.5">
                <span>⏰</span> {t.booking_success_page.time}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-900 bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-0.5 rounded-md">
                {booking.slotTime}
              </span>
            </div>

            {/* Amount */}
            <div className="flex justify-between items-center px-4 py-3 sm:py-3.5 bg-white">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium flex items-center gap-1.5">
                <span>💳</span> {t.booking_success_page.amount}
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900">
                {formatInr(booking.amount)}
              </span>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between px-4 py-3 sm:py-3.5 bg-neutral-50/80">
              <span className="text-xs sm:text-sm text-neutral-500 font-medium">
                {t.booking_success_page.payment_status}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold border shadow-2xs ${
                  PAYMENT_STATUS_STYLES[paymentStatus] ?? 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                {localizedPaymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Guidance Note Box */}
        <div className="mt-5 rounded-xl bg-amber-50/70 border border-amber-200/60 p-3.5 sm:p-4 text-left flex items-start gap-3">
          <span className="text-lg leading-none mt-0.5">🔔</span>
          <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            <strong className="font-semibold block mb-0.5">
              {locale === 'hi' ? 'महत्वपूर्ण सूचना:' : 'Next Steps:'}
            </strong>
            {locale === 'hi'
              ? 'हमारे वरिष्ठ ज्योतिषाचार्य निर्धारित समय पर आपसे सीधे कॉल या WhatsApp पर संपर्क करेंगे।'
              : 'Our expert astrologer will connect with you via Call or WhatsApp at your scheduled slot.'}
          </div>
        </div>

        {/* Contact CTAs */}
        {contact && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <a
              href={waLink(contact.whatsapp, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-102 hover:shadow-lg active:scale-98"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{t.booking_success_page.whatsapp_contact_btn}</span>
            </a>
            <a
              href={telLink(contact.phone)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-7 py-3.5 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs hover:border-orange-400 hover:bg-neutral-50 transition-all"
            >
              <span>📞</span>
              <span>{t.booking_success_page.call_now_btn}</span>
            </a>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="mt-8 pt-5 border-t border-neutral-100 flex justify-center">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-1.5 transition-colors"
          >
            <span>←</span> {t.booking_success_page.back_to_home}
          </Link>
        </div>
      </div>
    </div>
  );
}
