'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { DatePicker, Form, Radio, Spin, type FormInstance } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { CalendarOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
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

  // Sync tab with selection
  useEffect(() => {
    if (selection?.startsWith('combo:') && activeTab === 'category') {
      setActiveTab('combo');
    } else if (selection?.startsWith('category:') && activeTab === 'combo') {
      setActiveTab('category');
    }
  }, [selection, activeTab]);

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
      return combos.slice(0, 2);
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

  return (
    <div className="space-y-4">
      {/* 1. Consultation Selection Header & Segmented Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-orange-100/90 pb-2.5">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-950 flex items-center gap-1.5">
            <span className="text-base">🔮</span>
            <span>{t.booking.select_session_header}</span>
          </div>

          {/* High-Contrast Interactive Tabs */}
          <div className="inline-flex items-center p-1 rounded-full bg-orange-100/70 border border-orange-200/90 shadow-inner self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('popular')}
              className={`cursor-pointer select-none rounded-full px-3 sm:px-3.5 py-1 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'popular'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-600/30 scale-[1.03]'
                  : 'text-neutral-700 hover:text-orange-950 hover:bg-white/60'
              }`}
            >
              <span>🔥</span>
              <span>{t.booking.tab_popular}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('category')}
              className={`cursor-pointer select-none rounded-full px-3 sm:px-3.5 py-1 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'category'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-600/30 scale-[1.03]'
                  : 'text-neutral-700 hover:text-orange-950 hover:bg-white/60'
              }`}
            >
              <span>✨</span>
              <span>{t.booking.tab_category}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('combo')}
              className={`cursor-pointer select-none rounded-full px-3 sm:px-3.5 py-1 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'combo'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-600/30 scale-[1.03]'
                  : 'text-neutral-700 hover:text-orange-950 hover:bg-white/60'
              }`}
            >
              <span>🎁</span>
              <span>{t.booking.tab_combo}</span>
            </button>
          </div>
        </div>

        {/* Carousel Container with Controls */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous options"
            className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full bg-white border border-orange-200 text-neutral-700 shadow-md hover:bg-orange-50 hover:text-orange-700 transition cursor-pointer"
          >
            <LeftOutlined className="text-[10px]" />
          </button>

          {/* Cards Scroll View */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-2 pt-1 px-1 -mx-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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
                  className={`relative flex flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition-all duration-200 select-none w-[72vw] max-w-[215px] sm:w-52 shrink-0 snap-start cursor-pointer ${
                    isSelected
                      ? 'border-orange-600 bg-gradient-to-br from-orange-50 via-amber-50/50 to-orange-100/40 shadow-md ring-4 ring-orange-500/20 scale-[1.02]'
                      : 'border-orange-200/90 bg-white hover:border-orange-400 hover:bg-orange-50/30 hover:shadow-xs hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top: Icon, Title & Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{icon}</span>
                        <span
                          className={`font-bold text-xs sm:text-sm leading-snug line-clamp-1 ${
                            isSelected ? 'text-orange-950 font-black' : 'text-neutral-900'
                          }`}
                        >
                          {locName}
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="shrink-0 rounded-full bg-orange-600 px-2 py-0.5 text-[8.5px] font-black text-white shadow-2xs">
                          {t.booking.badge_active}
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-orange-100/90 px-1.5 py-0.2 text-[8px] font-bold text-orange-900 uppercase">
                          {t.booking.badge_vedic}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Price & Duration */}
                  <div className="mt-3 flex items-center justify-between border-t border-orange-100 pt-2 text-[10px]">
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
                    <span
                      className={`font-bold rounded-full px-2 py-0.5 text-[9px] flex items-center gap-0.5 ${
                        isSelected ? 'bg-orange-200/80 text-orange-950' : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      ⏱️ {category.durationMinutes}m
                    </span>
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
                  className={`relative flex flex-col justify-between rounded-2xl border-2 p-3.5 text-left transition-all duration-200 select-none w-[72vw] max-w-[215px] sm:w-52 shrink-0 snap-start cursor-pointer ${
                    isSelected
                      ? 'border-orange-600 bg-gradient-to-br from-orange-50 via-amber-50/50 to-orange-100/40 shadow-md ring-4 ring-orange-500/20 scale-[1.02]'
                      : 'border-orange-200/90 bg-white hover:border-orange-400 hover:bg-orange-50/30 hover:shadow-xs hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🎁</span>
                        <span
                          className={`font-bold text-xs sm:text-sm leading-snug line-clamp-1 ${
                            isSelected ? 'text-orange-950 font-black' : 'text-neutral-900'
                          }`}
                        >
                          {locTitle}
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="shrink-0 rounded-full bg-orange-600 px-2 py-0.5 text-[8.5px] font-black text-white shadow-2xs">
                          {t.booking.badge_active}
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-red-100 px-1.5 py-0.2 text-[8px] font-bold text-red-700 uppercase">
                          {t.booking.badge_combo}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-orange-100 pt-2 text-[10px]">
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
                    <span className="bg-red-100 text-red-800 font-bold rounded-full px-2 py-0.5 text-[8.5px]">
                      {t.booking.badge_discounted}
                    </span>
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
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full bg-white border border-orange-200 text-neutral-700 shadow-md hover:bg-orange-50 hover:text-orange-700 transition cursor-pointer"
          >
            <RightOutlined className="text-[10px]" />
          </button>
        </div>

        {/* Hidden input for AntD validation */}
        <Form.Item
          name="selection"
          rules={[{ required: true, message: t.booking.session_required }]}
          className="!hidden"
        >
          <input type="hidden" />
        </Form.Item>

        {/* Selected Session Pill Indicator */}
        {(selectedCategory || selectedCombo) && (
          <div className="rounded-xl border border-orange-300/90 bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-100/40 px-3.5 py-2 flex items-center justify-between shadow-2xs">
            <div className="text-[11px] sm:text-xs font-bold text-orange-950 flex items-center gap-1.5 truncate">
              <span className="text-orange-600 text-sm">🎯</span>
              <span className="truncate">
                {t.booking.selected_label}{' '}
                {selectedCategory
                  ? getLocalizedCategoryName(selectedCategory, locale)
                  : `${getLocalizedComboTitle(selectedCombo!, locale)} (${t.booking.badge_combo})`}
              </span>
            </div>
            <div className="shrink-0 text-xs sm:text-sm font-black text-orange-600 ml-2">
              {formatInr(selectedCategory ? selectedCategory.price : (selectedCombo?.discountedPrice ?? 0))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Date & Time Slot Selection */}
      <div className="rounded-2xl border border-orange-200/80 bg-orange-50/20 p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-orange-950">
          <CalendarOutlined className="text-orange-600" />
          <span>{t.booking.slot_header}</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
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
                <div className="py-4 text-center">
                  <Spin size="small" />
                  <span className="ml-2 text-xs text-neutral-500 font-medium">{t.booking.checking_slots}</span>
                </div>
              ) : slotError ? (
                <p className="text-xs text-red-600">{slotError}</p>
              ) : slots.length === 0 ? (
                <p className="text-xs text-neutral-500 py-2">
                  {t.booking.no_slots}
                </p>
              ) : (
                <Radio.Group className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
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
