'use client';

import React from 'react';
import { DatePicker, Form, Input, TimePicker, Select } from 'antd';
import dayjs from 'dayjs';
import { UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';
import { ALL_INDIA_CITIES_FLAT } from '@/lib/data/indiaLocations';

export function PersonalDetailsStep() {
  const { locale, t } = useLanguage();

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Slim Top WhatsApp Info Banner */}
      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-emerald-900 bg-emerald-50/90 border border-emerald-200/80 rounded-xl px-3 py-1.5 font-medium">
        <span className="text-emerald-600 font-bold text-xs shrink-0">📲</span>
        <span>
          {locale === 'hi'
            ? 'अपॉइंटमेंट लिंक व कॉल अपडेट के लिए कृपया सक्रिय व्हाट्सएप नंबर दर्ज करें।'
            : 'Please enter an active WhatsApp number to receive appointment link & call updates.'}
        </span>
      </div>

      {/* 1. Contact Details */}
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-2.5 sm:p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-950 border-b border-orange-100 pb-1.5">
          <UserOutlined className="text-orange-600" />
          <span>{t.booking.contact_header}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
          <Form.Item
            label={t.booking.full_name}
            name="name"
            rules={[{ required: true, message: t.booking.full_name_required }]}
            className="!mb-1.5"
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
            className="!mb-1.5"
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
          className="!mb-0"
        >
          <Input placeholder="you@example.com" size="middle" className="!rounded-xl" />
        </Form.Item>
      </div>

      {/* 2. Birth Details for Kundli Analysis */}
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-2.5 sm:p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-950 border-b border-orange-100 pb-1.5">
          <span className="text-sm">🪐</span>
          <span>{t.booking.birth_header}</span>
        </div>

        {/* Row 1: Profile Name & Date of Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
          <Form.Item
            label={t.booking.profile_name}
            name="profileName"
            tooltip={t.booking.profile_name_tooltip}
            rules={[{ required: true, message: t.booking.profile_name_required }]}
            className="!mb-1.5"
          >
            <Input placeholder={t.booking.profile_name_placeholder} size="middle" className="!rounded-xl" />
          </Form.Item>

          <Form.Item
            label={t.booking.dob}
            name="dob"
            rules={[{ required: true, message: t.booking.dob_required }]}
            className="!mb-1.5"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
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
            label={
              <span className="flex items-center gap-1">
                <EnvironmentOutlined className="text-orange-600" />
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
              className="w-full !rounded-xl"
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
