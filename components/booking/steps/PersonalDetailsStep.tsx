'use client';

import React from 'react';
import { DatePicker, Form, Input, TimePicker, Select } from 'antd';
import dayjs from 'dayjs';
import {
  UserOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';
import { ALL_INDIA_CITIES_FLAT } from '@/lib/data/indiaLocations';

export function PersonalDetailsStep() {
  const { locale, t } = useLanguage();

  return (
    <div className="space-y-2 sm:space-y-2.5">
      {/* Slim Top WhatsApp Info Banner (Hidden on Mobile) */}
      <div className="hidden sm:flex items-center gap-2 text-[11px] sm:text-xs text-emerald-900 bg-emerald-50/90 border border-emerald-200/80 rounded-xl px-3 py-1.5 font-medium">
        <WhatsAppOutlined className="text-emerald-600 text-sm shrink-0" />
        <span>{t.booking.phone_note}</span>
      </div>

      {/* 1. Contact Details */}
      <div className="rounded-xl sm:rounded-2xl border border-orange-200/70 bg-orange-50/15 p-2 sm:p-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-950 border-b border-orange-100 pb-1">
          <UserOutlined className="text-orange-600 text-xs" />
          <span>{t.booking.contact_header}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-1">
          <Form.Item
            label={
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-neutral-700">
                <UserOutlined className="text-orange-600 text-[11px]" />
                <span>{t.booking.full_name}</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: t.booking.full_name_required }]}
            className="!mb-0"
          >
            <Input placeholder={t.booking.full_name_placeholder} size="middle" className="!rounded-lg !text-xs sm:!text-sm" />
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-neutral-700">
                <span>{t.booking.phone}</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 text-emerald-800 text-[9.5px] px-1.5 py-0.2 font-semibold">
                  <WhatsAppOutlined className="text-[10px] text-emerald-600" />
                  <span>{t.booking.phone_badge}</span>
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
            className="!mb-0"
          >
            <Input
              prefix={<span className="text-neutral-400 font-semibold text-xs pr-1.5 border-r border-neutral-200 mr-1.5">+91</span>}
              placeholder="9876543210"
              size="middle"
              maxLength={10}
              className="!rounded-lg !text-xs sm:!text-sm font-normal"
            />
          </Form.Item>
        </div>
      </div>

      {/* 2. Birth Details for Kundli Analysis */}
      <div className="rounded-xl sm:rounded-2xl border border-orange-200/70 bg-orange-50/15 p-2 sm:p-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-950 border-b border-orange-100 pb-1">
          <CompassOutlined className="text-orange-600 text-xs" />
          <span>{t.booking.birth_header}</span>
        </div>

        {/* Row 1: Profile Name & Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-1">
          <Form.Item
            label={
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-neutral-700">
                <IdcardOutlined className="text-orange-600 text-[11px]" />
                <span>{t.booking.profile_name}</span>
              </span>
            }
            name="profileName"
            tooltip={t.booking.profile_name_tooltip}
            rules={[{ required: true, message: t.booking.profile_name_required }]}
            className="!mb-1"
          >
            <Input placeholder={t.booking.profile_name_placeholder} size="middle" className="!rounded-lg !text-xs sm:!text-sm" />
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-neutral-700">
                <CalendarOutlined className="text-orange-600 text-[11px]" />
                <span>{t.booking.dob}</span>
              </span>
            }
            name="dob"
            rules={[{ required: true, message: t.booking.dob_required }]}
            className="!mb-1"
          >
            <DatePicker
              className="w-full !rounded-lg !text-xs sm:!text-sm"
              size="middle"
              format="DD-MM-YYYY"
              disabledDate={(date) => date.isAfter(dayjs().endOf('day'))}
              placeholder={t.booking.dob_placeholder}
            />
          </Form.Item>
        </div>

        {/* Row 2: Time of Birth & Place of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2.5 gap-y-1">
          <Form.Item
            label={
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-neutral-700">
                <ClockCircleOutlined className="text-orange-600 text-[11px]" />
                <span>{t.booking.birth_time}</span>
              </span>
            }
            name="birthTime"
            rules={[{ required: true, message: t.booking.birth_time_required }]}
            className="!mb-0"
          >
            <TimePicker
              className="w-full !rounded-lg !text-xs sm:!text-sm"
              size="middle"
              format="hh:mm A"
              use12Hours
              placeholder={t.booking.birth_time_placeholder}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-medium text-neutral-700">
                <EnvironmentOutlined className="text-orange-600 text-[11px]" />
                <span>{t.booking.birth_place}</span>
              </span>
            }
            name="birthPlace"
            rules={[{ required: true, message: t.booking.birth_place_required }]}
            className="!mb-0"
          >
            <Select
              showSearch
              allowClear
              placeholder={
                locale === 'hi'
                  ? 'जिला या शहर खोजें...'
                  : 'Search by district...'
              }
              className="w-full !rounded-lg !text-xs sm:!text-sm"
              size="middle"
              filterOption={(input, option) =>
                ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
              }
              options={ALL_INDIA_CITIES_FLAT.map((c) => ({
                label: `${c.cityName}, ${c.state}`,
                value: `${c.cityName}, ${c.state}`,
              }))}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
}
