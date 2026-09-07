import type { AstrologyChartResponse, BirthDetailsPayload } from './types';

// Zodiac Signs (1 to 12)
const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_LORDS: Record<string, string> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter',
};

// 27 Vedic Nakshatras with their traditional ruling planets
const NAKSHATRAS: Array<{ name: string; lord: string }> = [
  { name: 'Ashwini', lord: 'Ketu' },
  { name: 'Bharani', lord: 'Venus' },
  { name: 'Krittika', lord: 'Sun' },
  { name: 'Rohini', lord: 'Moon' },
  { name: 'Mrigashira', lord: 'Mars' },
  { name: 'Ardra', lord: 'Rahu' },
  { name: 'Punarvasu', lord: 'Jupiter' },
  { name: 'Pushya', lord: 'Saturn' },
  { name: 'Ashlesha', lord: 'Mercury' },
  { name: 'Magha', lord: 'Ketu' },
  { name: 'Purva Phalguni', lord: 'Venus' },
  { name: 'Uttara Phalguni', lord: 'Sun' },
  { name: 'Hasta', lord: 'Moon' },
  { name: 'Chitra', lord: 'Mars' },
  { name: 'Swati', lord: 'Rahu' },
  { name: 'Vishakha', lord: 'Jupiter' },
  { name: 'Anuradha', lord: 'Saturn' },
  { name: 'Jyeshtha', lord: 'Mercury' },
  { name: 'Mula', lord: 'Ketu' },
  { name: 'Purva Ashadha', lord: 'Venus' },
  { name: 'Uttara Ashadha', lord: 'Sun' },
  { name: 'Shravana', lord: 'Moon' },
  { name: 'Dhanishta', lord: 'Mars' },
  { name: 'Shatabhisha', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn' },
  { name: 'Revati', lord: 'Mercury' },
];

// Vimshottari Dasha Periods (in years) for each planet in order
const DASHA_PERIODS: Array<{ lord: string; years: number }> = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
];

/**
 * Normalizes degrees into range [0, 360)
 */
function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculates Julian Day Number from Date and UTC decimal hour
 */
function getJulianDay(year: number, month: number, day: number, utcHour: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + utcHour / 24.0;
  return jd;
}

/**
 * Computes Lahiri Ayanamsha (Chitra Paksha) for a given Julian Day
 */
function getLahiriAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0; // Centuries from J2000.0
  // Standard Lahiri Ayanamsha formula
  const ayanamsha = 23.85 + (t * 1.396) + 0.0003 * t * t;
  return ayanamsha;
}

/**
 * Calculates Nakshatra info from 0-360 sidereal longitude
 */
function getNakshatraInfo(totalDeg: number) {
  const norm = normalizeDeg(totalDeg);
  const nakshatraSpan = 360 / 27; // 13.33333°
  const index = Math.min(26, Math.max(0, Math.floor(norm / nakshatraSpan)));
  const nak = NAKSHATRAS[index];
  const degInNak = norm - (index * nakshatraSpan);
  const padaSpan = nakshatraSpan / 4; // 3.33333°
  const pada = Math.min(4, Math.max(1, Math.floor(degInNak / padaSpan) + 1));

  return {
    nakshatra: nak.name,
    nakshatraLord: nak.lord,
    pada,
    degInNak,
    nakshatraSpan,
  };
}

/**
 * Calculates active Vimshottari Mahadasha & Antardasha
 */
function calculateVimshottariDasha(
  moonDeg: number,
  birthDate: Date,
  targetDate: Date = new Date()
) {
  const { nakshatraLord, degInNak, nakshatraSpan } = getNakshatraInfo(moonDeg);

  // Find index in DASHA_PERIODS
  const dashaIdx = DASHA_PERIODS.findIndex((d) => d.lord.toLowerCase() === nakshatraLord.toLowerCase());
  const startDasha = DASHA_PERIODS[dashaIdx >= 0 ? dashaIdx : 0];

  // Fraction of the first dasha remaining at birth
  const fractionSpent = degInNak / nakshatraSpan;
  const balanceYears = startDasha.years * (1 - fractionSpent);

  // Age in years at target date
  const ageYears = Math.max(0, (targetDate.getTime() - birthDate.getTime()) / (365.25 * 24 * 3600 * 1000));

  let accumulatedYears = 0;
  let activeLord = startDasha.lord;
  let mahadashaYears = startDasha.years;
  let currentPeriodStart = new Date(birthDate.getTime() - fractionSpent * startDasha.years * 365.25 * 24 * 3600 * 1000);

  if (ageYears < balanceYears) {
    activeLord = startDasha.lord;
    mahadashaYears = startDasha.years;
  } else {
    accumulatedYears = balanceYears;
    let idx = (dashaIdx + 1) % DASHA_PERIODS.length;

    while (accumulatedYears < ageYears + 120) {
      const nextDasha = DASHA_PERIODS[idx];
      if (accumulatedYears + nextDasha.years >= ageYears) {
        activeLord = nextDasha.lord;
        mahadashaYears = nextDasha.years;
        const yearsIntoCurrent = ageYears - accumulatedYears;
        currentPeriodStart = new Date(targetDate.getTime() - yearsIntoCurrent * 365.25 * 24 * 3600 * 1000);
        break;
      }
      accumulatedYears += nextDasha.years;
      idx = (idx + 1) % DASHA_PERIODS.length;
    }
  }

  // Antardasha within this Mahadasha
  const activeDashaIdx = DASHA_PERIODS.findIndex((d) => d.lord === activeLord);
  let antardashaLord = activeLord;

  const antardashasOrder: string[] = [];
  for (let i = 0; i < DASHA_PERIODS.length; i++) {
    antardashasOrder.push(DASHA_PERIODS[(activeDashaIdx + i) % DASHA_PERIODS.length].lord);
  }

  const yearsIntoDasha = Math.max(0, (targetDate.getTime() - currentPeriodStart.getTime()) / (365.25 * 24 * 3600 * 1000));
  let antardashaAcc = 0;

  for (const adLord of antardashasOrder) {
    const adRef = DASHA_PERIODS.find((d) => d.lord === adLord);
    const adYears = (mahadashaYears * (adRef?.years || 7)) / 120;
    if (antardashaAcc + adYears >= yearsIntoDasha) {
      antardashaLord = adLord;
      break;
    }
    antardashaAcc += adYears;
  }

  return {
    currentMahadasha: {
      planet: activeLord,
      lord: activeLord,
      name: activeLord,
      mahadasha: activeLord,
      startDate: currentPeriodStart.toISOString().split('T')[0],
      endDate: new Date(currentPeriodStart.getTime() + mahadashaYears * 365.25 * 24 * 3600 * 1000)
        .toISOString()
        .split('T')[0],
    },
    currentAntardasha: {
      planet: antardashaLord,
      lord: antardashaLord,
      name: antardashaLord,
      antardasha: antardashaLord,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    },
  };
}

/**
 * Calculates Sidereal Vedic Horoscope (Lagna Kundli) from birth details
 */
export function calculateVedicChart(payload: BirthDetailsPayload): AstrologyChartResponse {
  const [year, month, day] = (payload.dateOfBirth || '1995-01-01').split('-').map(Number);
  const [hour, minute] = (payload.timeOfBirth || '12:00').split(':').map(Number);
  const tz = payload.timezone !== undefined ? Number(payload.timezone) : 5.5; // Default IST +5:30
  const lat = Number(payload.latitude || 26.8467); // Default Lucknow/Kanpur area
  const lon = Number(payload.longitude || 80.9462);

  // Decimal UTC hours
  const localDecimalHour = hour + minute / 60.0;
  const utcDecimalHour = localDecimalHour - tz;
  const jd = getJulianDay(year, month, day, utcDecimalHour);
  const ayanamsha = getLahiriAyanamsha(jd);

  // Days since J2000.0
  const d = jd - 2451545.0;

  // Greenwich Mean Sidereal Time (GMST) in degrees
  let gmst = 280.46061837 + 360.98564736629 * d;
  gmst = normalizeDeg(gmst);

  // Local Sidereal Time (LST / RAMC) in degrees
  const ramc = normalizeDeg(gmst + lon);

  // Obliquity of the Ecliptic (eps)
  const eps = degToRad(23.4392911 - (0.000130042 * d) / 365.25);

  // Calculate Tropical Ascendant
  // tan(Asc) = cos(RAMC) / (-sin(RAMC) * cos(eps) - tan(lat) * sin(eps))
  const ramcRad = degToRad(ramc);
  const latRad = degToRad(lat);
  const yAsc = Math.cos(ramcRad);
  const xAsc = -Math.sin(ramcRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);
  let tropicalAscRad = Math.atan2(yAsc, xAsc);
  let tropicalAscDeg = normalizeDeg(radToDeg(tropicalAscRad));

  // Sidereal (Nirayana) Ascendant
  const siderealAscDeg = normalizeDeg(tropicalAscDeg - ayanamsha);
  const ascSignIdx = Math.floor(siderealAscDeg / 30);
  const ascSign = ZODIAC_SIGNS[ascSignIdx];
  const ascSignDeg = siderealAscDeg % 30;
  const ascNak = getNakshatraInfo(siderealAscDeg);

  // Planetary Mean Positions (adjusted for speed & ephemeris epoch J2000)
  // Sidereal longitudes = (Tropical mean longitude + perturbations) - Ayanamsha
  const sunMean = normalizeDeg(280.466 + 0.98564736 * d);
  const sunM = degToRad(normalizeDeg(357.529 + 0.98560028 * d));
  const sunEqCenter = 1.9148 * Math.sin(sunM) + 0.02 * Math.sin(2 * sunM);
  const sunSidereal = normalizeDeg(sunMean + sunEqCenter - ayanamsha);

  const moonMean = normalizeDeg(218.316 + 13.176396 * d);
  const moonM = degToRad(normalizeDeg(134.963 + 13.064993 * d));
  const moonEqCenter = 6.289 * Math.sin(moonM);
  const moonSidereal = normalizeDeg(moonMean + moonEqCenter - ayanamsha);

  // Mars, Mercury, Jupiter, Venus, Saturn mean tropical positions
  const marsTropical = normalizeDeg(355.433 + 0.524033 * d + 1.8 * Math.sin(degToRad(19.373 + 0.524 * d)));
  const mercuryTropical = normalizeDeg(sunMean + 18.0 * Math.sin(degToRad(252.25 + 4.0923 * d)));
  const jupiterTropical = normalizeDeg(34.351 + 0.083091 * d + 0.55 * Math.sin(degToRad(34.351 + 0.083 * d)));
  const venusTropical = normalizeDeg(sunMean + 38.0 * Math.sin(degToRad(181.98 + 1.6021 * d)));
  const saturnTropical = normalizeDeg(50.077 + 0.033459 * d + 0.28 * Math.sin(degToRad(50.077 + 0.033 * d)));

  // Lunar Nodes (Rahu & Ketu - 18.6 year retrograde cycle)
  const rahuTropical = normalizeDeg(125.0445 - 0.05295376 * d);
  const rahuSidereal = normalizeDeg(rahuTropical - ayanamsha);
  const ketuSidereal = normalizeDeg(rahuSidereal + 180);

  const rawPlanets: Array<{
    name: string;
    deg: number;
    isRetrograde?: boolean;
  }> = [
    { name: 'Sun', deg: sunSidereal, isRetrograde: false },
    { name: 'Moon', deg: moonSidereal, isRetrograde: false },
    { name: 'Mars', deg: normalizeDeg(marsTropical - ayanamsha), isRetrograde: false },
    { name: 'Mercury', deg: normalizeDeg(mercuryTropical - ayanamsha), isRetrograde: false },
    { name: 'Jupiter', deg: normalizeDeg(jupiterTropical - ayanamsha), isRetrograde: false },
    { name: 'Venus', deg: normalizeDeg(venusTropical - ayanamsha), isRetrograde: false },
    { name: 'Saturn', deg: normalizeDeg(saturnTropical - ayanamsha), isRetrograde: false },
    { name: 'Rahu', deg: rahuSidereal, isRetrograde: true },
    { name: 'Ketu', deg: ketuSidereal, isRetrograde: true },
  ];

  // Process Planets with Signs, Houses, Nakshatras
  const planets = rawPlanets.map((p) => {
    const signIndex = Math.floor(p.deg / 30);
    const signName = ZODIAC_SIGNS[signIndex];
    const signDegree = p.deg % 30;
    // Whole sign house relative to Lagna
    const house = ((signIndex - ascSignIdx + 12) % 12) + 1;
    const nakInfo = getNakshatraInfo(p.deg);

    return {
      name: p.name,
      sign: signName,
      signDegree: Number(signDegree.toFixed(2)),
      totalDegree: Number(p.deg.toFixed(2)),
      house,
      nakshatra: nakInfo.nakshatra,
      nakshatraLord: nakInfo.nakshatraLord,
      pada: nakInfo.pada,
      isRetrograde: !!p.isRetrograde,
    };
  });

  // Calculate 12 Houses
  const houses = [];
  for (let h = 1; h <= 12; h++) {
    const hSignIndex = (ascSignIdx + (h - 1)) % 12;
    const hSign = ZODIAC_SIGNS[hSignIndex];
    houses.push({
      house: h,
      sign: hSign,
      cuspDegree: Number(ascSignDeg.toFixed(2)),
      signLord: SIGN_LORDS[hSign] || 'Mars',
    });
  }

  // Calculate Vimshottari Dasha
  const birthDateObj = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`);
  const dashas = calculateVimshottariDasha(moonSidereal, birthDateObj, new Date());

  return {
    birthDetails: {
      dateOfBirth: payload.dateOfBirth,
      timeOfBirth: payload.timeOfBirth,
      latitude: lat,
      longitude: lon,
      timezone: tz,
    },
    ascendant: {
      sign: ascSign,
      signDegree: Number(ascSignDeg.toFixed(2)),
      totalDegree: Number(siderealAscDeg.toFixed(2)),
      nakshatra: ascNak.nakshatra,
      nakshatraLord: ascNak.nakshatraLord,
      pada: ascNak.pada,
      house: 1,
    },
    planets,
    houses,
    dashas,
  };
}
