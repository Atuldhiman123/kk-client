'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { App, Select, Spin, Card, Tag } from 'antd';
import dayjs from 'dayjs';
import {
  ArrowLeftOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  ProfileOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  FileImageOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { getAdminBooking, updateAdminBookingStatus } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Booking, BookingStatus, PaymentStatus } from '@/lib/types';
import { formatInr } from '@/lib/format';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  Pending: 'warning',
  Confirmed: 'processing',
  Completed: 'success',
  Cancelled: 'error',
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  Pending: 'warning',
  Paid: 'success',
  Failed: 'error',
};

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
      <div className="flex justify-center items-center py-32">
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center bg-white border border-neutral-200 rounded-2xl max-w-md mx-auto mt-20">
        <p className="text-neutral-500 font-semibold">Booking not found.</p>
        <Link href="/admin/bookings" className="mt-4 inline-block text-amber-600 font-bold">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const payment = booking.payments[0];
  const screenshotUrl = payment?.paymentScreenshot
    ? `${API_BASE_URL}${payment.paymentScreenshot}`
    : null;

  return (
    <div>
      {/* Detail Page Header */}
      <div className="mb-8">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-amber-700 font-bold transition-colors"
        >
          <ArrowLeftOutlined /> Back to Bookings
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
              <span>Booking Profile</span>
              <span className="text-xs font-bold text-neutral-400 font-mono bg-neutral-100 border border-neutral-200 rounded-md px-2 py-0.5">
                ID: {booking.id.slice(0, 8).toUpperCase()}
              </span>
            </h1>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              Scheduled slot details and client specifications
            </p>
          </div>
          <div className="flex gap-2">
            <Tag color={BOOKING_STATUS_COLORS[booking.bookingStatus]} className="font-bold text-xs px-3 py-1 rounded-xl">
              {booking.bookingStatus}
            </Tag>
            <Tag color={PAYMENT_STATUS_COLORS[booking.paymentStatus]} className="font-bold text-xs px-3 py-1 rounded-xl">
              Payment: {booking.paymentStatus}
            </Tag>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Customer & Birth Profile details */}
        <Card
          title={
            <span className="flex items-center gap-2 text-neutral-950 font-extrabold">
              <UserOutlined className="text-amber-600" />
              <span>Customer &amp; Birth Details</span>
            </span>
          }
          className="shadow-2xs rounded-3xl border-neutral-200"
        >
          <div className="space-y-6">
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Contact Info</div>
              <div className="mt-3 divide-y divide-neutral-100">
                <InfoRow label="Name" value={booking.user.name} icon={<UserOutlined />} />
                <InfoRow label="Phone" value={booking.user.phone} icon={<PhoneOutlined />} />
                <InfoRow label="Email" value={booking.user.email ?? '-'} icon={<MailOutlined />} />
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Astrological Birth Profile</div>
              <div className="mt-3 divide-y divide-neutral-100">
                <InfoRow label="Profile Name" value={booking.birthProfile.profileName} icon={<UserOutlined />} />
                <InfoRow
                  label="Date of Birth"
                  value={dayjs(booking.birthProfile.dob).format('DD MMM YYYY')}
                  icon={<CalendarOutlined />}
                />
                <InfoRow label="Time of Birth" value={booking.birthProfile.timeOfBirth ?? '-'} icon={<ClockCircleOutlined />} />
                <InfoRow label="Birth Place" value={booking.birthProfile.birthPlace} icon={<EnvironmentOutlined />} />
                <InfoRow
                  label="Gender"
                  value={
                    booking.birthProfile.gender ? (
                      <Tag
                        color={booking.birthProfile.gender.toLowerCase() === 'female' ? 'pink' : 'blue'}
                        icon={booking.birthProfile.gender.toLowerCase() === 'female' ? <WomanOutlined /> : <ManOutlined />}
                        className="font-bold rounded-lg m-0"
                      >
                        {booking.birthProfile.gender}
                      </Tag>
                    ) : (
                      '-'
                    )
                  }
                  icon={<InfoCircleOutlined />}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Consultation details & billing */}
        <Card
          title={
            <span className="flex items-center gap-2 text-neutral-950 font-extrabold">
              <ProfileOutlined className="text-amber-600" />
              <span>Consultation &amp; Billing</span>
            </span>
          }
          className="shadow-2xs rounded-3xl border-neutral-200"
        >
          <div className="space-y-6">
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Session Details</div>
              <div className="mt-3 divide-y divide-neutral-100">
                <InfoRow
                  label="Consultation"
                  value={
                    <span className="text-amber-800 font-extrabold">
                      {booking.category?.name ?? `${booking.comboOffer?.name ?? '-'} (Combo)`}
                    </span>
                  }
                  icon={<TagOutlined />}
                />
                <InfoRow
                  label="Scheduled Date"
                  value={dayjs(booking.bookingDate).format('DD MMM YYYY')}
                  icon={<CalendarOutlined />}
                />
                <InfoRow label="Time Slot" value={booking.slotTime} icon={<ClockCircleOutlined />} />
                <InfoRow label="Duration" value={`${booking.durationMinutes} min`} icon={<ClockCircleOutlined />} />
                <InfoRow
                  label="Amount"
                  value={<span className="text-neutral-900 font-extrabold text-base">{formatInr(booking.amount)}</span>}
                  icon={<DollarOutlined />}
                />
                <InfoRow label="Notes" value={booking.notes ?? '-'} icon={<InfoCircleOutlined />} />
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Payment Verification</div>
              <div className="mt-3 divide-y divide-neutral-100">
                <InfoRow label="Transaction ID" value={payment?.transactionId ?? '-'} icon={<InfoCircleOutlined />} />
              </div>
              {screenshotUrl && (
                <div className="mt-4">
                  <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2 flex items-center gap-1">
                    <FileImageOutlined />
                    <span>Receipt/Screenshot</span>
                  </div>
                  <div className="relative mt-2 h-64 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-2xs group hover:border-amber-400 transition cursor-zoom-in">
                    <Image src={screenshotUrl} alt="Payment screenshot" fill unoptimized className="object-contain" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-3">Status Management</div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[140px]">
                  <div className="text-xs text-neutral-500 font-semibold mb-1.5">Booking Status</div>
                  <Select<BookingStatus>
                    className="w-full h-10"
                    value={booking.bookingStatus}
                    disabled={saving}
                    onChange={(value) => updateStatus({ bookingStatus: value })}
                    options={['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => ({
                      value: s,
                      label: s,
                    }))}
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <div className="text-xs text-neutral-500 font-semibold mb-1.5">Payment Status</div>
                  <Select<PaymentStatus>
                    className="w-full h-10"
                    value={booking.paymentStatus}
                    disabled={saving}
                    onChange={(value) => updateStatus({ paymentStatus: value })}
                    options={['Pending', 'Paid', 'Failed'].map((s) => ({ value: s, label: s }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-neutral-50 last:border-0">
      <div className="flex items-center gap-2 text-neutral-500 font-medium text-xs">
        {icon && <span className="text-neutral-400 text-sm">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="font-semibold text-neutral-900 text-xs text-right">{value}</div>
    </div>
  );
}
