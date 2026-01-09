/**
 * Solunar Calculation Library
 * 
 * Uses SunCalc library for accurate astronomical calculations.
 * SunCalc provides ~1 minute accuracy for sun/moon positions.
 * 
 * The solunar theory: Fish are most active when the moon is 
 * directly overhead (upper transit) or directly underfoot (lower transit).
 */

import SunCalc from 'suncalc';

// Moon phase constants
export type MoonPhase = 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' |
    'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';

export interface SolunarPeriod {
    type: 'major' | 'minor';
    start: Date;
    end: Date;
    rating: number; // 1-5 fishing quality
}

export interface DaySolunarData {
    date: Date;
    moonPhase: MoonPhase;
    moonIllumination: number; // 0-100%
    moonrise: Date | null;
    moonset: Date | null;
    sunrise: Date;
    sunset: Date;
    majorPeriods: SolunarPeriod[];
    minorPeriods: SolunarPeriod[];
    overallRating: number; // 1-5
    bestTime: string;
}

/**
 * Convert SunCalc moon phase (0-1) to our MoonPhase type
 * SunCalc phase: 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
 */
function phaseToMoonPhase(phase: number): MoonPhase {
    if (phase < 0.0625) return 'new';
    if (phase < 0.1875) return 'waxing-crescent';
    if (phase < 0.3125) return 'first-quarter';
    if (phase < 0.4375) return 'waxing-gibbous';
    if (phase < 0.5625) return 'full';
    if (phase < 0.6875) return 'waning-gibbous';
    if (phase < 0.8125) return 'last-quarter';
    if (phase < 0.9375) return 'waning-crescent';
    return 'new';
}

/**
 * Get moon phase using SunCalc
 */
export function getMoonPhase(date: Date): MoonPhase {
    const illumination = SunCalc.getMoonIllumination(date);
    return phaseToMoonPhase(illumination.phase);
}

/**
 * Get moon illumination percentage (0-100) using SunCalc
 */
export function getMoonIllumination(date: Date): number {
    const illumination = SunCalc.getMoonIllumination(date);
    return Math.round(illumination.fraction * 100);
}

/**
 * Get moon phase emoji
 */
export function getMoonEmoji(phase: MoonPhase): string {
    const emojis: Record<MoonPhase, string> = {
        'new': '🌑',
        'waxing-crescent': '🌒',
        'first-quarter': '🌓',
        'waxing-gibbous': '🌔',
        'full': '🌕',
        'waning-gibbous': '🌖',
        'last-quarter': '🌗',
        'waning-crescent': '🌘',
    };
    return emojis[phase];
}

/**
 * Get moon phase name in Romanian
 */
export function getMoonPhaseName(phase: MoonPhase): string {
    const names: Record<MoonPhase, string> = {
        'new': 'Lună Nouă',
        'waxing-crescent': 'În creștere',
        'first-quarter': 'Primul Pătrar',
        'waxing-gibbous': 'În creștere',
        'full': 'Lună Plină',
        'waning-gibbous': 'În scădere',
        'last-quarter': 'Ultimul Pătrar',
        'waning-crescent': 'În scădere',
    };
    return names[phase];
}

/**
 * Get moon times using SunCalc
 * Returns actual moonrise/moonset for given location
 */
function getMoonTimes(date: Date, lat: number, lng: number): { rise: Date | null; set: Date | null } {
    const times = SunCalc.getMoonTimes(date, lat, lng);
    return {
        rise: times.rise || null,
        set: times.set || null
    };
}

/**
 * Get sun times using SunCalc
 * Returns actual sunrise/sunset for given location
 */
function getSunTimes(date: Date, lat: number, lng: number): { sunrise: Date; sunset: Date } {
    const times = SunCalc.getTimes(date, lat, lng);
    return {
        sunrise: times.sunrise,
        sunset: times.sunset
    };
}

/**
 * Calculate moon transit times (when moon is highest and lowest)
 * Major feeding periods occur around these times
 *
 * Optimized: Uses coarse-to-fine search to reduce iterations from 96 to ~20
 */
function getMoonTransitTimes(date: Date, lat: number, lng: number): { upper: Date | null; lower: Date | null } {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Phase 1: Coarse search every 60 minutes to find rough maximum
    let coarseMax = -Infinity;
    let coarseMaxTime = startOfDay;

    for (let hours = 0; hours < 24; hours++) {
        const checkTime = new Date(startOfDay.getTime() + hours * 3600000);
        const moonPos = SunCalc.getMoonPosition(checkTime, lat, lng);
        const altitude = moonPos.altitude * (180 / Math.PI);

        if (altitude > coarseMax) {
            coarseMax = altitude;
            coarseMaxTime = checkTime;
        }
    }

    // Phase 2: Fine search around the coarse maximum (±90 minutes in 5-minute steps)
    let upperTransit: Date | null = null;
    let maxAltitude = -Infinity;

    const searchStart = coarseMaxTime.getTime() - 90 * 60000;
    const searchEnd = coarseMaxTime.getTime() + 90 * 60000;

    for (let time = searchStart; time <= searchEnd; time += 5 * 60000) {
        const checkTime = new Date(time);
        if (checkTime.getDate() !== date.getDate()) continue;

        const moonPos = SunCalc.getMoonPosition(checkTime, lat, lng);
        const altitude = moonPos.altitude * (180 / Math.PI);

        if (altitude > maxAltitude) {
            maxAltitude = altitude;
            upperTransit = checkTime;
        }
    }

    // Lower transit is approximately 12 hours from upper transit
    let lowerTransit: Date | null = null;
    if (upperTransit) {
        const lowerTime = new Date(upperTransit.getTime() + 12 * 3600000);
        // Adjust to same day if needed
        if (lowerTime.getDate() !== date.getDate()) {
            const altLowerTime = new Date(upperTransit.getTime() - 12 * 3600000);
            if (altLowerTime.getDate() === date.getDate()) {
                lowerTransit = altLowerTime;
            }
        } else {
            lowerTransit = lowerTime;
        }
    }

    return { upper: upperTransit, lower: lowerTransit };
}

// Constants for period calculations
const MAJOR_PERIOD_DURATION_MS = 60 * 60 * 1000; // 1 hour = 3600000ms
const MINOR_PERIOD_DURATION_MS = 30 * 60 * 1000; // 30 minutes = 1800000ms
const PHASE_BOOST_THRESHOLD_LOW = 0.1;
const PHASE_BOOST_THRESHOLD_HIGH_MIN = 0.45;
const PHASE_BOOST_THRESHOLD_HIGH_MAX = 0.55;

/**
 * Calculate major periods (around moon transit - highest activity)
 * Major periods last approximately 2 hours centered on transit
 */
function calculateMajorPeriods(date: Date, lat: number, lng: number): SolunarPeriod[] {
    const periods: SolunarPeriod[] = [];
    const transits = getMoonTransitTimes(date, lat, lng);
    const illumination = SunCalc.getMoonIllumination(date);

    // Rating boost for new/full moon
    const isNewOrFullMoon = illumination.phase < PHASE_BOOST_THRESHOLD_LOW ||
        (illumination.phase > PHASE_BOOST_THRESHOLD_HIGH_MIN &&
            illumination.phase < PHASE_BOOST_THRESHOLD_HIGH_MAX);
    const phaseBoost = isNewOrFullMoon ? 1 : 0;
    const baseRating = 4 + phaseBoost;

    // Upper transit (moon overhead) - strongest period
    if (transits.upper) {
        const start = new Date(transits.upper.getTime() - MAJOR_PERIOD_DURATION_MS);
        const end = new Date(transits.upper.getTime() + MAJOR_PERIOD_DURATION_MS);

        periods.push({
            type: 'major',
            start,
            end,
            rating: Math.min(5, baseRating),
        });
    }

    // Lower transit (moon underfoot) - also strong
    if (transits.lower) {
        const start = new Date(transits.lower.getTime() - MAJOR_PERIOD_DURATION_MS);
        const end = new Date(transits.lower.getTime() + MAJOR_PERIOD_DURATION_MS);

        periods.push({
            type: 'major',
            start,
            end,
            rating: Math.min(5, baseRating),
        });
    }

    return periods;
}

/**
 * Calculate minor periods (around moonrise/moonset)
 * Minor periods last approximately 1 hour centered on rise/set
 */
function calculateMinorPeriods(date: Date, lat: number, lng: number): SolunarPeriod[] {
    const periods: SolunarPeriod[] = [];
    const moonTimes = getMoonTimes(date, lat, lng);

    // Moonrise period
    if (moonTimes.rise && moonTimes.rise.getDate() === date.getDate()) {
        const start = new Date(moonTimes.rise.getTime() - MINOR_PERIOD_DURATION_MS);
        const end = new Date(moonTimes.rise.getTime() + MINOR_PERIOD_DURATION_MS);

        periods.push({
            type: 'minor',
            start,
            end,
            rating: 3,
        });
    }

    // Moonset period
    if (moonTimes.set && moonTimes.set.getDate() === date.getDate()) {
        const start = new Date(moonTimes.set.getTime() - MINOR_PERIOD_DURATION_MS);
        const end = new Date(moonTimes.set.getTime() + MINOR_PERIOD_DURATION_MS);

        periods.push({
            type: 'minor',
            start,
            end,
            rating: 3,
        });
    }

    return periods;
}

// Rating constants
const QUARTER_MOON_PHASE_MIN_1 = 0.2;
const QUARTER_MOON_PHASE_MAX_1 = 0.3;
const QUARTER_MOON_PHASE_MIN_2 = 0.7;
const QUARTER_MOON_PHASE_MAX_2 = 0.8;
const DUAL_MAJOR_PERIOD_BONUS = 0.5;

/**
 * Calculate overall fishing rating for the day (1-5)
 * Based on moon phase and period quality
 */
function calculateOverallRating(date: Date, majorPeriods: SolunarPeriod[], minorPeriods: SolunarPeriod[]): number {
    const illumination = SunCalc.getMoonIllumination(date);
    const phase = illumination.phase;

    let baseRating = 3;

    // New moon (0) and full moon (0.5) are best
    const isNewOrFullMoon = phase < PHASE_BOOST_THRESHOLD_LOW ||
        (phase > PHASE_BOOST_THRESHOLD_HIGH_MIN && phase < PHASE_BOOST_THRESHOLD_HIGH_MAX);
    if (isNewOrFullMoon) {
        baseRating = 5;
    }
    // Quarter moons (0.25, 0.75)
    else if ((phase > QUARTER_MOON_PHASE_MIN_1 && phase < QUARTER_MOON_PHASE_MAX_1) ||
        (phase > QUARTER_MOON_PHASE_MIN_2 && phase < QUARTER_MOON_PHASE_MAX_2)) {
        baseRating = 4;
    }

    // Bonus for having both major periods in the day
    if (majorPeriods.length >= 2) {
        baseRating = Math.min(5, baseRating + DUAL_MAJOR_PERIOD_BONUS);
    }

    return Math.round(baseRating);
}

/**
 * Get best fishing time description
 */
function getBestTime(majorPeriods: SolunarPeriod[], minorPeriods: SolunarPeriod[]): string {
    const allPeriods = [...majorPeriods, ...minorPeriods].sort((a, b) => a.start.getTime() - b.start.getTime());

    if (allPeriods.length === 0) return 'Fără perioade optime';

    // Find the first major period, or first minor if no major
    const best = majorPeriods[0] || minorPeriods[0];
    if (!best) return 'Fără perioade optime';

    const startHour = best.start.getHours().toString().padStart(2, '0');
    const startMin = best.start.getMinutes().toString().padStart(2, '0');
    const endHour = best.end.getHours().toString().padStart(2, '0');
    const endMin = best.end.getMinutes().toString().padStart(2, '0');

    return `${startHour}:${startMin} - ${endHour}:${endMin}`;
}

/**
 * Main function: Get complete solunar data for a date and location
 * 
 * @param date - The date to calculate for
 * @param lat - Latitude (default: Bucharest 44.4268)
 * @param lng - Longitude (default: Bucharest 26.1025)
 */
export function getSolunarData(date: Date, lat: number = 44.4268, lng: number = 26.1025): DaySolunarData {
    const moonPhase = getMoonPhase(date);
    const moonIllumination = getMoonIllumination(date);
    const moonTimes = getMoonTimes(date, lat, lng);
    const sunTimes = getSunTimes(date, lat, lng);

    const majorPeriods = calculateMajorPeriods(date, lat, lng);
    const minorPeriods = calculateMinorPeriods(date, lat, lng);

    return {
        date,
        moonPhase,
        moonIllumination,
        moonrise: moonTimes.rise,
        moonset: moonTimes.set,
        sunrise: sunTimes.sunrise,
        sunset: sunTimes.sunset,
        majorPeriods,
        minorPeriods,
        overallRating: calculateOverallRating(date, majorPeriods, minorPeriods),
        bestTime: getBestTime(majorPeriods, minorPeriods),
    };
}

/**
 * Get solunar data for a week starting from given date
 */
export function getWeekSolunarData(startDate: Date, lat: number = 44.4268, lng: number = 26.1025): DaySolunarData[] {
    return getForecastData(startDate, 14, lat, lng);
}

/**
 * Get solunar data for N days starting from given date
 */
export function getForecastData(startDate: Date, days: number = 14, lat: number = 44.4268, lng: number = 26.1025): DaySolunarData[] {
    const data: DaySolunarData[] = [];

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        data.push(getSolunarData(date, lat, lng));
    }

    return data;
}

/**
 * Format time for display (24-hour format)
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Fish Species Data
interface FishSpecies {
    name: string;
    seasons: number[]; // 0=Spring, 1=Summer, 2=Autumn, 3=Winter
    moonPhases: MoonPhase[];
    minTemp?: number;
}

const FISH_DATA: FishSpecies[] = [
    // Răpitori (Predators)
    { name: 'Știucă', seasons: [0, 2, 3], moonPhases: ['full', 'new', 'waxing-gibbous', 'waning-gibbous'] },
    { name: 'Șalău', seasons: [0, 2, 3], moonPhases: ['new', 'first-quarter', 'last-quarter'] },
    { name: 'Somn', seasons: [1, 2], moonPhases: ['full', 'waxing-gibbous', 'waning-gibbous'] },
    { name: 'Avat', seasons: [1, 2], moonPhases: ['full', 'waxing-gibbous'] },
    { name: 'Biban', seasons: [0, 1, 2, 3], moonPhases: ['full', 'new', 'first-quarter', 'last-quarter'] },
    { name: 'Păstrăv', seasons: [0, 1, 2], moonPhases: ['new', 'first-quarter'] },
    { name: 'Mihalț', seasons: [2, 3], moonPhases: ['new', 'last-quarter'] }, // Active cold season
    { name: 'Lipan', seasons: [0, 2], moonPhases: ['new', 'first-quarter'] },

    // Pașnici (Coarse Fish)
    { name: 'Crap', seasons: [0, 1, 2], moonPhases: ['full', 'new', 'first-quarter', 'last-quarter'] },
    { name: 'Caras', seasons: [0, 1, 2], moonPhases: ['full', 'new', 'waxing-gibbous'] },
    { name: 'Plătică', seasons: [0, 1, 2], moonPhases: ['full', 'waxing-gibbous', 'waning-gibbous'] },
    { name: 'Roșioară', seasons: [0, 1], moonPhases: ['full', 'new'] },
    { name: 'Babușcă', seasons: [0, 1, 2, 3], moonPhases: ['new', 'first-quarter', 'last-quarter'] },
    { name: 'Clean', seasons: [0, 1, 2, 3], moonPhases: ['new', 'full', 'first-quarter'] },
    { name: 'Scobar', seasons: [0, 2, 3], moonPhases: ['new', 'first-quarter'] },
    { name: 'Lin', seasons: [0, 1], moonPhases: ['new', 'full', 'waxing-gibbous'] },
    { name: 'Morunaș', seasons: [0, 1, 2], moonPhases: ['full', 'waxing-gibbous'] },
    { name: 'Mreană', seasons: [1, 2], moonPhases: ['full', 'new', 'waning-gibbous'] },
    { name: 'Amur (Cteno)', seasons: [1, 2], moonPhases: ['full', 'waxing-gibbous'] },
    { name: 'Novac', seasons: [1], moonPhases: ['full', 'waxing-gibbous'] }, // Warm water
    { name: 'Sânger', seasons: [1], moonPhases: ['full', 'waxing-gibbous'] }, // Warm water
    { name: 'Sabiță', seasons: [1, 2], moonPhases: ['full', 'new'] },
    { name: 'Oblete', seasons: [0, 1, 2], moonPhases: ['full', 'new'] },
    { name: 'Văduviță', seasons: [0, 1, 2], moonPhases: ['new', 'first-quarter'] },
    { name: 'Anghilă', seasons: [0, 1, 2], moonPhases: ['new', 'last-quarter'] }
];

export function getActiveFish(date: Date, moonPhase: MoonPhase): string[] {
    const month = date.getMonth(); // 0-11

    // Determine season
    let season = 3; // Winter
    if (month >= 2 && month <= 4) season = 0; // Spring
    else if (month >= 5 && month <= 7) season = 1; // Summer
    else if (month >= 8 && month <= 10) season = 2; // Autumn

    return FISH_DATA
        .filter(fish => fish.seasons.includes(season) && fish.moonPhases.includes(moonPhase))
        .map(fish => fish.name);
}

/**
 * Calculate moon age in days (0-29.53)
 * Used for precise moon phase calculations
 */
export function getMoonage(date: Date): number {
    const SYNODIC_MONTH = 29.53058867; // Average lunar cycle length
    const REFERENCE_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime();
    const daysSinceReference = (date.getTime() - REFERENCE_NEW_MOON) / 86400000;
    return ((daysSinceReference % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
}
