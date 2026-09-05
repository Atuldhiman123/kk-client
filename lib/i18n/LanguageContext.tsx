'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Locale, Translations } from './types';
import { en } from './translations/en';
import { hi } from './translations/hi';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Translations;
  isHindi: boolean;
}

const translationsMap: Record<Locale, Translations> = {
  en,
  hi,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'kk_user_lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === 'hi' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'hi' : 'en');
  };

  const currentTranslations = translationsMap[locale] || en;

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        t: currentTranslations,
        isHindi: locale === 'hi',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider during SSR
    return {
      locale: 'en',
      setLocale: () => {},
      toggleLocale: () => {},
      t: en,
      isHindi: false,
    };
  }
  return context;
}
