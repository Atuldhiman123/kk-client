'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CloseOutlined, FireFilled } from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';

export function GemstoneOfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Only show if not dismissed in the current session
    try {
      const dismissed = sessionStorage.getItem('kk_gemstone_popup_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1800); // Trigger after 1.8 seconds

        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback if sessionStorage is disabled
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('kk_gemstone_popup_dismissed', 'true');
    } catch {}
  };

  const handleCtaClick = () => {
    handleClose();
    router.push('/ai-astrologer');
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-all duration-300 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl border-2 border-amber-400/90 bg-gradient-to-b from-[#1a0f05] via-[#241206] to-[#100702] text-white shadow-2xl shadow-orange-950/70 transition-all transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 h-36 w-36 rounded-full bg-amber-500/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-orange-600/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-20 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition hover:bg-white/20 hover:text-white cursor-pointer"
        >
          <CloseOutlined className="text-xs" />
        </button>

        <div className="p-5 sm:p-6 text-center">
          {/* Top Floating Badge */}
          <div className="flex items-center justify-center mb-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600/30 via-orange-600/30 to-amber-600/30 border border-orange-500/50 px-3 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-300 shadow-sm animate-pulse">
              <FireFilled className="text-yellow-400" />
              {t.gemstone_popup.badge}
            </span>
          </div>

          {/* Glowing Gemstone Icon */}
          <div className="relative mx-auto w-11 h-11 flex items-center justify-center mb-2">
            <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-md animate-pulse" />
            <span className="text-2xl sm:text-3xl relative">💎</span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-black text-amber-200 leading-tight tracking-tight px-2">
            {t.gemstone_popup.title}
          </h2>

          {/* Price Anchor Tag */}
          <div className="mt-2.5 inline-flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-400/40 px-3 py-1 backdrop-blur-sm">
            <span className="text-xs text-neutral-400 line-through font-semibold">
              {t.gemstone_popup.price_was}
            </span>
            <span className="text-xl sm:text-2xl font-black text-yellow-400 drop-shadow-sm">
              {t.gemstone_popup.price_now}
            </span>
            <span className="rounded-md bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 text-[9.5px] font-extrabold px-1.5 py-0.2">
              {t.gemstone_popup.discount}
            </span>
          </div>

          {/* 3 Compact Feature Chips */}
          <div className="mt-3.5 grid grid-cols-3 gap-1.5 text-center">
            <div className="rounded-xl bg-white/5 border border-white/10 p-2 text-[10.5px] sm:text-[11px] font-medium text-amber-100 flex items-center justify-center">
              <span>{t.gemstone_popup.feature_1}</span>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-2 text-[10.5px] sm:text-[11px] font-medium text-amber-100 flex items-center justify-center">
              <span>{t.gemstone_popup.feature_2}</span>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-2 text-[10.5px] sm:text-[11px] font-medium text-amber-100 flex items-center justify-center">
              <span>{t.gemstone_popup.feature_3}</span>
            </div>
          </div>

          {/* Glowing Beacon CTA Button */}
          <div className="mt-4 relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-80 blur-xs animate-btn-beacon -z-10" />

            <button
              onClick={handleCtaClick}
              className="relative w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-black text-slate-950 shadow-xl transition-all duration-200 hover:brightness-110 active:scale-98 cursor-pointer uppercase tracking-wider"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950" />
              </span>
              <span>{t.gemstone_popup.cta_button}</span>
            </button>
          </div>

          {/* Dismiss option */}
          <div className="mt-2 text-center">
            <button
              onClick={handleClose}
              type="button"
              className="text-[10.5px] sm:text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors bg-transparent border-none outline-none cursor-pointer hover:underline p-0.5"
            >
              {t.gemstone_popup.dismiss}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
