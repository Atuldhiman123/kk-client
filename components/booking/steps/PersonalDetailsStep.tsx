'use client';

import { DatePicker, Form, Input, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';

export function PersonalDetailsStep() {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 1. Contact Details */}
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-3 sm:p-4">
        <div className="flex items-center justify-between border-b border-orange-100 pb-2 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-950">
            <UserOutlined className="text-orange-600" />
            <span>{t.booking.contact_header}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.booking.whatsapp_active}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <Form.Item
            label={t.booking.full_name}
            name="name"
            rules={[{ required: true, message: t.booking.full_name_required }]}
          >
            <Input placeholder={t.booking.full_name_placeholder} size="middle" className="!rounded-xl" />
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center gap-1.5">
                <span>{t.booking.phone}</span>
                <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 font-black">
                  {t.booking.phone_badge}
                </span>
              </span>
            }
            name="phone"
            tooltip={t.booking.phone_tooltip}
            rules={[
              { required: true, message: t.booking.phone_required },
              {
                pattern: /^[6-9]\d{9}$|^[+]?[0-9\s-]{10,15}$/,
                message: t.booking.phone_valid,
              },
            ]}
            extra={
              <div className="mt-1 flex items-start gap-1 text-[10.5px] text-emerald-800 leading-tight font-medium bg-emerald-50/90 border border-emerald-200/70 rounded-lg p-1.5">
                <span className="text-emerald-600 font-bold shrink-0">{t.booking.phone_note_prefix}</span>
                <span>{t.booking.phone_note}</span>
              </div>
            }
          >
            <Input
              prefix={<span className="text-neutral-400 font-bold text-xs pr-1.5 border-r border-neutral-200 mr-1.5">+91</span>}
              placeholder="9876543210"
              size="middle"
              maxLength={10}
              className="!rounded-xl font-medium"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={t.booking.email}
          name="email"
          rules={[{ type: 'email', message: t.booking.email_valid }]}
          className="!mb-0 mt-1"
        >
          <Input placeholder="you@example.com" size="middle" className="!rounded-xl" />
        </Form.Item>
      </div>

      {/* 2. Birth Details for Kundli Analysis */}
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-3 sm:p-4">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-950 mb-2.5">
          <span className="text-sm">🪐</span>
          <span>{t.booking.birth_header}</span>
        </div>

        {/* Row 1: Profile Name & Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <Form.Item
            label={t.booking.profile_name}
            name="profileName"
            tooltip={t.booking.profile_name_tooltip}
            rules={[{ required: true, message: t.booking.profile_name_required }]}
          >
            <Input placeholder={t.booking.profile_name_placeholder} size="middle" className="!rounded-xl" />
          </Form.Item>

          <Form.Item
            label={t.booking.dob}
            name="dob"
            rules={[{ required: true, message: t.booking.dob_required }]}
          >
            <DatePicker
              className="w-full !rounded-xl"
              size="middle"
              format="DD-MM-YYYY"
              disabledDate={(date) => date.isAfter(dayjs().endOf('day'))}
              placeholder={t.booking.dob_placeholder}
            />
          </Form.Item>
        </div>

        {/* Row 2: Time of Birth & Place of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
          <Form.Item
            label={t.booking.birth_time}
            name="birthTime"
            rules={[{ required: true, message: t.booking.birth_time_required }]}
            className="!mb-0"
          >
            <TimePicker
              className="w-full !rounded-xl"
              size="middle"
              format="hh:mm A"
              use12Hours
              placeholder={t.booking.birth_time_placeholder}
            />
          </Form.Item>

          <Form.Item
            label={t.booking.birth_place}
            name="birthPlace"
            rules={[{ required: true, message: t.booking.birth_place_required }]}
            className="!mb-0"
          >
            <Input placeholder={t.booking.birth_place_placeholder} size="middle" className="!rounded-xl" />
          </Form.Item>
        </div>
      </div>
    </div>
  );
}
