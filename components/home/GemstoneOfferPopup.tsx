'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CloseOutlined,
  CheckCircleFilled,
  FireFilled,
  ThunderboltFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-md transition-all duration-300 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-[#1c1006] via-[#2a1408] to-[#120903] text-white shadow-2xl shadow-orange-950/60 transition-all transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition hover:bg-white/20 hover:text-white"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="p-5 sm:p-7">
          {/* Top Floating Badge */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-3 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-white shadow-md animate-pulse">
              <FireFilled className="text-yellow-300" />
              {t.gemstone_popup.badge}
            </span>
          </div>

          {/* Gemstone Sparkles Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl mb-1 drop-shadow-md">
              <span>💎</span>
              <span>🪐</span>
              <span>✨</span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-amber-200 leading-tight tracking-tight">
              {t.gemstone_popup.title}
            </h2>

            {/* Price Anchor Tag */}
            <div className="mt-2.5 inline-flex items-center gap-2 rounded-2xl bg-amber-500/15 border border-amber-400/40 px-3.5 py-1.5 backdrop-blur-sm">
              <span className="text-xs sm:text-sm text-neutral-400 line-through font-semibold">
                {t.gemstone_popup.price_was}
              </span>
              <span className="text-xl sm:text-2xl font-black text-yellow-400 drop-shadow-md">
                {t.gemstone_popup.price_now}
              </span>
              <span className="rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] sm:text-xs font-extrabold px-2 py-0.5">
                {t.gemstone_popup.discount}
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-amber-100/85 leading-relaxed">
              {t.gemstone_popup.subtitle}
            </p>
          </div>

          {/* Features Checkmark List */}
          <div className="mt-4 space-y-2 rounded-2xl bg-white/5 border border-white/10 p-3.5 sm:p-4 text-left">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
              <CheckCircleFilled className="text-emerald-400 shrink-0 text-sm" />
              <span>{t.gemstone_popup.feature_1}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
              <CheckCircleFilled className="text-emerald-400 shrink-0 text-sm" />
              <span>{t.gemstone_popup.feature_2}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
              <CheckCircleFilled className="text-emerald-400 shrink-0 text-sm" />
              <span>{t.gemstone_popup.feature_3}</span>
            </div>
          </div>

          {/* Urgency Counter Strip */}
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold text-amber-300/90">
            <ClockCircleOutlined className="animate-spin text-xs" />
            <span>{t.gemstone_popup.urgency}</span>
          </div>

          {/* Glowing Magnetic CTA Button */}
          <div className="mt-4">
            <button
              onClick={handleCtaClick}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 px-6 py-3.5 sm:py-4 text-sm sm:text-base font-black text-neutral-950 shadow-xl shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/60 hover:brightness-110 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <span>{t.gemstone_popup.cta_button}</span>
            </button>
          </div>

          {/* Dismiss option */}
          <div className="mt-2.5 text-center">
            <button
              onClick={handleClose}
              type="button"
              className="text-[11px] sm:text-xs text-neutral-400 hover:text-neutral-200 transition-colors bg-transparent border-none outline-none cursor-pointer hover:underline p-1"
            >
              {t.gemstone_popup.dismiss}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
