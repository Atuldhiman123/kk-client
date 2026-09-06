'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { DatePicker, Form, Radio, Spin, Segmented, Tag, type FormInstance } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CheckCircleFilled,
  FireOutlined,
  GiftOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ComboOffer, ConsultationCategory } from '@/lib/types';
import { formatInr } from '@/lib/format';
import { getAvailability } from '@/lib/api';
import { useLanguage, getLocalizedCategoryName, getLocalizedComboTitle } from '@/lib/i18n';

interface Props {
  form: FormInstance;
  categories: ConsultationCategory[];
  combos: ComboOffer[];
}

function getCategoryIcon(name: string, slug?: string) {
  const n = (name + ' ' + (slug || '')).toLowerCase();
  if (n.includes('career') || n.includes('job') || n.includes('business')) return '💼';
  if (n.includes('marriage') || n.includes('match') || n.includes('relationship') || n.includes('love')) return '💍';
  if (n.includes('child') || n.includes('santana') || n.includes('birth')) return '👶';
  if (n.includes('health') || n.includes('medical') || n.includes('roga')) return '🩺';
  if (n.includes('wealth') || n.includes('money') || n.includes('finance') || n.includes('property')) return '💰';
  if (n.includes('gem') || n.includes('stone') || n.includes('ratna')) return '💎';
  if (n.includes('dasha') || n.includes('rahu') || n.includes('shani') || n.includes('planet')) return '🪐';
  if (n.includes('combo')) return '🎁';
  return '✨';
}

export function ConsultationStep({ form, categories, combos }: Props) {
  const { locale, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'popular' | 'category' | 'combo'>('popular');
  const selection = Form.useWatch('selection', form) as string | undefined;
  const bookingDate = Form.useWatch('bookingDate', form) as Dayjs | undefined;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  // Sync tab only when selection changes from external source/mount
  const prevSelectionRef = useRef<string | undefined>(selection);
  useEffect(() => {
    if (selection && selection !== prevSelectionRef.current) {
      prevSelectionRef.current = selection;
      if (selection.startsWith('combo:')) {
        setActiveTab('combo');
      }
    }
  }, [selection]);

  // Fetch slots whenever bookingDate changes
  useEffect(() => {
    if (!bookingDate) {
      setSlots([]);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    setSlotError(null);
    form.setFieldValue('slot', undefined);

    getAvailability(bookingDate.format('YYYY-MM-DD'))
      .then((res) => {
        if (!cancelled) setSlots(res.slots);
      })
      .catch(() => {
        if (!cancelled) setSlotError(t.booking.load_slots_error);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bookingDate?.format('YYYY-MM-DD'), form, t.booking.load_slots_error]);

  const selectedCategory = selection?.startsWith('category:')
    ? categories.find((c) => c.id === selection.split(':')[1])
    : undefined;
  const selectedCombo = selection?.startsWith('combo:')
    ? combos.find((c) => c.id === selection.split(':')[1])
    : undefined;

  // Filter items based on active tab
  const displayCategories = useMemo(() => {
    if (activeTab === 'combo') return [];
    if (activeTab === 'popular') {
      return categories.slice(0, 4);
    }
    return categories;
  }, [categories, activeTab]);

  const displayCombos = useMemo(() => {
    if (activeTab === 'category') return [];
    if (activeTab === 'popular') {
      return combos.slice(0, 3);
    }
    return combos;
  }, [combos, activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 240;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const segmentedOptions = [
    {
      value: 'popular',
      label: (
        <span className="flex items-center gap-1 text-[10px] xs:text-[11px] font-bold px-0.5 xs:px-1 py-0.5">
          <FireOutlined className="text-orange-600" />
          <span>{t.booking.tab_popular}</span>
        </span>
      ),
    },
    {
      value: 'category',
      label: (
        <span className="flex items-center gap-1 text-[10px] xs:text-[11px] font-bold px-0.5 xs:px-1 py-0.5">
          <StarOutlined className="text-amber-500" />
          <span>{t.booking.tab_category}</span>
        </span>
      ),
    },
    {
      value: 'combo',
      label: (
        <span className="flex items-center gap-1 text-[10px] xs:text-[11px] font-bold px-0.5 xs:px-1 py-0.5">
          <GiftOutlined className="text-red-500" />
          <span>{t.booking.tab_combo}</span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* 1. Consultation Selection Box */}
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-2.5 sm:p-3 space-y-2">
        {/* Header & Compact AntD Segmented Tabs */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2 border-b border-orange-100 pb-2">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1.5 shrink-0">
            <span className="text-sm">🔮</span>
            <span>{t.booking.select_session_header}</span>
          </div>

          {/* Ant Design Compact Segmented Control */}
          <Segmented
            value={activeTab}
            onChange={(val) => setActiveTab(val as any)}
            options={segmentedOptions}
            size="small"
            className="!bg-orange-100/70 !p-0.5 !rounded-xl !border !border-orange-200 shadow-2xs self-start xs:self-auto"
          />
        </div>

        {/* Carousel Container with Native Controls & AntD Tags */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous options"
            className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-6 w-6 items-center justify-center rounded-full bg-white border border-orange-200 text-neutral-700 shadow-md hover:bg-orange-50 hover:text-orange-700 transition cursor-pointer"
          >
            <LeftOutlined className="text-[9px]" />
          </button>

          {/* Cards Scroll View */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 px-0.5 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayCategories.map((category) => {
              const isSelected = selection === `category:${category.id}`;
              const icon = getCategoryIcon(category.name, category.slug);
              const locName = getLocalizedCategoryName(category, locale);

              return (
                <div
                  key={category.id}
                  onClick={() => {
                    form.setFieldValue('selection', `category:${category.id}`);
                    form.validateFields(['selection']).catch(() => {});
                  }}
                  className={`relative flex flex-col justify-between rounded-xl border p-2.5 sm:p-3 text-left transition-all duration-200 select-none w-[68vw] max-w-[200px] sm:w-48 shrink-0 snap-start cursor-pointer ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/75 shadow-md ring-2 ring-orange-500/30'
                      : 'border-orange-200/90 bg-white hover:border-orange-400 hover:bg-orange-50/20 shadow-2xs hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top: Icon, Title & AntD Tag */}
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base shrink-0">{icon}</span>
                        <span
                          className={`font-bold text-xs sm:text-sm leading-tight truncate ${
                            isSelected ? 'text-orange-950 font-black' : 'text-neutral-900'
                          }`}
                        >
                          {locName}
                        </span>
                      </div>

                      {isSelected ? (
                        <Tag color="orange" className="!mr-0 !px-1.5 !py-0 !rounded-full !text-[9px] !font-extrabold flex items-center gap-0.5 shrink-0">
                          <CheckCircleFilled className="text-orange-600" />
                          <span>{t.booking.badge_active}</span>
                        </Tag>
                      ) : (
                        <Tag color="gold" className="!mr-0 !px-1.5 !py-0 !rounded-full !text-[8.5px] !font-bold uppercase shrink-0 border-0">
                          {t.booking.badge_vedic}
                        </Tag>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Price & Duration Tag */}
                  <div className="mt-2 flex items-center justify-between border-t border-orange-100/80 pt-1.5 text-[10px]">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-black text-sm sm:text-base ${isSelected ? 'text-orange-600' : 'text-neutral-900'}`}>
                        {formatInr(category.price)}
                      </span>
                      {category.originalPrice && (
                        <span className="text-neutral-400 line-through text-[9.5px]">
                          {formatInr(category.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Tag
                      icon={<ClockCircleOutlined className="text-[10px]" />}
                      className={`!mr-0 !rounded-md !px-1.5 !py-0 !text-[9px] !font-bold ${
                        isSelected ? '!border-orange-300 !bg-orange-100 !text-orange-900' : '!bg-neutral-50 !text-neutral-600'
                      }`}
                    >
                      {category.durationMinutes}m
                    </Tag>
                  </div>
                </div>
              );
            })}

            {displayCombos.map((combo) => {
              const isSelected = selection === `combo:${combo.id}`;
              const locTitle = getLocalizedComboTitle(combo, locale);

              return (
                <div
                  key={combo.id}
                  onClick={() => {
                    form.setFieldValue('selection', `combo:${combo.id}`);
                    form.validateFields(['selection']).catch(() => {});
                  }}
                  className={`relative flex flex-col justify-between rounded-xl border p-2.5 sm:p-3 text-left transition-all duration-200 select-none w-[68vw] max-w-[200px] sm:w-48 shrink-0 snap-start cursor-pointer ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/75 shadow-md ring-2 ring-orange-500/30'
                      : 'border-orange-200/90 bg-white hover:border-orange-400 hover:bg-orange-50/20 shadow-2xs hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base shrink-0">🎁</span>
                        <span
                          className={`font-bold text-xs sm:text-sm leading-tight truncate ${
                            isSelected ? 'text-orange-950 font-black' : 'text-neutral-900'
                          }`}
                        >
                          {locTitle}
                        </span>
                      </div>

                      {isSelected ? (
                        <Tag color="orange" className="!mr-0 !px-1.5 !py-0 !rounded-full !text-[9px] !font-extrabold flex items-center gap-0.5 shrink-0">
                          <CheckCircleFilled className="text-orange-600" />
                          <span>{t.booking.badge_active}</span>
                        </Tag>
                      ) : (
                        <Tag color="error" className="!mr-0 !px-1.5 !py-0 !rounded-full !text-[8.5px] !font-bold uppercase shrink-0 border-0">
                          {t.booking.badge_combo}
                        </Tag>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-orange-100/80 pt-1.5 text-[10px]">
                    <div className="flex items-baseline gap-1">
                      <span className={`font-black text-sm sm:text-base ${isSelected ? 'text-orange-600' : 'text-neutral-900'}`}>
                        {formatInr(combo.discountedPrice)}
                      </span>
                      {combo.originalPrice && (
                        <span className="text-neutral-400 line-through text-[9.5px]">
                          {formatInr(combo.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Tag color="volcano" className="!mr-0 !rounded-md !px-1.5 !py-0 !text-[9px] !font-bold border-0">
                      {t.booking.badge_discounted}
                    </Tag>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next options"
            className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-6 w-6 items-center justify-center rounded-full bg-white border border-orange-200 text-neutral-700 shadow-md hover:bg-orange-50 hover:text-orange-700 transition cursor-pointer"
          >
            <RightOutlined className="text-[9px]" />
          </button>
        </div>

        {/* Hidden input for AntD form validation */}
        <Form.Item
          name="selection"
          rules={[{ required: true, message: t.booking.session_required }]}
          className="!hidden"
        >
          <input type="hidden" />
        </Form.Item>

        {/* Selected Session Pill Indicator */}
        {(selectedCategory || selectedCombo) && (
          <div className="rounded-xl border border-orange-300/80 bg-orange-100/60 px-3 py-1.5 flex items-center justify-between shadow-2xs">
            <div className="text-[11px] sm:text-xs font-bold text-orange-950 flex items-center gap-1.5 truncate">
              <span className="text-orange-600 text-xs">🎯</span>
              <span className="truncate">
                {t.booking.selected_label}{' '}
                <span className="font-extrabold text-orange-900">
                  {selectedCategory
                    ? getLocalizedCategoryName(selectedCategory, locale)
                    : `${getLocalizedComboTitle(selectedCombo!, locale)}`}
                </span>
              </span>
            </div>
            <Tag color="orange" className="!mr-0 !font-black !text-xs !rounded-lg !px-2 !py-0.5">
              {formatInr(selectedCategory ? selectedCategory.price : (selectedCombo?.discountedPrice ?? 0))}
            </Tag>
          </div>
        )}
      </div>

      {/* 2. Date & Time Slot Selection */}
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-2.5 sm:p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-950 border-b border-orange-100 pb-1.5">
          <CalendarOutlined className="text-orange-600" />
          <span>{t.booking.slot_header}</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          <Form.Item
            label={t.booking.appointment_date}
            name="bookingDate"
            rules={[{ required: true, message: t.booking.appointment_date_required }]}
            className="!mb-1"
          >
            <DatePicker
              className="w-full !rounded-xl cursor-pointer"
              size="middle"
              format="DD-MM-YYYY"
              disabledDate={(date) => date.isBefore(dayjs().startOf('day'))}
              placeholder={t.booking.appointment_date_placeholder}
            />
          </Form.Item>

          {bookingDate && (
            <Form.Item
              label={t.booking.available_slots}
              name="slot"
              rules={[{ required: true, message: t.booking.slot_required }]}
              className="!mb-0"
            >
              {loadingSlots ? (
                <div className="py-2.5 text-center">
                  <Spin size="small" />
                  <span className="ml-2 text-xs text-neutral-500 font-medium">{t.booking.checking_slots}</span>
                </div>
              ) : slotError ? (
                <p className="text-xs text-red-600">{slotError}</p>
              ) : slots.length === 0 ? (
                <p className="text-xs text-neutral-500 py-1">
                  {t.booking.no_slots}
                </p>
              ) : (
                <Radio.Group className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                    {slots.map((slot) => (
                      <Radio.Button
                        key={slot}
                        value={slot}
                        className="!text-center !text-xs !py-1 !h-auto flex items-center justify-center font-bold !rounded-xl border border-orange-200/80 hover:border-orange-500 cursor-pointer shadow-2xs"
                      >
                        {slot}
                      </Radio.Button>
                    ))}
                  </div>
                </Radio.Group>
              )}
            </Form.Item>
          )}
        </div>
      </div>
    </div>
  );
}
