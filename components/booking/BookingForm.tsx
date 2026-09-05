'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { App, Button, Form } from 'antd';
import type { ComboOffer, ConsultationCategory, CreateBookingPayload, PaymentConfig } from '../../lib/types';
import { ApiError, createBooking } from '@/lib/api';
import { PersonalDetailsStep } from './steps/PersonalDetailsStep';
import { ConsultationStep } from './steps/ConsultationStep';
import { PaymentStep } from './steps/PaymentStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { useLanguage } from '@/lib/i18n';
import type { Dayjs } from 'dayjs';

interface Props {
  categories: ConsultationCategory[];
  combos: ComboOffer[];
  paymentConfig: PaymentConfig | null;
  isModal?: boolean;
}

interface BookingFormValues {
  name: string;
  phone: string;
  email?: string;
  profileName: string;
  dob: Dayjs;
  birthTime: Dayjs;
  birthPlace: string;
  gender?: string;
  selection: string;
  bookingDate: Dayjs;
  slot: string;
  paymentMethod: 'UPI' | 'Razorpay';
  transactionId?: string;
  paymentScreenshot: string;
}

const STEP_FIELDS: (keyof BookingFormValues)[][] = [
  ['name', 'phone', 'email', 'profileName', 'dob', 'birthTime', 'birthPlace'],
  ['selection', 'bookingDate', 'slot'],
  ['paymentMethod', 'transactionId', 'paymentScreenshot'],
  [],
];

export function BookingForm({ categories, combos, paymentConfig, isModal }: Props) {
  const [form] = Form.useForm<BookingFormValues>();
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const { t } = useLanguage();

  const stepTitles = t.booking.steps || ['Details', 'Session & Slot', 'Payment', 'Confirm'];

  useEffect(() => {
    const categorySlug = searchParams.get('category');
    const comboSlug = searchParams.get('combo');

    if (categorySlug) {
      const match = categories.find((c) => c.slug === categorySlug);
      if (match) form.setFieldValue('selection', `category:${match.id}`);
    } else if (comboSlug) {
      const match = combos.find((c) => c.slug === comboSlug);
      if (match) form.setFieldValue('selection', `combo:${match.id}`);
    }
  }, [categories, combos, searchParams, form]);

  useEffect(() => {
    const handleCategoryEvent = (e: any) => {
      const slug = e.detail?.categorySlug;
      if (slug) {
        const match = categories.find((c) => c.slug === slug);
        if (match) {
          form.setFieldValue('selection', `category:${match.id}`);
        }
      }
    };
    window.addEventListener('select-booking-category', handleCategoryEvent);
    return () => window.removeEventListener('select-booking-category', handleCategoryEvent);
  }, [categories, form]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const goNext = async () => {
    try {
      const paymentMethod = form.getFieldValue('paymentMethod') ?? 'UPI';
      let fields = STEP_FIELDS[current];
      if (current === 2 && paymentMethod === 'Razorpay') {
        fields = ['paymentMethod'];
      }
      await form.validateFields(fields);
      setCurrent((c) => c + 1);
    } catch {
      // validation errors are shown inline by AntD
    }
  };

  const goBack = () => setCurrent((c) => c - 1);

  const handleSubmit = async () => {
    setError(null);
    try {
      await form.validateFields();
    } catch {
      return;
    }

    const values = form.getFieldsValue(true) as BookingFormValues;
    const [type, id] = (values.selection || '').split(':');

    const rawPhone = (values.phone || '').trim();
    const formattedPhone = rawPhone.startsWith('+')
      ? rawPhone
      : rawPhone.length === 10
      ? `+91${rawPhone}`
      : rawPhone;

    const payload: CreateBookingPayload = {
      name: values.name.trim(),
      phone: formattedPhone,
      email: values.email?.trim() || undefined,
      profileName: (values.profileName || values.name).trim(),
      dob: values.dob.format('YYYY-MM-DD'),
      birthTime: values.birthTime ? values.birthTime.format('HH:mm') : undefined,
      birthPlace: values.birthPlace,
      gender: values.gender,
      categoryId: type === 'category' ? id : undefined,
      comboOfferId: type === 'combo' ? id : undefined,
      bookingDate: values.bookingDate.format('YYYY-MM-DD'),
      slot: values.slot,
      paymentMethod: values.paymentMethod ?? 'UPI',
      transactionId: values.paymentMethod === 'Razorpay' ? undefined : (values.transactionId || undefined),
      paymentScreenshot: values.paymentMethod === 'Razorpay' ? undefined : values.paymentScreenshot,
    };

    setSubmitting(true);
    try {
      const booking = await createBooking(payload);

      if (values.paymentMethod === 'Razorpay' && (booking as any).razorpayOrder) {
        const order = (booking as any).razorpayOrder;

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError(t.booking.razorpay_sdk_error);
          setSubmitting(false);
          return;
        }

        const options = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'Kundli Kendra',
          description: 'Astro Consultation Session',
          order_id: order.id,
          handler: async (response: any) => {
            setSubmitting(true);
            try {
              const { verifyRazorpayPayment } = await import('@/lib/api');
              await verifyRazorpayPayment({
                bookingId: booking.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              message.success(t.booking.payment_verified_msg);
              router.push(`/booking/success/${booking.id}`);
            } catch (err: any) {
              setError(err instanceof ApiError ? err.message : t.booking.payment_failed);
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: values.name,
            email: values.email || '',
            contact: values.phone,
          },
          theme: {
            color: '#EA580C',
          },
          modal: {
            ondismiss: () => {
              setError(t.booking.payment_cancelled);
              setSubmitting(false);
            },
          },
        };

        const rzpay = new (window as any).Razorpay(options);
        rzpay.open();
      } else {
        message.success(t.booking.booking_success_msg);
        router.push(`/booking/success/${booking.id}`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.booking.generic_error);
      setSubmitting(false);
    }
  };

  const wrapperClass = isModal
    ? 'mx-auto max-w-2xl p-2 sm:p-4 bg-[#FFFDF9]'
    : 'mx-auto max-w-2xl rounded-2xl sm:rounded-3xl border border-orange-200 bg-[#FFFDF9] p-3.5 sm:p-7 md:p-8 shadow-lg';

  return (
    <div className={wrapperClass}>
      {/* 4-Step Stepper Header */}
      <div className="mb-4 sm:mb-6 select-none">
        {/* Desktop Stepper */}
        <div className="hidden sm:flex items-center justify-between">
          {stepTitles.map((title, idx) => {
            const isCompleted = current > idx;
            const isActive = current === idx;
            const isLast = idx === stepTitles.length - 1;

            return (
              <div key={title} className={`flex items-center ${isLast ? 'flex-none' : 'flex-1'}`}>
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-orange-600 text-white border-2 border-orange-600 shadow-xs'
                        : isActive
                        ? 'bg-orange-100 text-orange-950 border-2 border-orange-600 scale-105 shadow-sm ring-4 ring-orange-500/15'
                        : 'bg-neutral-50 text-neutral-400 border-2 border-neutral-200'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-bold transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-orange-950 font-black'
                        : isCompleted
                        ? 'text-neutral-700 font-bold'
                        : 'text-neutral-400 font-semibold'
                    }`}
                  >
                    {title}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`h-[2px] flex-1 mx-3 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-orange-500' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper */}
        <div className="flex sm:hidden flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
            <span className="text-orange-800 font-bold text-[11px]">
              {t.booking.step_label} {current + 1} {t.booking.step_of} {stepTitles.length}
            </span>
            <span className="text-neutral-900 font-black text-xs flex items-center gap-1">
              <span>{stepTitles[current]}</span>
            </span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / stepTitles.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        preserve
        className="[&_.ant-form-item]:!mb-2.5 sm:[&_.ant-form-item]:!mb-3.5 [&_.ant-form-item-label]:!pb-0.5 [&_.ant-form-item-label_label]:!text-xs sm:[&_.ant-form-item-label_label]:!text-sm [&_.ant-form-item-label_label]:!font-semibold"
      >
        <div className={current === 0 ? '' : 'hidden'}>
          <PersonalDetailsStep />
        </div>
        <div className={current === 1 ? '' : 'hidden'}>
          <ConsultationStep form={form} categories={categories} combos={combos} />
        </div>
        <div className={current === 2 ? '' : 'hidden'}>
          <PaymentStep form={form} paymentConfig={paymentConfig} />
        </div>
        <div className={current === 3 ? '' : 'hidden'}>
          <ConfirmationStep form={form} categories={categories} combos={combos} error={error} />
        </div>
      </Form>

      {/* Navigation Buttons */}
      <div className="mt-4 sm:mt-6 flex items-center justify-between gap-2.5 border-t border-orange-100 pt-3.5 sm:pt-4">
        <Button
          size="middle"
          onClick={goBack}
          disabled={current === 0}
          className="!rounded-full !px-4 sm:!px-6 !text-xs sm:!text-sm !h-8.5 sm:!h-10 shrink-0 font-bold border border-orange-200"
        >
          {t.booking.btn_back}
        </Button>
        {current < stepTitles.length - 1 ? (
          <Button
            type="primary"
            size="middle"
            onClick={goNext}
            className="!rounded-full !bg-orange-600 !px-5 sm:!px-8 !font-bold hover:!bg-orange-700 !text-xs sm:!text-sm !h-8.5 sm:!h-10 flex-1 sm:flex-none justify-center shadow-xs"
          >
            {t.booking.btn_next}
          </Button>
        ) : (
          <Button
            type="primary"
            size="middle"
            loading={submitting}
            onClick={handleSubmit}
            className="!rounded-full !bg-gradient-to-r !from-orange-500 !to-red-600 !px-5 sm:!px-8 !font-bold hover:!from-orange-600 hover:!to-red-700 !text-xs sm:!text-sm !h-8.5 sm:!h-10 flex-1 sm:flex-none justify-center shadow-sm"
          >
            {t.booking.btn_submit}
          </Button>
        )}
      </div>
    </div>
  );
}
