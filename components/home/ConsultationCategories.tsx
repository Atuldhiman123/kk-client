'use client';

import {
  SafetyCertificateOutlined,
  UserOutlined,
  LockOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import type { ConsultationCategory } from '@/lib/types';
import { CategoryCard } from './CategoryCard';

const trustPoints = [
  { icon: <SafetyCertificateOutlined />, title: '100% Authentic', desc: 'Vedic guidance based on ancient scriptures.' },
  { icon: <UserOutlined />, title: 'Expert Astrologers', desc: 'Experienced professionals with years of practical knowledge.' },
  { icon: <LockOutlined />, title: 'Private & Confidential', desc: 'Your privacy and trust are our top priority.' },
  { icon: <GiftOutlined />, title: 'Personalized Remedies', desc: 'Custom remedies and insights tailored just for you.' },
];

export function ConsultationCategories({ categories }: { categories: ConsultationCategory[] }) {
  return (
    <section id="consultations" className="py-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-orange-800 uppercase tracking-wider">
            🏷️ Specialized Guidance
          </span>
          <h2 className="mt-2.5 sm:mt-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 font-serif">
            Consultation Categories
          </h2>
          <div className="mx-auto mt-2 sm:mt-3 flex items-center justify-center gap-2 text-orange-300">
            <span className="h-px w-8 sm:w-10 bg-orange-200" />
            <span className="text-orange-400">✦</span>
            <span className="h-px w-8 sm:w-10 bg-orange-200" />
          </div>
          <p className="mt-2 sm:mt-3 max-w-2xl mx-auto text-xs sm:text-base text-neutral-600">
            Select your area of interest to receive tailored birth chart readings, predictions, and authentic Vedic remedies.
          </p>
        </div>

        <div className="mt-6 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-10 sm:mt-14 rounded-2xl border border-orange-100 bg-orange-50/60 p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-white text-lg text-orange-600">
                  {point.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900">{point.title}</div>
                  <div className="mt-0.5 text-xs leading-snug text-neutral-500">{point.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
