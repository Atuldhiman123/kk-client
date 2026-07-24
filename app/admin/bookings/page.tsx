'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { App, DatePicker, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { getAdminBookings } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Booking, BookingStatus, PaymentStatus } from '@/lib/types';
import { formatInr } from '@/lib/format';

const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  Pending: 'gold',
  Confirmed: 'blue',
  Completed: 'green',
  Cancelled: 'red',
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  Pending: 'gold',
  Paid: 'green',
  Failed: 'red',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | undefined>();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | undefined>();
  const [date, setDate] = useState<Dayjs | null>(null);
  const { message } = App.useApp();

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-filter-change pattern
    setLoading(true);
    getAdminBookings({
      bookingStatus,
      paymentStatus,
      date: date ? date.format('YYYY-MM-DD') : undefined,
      page,
      limit: 20,
    })
      .then((res) => {
        if (cancelled) return;
        setBookings(res.items);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelled) return;
        message.error(err instanceof ApiError ? err.message : 'Failed to load bookings');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingStatus, paymentStatus, date, page]);

  const columns: ColumnsType<Booking> = [
    {
      title: 'Customer',
      dataIndex: ['user', 'name'],
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.user.name}</div>
          <div className="text-xs text-neutral-500">{record.user.phone}</div>
        </div>
      ),
    },
    {
      title: 'Consultation',
      render: (_, record) => record.category?.name ?? `${record.comboOffer?.name ?? '-'} (Combo)`,
    },
    {
      title: 'Date & Time',
      render: (_, record) => (
        <span>
          {dayjs(record.bookingDate).format('DD MMM YYYY')} &middot; {record.slotTime}
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount: string) => formatInr(amount),
    },
    {
      title: 'Status',
      dataIndex: 'bookingStatus',
      render: (status: BookingStatus) => <Tag color={BOOKING_STATUS_COLORS[status]}>{status}</Tag>,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      render: (status: PaymentStatus) => <Tag color={PAYMENT_STATUS_COLORS[status]}>{status}</Tag>,
    },
    {
      title: '',
      render: (_, record) => (
        <Link href={`/admin/bookings/${record.id}`} className="font-medium" style={{ color: '#B8860B' }}>
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-neutral-900">Bookings</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <Select<BookingStatus | undefined>
          placeholder="Booking Status"
          allowClear
          className="w-44"
          value={bookingStatus}
          onChange={(value) => {
            setBookingStatus(value);
            setPage(1);
          }}
          options={['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => ({
            value: s,
            label: s,
          }))}
        />
        <Select<PaymentStatus | undefined>
          placeholder="Payment Status"
          allowClear
          className="w-44"
          value={paymentStatus}
          onChange={(value) => {
            setPaymentStatus(value);
            setPage(1);
          }}
          options={['Pending', 'Paid', 'Failed'].map((s) => ({ value: s, label: s }))}
        />
        <DatePicker
          placeholder="Filter by date"
          value={date}
          onChange={(value) => {
            setDate(value);
            setPage(1);
          }}
          format="DD-MM-YYYY"
        />
      </div>

      <Table
        className="mt-6"
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={bookings}
        pagination={{
          current: page,
          total,
          pageSize: 20,
          onChange: setPage,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}
