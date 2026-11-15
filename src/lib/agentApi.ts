/**
 * Data for AI agents. The MCP endpoint (/mcp), the WebMCP tools registered in the
 * browser and the Markdown versions of pages all read from here.
 */

import { cities, getCityBySlug } from '@/data/cities';
import { getMonthlyLandingBySlug } from '@/data/seoLandingPages';
import { getMonthHighlights } from './monthHighlights';
import { RATING_LABELS, formatTime, getActiveFish, getMoonPhaseName, getSolunarData, type SolunarPeriod } from './solunar';
import { MONTHS_RO, datePartsInRomania, daysInMonth, formatClock, middayOf, todayInRomania, weekdayRo, type DateParts } from './sunTimes';

export const SITE_URL = 'https://calendarsolunar.ro';
export const DEFAULT_CITY = 'bucuresti';
const TIMEZONE = 'Europe/Bucharest';
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

export const MCP_SERVER_INFO = { name: 'calendar-solunar', title: 'Calendar Solunar', version: '1.0.0' };
/** Newest first; the first one is offered when a client asks for a version we don't speak. */
export const MCP_PROTOCOL_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26'];
export const MCP_INSTRUCTIONS = 'Solunar fishing data for Romania. Times are Romanian local time (Europe/Bucharest). '
    + 'Day ratings go from 1 to 5 and peak around the new and full moon. Major periods last about 2 hours '
    + '(moon overhead and underfoot), minor periods about 1 hour (moonrise and moonset).';

export interface AgentTool {
    name: string;
    title: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations: { readOnlyHint: boolean; openWorldHint: boolean };
}

export const AGENT_TOOLS: AgentTool[] = [
    {
        name: 'get_solunar_day',
        title: 'Solunar fishing forecast for a day',
        description: 'Solunar fishing forecast for one day in Romania: day rating (1-5), major and minor feeding periods, '
            + 'moon phase and illumination, sunrise, sunset, moonrise and moonset. Times are Romanian local time.',
        inputSchema: {
            type: 'object',
            properties: {
                date: {
                    type: 'string',
                    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                    description: `Calendar date in Romania, YYYY-MM-DD, between ${MIN_YEAR} and ${MAX_YEAR}. Defaults to today.`,
                },
                city: {
                    type: 'string',
                    enum: cities.map((city) => city.slug),
                    description: `City the sun and moon times are calculated for. Defaults to ${DEFAULT_CITY} (Bucharest).`,
                },
            },
            additionalProperties: false,
        },
        annotations: { readOnlyHint: true, openWorldHint: false },
    },
    {
        name: 'get_best_fishing_days',
        title: 'Best solunar fishing days of a month',
        description: 'The best solunar fishing days of a month in Romania (rating 5/5 and 4/5) and the exact new and full moon times.',
        inputSchema: {
            type: 'object',
            properties: {
                year: { type: 'integer', minimum: MIN_YEAR, maximum: MAX_YEAR },
                month: { type: 'integer', minimum: 1, maximum: 12, description: '1 = January, 12 = December.' },
            },
            required: ['year', 'month'],
            additionalProperties: false,
        },
        annotations: { readOnlyHint: true, openWorldHint: false },
    },
];

export interface DayReport {
    date: string;
    weekday: string;
    city: string;
    timezone: string;
    rating: number;
    ratingLabel: string;
    moonPhase: string;
    moonIllumination: number;
    sunrise: string;
    sunset: string;
    moonrise: string | null;
    moonset: string | null;
    majorPeriods: string[];
    minorPeriods: string[];
    activeSpecies: string[];
    url: string;
}

export interface MonthReport {
    year: number;
    month: number;
    monthName: string;
    timezone: string;
    excellentDays: number[];
    veryGoodDays: number[];
    moonPhases: { phase: 'new' | 'full'; name: string; times: string[] }[];
    url: string | null;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function isoDate(p: DateParts): string {
    return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

/** „10:15 - 12:15” per period, in clock order. */
export function formatPeriods(periods: SolunarPeriod[]): string[] {
    return [...periods]
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map((period) => `${formatTime(period.start)} - ${formatTime(period.end)}`);
}

/** The month's landing page, when the site has one (2026 and 2027). */
export function monthPageUrl(year: number, month: number): string | null {
    const slug = `solunar-${MONTHS_RO[month - 1]}-${year}`;
    return getMonthlyLandingBySlug(slug) ? `${SITE_URL}/${slug}` : null;
}

export function getDayReport(p: DateParts, citySlug: string = DEFAULT_CITY): DayReport {
    const city = getCityBySlug(citySlug) ?? getCityBySlug(DEFAULT_CITY)!;
    const date = middayOf(p);
    const data = getSolunarData(date, city.lat, city.lng);

    return {
        date: isoDate(p),
        weekday: weekdayRo(p),
        city: city.name,
        timezone: TIMEZONE,
        rating: data.overallRating,
        ratingLabel: RATING_LABELS[data.overallRating],
        moonPhase: getMoonPhaseName(data.moonPhase),
        moonIllumination: data.moonIllumination,
        sunrise: formatTime(data.sunrise),
        sunset: formatTime(data.sunset),
        moonrise: data.moonrise ? formatTime(data.moonrise) : null,
        moonset: data.moonset ? formatTime(data.moonset) : null,
        majorPeriods: formatPeriods(data.majorPeriods),
        minorPeriods: formatPeriods(data.minorPeriods),
        activeSpecies: getActiveFish(date, data.moonPhase),
        url: monthPageUrl(p.y, p.m) ?? `${SITE_URL}/${city.slug}`,
    };
}

export function getMonthReport(year: number, month: number): MonthReport {
    const highlights = getMonthHighlights(year, month - 1);

    return {
        year,
        month,
        monthName: MONTHS_RO[month - 1],
        timezone: TIMEZONE,
        excellentDays: highlights.excellentDays,
        veryGoodDays: highlights.veryGoodDays,
        moonPhases: highlights.moonPhases.map((row) => ({
            phase: row.phase,
            name: row.label,
            times: row.dates.map((date) => `${isoDate(datePartsInRomania(date))} ${formatClock(date)}`),
        })),
        url: monthPageUrl(year, month),
    };
}

function parseDate(value: unknown): DateParts | string {
    if (value === undefined) return todayInRomania();
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'date must be written as YYYY-MM-DD.';
    const [y, m, d] = value.split('-').map(Number);
    if (y < MIN_YEAR || y > MAX_YEAR || m < 1 || m > 12 || d < 1 || d > daysInMonth(y, m)) {
        return `date must be a real calendar date between ${MIN_YEAR} and ${MAX_YEAR}.`;
    }
    return { y, m, d };
}

const isWholeNumberIn = (value: unknown, min: number, max: number): value is number =>
    typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;

export type AgentToolOutcome = { ok: true; data: DayReport | MonthReport } | { ok: false; error: string };

/** Runs one of AGENT_TOOLS; undefined when no tool has that name. */
export function runAgentTool(name: string, args: Record<string, unknown>): AgentToolOutcome | undefined {
    if (name === 'get_solunar_day') {
        const date = parseDate(args.date);
        if (typeof date === 'string') return { ok: false, error: date };
        const city = args.city ?? DEFAULT_CITY;
        if (typeof city !== 'string' || !getCityBySlug(city)) {
            return { ok: false, error: `city must be one of: ${cities.map((c) => c.slug).join(', ')}.` };
        }
        return { ok: true, data: getDayReport(date, city) };
    }

    if (name === 'get_best_fishing_days') {
        if (!isWholeNumberIn(args.year, MIN_YEAR, MAX_YEAR) || !isWholeNumberIn(args.month, 1, 12)) {
            return { ok: false, error: `year must be a whole number between ${MIN_YEAR} and ${MAX_YEAR}, month between 1 and 12.` };
        }
        return { ok: true, data: getMonthReport(args.year, args.month) };
    }

    return undefined;
}
