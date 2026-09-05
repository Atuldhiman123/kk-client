'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'header' | 'mobile';
}

export function LanguageSwitcher({ className = '', variant = 'header' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center justify-between rounded-xl bg-orange-100/70 p-1 border border-orange-200/80 ${className}`}>
        <button
          onClick={() => setLocale('en')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            locale === 'en'
              ? 'bg-white text-orange-950 shadow-xs border border-orange-200 font-extrabold'
              : 'text-neutral-600 hover:text-orange-900'
          }`}
        >
          <span>English</span>
        </button>
        <button
          onClick={() => setLocale('hi')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            locale === 'hi'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs font-extrabold'
              : 'text-neutral-600 hover:text-orange-900'
          }`}
        >
          <span>हिन्दी</span>
        </button>
      </div>
    );
  }

  // Desktop Header Switcher - Sleek Segmented Pill with High-Contrast Active State
  return (
    <div
      className={`inline-flex items-center rounded-full border border-orange-300 bg-white/95 p-0.5 shadow-2xs shrink-0 select-none ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      <button
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all duration-200 cursor-pointer ${
          locale === 'en'
            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xs scale-102'
            : 'text-neutral-600 hover:text-orange-900 hover:bg-orange-50/60'
        }`}
        style={locale === 'en' ? { color: '#ffffff' } : {}}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('hi')}
        className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-black transition-all duration-200 cursor-pointer ${
          locale === 'hi'
            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xs scale-102'
            : 'text-neutral-600 hover:text-orange-900 hover:bg-orange-50/60'
        }`}
        style={locale === 'hi' ? { color: '#ffffff' } : {}}
      >
        हिन्दी
      </button>
    </div>
  );
}
