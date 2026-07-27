'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { App, Button, Form, Steps } from 'antd';
import type { ComboOffer, ConsultationCategory, CreateBookingPayload, PaymentConfig } from '@/lib/types';
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

export function BookingForm({ categories, combos, paymentConfig }: Props) {
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

  const goNext = async () => {
    try {
      await form.validateFields(STEP_FIELDS[current]);
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
      transactionId: values.transactionId || undefined,
      paymentScreenshot: values.paymentScreenshot ?? 'demo-screenshot',
    };

    setSubmitting(true);
    try {
      const booking = await createBooking(payload);
      message.success('Booking submitted successfully!');
      router.push(`/booking/success/${booking.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-white p-6 shadow-xl sm:p-10">
      <div className="mb-8">
        <Steps
          current={current}
          size="small"
          items={STEP_TITLES.map((title) => ({ title }))}
          className="booking-steps"
        />
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
            className="!rounded-full !bg-amber-600 !px-8 !font-bold hover:!bg-amber-700"
          >
            Next Step &rarr;
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            loading={submitting}
            onClick={handleSubmit}
            className="!rounded-full !bg-gradient-to-r !from-amber-600 !to-amber-700 !px-8 !font-bold hover:!from-amber-700 hover:!to-amber-800"
          >
            Confirm &amp; Submit Booking ✨
          </Button>
        )}
      </div>
    </div>
  );
}
