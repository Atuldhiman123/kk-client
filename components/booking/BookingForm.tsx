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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const [type, id] = values.selection.split(':');

    const payload: CreateBookingPayload = {
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
      profileName: values.profileName,
      dob: values.dob.format('YYYY-MM-DD'),
      birthTime: values.birthTime ? values.birthTime.format('HH:mm') : undefined,
      birthPlace: values.birthPlace,
      gender: values.gender,
      categoryId: type === 'category' ? id : undefined,
      comboOfferId: type === 'combo' ? id : undefined,
      bookingDate: values.bookingDate.format('YYYY-MM-DD'),
      slot: values.slot,
      transactionId: values.transactionId || undefined,
      paymentScreenshot: values.paymentScreenshot,
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
    <div className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <Steps
        current={current}
        size="small"
        items={STEP_TITLES.map((title) => ({ title }))}
        className="mb-8"
      />

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

      <div className="mt-8 flex justify-between">
        <Button size="large" onClick={goBack} disabled={current === 0}>
          Back
        </Button>
        {current < STEP_TITLES.length - 1 ? (
          <Button type="primary" size="large" onClick={goNext}>
            Next
          </Button>
        ) : (
          <Button type="primary" size="large" loading={submitting} onClick={handleSubmit}>
            Submit Booking
          </Button>
        )}
      </div>
    </div>
  );
}
