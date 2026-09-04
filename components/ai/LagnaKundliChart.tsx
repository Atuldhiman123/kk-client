'use client';

import React, { useMemo } from 'react';
import type { AstrologyChartResponse } from '@/lib/types';

interface LagnaKundliChartProps {
  chartData: AstrologyChartResponse | null;
  className?: string;
}

const SIGN_MAP: Record<string, { num: number; hi: string; en: string }> = {
  aries: { num: 1, hi: 'मेष', en: 'Aries' },
  taurus: { num: 2, hi: 'वृषभ', en: 'Taurus' },
  gemini: { num: 3, hi: 'मिथुन', en: 'Gemini' },
  cancer: { num: 4, hi: 'कर्क', en: 'Cancer' },
  leo: { num: 5, hi: 'सिंह', en: 'Leo' },
  virgo: { num: 6, hi: 'कन्या', en: 'Virgo' },
  libra: { num: 7, hi: 'तुला', en: 'Libra' },
  scorpio: { num: 8, hi: 'वृश्चिक', en: 'Scorpio' },
  sagittarius: { num: 9, hi: 'धनु', en: 'Sagittarius' },
  capricorn: { num: 10, hi: 'मकर', en: 'Capricorn' },
  aquarius: { num: 11, hi: 'कुम्भ', en: 'Aquarius' },
  pisces: { num: 12, hi: 'मीन', en: 'Pisces' },
};

const PLANET_SHORT_NAMES: Record<string, { short: string; hi: string }> = {
  sun: { short: 'Su', hi: 'सूर्य' },
  moon: { short: 'Mo', hi: 'चन्द्र' },
  mars: { short: 'Ma', hi: 'मंगल' },
  mercury: { short: 'Me', hi: 'बुध' },
  jupiter: { short: 'Ju', hi: 'गुरु' },
  venus: { short: 'Ve', hi: 'शुक्र' },
  saturn: { short: 'Sa', hi: 'शनि' },
  rahu: { short: 'Ra', hi: 'राहु' },
  ketu: { short: 'Ke', hi: 'केतु' },
  uranus: { short: 'Ur', hi: 'यूरेनस' },
  neptune: { short: 'Ne', hi: 'नेपच्यून' },
  pluto: { short: 'Pl', hi: 'प्लूटो' },
};

export const LagnaKundliChart: React.FC<LagnaKundliChartProps> = ({ chartData, className = '' }) => {
  // Compute house signs and planetary placements
  const { houseSigns, housePlanets, moonSign, moonNakshatra, lagnaSign, lagnaNakshatra, currentMahadasha } =
    useMemo(() => {
      if (!chartData || !chartData.ascendant) {
        return {
          houseSigns: {},
          housePlanets: {},
          moonSign: null,
          moonNakshatra: null,
          lagnaSign: null,
          lagnaNakshatra: null,
          currentMahadasha: null,
        };
      }

      const ascSignName = (chartData.ascendant.sign || '').toLowerCase();
      const ascSignNum = SIGN_MAP[ascSignName]?.num || 1;

      // Calculate signs for houses 1 to 12
      const hSigns: Record<number, number> = {};
      for (let h = 1; h <= 12; h++) {
        let s = (ascSignNum + (h - 1)) % 12;
        if (s === 0) s = 12;
        hSigns[h] = s;
      }

      // Group Vedic planets by house
      const hPlanets: Record<number, { name: string; short: string; isRetrograde?: boolean }[]> = {};
      for (let i = 1; i <= 12; i++) hPlanets[i] = [];

      // Add Ascendant marker to House 1
      hPlanets[1].push({ name: 'Ascendant', short: 'Asc', isRetrograde: false });

      let mSign: string | null = null;
      let mNakshatra: string | null = null;

      if (Array.isArray(chartData.planets)) {
        chartData.planets.forEach((p) => {
          const pNameLower = p.name.toLowerCase();
          if (pNameLower === 'moon') {
            mSign = p.sign;
            mNakshatra = p.nakshatra || null;
          }

          // Filter only traditional Vedic + outer if needed
          if (PLANET_SHORT_NAMES[pNameLower] && p.house >= 1 && p.house <= 12) {
            hPlanets[p.house].push({
              name: p.name,
              short: PLANET_SHORT_NAMES[pNameLower]?.short || p.name.substring(0, 2),
              isRetrograde: !!p.isRetrograde,
            });
          }
        });
      }

      const dasha =
        chartData.dashas?.currentMahadasha?.lord ||
        chartData.dashas?.currentMahadasha?.planet ||
        (chartData.dashas?.mahadashas && chartData.dashas.mahadashas[0]?.planet) ||
        null;

      return {
        houseSigns: hSigns,
        housePlanets: hPlanets,
        moonSign: mSign,
        moonNakshatra: mNakshatra,
        lagnaSign: chartData.ascendant.sign,
        lagnaNakshatra: chartData.ascendant.nakshatra,
        currentMahadasha: dasha,
      };
    }, [chartData]);

  if (!chartData || !chartData.ascendant) {
    return (
      <div className={`rounded-2xl border border-orange-200/80 bg-white p-4 text-center shadow-sm ${className}`}>
        <div className="py-6 text-xs text-neutral-500">
          <span className="text-2xl block mb-2">☸️</span>
          <p className="font-bold text-neutral-700">Lagna Kundli Chart</p>
          <p className="mt-1">Add your birth details to generate your authentic North Indian Janam Kundli.</p>
        </div>
      </div>
    );
  }

  // Coordinates and layout definition for North Indian Vedic Chart (300x300 canvas)
  // House sign number label positions
  const signPositions: Record<number, { x: number; y: number }> = {
    1: { x: 150, y: 115 },
    2: { x: 95, y: 45 },
    3: { x: 45, y: 95 },
    4: { x: 115, y: 150 },
    5: { x: 45, y: 205 },
    6: { x: 95, y: 255 },
    7: { x: 150, y: 185 },
    8: { x: 205, y: 255 },
    9: { x: 255, y: 205 },
    10: { x: 185, y: 150 },
    11: { x: 255, y: 95 },
    12: { x: 205, y: 45 },
  };

  // House planet center positions
  const planetPositions: Record<number, { x: number; y: number }> = {
    1: { x: 150, y: 65 },
    2: { x: 65, y: 25 },
    3: { x: 25, y: 65 },
    4: { x: 65, y: 150 },
    5: { x: 25, y: 235 },
    6: { x: 65, y: 275 },
    7: { x: 150, y: 235 },
    8: { x: 235, y: 275 },
    9: { x: 275, y: 235 },
    10: { x: 235, y: 150 },
    11: { x: 275, y: 65 },
    12: { x: 235, y: 25 },
  };

  return (
    <div className={`rounded-2xl border border-orange-200/90 bg-white p-4 shadow-sm space-y-3.5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange-100 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">☸️</span>
          <h3 className="font-serif text-xs font-bold text-orange-950 uppercase tracking-wider">
            Lagna Kundli (लग्न चक्र)
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
          Lagna: {lagnaSign}
        </span>
      </div>

      {/* SVG North Indian Lagna Chart */}
      <div className="relative mx-auto w-full max-w-[280px] aspect-square flex items-center justify-center">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-xs select-none"
          style={{ background: '#FFFDF9' }}
        >
          {/* Background Outer Border */}
          <rect
            x="2"
            y="2"
            width="296"
            height="296"
            fill="#FFFBF2"
            stroke="#D97706"
            strokeWidth="2.5"
            rx="4"
          />

          {/* Kundli Diamond Layout Lines */}
          {/* Outer Square border */}
          <rect x="2" y="2" width="296" height="296" fill="none" stroke="#D97706" strokeWidth="2" />
          {/* Diagonal 1: (0,0) to (300,300) */}
          <line x1="2" y1="2" x2="298" y2="298" stroke="#D97706" strokeWidth="1.5" />
          {/* Diagonal 2: (0,300) to (300,0) */}
          <line x1="2" y1="298" x2="298" y2="2" stroke="#D97706" strokeWidth="1.5" />
          {/* Inner Diamond: (150,0) -> (300,150) -> (150,300) -> (0,150) */}
          <polygon
            points="150,2 298,150 150,298 2,150"
            fill="none"
            stroke="#D97706"
            strokeWidth="1.8"
          />

          {/* Render House Signs and Planets for all 12 Houses */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
            const signNum = houseSigns[h] || h;
            const signPos = signPositions[h];
            const pPos = planetPositions[h];
            const planets = housePlanets[h] || [];

            return (
              <g key={`house-${h}`}>
                {/* Zodiac Sign Number (Rashi Num) */}
                <text
                  x={signPos.x}
                  y={signPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-bold fill-amber-700/80"
                  style={{ fontSize: '10px', fontFamily: 'serif' }}
                >
                  {signNum}
                </text>

                {/* Planets placed in this house */}
                {planets.length > 0 && (
                  <g>
                    {planets.map((p, idx) => {
                      // Stagger multiple planets cleanly
                      const offsetY = (idx - (planets.length - 1) / 2) * 11;
                      const isAsc = p.short === 'Asc';
                      const isMoon = p.short === 'Mo';
                      const isSun = p.short === 'Su';

                      let textColor = '#78350F'; // deep amber/brown
                      if (isAsc) textColor = '#DC2626'; // Red for Ascendant
                      if (isMoon) textColor = '#0284C7'; // Blue for Moon
                      if (isSun) textColor = '#EA580C'; // Orange for Sun

                      return (
                        <text
                          key={`${p.short}-${idx}`}
                          x={pPos.x}
                          y={pPos.y + offsetY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={textColor}
                          style={{
                            fontSize: '9.5px',
                            fontWeight: isAsc || isMoon ? '800' : '700',
                            fontFamily: 'sans-serif',
                          }}
                        >
                          {p.short}
                          {p.isRetrograde ? '(R)' : ''}
                        </text>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Key Kundli Highlights Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs border-t border-orange-100 pt-2.5">
        <div className="rounded-xl bg-orange-50/70 p-2 border border-orange-100/80">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            Lagna (लग्न)
          </div>
          <div className="font-bold text-orange-950 mt-0.5 flex items-center justify-between">
            <span>{lagnaSign || '—'}</span>
            <span className="text-[10px] text-orange-700">
              {lagnaSign ? SIGN_MAP[lagnaSign.toLowerCase()]?.hi : ''}
            </span>
          </div>
          {lagnaNakshatra && (
            <div className="text-[10px] text-neutral-500 mt-0.5">
              Nakshatra: <span className="text-neutral-700 font-medium">{lagnaNakshatra}</span>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-sky-50/70 p-2 border border-sky-100/80">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
            Rashi (राशि / Moon)
          </div>
          <div className="font-bold text-sky-950 mt-0.5 flex items-center justify-between">
            <span>{moonSign || '—'}</span>
            <span className="text-[10px] text-sky-700">
              {moonSign ? SIGN_MAP[moonSign.toLowerCase()]?.hi : ''}
            </span>
          </div>
          {moonNakshatra && (
            <div className="text-[10px] text-neutral-500 mt-0.5">
              Janma Nak: <span className="text-neutral-700 font-medium">{moonNakshatra}</span>
            </div>
          )}
        </div>

        {currentMahadasha && (
          <div className="col-span-2 rounded-xl bg-amber-50/80 p-2 border border-amber-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">⏳</span>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-semibold block">Active Mahadasha</span>
                <span className="font-bold text-amber-950">{currentMahadasha} Mahadasha</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
              Running
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
