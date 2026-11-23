/**
 * Zilele dintr-o luna care se potrivesc sfatului din ghidul lunii: rating 4/5
 * sau 5/5 si o perioada majora la ora potrivita sezonului. Aceeasi propozitie
 * apare pe pagina lunii si in versiunea ei Markdown, si difera de la an la an.
 */

import { getMonthGuideWindow, type GuideWindow } from '@/data/monthGuides';
import { formatTime, getSolunarData } from './solunar';
import { MONTHS_RO, daysInMonth, middayOf } from './sunTimes';

const WINDOW_LABEL: Record<GuideWindow, string> = {
    midday: 'cu o perioadă majoră care începe între 10:00 și 16:00',
    cool: 'cu o perioadă majoră care începe înainte de 9:00 sau după 18:00',
    daylight: 'cu o perioadă majoră care începe între 6:00 și 20:00',
};

function inWindow(window: GuideWindow, hour: number): boolean {
    if (window === 'midday') return hour >= 10 && hour < 16;
    if (window === 'cool') return hour < 9 || hour >= 18;
    return hour >= 6 && hour < 20;
}

export interface GuideDay {
    day: number;
    /** "10:35–12:35", ora Romaniei. */
    period: string;
}

export function guideDays(year: number, monthIndex: number): GuideDay[] {
    const window = getMonthGuideWindow(monthIndex);
    const m = monthIndex + 1;
    const days: GuideDay[] = [];
    for (let d = 1; d <= daysInMonth(year, m); d++) {
        const data = getSolunarData(middayOf({ y: year, m, d }));
        if (data.overallRating < 4) continue;
        const match = [...data.majorPeriods]
            .sort((a, b) => a.start.getTime() - b.start.getTime())
            // formatTime gives "HH:MM" in Romanian time.
            .find((period) => inWindow(window, Number(formatTime(period.start).slice(0, 2))));
        if (match) days.push({ day: d, period: `${formatTime(match.start)}–${formatTime(match.end)}` });
    }
    return days;
}

export function guideDaysSentence(year: number, monthIndex: number): string {
    const month = MONTHS_RO[monthIndex];
    const label = WINDOW_LABEL[getMonthGuideWindow(monthIndex)];
    const days = guideDays(year, monthIndex);
    if (days.length === 0) {
        return `În ${month} ${year} nu există zile de 4/5 sau 5/5 ${label}; alege atunci o zi de 3/5 cu fereastra potrivită.`;
    }
    const list = days.map((day) => `${day.day} ${month} (${day.period})`).join(', ');
    return `În ${month} ${year}, zilele de 4/5 și 5/5 ${label} sunt: ${list}.`;
}
