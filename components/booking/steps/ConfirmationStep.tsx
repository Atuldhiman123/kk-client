'use client';

import { Alert, Form, type FormInstance } from 'antd';
import type { Dayjs } from 'dayjs';
import type { ComboOffer, ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { useLanguage, getLocalizedCategoryName, getLocalizedComboTitle } from '@/lib/i18n';

interface Props {
  form: FormInstance;
  categories: ConsultationCategory[];
  combos: ComboOffer[];
  error: string | null;
}

export function ConfirmationStep({ form, categories, combos, error }: Props) {
  const { locale, t } = useLanguage();
  const values = Form.useWatch([], form) as
    | {
        name?: string;
        phone?: string;
        email?: string;
        profileName?: string;
        dob?: Dayjs;
        birthTime?: Dayjs;
        birthPlace?: string;
        gender?: string;
        selection?: string;
        bookingDate?: Dayjs;
        slot?: string;
        paymentMethod?: 'UPI' | 'Razorpay';
      }
    | undefined;

  const selectedCategory = values?.selection?.startsWith('category:')
    ? categories.find((c) => c.id === values.selection?.split(':')[1])
    : undefined;
  const selectedCombo = values?.selection?.startsWith('combo:')
    ? combos.find((c) => c.id === values.selection?.split(':')[1])
    : undefined;

  const personalRows: [string, string][] = [
    [t.booking.label_full_name, values?.name ?? '-'],
    [t.booking.label_phone, values?.phone ?? '-'],
    ...(values?.email ? ([[t.booking.label_email, values.email]] as [string, string][]) : []),
    [t.booking.label_consultation_for, values?.profileName ?? 'Self'],
    [
      t.booking.label_dob_time,
      values?.dob
        ? `${values.dob.format('DD MMM YYYY')}${values.birthTime ? ', ' + values.birthTime.format('hh:mm A') : ''}`
        : '-',
    ],
    [t.booking.label_birth_place, values?.birthPlace ?? '-'],
  ];

  const bookingRows: [string, string][] = [
    [
      t.booking.label_consultation,
      selectedCategory
        ? getLocalizedCategoryName(selectedCategory, locale)
        : selectedCombo
        ? `${getLocalizedComboTitle(selectedCombo, locale)} (${t.booking.badge_combo})`
        : '-',
    ],
    [t.booking.label_appointment_date, values?.bookingDate ? values.bookingDate.format('DD MMMM YYYY') : '-'],
    [t.booking.label_time_slot, values?.slot ?? '-'],
    [t.booking.label_payment_mode, values?.paymentMethod === 'Razorpay' ? t.booking.payment_razorpay : t.booking.payment_upi],
    [
      t.booking.label_total_amount,
      formatInr(selectedCategory ? selectedCategory.price : (selectedCombo?.discountedPrice ?? 0)),
    ],
  ];

  return (
    <div className="space-y-3">
      {/* 1. Personal & Kundli Details Summary */}
      <div className="overflow-hidden rounded-2xl border border-orange-200/80 bg-white shadow-2xs">
        <div className="bg-orange-50/60 px-3 py-1.5 border-b border-orange-100 text-[11px] font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1.5">
          <span>{t.booking.confirm_contact_header}</span>
        </div>
        <div>
          {personalRows.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center border-b border-orange-50 px-3 py-1.5 sm:py-2 last:border-0 text-xs sm:text-sm"
            >
              <span className="text-neutral-500 font-medium">{label}</span>
              <span className="font-semibold text-neutral-900 text-right truncate max-w-[62%]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Session & Appointment Summary */}
      <div className="overflow-hidden rounded-2xl border border-orange-200/80 bg-white shadow-2xs">
        <div className="bg-orange-50/60 px-3 py-1.5 border-b border-orange-100 text-[11px] font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1.5">
          <span>{t.booking.confirm_appointment_header}</span>
        </div>
        <div>
          {bookingRows.map(([label, value], idx) => {
            const isLast = idx === bookingRows.length - 1;
            return (
              <div
                key={label}
                className={`flex justify-between items-center border-b border-orange-50 px-3 py-1.5 sm:py-2 last:border-0 text-xs sm:text-sm ${
                  isLast ? 'bg-orange-50/40 font-bold' : ''
                }`}
              >
                <span className={`${isLast ? 'text-orange-950 font-bold' : 'text-neutral-500 font-medium'}`}>
                  {label}
                </span>
                <span
                  className={`text-right truncate max-w-[62%] ${
                    isLast ? 'text-orange-600 font-black text-sm sm:text-base' : 'font-semibold text-neutral-900'
                  }`}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {error && <Alert type="error" message={error} showIcon className="!rounded-xl !py-1.5 !text-xs" />}

      <p className="text-[10px] sm:text-[11px] text-neutral-500 leading-tight px-1 text-center">
        {t.booking.confidential_disclaimer}
      </p>
    </div>
  );
}
