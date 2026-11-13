/**
 * Rezumatul unei luni pentru paginile /solunar-<luna>-<an>: zilele de 5/5 si
 * 4/5 si momentele lunii noi si ale lunii pline. Totul e calculat, pe zile
 * calendaristice din Romania, din aceleasi functii ca tabelul zilnic.
 */

import { moonPhasesBetween } from './moonPhases';
import { calculateOverallRating } from './solunar';
import { MONTHS_RO, addDays, datePartsInRomania, daysInMonth, formatClock, middayOf, startOfDayInRomania, weekdayRo } from './sunTimes';

type RatedPhase = 'new' | 'full';

export interface MonthMoonPhase {
    phase: RatedPhase;
    /** „Lună nouă” / „Lună plină” */
    label: string;
    /** Momentele din luna: de obicei unul, uneori doua. */
    dates: Date[];
}

export interface MonthHighlights {
    /** Zilele lunii cu rating 5/5. */
    excellentDays: number[];
    /** Zilele lunii cu rating 4/5. */
    veryGoodDays: number[];
    /** Luna noua si luna plina, in ordinea din luna. O faza care nu cade in luna (posibil in februarie) lipseste. */
    moonPhases: MonthMoonPhase[];
}

const PHASE_LABELS: Record<RatedPhase, string> = { 'new': 'Lună nouă', 'full': 'Lună plină' };
const PHASE_SUBJECTS: Record<RatedPhase, string> = { 'new': 'luna nouă', 'full': 'luna plină' };

/** `monthIndex` e 0-11, ca in seoLandingPages. */
export function getMonthHighlights(year: number, monthIndex: number): MonthHighlights {
    const m = monthIndex + 1;
    const lastDay = daysInMonth(year, m);
    const excellentDays: number[] = [];
    const veryGoodDays: number[] = [];

    for (let d = 1; d <= lastDay; d++) {
        const rating = calculateOverallRating(middayOf({ y: year, m, d }));
        if (rating === 5) excellentDays.push(d);
        else if (rating === 4) veryGoodDays.push(d);
    }

    const events = moonPhasesBetween(
        startOfDayInRomania({ y: year, m, d: 1 }),
        startOfDayInRomania(addDays({ y: year, m, d: lastDay }, 1)),
    );
    const moonPhases = (['new', 'full'] as const)
        .map((phase) => ({ phase, label: PHASE_LABELS[phase], dates: events.filter((e) => e.phase === phase).map((e) => e.date) }))
        .filter((row) => row.dates.length > 0)
        .sort((a, b) => a.dates[0].getTime() - b.dates[0].getTime());

    return { excellentDays, veryGoodDays, moonPhases };
}

/** „a, b și c” */
function joinRo(items: string[]): string {
    if (items.length <= 1) return items.join('');
    return `${items.slice(0, -1).join(', ')} și ${items[items.length - 1]}`;
}

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/** „8, 9, 10, 23, 24 și 25” */
export function formatDayList(days: number[]): string {
    return joinRo(days.map(String));
}

/** Zilele consecutive devin intervale: „8–10 și 23–25”. */
export function formatDayRanges(days: number[]): string {
    const ranges: string[] = [];
    for (let i = 0; i < days.length; i++) {
        const first = days[i];
        while (i + 1 < days.length && days[i + 1] === days[i] + 1) i++;
        ranges.push(first === days[i] ? String(first) : `${first}–${days[i]}`);
    }
    return joinRo(ranges);
}

/** „luni, 9 noiembrie, 09:02” (ora Romaniei); cu `beforeTime`: „luni, 9 noiembrie, la 09:02”. */
export function formatPhaseMoment(date: Date, beforeTime = ''): string {
    const p = datePartsInRomania(date);
    return `${weekdayRo(p)}, ${p.d} ${MONTHS_RO[p.m - 1]}, ${beforeTime}${formatClock(date)}`;
}

/** Google taie descrierea pe la 155-160 de caractere (pe mobil mai devreme), asa ca zilele bune stau primele. */
const DESCRIPTION_MAX_LENGTH = 160;

/** Descrierea meta a paginii lunare: zilele bune si fazele Lunii, cu date reale. */
export function monthMetaDescription(monthName: string, year: number, h: MonthHighlights): string {
    const days = [
        h.excellentDays.length ? `zile de 5/5 pe ${formatDayRanges(h.excellentDays)}` : '',
        h.veryGoodDays.length ? `de 4/5 pe ${formatDayRanges(h.veryGoodDays)}` : '',
    ].filter(Boolean).join('; ');
    const moon = h.moonPhases
        .map((row) => `${row.label.toLowerCase()} pe ${formatDayList(row.dates.map((date) => datePartsInRomania(date).d))}`)
        .join(', ');

    const sentences = [
        `Solunar ${monthName} ${year}: ${days}.`,
        moon ? `${capitalize(moon)}.` : '',
        'Ore majore și minore pe zile.',
    ].filter(Boolean);

    // Daca luna are multe intervale, renunta la propozitiile de la coada, nu la zile.
    while (sentences.length > 1 && sentences.join(' ').length > DESCRIPTION_MAX_LENGTH) sentences.pop();
    return sentences.join(' ');
}

/** Raspunsul la „care sunt cele mai bune zile”, cu zilele si fazele numite. */
export function monthBestDaysAnswer(monthName: string, year: number, h: MonthHighlights): string {
    const month = `${monthName.toLowerCase()} ${year}`;
    const veryGood = h.veryGoodDays.length ? `, urmate de ${formatDayList(h.veryGoodDays)} (rating 4/5)` : '';
    const moon = h.moonPhases
        .map((row) => `${PHASE_SUBJECTS[row.phase]} este ${joinRo(row.dates.map((date) => formatPhaseMoment(date, 'la ')))}`)
        .join(', iar ');

    return [
        `Cele mai bune zile de pescuit din ${month} sunt ${formatDayList(h.excellentDays)} (rating 5/5)${veryGood}.`,
        moon ? `${capitalize(moon)} (ora României).` : '',
        'Rezultatele sunt cele mai bune când perioadele majore se suprapun cu răsăritul, apusul sau o vreme stabilă.',
    ].filter(Boolean).join(' ');
}
