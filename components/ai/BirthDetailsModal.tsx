'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Select, Button, message } from 'antd';
import dayjs from 'dayjs';
import type { BirthDetailsPayload } from '@/lib/types';
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';
import { ALL_INDIA_CITIES_FLAT } from '@/lib/data/indiaLocations';

interface BirthDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (details: BirthDetailsPayload, placeName: string) => void;
  initialDetails?: BirthDetailsPayload | null;
  initialPlaceName?: string;
}

export function BirthDetailsModal({
  open,
  onClose,
  onSave,
  initialDetails,
  initialPlaceName,
}: BirthDetailsModalProps) {
  const [form] = Form.useForm();
  const { locale, t } = useLanguage();

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedPlaceString, setSelectedPlaceString] = useState<string>(initialPlaceName || '');
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lon: number; tz: number }>({
    lat: initialDetails?.latitude || 28.6139,
    lon: initialDetails?.longitude || 77.2090,
    tz: initialDetails?.timezone || 5.5,
  });

  // Sync state when modal opens
  useEffect(() => {
    if (open) {
      if (initialPlaceName) {
        const raw = initialPlaceName.trim().toLowerCase();
        let matched = ALL_INDIA_CITIES_FLAT.find((c) =>
          c.label.toLowerCase() === raw ||
          raw === `${c.cityName.toLowerCase()}, ${c.state.toLowerCase()}`
        );

        if (!matched && initialPlaceName.includes(',')) {
          const cityPart = initialPlaceName.split(',')[0].trim().toLowerCase();
          matched = ALL_INDIA_CITIES_FLAT.find((c) => c.cityName.toLowerCase() === cityPart);
        }

        if (matched) {
          const placeStr = `${matched.cityName}, ${matched.state}`;
          setSelectedPlaceString(placeStr);
          setCurrentCoordinates({ lat: matched.lat, lon: matched.lon, tz: matched.tz });
          form.setFieldsValue({
            dob: initialDetails?.dateOfBirth ? dayjs(initialDetails.dateOfBirth) : undefined,
            time: initialDetails?.timeOfBirth ? dayjs(`2000-01-01 ${initialDetails.timeOfBirth}`) : undefined,
            birthPlace: placeStr,
            latitude: matched.lat,
            longitude: matched.lon,
            timezone: matched.tz,
          });
        } else {
          setSelectedPlaceString(initialPlaceName);
          form.setFieldsValue({
            dob: initialDetails?.dateOfBirth ? dayjs(initialDetails.dateOfBirth) : undefined,
            time: initialDetails?.timeOfBirth ? dayjs(`2000-01-01 ${initialDetails.timeOfBirth}`) : undefined,
            birthPlace: initialPlaceName,
            latitude: initialDetails?.latitude || 28.6139,
            longitude: initialDetails?.longitude || 77.2090,
            timezone: initialDetails?.timezone || 5.5,
          });
        }
      } else {
        setSelectedPlaceString('');
        form.setFieldsValue({
          dob: initialDetails?.dateOfBirth ? dayjs(initialDetails.dateOfBirth) : undefined,
          time: initialDetails?.timeOfBirth ? dayjs(`2000-01-01 ${initialDetails.timeOfBirth}`) : undefined,
          birthPlace: undefined,
          latitude: initialDetails?.latitude || 28.6139,
          longitude: initialDetails?.longitude || 77.2090,
          timezone: initialDetails?.timezone || 5.5,
        });
      }
    }
  }, [open, initialPlaceName, initialDetails, form]);

  const handleCitySelect = (val: string) => {
    if (val === 'CUSTOM') {
      setIsCustomMode(true);
      return;
    }
    const matched = ALL_INDIA_CITIES_FLAT.find((c) => `${c.cityName}, ${c.state}` === val || c.label === val);
    if (matched) {
      const placeStr = `${matched.cityName}, ${matched.state}`;
      setSelectedPlaceString(placeStr);
      const coords = { lat: matched.lat, lon: matched.lon, tz: matched.tz };
      setCurrentCoordinates(coords);
      form.setFieldsValue({
        birthPlace: placeStr,
        latitude: coords.lat,
        longitude: coords.lon,
        timezone: coords.tz,
      });
    } else {
      setSelectedPlaceString(val);
      form.setFieldsValue({ birthPlace: val });
    }
  };

  const handleFinish = (values: any) => {
    try {
      const dateOfBirth = values.dob ? values.dob.format('YYYY-MM-DD') : '1990-01-01';
      const timeOfBirth = values.time ? values.time.format('HH:mm') : '12:00';

      let lat = currentCoordinates.lat;
      let lon = currentCoordinates.lon;
      let tz = currentCoordinates.tz || 5.5;
      let placeDisplayName = selectedPlaceString || values.birthPlace || 'New Delhi, Delhi (NCT)';

      if (isCustomMode) {
        lat = Number(values.latitude);
        lon = Number(values.longitude);
        tz = Number(values.timezone || 5.5);
        placeDisplayName = values.customCityName
          ? `${values.customCityName}, Custom Coordinates`
          : `Custom (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
      }

      const payload: BirthDetailsPayload = {
        dateOfBirth,
        timeOfBirth,
        latitude: lat,
        longitude: lon,
        timezone: tz,
      };

      onSave(payload, placeDisplayName);
      message.success(
        locale === 'hi'
          ? `जन्म विवरण (${placeDisplayName}) सुरक्षित कर लिया गया!`
          : `Birth details saved (${placeDisplayName})!`
      );
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
        <div className="flex items-center gap-2 pb-1.5 border-b border-orange-100">
          <span className="text-xl">🪐</span>
          <div className="min-w-0">
            <h3 className="font-serif text-sm sm:text-base font-bold text-neutral-900 leading-tight">
              {locale === 'hi' ? 'जन्म विवरण दर्ज करें' : 'Add Birth Details'}
            </h3>
            <p className="text-[10.5px] text-neutral-500 font-normal truncate mt-0.5">
              {locale === 'hi'
                ? 'सटीक लग्न कुंडली व ग्रह दशा गणना हेतु'
                : 'Accurate Vedic Kundli & planetary calculation'}
            </p>
          </div>
        </div>
      }
      centered
      width="100%"
      style={{ maxWidth: 400, margin: '12px auto' }}
      styles={{
        body: { padding: '4px 0' },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-2.5 space-y-2"
      >
        {/* Row 1: Date of Birth */}
        <Form.Item
          label={<span className="text-[11px] font-medium text-neutral-700">{t.booking.dob}</span>}
          name="dob"
          rules={[{ required: true, message: t.booking.dob_required }]}
          className="!mb-2"
        >
          <DatePicker
            className="w-full !rounded-xl !h-9 text-xs"
            format="DD MMM YYYY"
            placeholder={locale === 'hi' ? 'जन्म दिनांक चुनें (उदा. 15 Aug 1995)' : 'Select Birth Date (DD MMM YYYY)'}
          />
        </Form.Item>

        {/* Row 2: Time of Birth */}
        <Form.Item
          label={<span className="text-[11px] font-medium text-neutral-700">{t.booking.birth_time}</span>}
          name="time"
          rules={[{ required: true, message: t.booking.birth_time_required }]}
          className="!mb-2"
        >
          <TimePicker
            className="w-full !rounded-xl !h-9 text-xs"
            format="HH:mm"
            placeholder={locale === 'hi' ? 'जन्म समय चुनें (उदा. 10:30 AM)' : 'Select Birth Time (HH:mm)'}
          />
        </Form.Item>

        {/* Place of Birth Selection */}
        {!isCustomMode ? (
          <Form.Item
            label={
              <span className="text-[11px] font-medium text-neutral-700 flex items-center gap-1">
                <EnvironmentOutlined className="text-orange-600 text-xs" />
                <span>{t.booking.birth_place}</span>
              </span>
            }
            name="birthPlace"
            rules={[{ required: true, message: t.booking.birth_place_required }]}
            className="!mb-1.5"
          >
            <Select
              showSearch
              allowClear
              placeholder={
                locale === 'hi'
                  ? 'जिला या शहर खोजें...'
                  : 'Search city or district...'
              }
              className="w-full !rounded-xl"
              style={{ height: 36 }}
              onChange={handleCitySelect}
              filterOption={(input, option) =>
                ((option?.label as string) || '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                ...ALL_INDIA_CITIES_FLAT.map((c) => ({
                  label: `${c.cityName}, ${c.state}`,
                  value: `${c.cityName}, ${c.state}`,
                })),
                {
                  label: locale === 'hi' ? '📍 अन्य / मैन्युअल निर्देशांक दर्ज करें' : '📍 Other / Manual Coordinates',
                  value: 'CUSTOM',
                },
              ]}
            />
          </Form.Item>
        ) : (
          /* Custom Coordinates Section */
          <div className="rounded-xl bg-orange-50/60 p-2.5 border border-orange-200 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-orange-950">
              <span>📍 {locale === 'hi' ? 'मैन्युअल निर्देशांक' : 'Manual Coordinates'}</span>
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="text-orange-700 underline text-[10.5px] font-medium cursor-pointer"
              >
                {locale === 'hi' ? 'वापस लिस्ट पर जाएं' : 'Back to list'}
              </button>
            </div>

            <Form.Item
              name="customCityName"
              label={<span className="text-[10px] font-medium text-neutral-700">{locale === 'hi' ? 'स्थान / शहर का नाम' : 'Place / City Name'}</span>}
              className="!mb-1"
            >
              <Input placeholder={locale === 'hi' ? 'उदा. मेरा गांव / शहर' : 'e.g. City'} size="small" className="!rounded-lg" />
            </Form.Item>

            <div className="grid grid-cols-3 gap-1.5">
              <Form.Item
                name="latitude"
                label={<span className="text-[9.5px] font-medium text-neutral-700">Lat (अक्षांश)</span>}
                className="!mb-0"
              >
                <Input placeholder="28.61" size="small" className="!rounded-lg" />
              </Form.Item>
              <Form.Item
                name="longitude"
                label={<span className="text-[9.5px] font-medium text-neutral-700">Lon (देशांतर)</span>}
                className="!mb-0"
              >
                <Input placeholder="77.20" size="small" className="!rounded-lg" />
              </Form.Item>
              <Form.Item
                name="timezone"
                label={<span className="text-[9.5px] font-medium text-neutral-700">Timezone</span>}
                className="!mb-0"
              >
                <Input placeholder="5.5" size="small" className="!rounded-lg" />
              </Form.Item>
            </div>
          </div>
        )}

        {/* Selected Coordinates Pill */}
        {selectedPlaceString && !isCustomMode && (
          <div className="flex items-center justify-between text-[10.5px] bg-orange-50/60 px-2.5 py-1 rounded-lg border border-orange-200/60 text-orange-950">
            <span className="font-medium flex items-center gap-1 truncate max-w-[65%]">
              📍 <span className="truncate">{selectedPlaceString}</span>
            </span>
            <span className="text-[9.5px] text-neutral-500 font-mono shrink-0">
              {currentCoordinates.lat.toFixed(2)}°, {currentCoordinates.lon.toFixed(2)}°
            </span>
          </div>
        )}

        {/* Compact Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100 mt-2">
          <Button onClick={onClose} className="rounded-xl h-8.5 px-3.5 text-xs">
            {locale === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-xl h-8.5 px-4 bg-gradient-to-r from-orange-500 to-red-600 border-0 font-semibold text-xs shadow-xs hover:from-orange-600 hover:to-red-700"
          >
            {locale === 'hi' ? 'सुरक्षित करें' : 'Save & Calculate'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
