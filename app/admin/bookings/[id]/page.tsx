'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { App, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import { getAdminBooking, updateAdminBookingStatus } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Booking, BookingStatus, PaymentStatus } from '@/lib/types';
import { formatInr } from '@/lib/format';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function AdminBookingDetailPage(props: PageProps<'/admin/bookings/[id]'>) {
  const { id } = use(props.params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { message } = App.useApp();

  const load = () => {
    setLoading(true);
    getAdminBooking(id)
      .then(setBooking)
      .catch((err) => message.error(err instanceof ApiError ? err.message : 'Failed to load booking'))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount pattern
  useEffect(load, [id, message]);

  const updateStatus = async (data: { bookingStatus?: BookingStatus; paymentStatus?: PaymentStatus }) => {
    setSaving(true);
    try {
      const updated = await updateAdminBookingStatus(id, data);
      setBooking(updated);
      message.success('Booking updated');
    } catch (err) {
      message.error(err instanceof ApiError ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return <p className="text-neutral-500">Booking not found.</p>;
  }

  const payment = booking.payments[0];
  const screenshotUrl = payment?.paymentScreenshot
    ? `${API_BASE_URL}${payment.paymentScreenshot}`
    : null;

  return (
    <div>
      <Link href="/admin/bookings" className="text-sm text-neutral-500 hover:text-neutral-900">
        &larr; Back to Bookings
      </Link>
      <h1 className="mt-2 text-xl font-bold text-neutral-900">Booking Detail</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-900">Customer</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <Row label="Name" value={booking.user.name} />
            <Row label="Phone" value={booking.user.phone} />
            <Row label="Email" value={booking.user.email ?? '-'} />
          </dl>

          <h2 className="mt-6 font-semibold text-neutral-900">Birth Profile</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <Row label="Profile Name" value={booking.birthProfile.profileName} />
            <Row label="Date of Birth" value={dayjs(booking.birthProfile.dob).format('DD MMM YYYY')} />
            <Row label="Time of Birth" value={booking.birthProfile.timeOfBirth ?? '-'} />
            <Row label="Birth Place" value={booking.birthProfile.birthPlace} />
            <Row label="Gender" value={booking.birthProfile.gender ?? '-'} />
          </dl>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-900">Booking</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <Row
              label="Consultation"
              value={booking.category?.name ?? `${booking.comboOffer?.name ?? '-'} (Combo)`}
            />
            <Row label="Date" value={dayjs(booking.bookingDate).format('DD MMM YYYY')} />
            <Row label="Time" value={booking.slotTime} />
            <Row label="Duration" value={`${booking.durationMinutes} min`} />
            <Row label="Amount" value={formatInr(booking.amount)} />
            <Row label="Notes" value={booking.notes ?? '-'} />
          </dl>

          <h2 className="mt-6 font-semibold text-neutral-900">Payment</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <Row label="Transaction ID" value={payment?.transactionId ?? '-'} />
          </dl>
          {screenshotUrl && (
            <div className="relative mt-3 h-64 w-full overflow-hidden rounded-lg border border-neutral-200">
              <Image src={screenshotUrl} alt="Payment screenshot" fill unoptimized className="object-contain" />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div>
              <div className="text-xs text-neutral-500">Booking Status</div>
              <Select<BookingStatus>
                className="mt-1 w-40"
                value={booking.bookingStatus}
                disabled={saving}
                onChange={(value) => updateStatus({ bookingStatus: value })}
                options={['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => ({
                  value: s,
                  label: s,
                }))}
              />
            </div>
            <div>
              <div className="text-xs text-neutral-500">Payment Status</div>
              <Select<PaymentStatus>
                className="mt-1 w-40"
                value={booking.paymentStatus}
                disabled={saving}
                onChange={(value) => updateStatus({ paymentStatus: value })}
                options={['Pending', 'Paid', 'Failed'].map((s) => ({ value: s, label: s }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="font-medium text-neutral-900">{value}</dd>
    </div>
  );
}
