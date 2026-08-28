'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { App, DatePicker, Select, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { getAdminBookings } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import type { Booking, BookingStatus, PaymentStatus } from '@/lib/types';
import { formatInr } from '@/lib/format';

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
        <div className="flex flex-col">
          <div className="font-semibold text-neutral-900 text-sm">{record.user.name}</div>
          <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium mt-0.5">
            <PhoneOutlined className="text-[10px]" />
            <span>{record.user.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Consultation',
      render: (_, record) => (
        <span className="font-semibold text-neutral-800 text-sm">
          {record.category?.name ?? `${record.comboOffer?.name ?? '-'} (Combo)`}
        </span>
      ),
    },
    {
      title: 'Date & Time',
      render: (_, record) => (
        <div className="text-xs text-neutral-700 font-medium">
          <div>{dayjs(record.bookingDate).format('DD MMM YYYY')}</div>
          <div className="text-neutral-500 mt-0.5">{record.slotTime}</div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount: string) => (
        <span className="font-bold text-neutral-900">{formatInr(amount)}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'bookingStatus',
      render: (status: BookingStatus) => {
        let icon = <ClockCircleOutlined />;
        if (status === 'Confirmed') icon = <CheckCircleOutlined />;
        if (status === 'Completed') icon = <CheckSquareOutlined />;
        if (status === 'Cancelled') icon = <CloseCircleOutlined />;
        return (
          <Tag icon={icon} color={BOOKING_STATUS_COLORS[status]} className="font-bold rounded-lg px-2.5 py-1 text-xs">
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      render: (status: PaymentStatus) => {
        let icon = <ClockCircleOutlined />;
        if (status === 'Paid') icon = <DollarCircleOutlined />;
        if (status === 'Failed') icon = <CloseCircleOutlined />;
        return (
          <Tag icon={icon} color={PAYMENT_STATUS_COLORS[status]} className="font-bold rounded-lg px-2.5 py-1 text-xs">
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Link
          href={`/admin/bookings/${record.id}`}
          className="inline-flex items-center gap-1.5 font-bold text-xs px-3.5 py-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:text-amber-800 transition"
          style={{ color: '#B8860B' }}
        >
          <EyeOutlined className="text-xs" />
          <span>View Profile</span>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Bookings</h1>
        <p className="text-xs text-neutral-500 font-medium">Manage and review consultation requests and payments.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg shadow-2xs">
            <CalendarOutlined />
          </div>
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Bookings</div>
            <div className="text-2xl font-black text-neutral-900 mt-0.5">{total}</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 text-lg shadow-2xs">
            <ClockCircleOutlined />
          </div>
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Pending Review</div>
            <div className="text-2xl font-black text-neutral-900 mt-0.5">
              {bookings.filter((b) => b.bookingStatus === 'Pending').length}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 text-lg shadow-2xs">
            <CheckCircleOutlined />
          </div>
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Confirmed Slots</div>
            <div className="text-2xl font-black text-neutral-900 mt-0.5">
              {bookings.filter((b) => b.bookingStatus === 'Confirmed').length}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-lg shadow-2xs">
            <CheckSquareOutlined />
          </div>
          <div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Completed Sessions</div>
            <div className="text-2xl font-black text-neutral-900 mt-0.5">
              {bookings.filter((b) => b.bookingStatus === 'Completed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <Select<BookingStatus | undefined>
          placeholder="Booking Status"
          allowClear
          className="w-44 h-10"
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
          className="w-44 h-10"
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
          className="h-10"
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
