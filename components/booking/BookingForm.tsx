'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { App, Button, Form } from 'antd';
import type { ComboOffer, ConsultationCategory, CreateBookingPayload, PaymentConfig } from '../../lib/types';
import { ApiError, createBooking } from '@/lib/api';
import { PersonalDetailsStep } from './steps/PersonalDetailsStep';
import { BirthDetailsStep } from './steps/BirthDetailsStep';
import { ConsultationStep } from './steps/ConsultationStep';
import { SlotStep } from './steps/SlotStep';
import { PaymentStep } from './steps/PaymentStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
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
  birthTime?: Dayjs;
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
  ['name', 'phone', 'email'],
  ['profileName', 'dob', 'birthTime', 'birthPlace', 'gender'],
  ['selection'],
  ['bookingDate', 'slot'],
  ['transactionId', 'paymentScreenshot'],
  [],
];

const STEP_TITLES = ['Personal', 'Birth Details', 'Consultation', 'Slot', 'Payment', 'Confirm'];

export function BookingForm({ categories, combos, paymentConfig, isModal }: Props) {
  const [form] = Form.useForm<BookingFormValues>();
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = App.useApp();

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
      if (current === 4 && paymentMethod === 'Razorpay') {
        fields = [];
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
    const [type, id] = values.selection ? values.selection.split(':') : ['category', categories[0]?.id ?? 'cat-1'];

    const payload: CreateBookingPayload = {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      profileName: values.profileName,
      dob: values.dob ? values.dob.format('YYYY-MM-DD') : '1995-01-01',
      birthTime: values.birthTime ? values.birthTime.format('HH:mm') : undefined,
      birthPlace: values.birthPlace,
      gender: values.gender,
      categoryId: type === 'category' ? id : undefined,
      comboOfferId: type === 'combo' ? id : undefined,
      bookingDate: values.bookingDate ? values.bookingDate.format('YYYY-MM-DD') : new Date().toISOString().split('T')[0],
      slot: values.slot ?? '11:30 AM',
      paymentMethod: values.paymentMethod ?? 'UPI',
      transactionId: values.paymentMethod === 'Razorpay' ? undefined : (values.transactionId || undefined),
      paymentScreenshot: values.paymentMethod === 'Razorpay' ? undefined : (values.paymentScreenshot ?? 'demo-screenshot'),
    };

    setSubmitting(true);
    try {
      const booking = await createBooking(payload);

      if (values.paymentMethod === 'Razorpay' && (booking as any).razorpayOrder) {
        const order = (booking as any).razorpayOrder;

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError('Failed to load Razorpay SDK. Please check your internet connection.');
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
              message.success('Payment verified & booking confirmed successfully!');
              router.push(`/booking/success/${booking.id}`);
            } catch (err: any) {
              setError(err instanceof ApiError ? err.message : 'Payment verification failed. Please contact support.');
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
              setError('Payment process was cancelled. You can try confirming again.');
              setSubmitting(false);
            }
          }
        };

        const rzpay = new (window as any).Razorpay(options);
        rzpay.open();
      } else {
        message.success('Booking submitted successfully!');
        router.push(`/booking/success/${booking.id}`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const wrapperClass = isModal
    ? 'mx-auto max-w-2xl p-4 sm:p-6 bg-[#FFFDF9]'
    : 'mx-auto max-w-2xl rounded-3xl border border-orange-200 bg-[#FFFDF9] p-6 shadow-xl sm:p-10';

  return (
    <div className={wrapperClass}>
      {/* Custom Stepper */}
      <div className="mb-8 select-none">
        {/* Desktop Stepper */}
        <div className="hidden md:flex items-center justify-between">
          {STEP_TITLES.map((title, idx) => {
            const isCompleted = current > idx;
            const isActive = current === idx;
            const isLast = idx === STEP_TITLES.length - 1;

            return (
              <div key={title} className={`flex items-center ${isLast ? 'flex-none' : 'flex-1'}`}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-orange-600 text-white border-2 border-orange-600 shadow-xs'
                        : isActive
                        ? 'bg-orange-100 text-orange-950 border-2 border-orange-600 scale-102 shadow-sm ring-4 ring-orange-500/15'
                        : 'bg-neutral-50 text-neutral-400 border-2 border-neutral-200'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-bold transition-colors whitespace-nowrap ${
                      isActive ? 'text-orange-950 font-black' : isCompleted ? 'text-neutral-700 font-bold' : 'text-neutral-400 font-semibold'
                    }`}
                  >
                    {title}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`h-[2px] flex-1 mx-2.5 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-orange-500' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Stepper */}
        <div className="flex md:hidden flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
            <span className="text-orange-800">Step {current + 1} of {STEP_TITLES.length}</span>
            <span className="text-neutral-900 font-black">{STEP_TITLES[current]}</span>
          </div>
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / STEP_TITLES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <Form form={form} layout="vertical" requiredMark="optional" preserve>
        <div className={current === 0 ? '' : 'hidden'}>
          <PersonalDetailsStep />
        </div>
        <div className={current === 1 ? '' : 'hidden'}>
          <BirthDetailsStep />
        </div>
        <div className={current === 2 ? '' : 'hidden'}>
          <ConsultationStep form={form} categories={categories} combos={combos} />
        </div>
        <div className={current === 3 ? '' : 'hidden'}>
          <SlotStep form={form} />
        </div>
        <div className={current === 4 ? '' : 'hidden'}>
          <PaymentStep form={form} paymentConfig={paymentConfig} />
        </div>
        <div className={current === 5 ? '' : 'hidden'}>
          <ConfirmationStep form={form} categories={categories} combos={combos} error={error} />
        </div>
      </Form>

      <div className="mt-10 flex justify-between border-t border-neutral-100 pt-6">
        <Button size="large" onClick={goBack} disabled={current === 0} className="!rounded-full !px-6">
          Back
        </Button>
        {current < STEP_TITLES.length - 1 ? (
          <Button
            type="primary"
            size="large"
            onClick={goNext}
            className="!rounded-full !bg-orange-600 !px-8 !font-bold hover:!bg-orange-700"
          >
            Next Step &rarr;
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            loading={submitting}
            onClick={handleSubmit}
            className="!rounded-full !bg-gradient-to-r !from-orange-500 !to-red-600 !px-8 !font-bold hover:!from-orange-600 hover:!to-red-700"
          >
            Confirm &amp; Submit Booking ✨
          </Button>
        )}
      </div>
    </div>
  );
}
