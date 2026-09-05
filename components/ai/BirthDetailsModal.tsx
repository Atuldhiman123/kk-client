'use client';

import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Select, Button, message } from 'antd';
import dayjs from 'dayjs';
import type { BirthDetailsPayload } from '@/lib/types';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';

interface BirthDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (details: BirthDetailsPayload, placeName: string) => void;
  initialDetails?: BirthDetailsPayload | null;
  initialPlaceName?: string;
}

const POPULAR_CITIES = [
  { label: 'New Delhi, Delhi', value: 'New Delhi', lat: 28.6139, lon: 77.2090, tz: 5.5 },
  { label: 'Mumbai, Maharashtra', value: 'Mumbai', lat: 19.0760, lon: 72.8777, tz: 5.5 },
  { label: 'Bengaluru, Karnataka', value: 'Bengaluru', lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { label: 'Kolkata, West Bengal', value: 'Kolkata', lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { label: 'Chennai, Tamil Nadu', value: 'Chennai', lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { label: 'Hyderabad, Telangana', value: 'Hyderabad', lat: 17.3850, lon: 78.4867, tz: 5.5 },
  { label: 'Jaipur, Rajasthan', value: 'Jaipur', lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { label: 'Lucknow, Uttar Pradesh', value: 'Lucknow', lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { label: 'Ahmedabad, Gujarat', value: 'Ahmedabad', lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { label: 'Pune, Maharashtra', value: 'Pune', lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { label: 'Chandigarh, Punjab/Haryana', value: 'Chandigarh', lat: 30.7333, lon: 76.7794, tz: 5.5 },
  { label: 'Patna, Bihar', value: 'Patna', lat: 25.5941, lon: 85.1376, tz: 5.5 },
  { label: 'Varanasi, Uttar Pradesh', value: 'Varanasi', lat: 25.3176, lon: 82.9739, tz: 5.5 },
];

export function BirthDetailsModal({
  open,
  onClose,
  onSave,
  initialDetails,
  initialPlaceName = 'New Delhi',
}: BirthDetailsModalProps) {
  const [form] = Form.useForm();
  const [selectedCity, setSelectedCity] = useState(initialPlaceName);
  const [isCustomPlace, setIsCustomPlace] = useState(false);
  const { locale, t } = useLanguage();

  const handleCityChange = (val: string) => {
    if (val === 'CUSTOM') {
      setIsCustomPlace(true);
      setSelectedCity('Custom Location');
    } else {
      setIsCustomPlace(false);
      setSelectedCity(val);
      const city = POPULAR_CITIES.find((c) => c.value === val);
      if (city) {
        form.setFieldsValue({
          latitude: city.lat,
          longitude: city.lon,
          timezone: city.tz,
        });
      }
    }
  };

  const handleFinish = (values: any) => {
    try {
      const dateOfBirth = values.dob ? values.dob.format('YYYY-MM-DD') : '1990-01-01';
      const timeOfBirth = values.time ? values.time.format('HH:mm') : '12:00';
      
      let lat = Number(values.latitude);
      let lon = Number(values.longitude);
      let tz = Number(values.timezone || 5.5);

      if (!isCustomPlace) {
        const city = POPULAR_CITIES.find((c) => c.value === selectedCity) || POPULAR_CITIES[0];
        lat = city.lat;
        lon = city.lon;
        tz = city.tz;
      }

      const payload: BirthDetailsPayload = {
        dateOfBirth,
        timeOfBirth,
        latitude: lat,
        longitude: lon,
        timezone: tz,
      };

      onSave(payload, selectedCity);
      message.success(locale === 'hi' ? 'जन्म विवरण सफलतापूर्वक सुरक्षित हो गया!' : 'Birth details saved for personalized astrology readings!');
      onClose();
    } catch {
      message.error(locale === 'hi' ? 'कृपया सही जन्म विवरण भरें' : 'Please enter valid birth details');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
          <span className="text-xl">🪐</span>
          <div>
            <h3 className="font-serif text-base font-bold text-orange-950">
              {locale === 'hi' ? 'जन्म विवरण दर्ज करें' : 'Add Birth Details'}
            </h3>
            <p className="text-xs text-neutral-500 font-normal">
              {locale === 'hi' ? 'व्यक्तिगत कुंडली विश्लेषण और ग्रह दशा गणना हेतु' : 'Enable personalized Kundli consultation & planetary analysis'}
            </p>
          </div>
        </div>
      }
      centered
      width={440}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          dob: initialDetails?.dateOfBirth ? dayjs(initialDetails.dateOfBirth) : dayjs('1995-05-15'),
          time: initialDetails?.timeOfBirth ? dayjs(`2000-01-01 ${initialDetails.timeOfBirth}`) : dayjs('2000-01-01 10:30'),
          city: initialPlaceName || 'New Delhi',
          latitude: initialDetails?.latitude || 28.6139,
          longitude: initialDetails?.longitude || 77.2090,
          timezone: initialDetails?.timezone || 5.5,
        }}
        className="mt-3 space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label={<span className="text-xs font-semibold text-neutral-700">{t.booking.dob}</span>}
            name="dob"
            rules={[{ required: true, message: t.booking.dob_required }]}
          >
            <DatePicker
              className="w-full"
              format="DD MMM YYYY"
              placeholder={t.booking.dob_placeholder}
              prefix={<CalendarOutlined className="text-orange-500" />}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-semibold text-neutral-700">{t.booking.birth_time}</span>}
            name="time"
            rules={[{ required: true, message: t.booking.birth_time_required }]}
          >
            <TimePicker
              className="w-full"
              format="HH:mm"
              placeholder={t.booking.birth_time_placeholder}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
            />
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="text-xs font-semibold text-neutral-700">{t.booking.birth_place}</span>}
          name="city"
          rules={[{ required: true }]}
        >
          <Select
            onChange={handleCityChange}
            options={[
              ...POPULAR_CITIES.map((c) => ({ label: c.label, value: c.value })),
              { label: locale === 'hi' ? '📍 अन्य शहर / निर्देशांक दर्ज करें' : '📍 Enter Custom Coordinates / Other City', value: 'CUSTOM' },
            ]}
          />
        </Form.Item>

        {isCustomPlace && (
          <div className="rounded-xl bg-orange-50/70 p-3 border border-orange-200/80 space-y-2">
            <div className="text-[11px] font-bold text-orange-900 uppercase">Coordinates (Lat / Lon)</div>
            <div className="grid grid-cols-3 gap-2">
              <Form.Item name="latitude" label={<span className="text-[10px]">Latitude</span>} className="mb-0">
                <Input placeholder="28.61" size="small" />
              </Form.Item>
              <Form.Item name="longitude" label={<span className="text-[10px]">Longitude</span>} className="mb-0">
                <Input placeholder="77.20" size="small" />
              </Form.Item>
              <Form.Item name="timezone" label={<span className="text-[10px]">Timezone</span>} className="mb-0">
                <Input placeholder="5.5" size="small" />
              </Form.Item>
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2">
          <Button onClick={onClose} className="rounded-xl">
            {locale === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 border-0 font-bold"
          >
            {locale === 'hi' ? 'सुरक्षित करें एवं लागू करें' : 'Save & Apply Chart'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
