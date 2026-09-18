'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Drawer } from 'antd';
import {
  CompassOutlined,
  CalendarOutlined,
  CloseOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  StarFilled,
} from '@ant-design/icons';
import { PhoneIcon } from '@/components/icons/PhoneIcon';
import { BookingSectionHeader } from './BookingSectionHeader';
import { BookingForm } from './BookingForm';
import type { ComboOffer, ConsultationCategory, PaymentConfig } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

interface Props {
  categories: ConsultationCategory[];
  combos: ComboOffer[];
  paymentConfig: PaymentConfig | null;
}

export function BookingSection({ categories, combos, paymentConfig }: Props) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { t } = useLanguage();

  // Listen for mobile triggers: when user clicks header/hero/combo booking buttons on mobile screen (< 768px)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (typeof window === 'undefined' || window.innerWidth >= 768) return;

      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        if (href.includes('#booking')) {
          e.preventDefault();
          setIsMobileDrawerOpen(true);
        }
      }
    };

    const handleCategoryEvent = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsMobileDrawerOpen(true);
      }
    };

    const handleComboEvent = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsMobileDrawerOpen(true);
      }
    };

    const handleOpenDrawerEvent = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsMobileDrawerOpen(true);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('open-booking-drawer', handleOpenDrawerEvent);
    window.addEventListener('select-booking-category', handleCategoryEvent);
    window.addEventListener('select-booking-combo', handleComboEvent);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('open-booking-drawer', handleOpenDrawerEvent);
      window.removeEventListener('select-booking-category', handleCategoryEvent);
      window.removeEventListener('select-booking-combo', handleComboEvent);
    };
  }, []);

  return (
    <section id="booking" className="bg-gradient-to-b from-[#FFF3E0]/50 via-amber-50/40 to-orange-50/60 py-6 sm:py-16 md:py-20 border-t border-orange-200/35">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* 1. DESKTOP VIEW: Full Inline Form (Preserved Exactly)                      */}
        {/* ========================================================================= */}
        <div className="hidden md:block">
          <BookingSectionHeader />
          <div className="mt-8">
            <BookingForm
              categories={categories}
              combos={combos}
              paymentConfig={paymentConfig}
              isModal={false}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MOBILE VIEW: Cosmic Universe & Vedic Kundli Portal Card (Compact)       */}
        {/* ========================================================================= */}
        <div className="block md:hidden">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-400/45 bg-gradient-to-br from-[#060B18] via-[#0E172E] to-[#070D1B] p-3.5 xs:p-4 text-white shadow-xl">
            {/* Cosmic Background Nebula & Vedic Stars */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-35">
              <Image
                src="/images/vedic-3d-nakshatra-bg.webp"
                alt="Cosmic Vedic Kundli Universe"
                fill
                unoptimized
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-[#060B18]/90" />
            </div>

            {/* Radiant Golden Cosmic Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full bg-amber-500/15 blur-xl pointer-events-none -z-0" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Top Badge: Cosmic Guidance */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 px-2.5 py-0.5 text-[9.5px] xs:text-[10px] font-extrabold text-amber-300 uppercase tracking-wider backdrop-blur-md shadow-2xs">
                <CompassOutlined className="text-amber-400 text-xs" />
                <span>{t.booking_section.mobile_card.badge}</span>
              </div>

              {/* Central Compact Cosmic Lagna Kundli Graphic */}
              <div className="relative my-2.5 h-20 w-20 flex items-center justify-center">
                {/* Outer Rotating Celestial Ring */}
                <div
                  className="absolute inset-0 m-auto h-20 w-20 rounded-full border border-amber-400/60 border-dashed animate-spin-slow pointer-events-none"
                  style={{ animationDuration: '36s' }}
                />
                <div className="absolute inset-0 m-auto h-16 w-16 rounded-full border border-amber-300/30 pointer-events-none" />

                {/* Core Sacred Lagna Kundli Orb */}
                <div className="relative h-14 w-14 rounded-full border-2 border-amber-400 bg-gradient-to-br from-amber-950 via-[#18233C] to-[#0A1224] flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.45)]">
                  <CompassOutlined className="text-lg text-amber-400" />
                  <span className="text-[7.5px] font-serif font-black text-amber-300 tracking-wider">
                    KUNDLI
                  </span>
                </div>

                {/* Orbiting Satellite Star Glows */}
                <div className="absolute top-0 right-1 h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_#FBBF24] animate-pulse" />
                <div className="absolute bottom-0 left-1 h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_#FB923C]" />
              </div>

              {/* Heading */}
              <h3 className="font-serif text-lg xs:text-xl font-black text-white leading-tight">
                {t.booking_section.mobile_card.title}
              </h3>

              {/* Subtitle */}
              <p className="mt-0.5 text-[11px] xs:text-xs text-amber-100/85 max-w-xs leading-relaxed font-medium">
                {t.booking_section.mobile_card.subtitle}
              </p>

              {/* 3 Cosmic Guidance Features (Clean 1-line chips without truncation) */}
              <div className="mt-2.5 w-full space-y-1 text-left">
                <div className="flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-amber-100">
                  <CompassOutlined className="text-amber-300 text-xs shrink-0" />
                  <span>{t.booking_section.mobile_card.feature_1}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-amber-100">
                  <SafetyCertificateOutlined className="text-amber-300 text-xs shrink-0" />
                  <span>{t.booking_section.mobile_card.feature_2}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 px-2.5 py-1 text-[10.5px] font-semibold text-amber-100">
                  <PhoneIcon className="h-3 w-3 text-amber-300 shrink-0" />
                  <span>{t.booking_section.mobile_card.feature_3}</span>
                </div>
              </div>

              {/* Live Availability Status */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 shadow-2xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span>{t.booking_section.mobile_card.live_slots}</span>
              </div>

              {/* Big Interactive Glowing CTA Button */}
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 px-4 py-2.5 text-xs xs:text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 border border-amber-300/40 hover:scale-[1.01] active:scale-95 transition duration-200 cursor-pointer"
                style={{ color: '#ffffff' }}
              >
                <CalendarOutlined className="text-sm" />
                <span>{t.booking_section.mobile_card.cta_btn}</span>
                <span className="text-sm font-bold">&rarr;</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MOBILE BOTTOM SHEET DRAWER (Fixed Header, Leak-proof scrolling)             */}
          {/* ========================================================================= */}
          <Drawer
            placement="bottom"
            height="90vh"
            open={isMobileDrawerOpen}
            onClose={() => setIsMobileDrawerOpen(false)}
            maskClosable={false}
            keyboard={false}
            destroyOnClose={false}
            closable={false}
            className="booking-mobile-bottom-sheet"
            styles={{
              wrapper: { borderRadius: '24px 24px 0 0', overflow: 'hidden' },
              content: { borderRadius: '24px 24px 0 0', backgroundColor: '#FFFDF9', overflow: 'hidden' },
              header: { padding: '20px 20px 12px', backgroundColor: '#FFFDF9', borderBottom: '1px solid rgba(251, 146, 60, 0.2)' },
              body: { padding: '8px 12px 24px', backgroundColor: '#FFFDF9', overflowX: 'hidden' },
            }}
            title={
              <div className="w-full select-none">
                {/* Swipe handle indicator */}
                <div className="h-1.5 w-10 rounded-full bg-neutral-300 mx-auto mb-2.5" />

                <div className="flex items-center justify-between gap-2.5">
                  {/* Left: Icon + Title */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-sm shrink-0 shadow-2xs border border-amber-300/40">
                      <CalendarOutlined />
                    </div>
                    <span className="font-serif text-[15px] xs:text-base font-bold text-neutral-900 leading-tight truncate">
                      {t.booking_section.mobile_card.drawer_title}
                    </span>
                  </div>

                  {/* Right: Close Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="h-8 w-8 rounded-full bg-neutral-100 hover:bg-orange-100 text-neutral-700 hover:text-orange-700 flex items-center justify-center text-xs transition cursor-pointer shrink-0 border border-neutral-300/80 shadow-2xs"
                    aria-label="Close Booking Sheet"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              </div>
            }
          >
            {/* Embedded Responsive Booking Form in Modal/Sheet Mode */}
            <div className="pb-6">
              <BookingForm
                categories={categories}
                combos={combos}
                paymentConfig={paymentConfig}
                isModal={true}
              />
            </div>
          </Drawer>
        </div>
      </div>
    </section>
  );
}
