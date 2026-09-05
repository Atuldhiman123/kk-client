'use client';

import { useState, useMemo } from 'react';
import {
  SafetyCertificateOutlined,
  UserOutlined,
  LockOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import type { ConsultationCategory } from '@/lib/types';
import { CategoryCard } from './CategoryCard';
import { useLanguage } from '@/lib/i18n';

export function ConsultationCategories({ categories }: { categories: ConsultationCategory[] }) {
  const [activeTab, setActiveTab] = useState('all');
  const { t } = useLanguage();

  const filterTabs = [
    { key: 'all', label: t.consultations.tabs.all },
    { key: 'career', label: t.consultations.tabs.career },
    { key: 'marriage', label: t.consultations.tabs.marriage },
    { key: 'business', label: t.consultations.tabs.business },
    { key: 'wealth', label: t.consultations.tabs.wealth },
    { key: 'family', label: t.consultations.tabs.family },
    { key: 'health', label: t.consultations.tabs.health },
  ];

  const trustPoints = [
    { icon: <SafetyCertificateOutlined />, title: t.consultations.trust_bar.authentic_title, desc: t.consultations.trust_bar.authentic_desc },
    { icon: <UserOutlined />, title: t.consultations.trust_bar.expert_title, desc: t.consultations.trust_bar.expert_desc },
    { icon: <LockOutlined />, title: t.consultations.trust_bar.private_title, desc: t.consultations.trust_bar.private_desc },
    { icon: <GiftOutlined />, title: t.consultations.trust_bar.remedies_title, desc: t.consultations.trust_bar.remedies_desc },
  ];

  const filteredCategories = useMemo(() => {
    if (activeTab === 'all') return categories;
    return categories.filter((c) => {
      const slug = c.slug.toLowerCase();
      const name = c.name.toLowerCase();
      if (activeTab === 'career') return slug.includes('career') || name.includes('career') || slug.includes('education');
      if (activeTab === 'marriage') return slug.includes('marriage') || slug.includes('love') || slug.includes('matching') || name.includes('marriage');
      if (activeTab === 'business') return slug.includes('business') || name.includes('business');
      if (activeTab === 'wealth') return slug.includes('finance') || slug.includes('wealth') || slug.includes('property') || name.includes('wealth');
      if (activeTab === 'family') return slug.includes('child') || slug.includes('family') || name.includes('child');
      if (activeTab === 'health') return slug.includes('health') || name.includes('health');
      return true;
    });
  }, [categories, activeTab]);

  return (
    <section id="consultations" className="py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-[#FFFDF9] via-orange-50/20 to-[#FFFDF9]">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100/90 border border-orange-200 px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-black text-orange-800 uppercase tracking-wider shadow-2xs">
            🏷️ {t.consultations.badge}
          </span>
          <h2 className="mt-2.5 sm:mt-3 text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 font-serif">
            {t.consultations.title} <span className="text-orange-600">{t.consultations.title_highlight}</span>
          </h2>
          <div className="mx-auto mt-2 sm:mt-3 flex items-center justify-center gap-2 text-orange-300">
            <span className="h-px w-8 sm:w-12 bg-orange-200" />
            <span className="text-orange-500 font-bold">✦ 🕉️ ✦</span>
            <span className="h-px w-8 sm:w-12 bg-orange-200" />
          </div>
          <p className="mt-2 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {t.consultations.subtitle}
          </p>
        </div>

        {/* Astrotalk-style Quick Filter Pills / Carousel Tabs */}
        <div className="mt-6 sm:mt-8 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold transition-all duration-200 shadow-2xs ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md scale-105 border-transparent'
                    : 'bg-white text-neutral-700 hover:bg-orange-50 hover:text-orange-900 border border-orange-200/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Categories Cards Grid */}
        <div className="mt-6 sm:mt-10 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Astrotalk-style Trust & Assurance Bar */}
        <div className="mt-12 sm:mt-16 rounded-3xl border-2 border-orange-200/90 bg-gradient-to-r from-orange-50/90 via-amber-50/50 to-orange-50/90 p-5 sm:p-7 shadow-sm">
          <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-orange-200 bg-white text-xl text-orange-600 shadow-xs">
                  {point.icon}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-neutral-900">{point.title}</div>
                  <div className="mt-0.5 text-[11px] sm:text-xs leading-snug text-neutral-600">{point.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

