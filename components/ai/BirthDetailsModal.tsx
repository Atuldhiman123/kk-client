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
        // Find in flat list
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
          : `Birth details saved (${placeDisplayName}) for Kundli analysis!`
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
        <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
          <span className="text-2xl">🪐</span>
          <div>
            <h3 className="font-serif text-base font-bold text-orange-950">
              {locale === 'hi' ? 'जन्म विवरण दर्ज करें' : 'Add Birth Details'}
            </h3>
            <p className="text-xs text-neutral-500 font-normal">
              {locale === 'hi'
                ? 'सटीक वैदिक कुंडली और ग्रह दशा गणना हेतु'
                : 'Accurate Vedic Kundli & planetary calculation location'}
            </p>
          </div>
        </div>
      }
      centered
      width={460}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-3 space-y-3"
      >
        {/* Row 1: DOB and Birth Time */}
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label={<span className="text-xs font-semibold text-neutral-700">{t.booking.dob}</span>}
            name="dob"
            rules={[{ required: true, message: t.booking.dob_required }]}
          >
            <DatePicker
              className="w-full !rounded-xl"
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
              className="w-full !rounded-xl"
              format="HH:mm"
              placeholder={t.booking.birth_time_placeholder}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
            />
          </Form.Item>
        </div>

        {/* Place of Birth Selection */}
        {!isCustomMode ? (
          <Form.Item
            label={
              <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                <EnvironmentOutlined className="text-orange-600" />
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
                  : 'Search by district...'
              }
              className="w-full !rounded-xl"
              size="middle"
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
          <div className="rounded-2xl bg-orange-50/70 p-3 border border-orange-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-orange-950">
              <span>📍 {locale === 'hi' ? 'मैन्युअल निर्देशांक' : 'Manual Coordinates'}</span>
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="text-orange-700 underline text-[11px] font-semibold cursor-pointer"
              >
                {locale === 'hi' ? 'वापस लिस्ट पर जाएं' : 'Back to list'}
              </button>
            </div>

            <Form.Item
              name="customCityName"
              label={<span className="text-[10.5px] font-medium text-neutral-700">{locale === 'hi' ? 'स्थान / शहर का नाम' : 'Place / City Name'}</span>}
              className="!mb-1.5"
            >
              <Input placeholder={locale === 'hi' ? 'उदा. मेरा गांव / शहर' : 'e.g. Village / City'} size="small" className="!rounded-xl" />
            </Form.Item>

            <div className="grid grid-cols-3 gap-2">
              <Form.Item
                name="latitude"
                label={<span className="text-[10px] font-medium text-neutral-700">Latitude (अक्षांश)</span>}
                className="!mb-0"
              >
                <Input placeholder="28.61" size="small" className="!rounded-lg" />
              </Form.Item>
              <Form.Item
                name="longitude"
                label={<span className="text-[10px] font-medium text-neutral-700">Longitude (देशांतर)</span>}
                className="!mb-0"
              >
                <Input placeholder="77.20" size="small" className="!rounded-lg" />
              </Form.Item>
              <Form.Item
                name="timezone"
                label={<span className="text-[10px] font-medium text-neutral-700">Timezone</span>}
                className="!mb-0"
              >
                <Input placeholder="5.5" size="small" className="!rounded-lg" />
              </Form.Item>
            </div>
          </div>
        )}

        {/* Selected Coordinates Pill */}
        {selectedPlaceString && !isCustomMode && (
          <div className="flex items-center justify-between text-[11px] bg-orange-50/80 px-3 py-1.5 rounded-xl border border-orange-200/80 text-orange-950">
            <span className="font-semibold flex items-center gap-1 truncate max-w-[65%]">
              📍 <span>{selectedPlaceString}</span>
            </span>
            <span className="text-[10px] text-neutral-600 font-mono shrink-0">
              Lat: {currentCoordinates.lat.toFixed(2)}°, Lon: {currentCoordinates.lon.toFixed(2)}°
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-2.5 flex items-center justify-end gap-2 border-t border-neutral-100">
          <Button onClick={onClose} className="rounded-xl">
            {locale === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 border-0 font-bold shadow-md hover:from-orange-600 hover:to-red-700"
          >
            {locale === 'hi' ? 'सुरक्षित करें एवं कुंडली देखें' : 'Save & Calculate Kundli'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
