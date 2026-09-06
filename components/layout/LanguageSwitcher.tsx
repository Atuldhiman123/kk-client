'use client';

import React from 'react';
import { Segmented } from 'antd';
import { useLanguage } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'header' | 'mobile';
}

export function LanguageSwitcher({ className = '', variant = 'header' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  if (variant === 'mobile') {
    return (
      <div className={`w-full ${className}`}>
        <Segmented
          block
          size="middle"
          value={locale}
          onChange={(val) => setLocale(val as 'en' | 'hi')}
          options={[
            {
              label: <span className="font-bold text-xs py-1">English</span>,
              value: 'en',
            },
            {
              label: <span className="font-bold text-xs py-1">हिन्दी</span>,
              value: 'hi',
            },
          ]}
          className="w-full !bg-orange-100/80 !border !border-orange-200/90 !p-0.5 !rounded-xl"
        />
      </div>
    );
  }

  // Desktop Header Switcher - Sleek compact Segmented Control
  return (
    <div className={`shrink-0 flex items-center ${className}`}>
      <Segmented
        size="small"
        value={locale}
        onChange={(val) => setLocale(val as 'en' | 'hi')}
        options={[
          {
            label: <span className="font-extrabold text-[10px] sm:text-[11px] px-0.5 sm:px-1">EN</span>,
            value: 'en',
          },
          {
            label: <span className="font-extrabold text-[10px] sm:text-[11px] px-0.5 sm:px-1">हिन्दी</span>,
            value: 'hi',
          },
        ]}
        className="!border !border-orange-200/90 !bg-orange-50/70 shadow-2xs !rounded-lg text-neutral-800"
      />
    </div>
  );
}
