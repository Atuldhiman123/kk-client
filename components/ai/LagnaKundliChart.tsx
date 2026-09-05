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

interface PlanetPlacement {
  name: string;
  short: string;
  isRetrograde?: boolean;
}

export const LagnaKundliChart: React.FC<LagnaKundliChartProps> = ({ chartData, className = '' }) => {
  // Compute house signs and planetary placements
  const { houseSigns, housePlanets, moonSign, moonNakshatra, lagnaSign, lagnaNakshatra, currentMahadasha } =
    useMemo<{
      houseSigns: Record<number, number>;
      housePlanets: Record<number, PlanetPlacement[]>;
      moonSign: string | null;
      moonNakshatra: string | null;
      lagnaSign: string | null;
      lagnaNakshatra: string | null;
      currentMahadasha: string | null;
    }>(() => {
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

          // Filter traditional Vedic planets
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
      <div
        className={`rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#070B14] via-[#0F172A] to-[#070B14] p-4 text-center shadow-xl text-white ${className}`}
      >
        <div className="py-4 text-xs">
          <span className="text-3xl block mb-1.5 filter drop-shadow">☸️</span>
          <p className="font-bold text-sm text-amber-300 font-serif tracking-wide">LAGNA KUNDLI (लग्न चक्र)</p>
          <p className="mt-1 text-slate-300 text-xs max-w-xs mx-auto">
            Add birth date &amp; time above to view your Vedic Lagna Chart &amp; planetary positions.
          </p>
        </div>
      </div>
    );
  }

  // Coordinates for North Indian Vedic Chart (300x300 canvas)
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
    <div
      className={`rounded-2xl border border-amber-400/40 bg-gradient-to-br from-[#060911] via-[#0E1726] to-[#060911] p-3 sm:p-3.5 shadow-2xl space-y-2.5 text-white ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/25 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">☸️</span>
          <h3 className="font-serif text-xs font-bold text-amber-300 uppercase tracking-wider">
            LAGNA KUNDLI (लग्न चक्र)
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[11px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/60 shadow-xs">
          Lagna: {lagnaSign}
        </span>
      </div>

      {/* Horizontal Layout: Left Side (Details) | Right Side (SVG Chart) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
        {/* Left Column (sm:col-span-5): Lagna, Rashi & Active Mahadasha */}
        <div className="sm:col-span-5 space-y-2">
          {/* Lagna Highlight Card */}
          <div className="rounded-xl bg-slate-900/95 p-2 border border-amber-400/40 shadow-xs">
            <div className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">
              Lagna (लग्न)
            </div>
            <div className="font-extrabold text-amber-200 text-xs mt-0.5 flex items-center justify-between">
              <span>{lagnaSign || '—'}</span>
              <span className="text-[11px] text-amber-300 font-serif font-bold">
                {lagnaSign ? SIGN_MAP[lagnaSign.toLowerCase()]?.hi : ''}
              </span>
            </div>
            {lagnaNakshatra && (
              <div className="text-[9.5px] text-slate-300 mt-0.5 truncate">
                Nak: <span className="text-amber-100 font-bold">{lagnaNakshatra}</span>
              </div>
            )}
          </div>

          {/* Rashi Highlight Card */}
          <div className="rounded-xl bg-slate-900/95 p-2 border border-sky-400/40 shadow-xs">
            <div className="text-[9px] font-bold text-sky-300 uppercase tracking-wider">
              Rashi (राशि / Moon)
            </div>
            <div className="font-extrabold text-sky-200 text-xs mt-0.5 flex items-center justify-between">
              <span>{moonSign || '—'}</span>
              <span className="text-[11px] text-sky-300 font-serif font-bold">
                {moonSign ? SIGN_MAP[moonSign.toLowerCase()]?.hi : ''}
              </span>
            </div>
            {moonNakshatra && (
              <div className="text-[9.5px] text-slate-300 mt-0.5 truncate">
                Janma Nak: <span className="text-sky-100 font-bold">{moonNakshatra}</span>
              </div>
            )}
          </div>

          {/* Active Mahadasha Card */}
          {currentMahadasha && (
            <div className="rounded-xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 p-2 border border-amber-400/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs shrink-0">⏳</span>
                <div className="min-w-0">
                  <span className="text-[8.5px] text-amber-300 uppercase font-bold block">Mahadasha</span>
                  <span className="font-extrabold text-amber-100 text-[10.5px] truncate block">{currentMahadasha}</span>
                </div>
              </div>
              <span className="text-[8.5px] font-black text-amber-900 bg-amber-300 border border-amber-200 px-1.5 py-0.2 rounded-full shadow-xs shrink-0 ml-1">
                Running
              </span>
            </div>
          )}
        </div>

        {/* Right Column (sm:col-span-7): The SVG North Indian Lagna Chart */}
        <div className="sm:col-span-7 flex justify-center items-center">
          <div className="relative w-full max-w-[210px] aspect-square flex items-center justify-center p-1 rounded-2xl bg-[#050811] border-2 border-amber-500/40 shadow-inner">
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full select-none"
            >
              {/* Background Outer Border */}
              <rect
                x="3"
                y="3"
                width="294"
                height="294"
                fill="#080D1A"
                stroke="#F59E0B"
                strokeWidth="3"
                rx="8"
              />

              {/* Inner Accent Border */}
              <rect
                x="8"
                y="8"
                width="284"
                height="284"
                fill="none"
                stroke="#78350F"
                strokeWidth="1"
                rx="6"
              />

              {/* Kundli Diamond Layout Lines in Radiant Yellow / Gold */}
              <line x1="3" y1="3" x2="297" y2="297" stroke="#FBBF24" strokeWidth="2" />
              <line x1="3" y1="297" x2="297" y2="3" stroke="#FBBF24" strokeWidth="2" />
              <polygon
                points="150,3 297,150 150,297 3,150"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
              />

              {/* Render House Signs and Planets for all 12 Houses */}
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                const signNum = houseSigns[h] || h;
                const signPos = signPositions[h];
                const pPos = planetPositions[h];
                const planets = housePlanets[h] || [];

                return (
                  <g key={`house-${h}`}>
                    {/* Zodiac Sign Number (Rashi Num) in Bright Luminous Golden Yellow */}
                    <text
                      x={signPos.x}
                      y={signPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#FEF08A"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'serif',
                        fontWeight: '900',
                        filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.9))',
                      }}
                    >
                      {signNum}
                    </text>

                    {/* Planets placed in this house */}
                    {planets.length > 0 && (
                      <g>
                        {planets.map((p, idx) => {
                          const offsetY = (idx - (planets.length - 1) / 2) * 13;
                          const isAsc = p.short === 'Asc';
                          const isMoon = p.short === 'Mo';
                          const isSun = p.short === 'Su';
                          const isMars = p.short === 'Ma';
                          const isJup = p.short === 'Ju';
                          const isSat = p.short === 'Sa';

                          let textColor = '#FBBF24'; // Golden Amber
                          if (isAsc) textColor = '#FF6B6B'; // Vibrant Coral Red for Ascendant
                          if (isMoon) textColor = '#38BDF8'; // Luminous Sky Blue for Moon
                          if (isSun) textColor = '#FDBA74'; // Warm Saffron for Sun
                          if (isMars) textColor = '#FB7185'; // Rose for Mars
                          if (isJup) textColor = '#4ADE80'; // Bright Emerald for Jupiter
                          if (isSat) textColor = '#A78BFA'; // Violet for Saturn

                          return (
                            <text
                              key={`${p.short}-${idx}`}
                              x={pPos.x}
                              y={pPos.y + offsetY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={textColor}
                              style={{
                                fontSize: isAsc ? '10.5px' : '10px',
                                fontWeight: isAsc || isMoon ? '900' : '800',
                                fontFamily: 'sans-serif',
                                filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.95))',
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
        </div>
      </div>
    </div>
  );
};
