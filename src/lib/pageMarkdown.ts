/**
 * Versiunile Markdown ale paginilor pe care agentii AI le cer cel mai des: prima
 * pagina, /azi, paginile lunare si cele anuale. Middleware-ul le serveste cand
 * cererea are `Accept: text/markdown` sau adresa se termina in `.md`.
 */

import {
    getAnnualLandingBySlug,
    getMonthlyLandingBySlug,
    getMonthlyLandingsForYear,
    monthlySeoLandingPages,
    type AnnualSeoLandingPage,
    type MonthlySeoLandingPage,
} from '@/data/seoLandingPages';
import { getMonthGuide, MONTH_GUIDE_NOTE_LABEL, type MonthGuide } from '@/data/monthGuides';
import { guideDaysSentence } from './monthGuideDays';
import { SITE_URL, getDayReport, formatPeriods, monthPageUrl, type DayReport } from './agentApi';
import { formatDayList, formatPhaseMoment, getMonthHighlights } from './monthHighlights';
import { getMoonPhaseName, getSolunarData } from './solunar';
import { MONTHS_RO, daysInMonth, middayOf, todayInRomania, weekdayRo } from './sunTimes';

const NOTE = 'Ora României (Europe/Bucharest). Ratingul zilei merge de la 1 la 5 și e maxim în jurul lunii noi și al lunii pline.';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function dayLines(day: DayReport): string[] {
    return [
        `- Rating: ${day.rating}/5 (${day.ratingLabel})`,
        `- Faza Lunii: ${day.moonPhase}, ${day.moonIllumination}% iluminare`,
        `- Perioade majore (~2 ore): ${day.majorPeriods.join(', ') || '–'}`,
        `- Perioade minore (~1 oră): ${day.minorPeriods.join(', ') || '–'}`,
        `- Soare: răsărit ${day.sunrise}, apus ${day.sunset}`,
        `- Lună: răsărit ${day.moonrise ?? '–'}, apus ${day.moonset ?? '–'}`,
        ...(day.activeSpecies.length ? [`- Specii active: ${day.activeSpecies.join(', ')}`] : []),
    ];
}

/** Zilele de 5/5 si 4/5 si fazele Lunii dintr-o luna, ca lista. */
function highlightLines(year: number, monthIndex: number): string[] {
    const h = getMonthHighlights(year, monthIndex);
    const month = MONTHS_RO[monthIndex];
    return [
        ...(h.excellentDays.length ? [`- 5/5: ${formatDayList(h.excellentDays)} ${month}`] : []),
        ...(h.veryGoodDays.length ? [`- 4/5: ${formatDayList(h.veryGoodDays)} ${month}`] : []),
        ...h.moonPhases.map((row) => `- ${row.label}: ${row.dates.map((date) => formatPhaseMoment(date)).join('; ')}`),
    ];
}

function homeMarkdown(): string {
    const today = todayInRomania();
    const day = getDayReport(today);
    const monthName = capitalize(MONTHS_RO[today.m - 1]);
    const monthUrl = monthPageUrl(today.y, today.m);
    const upcoming = monthlySeoLandingPages
        .filter((page) => page.year * 12 + page.monthIndex >= today.y * 12 + today.m - 1)
        .slice(0, 12);

    return [
        '# Calendar Solunar',
        '',
        'Calendar solunar pentru pescuit în România: ratingul fiecărei zile, perioade majore și minore, faze lunare, răsărit și apus.',
        NOTE,
        '',
        `## Azi, ${day.weekday} ${today.d} ${MONTHS_RO[today.m - 1]} ${today.y} (${day.city})`,
        '',
        ...dayLines(day),
        `- Detalii: ${SITE_URL}/azi`,
        '',
        `## Cele mai bune zile din ${monthName} ${today.y}`,
        '',
        ...highlightLines(today.y, today.m - 1),
        ...(monthUrl ? [`- Calendarul lunii: ${monthUrl}`] : []),
        '',
        '## Calendar solunar pe luni',
        '',
        ...upcoming.map((page) => `- [Solunar ${page.monthName} ${page.year}](${SITE_URL}/${page.slug})`),
        '',
        '## Instrumente',
        '',
        `- [Solunar azi](${SITE_URL}/azi)`,
        `- [Prognoză 14 zile](${SITE_URL}/prognoza)`,
        `- [Calendar lunar](${SITE_URL}/lunar)`,
        `- [Răsărit și apus soare](${SITE_URL}/rasarit-apus-soare)`,
        `- [Specii de pești](${SITE_URL}/specii)`,
        `- [Despre](${SITE_URL}/despre) · [Contact](${SITE_URL}/contact) · [Termeni](${SITE_URL}/termeni)`,
        '',
    ].join('\n');
}

function todayMarkdown(): string {
    const today = todayInRomania();
    const day = getDayReport(today);

    return [
        `# Solunar azi, ${day.weekday} ${today.d} ${MONTHS_RO[today.m - 1]} ${today.y}`,
        '',
        `Calculat pentru ${day.city}. ${NOTE}`,
        '',
        ...dayLines(day),
        '',
        `Pagina: ${SITE_URL}/azi`,
        '',
    ].join('\n');
}

function guideLines(guide: MonthGuide, daysSentence: string): string[] {
    return [
        `## ${guide.heading}`,
        '',
        guide.intro,
        '',
        ...guide.species.map((species) => `- **${species.name}**: ${species.text}`),
        '',
        `Când ieși la apă: ${guide.timing}`,
        '',
        daysSentence,
        '',
        `${MONTH_GUIDE_NOTE_LABEL[guide.note.kind]}: ${guide.note.text}`,
        '',
    ];
}

function monthMarkdown(page: MonthlySeoLandingPage): string {
    const m = page.monthIndex + 1;
    const rows = Array.from({ length: daysInMonth(page.year, m) }, (_, index) => {
        const p = { y: page.year, m, d: index + 1 };
        const data = getSolunarData(middayOf(p));
        return `| ${weekdayRo(p)} ${p.d} | ${data.overallRating}/5 | ${getMoonPhaseName(data.moonPhase)} (${data.moonIllumination}%) | `
            + `${formatPeriods(data.majorPeriods).join(', ') || '–'} | ${formatPeriods(data.minorPeriods).join(', ') || '–'} |`;
    });

    return [
        `# ${page.title}`,
        '',
        page.description,
        '',
        `Calculat pentru București. ${NOTE}`,
        '',
        '## Cele mai bune zile și fazele Lunii',
        '',
        ...highlightLines(page.year, page.monthIndex),
        '',
        '## Pe zile',
        '',
        '| Zi | Rating | Faza Lunii | Perioade majore | Perioade minore |',
        '| --- | --- | --- | --- | --- |',
        ...rows,
        '',
        '## Sezon',
        '',
        page.seasonContext,
        '',
        `Specii: ${page.speciesFocus.join(', ')}.`,
        '',
        `Strategie: ${page.strategy}`,
        '',
        ...guideLines(getMonthGuide(page.monthIndex), guideDaysSentence(page.year, page.monthIndex)),
        `Pagina: ${SITE_URL}/${page.slug}`,
        '',
    ].join('\n');
}

function annualMarkdown(page: AnnualSeoLandingPage): string {
    const months = MONTHS_RO.flatMap((month, monthIndex) => {
        const landing = getMonthlyLandingsForYear(page.year).find((p) => p.monthIndex === monthIndex);
        return [
            `## ${capitalize(month)} ${page.year}`,
            '',
            ...highlightLines(page.year, monthIndex),
            ...(landing ? [`- Calendarul lunii: ${SITE_URL}/${landing.slug}`] : []),
            '',
        ];
    });

    return [
        `# ${page.title}`,
        '',
        page.description,
        '',
        NOTE,
        '',
        ...months,
        `Pagina: ${SITE_URL}/${page.slug}`,
        '',
    ].join('\n');
}

/** Markdown-ul paginii de la `path` („/”, „/azi”, „/solunar-mai-2026”), sau null daca pagina nu are versiune Markdown. */
export function pageMarkdown(path: string): string | null {
    if (path === '/') return homeMarkdown();
    if (path === '/azi') return todayMarkdown();
    const slug = path.slice(1);
    const month = getMonthlyLandingBySlug(slug);
    if (month) return monthMarkdown(month);
    const annual = getAnnualLandingBySlug(slug);
    if (annual) return annualMarkdown(annual);
    return null;
}
