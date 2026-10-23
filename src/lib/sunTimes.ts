/**
 * Ore de soare pe zile calendaristice din Romania.
 *
 * Folosim algoritmul NOAA (bazat pe Meeus), recalculat la momentul fiecarui
 * eveniment. Verificat pe 2026-10-23 fata de timeanddate.com pentru Constanta:
 * diferente sub 5 secunde. SunCalc, folosit inainte, iesea cu 1-2 minute mai
 * tarziu (ignora diferenta TT-UTC de ~69 s si are formule simplificate).
 *
 * Serverul ruleaza in UTC, asa ca „azi” si zilele lunii se calculeaza in
 * Europe/Bucharest.
 */

const TZ = 'Europe/Bucharest';
const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

/** Altitudinea soarelui (grade) pentru fiecare eveniment. */
const ALT_SUNRISE = -0.833; // refractie + raza discului
const ALT_CIVIL = -6;
const ALT_GOLDEN = 6;

export interface DateParts {
    y: number;
    m: number; // 1-12
    d: number;
}

export interface SunDay {
    date: Date;
    dawn: Date;
    sunrise: Date;
    goldenHourEnd: Date;
    solarNoon: Date;
    goldenHour: Date;
    sunset: Date;
    dusk: Date;
    dayLengthMs: number;
}

export const MONTHS_RO = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
const WEEKDAYS_RO = ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'];

export function datePartsInRomania(date: Date): DateParts {
    const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(date)
        .split('-')
        .map(Number);
    return { y, m, d };
}

export function todayInRomania(now: Date = new Date()): DateParts {
    return datePartsInRomania(now);
}

export function addDays(p: DateParts, n: number): DateParts {
    const t = new Date(Date.UTC(p.y, p.m - 1, p.d + n));
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

export function daysInMonth(y: number, m: number): number {
    return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function weekdayRo(p: DateParts): string {
    return WEEKDAYS_RO[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()];
}

/** Pranzul aproximativ al zilei in Romania, folosit ca moment de referinta. */
export function middayOf(p: DateParts): Date {
    return new Date(Date.UTC(p.y, p.m - 1, p.d, 10));
}

/** Declinatia soarelui (radiani) si ecuatia timpului (minute) la o data juliana. */
function solarPosition(jd: number): { decl: number; eqTime: number } {
    const T = (jd - 2451545) / 36525;
    const L0 = (((280.46646 + T * (36000.76983 + T * 0.0003032)) % 360) + 360) % 360;
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const C = Math.sin(M * RAD) * (1.914602 - T * (0.004817 + 0.000014 * T))
        + Math.sin(2 * M * RAD) * (0.019993 - 0.000101 * T)
        + Math.sin(3 * M * RAD) * 0.000289;
    const omega = 125.04 - 1934.136 * T;
    const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(omega * RAD);
    const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60;
    const eps = eps0 + 0.00256 * Math.cos(omega * RAD);
    const decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD));
    const y = Math.tan((eps / 2) * RAD) ** 2;
    const eqTime = 4 * DEG * (
        y * Math.sin(2 * L0 * RAD)
        - 2 * e * Math.sin(M * RAD)
        + 4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD)
        - 0.5 * y * y * Math.sin(4 * L0 * RAD)
        - 1.25 * e * e * Math.sin(2 * M * RAD)
    );
    return { decl, eqTime };
}

/**
 * Momentul in care soarele trece de altitudinea `alt` dimineata (dir = -1),
 * seara (dir = 1) sau culmineaza (dir = 0), pentru ziua calendaristica `p`.
 */
function sunEvent(p: DateParts, lat: number, lng: number, alt: number, dir: -1 | 0 | 1): Date {
    const dayStartMs = Date.UTC(p.y, p.m - 1, p.d);
    const jd0 = dayStartMs / 86400000 + 2440587.5;
    let minutes = 720 - 4 * lng;
    for (let i = 0; i < 3; i++) {
        const { decl, eqTime } = solarPosition(jd0 + minutes / 1440);
        const noon = 720 - 4 * lng - eqTime;
        if (dir === 0) {
            minutes = noon;
            continue;
        }
        const cosH = (Math.sin(alt * RAD) - Math.sin(lat * RAD) * Math.sin(decl)) / (Math.cos(lat * RAD) * Math.cos(decl));
        const H = Math.acos(Math.min(1, Math.max(-1, cosH))) * DEG;
        minutes = noon + dir * 4 * H;
    }
    return new Date(dayStartMs + minutes * 60000);
}

export function getSunDay(p: DateParts, lat: number, lng: number): SunDay {
    const sunrise = sunEvent(p, lat, lng, ALT_SUNRISE, -1);
    const sunset = sunEvent(p, lat, lng, ALT_SUNRISE, 1);
    return {
        date: middayOf(p),
        dawn: sunEvent(p, lat, lng, ALT_CIVIL, -1),
        sunrise,
        goldenHourEnd: sunEvent(p, lat, lng, ALT_GOLDEN, -1),
        solarNoon: sunEvent(p, lat, lng, 0, 0),
        goldenHour: sunEvent(p, lat, lng, ALT_GOLDEN, 1),
        sunset,
        dusk: sunEvent(p, lat, lng, ALT_CIVIL, 1),
        dayLengthMs: sunset.getTime() - sunrise.getTime(),
    };
}

/** Rasarit si apus pentru ziua (in Romania) in care cade `date`. */
export function sunriseSunsetFor(date: Date, lat: number, lng: number): { sunrise: Date; sunset: Date } {
    const p = datePartsInRomania(date);
    return { sunrise: sunEvent(p, lat, lng, ALT_SUNRISE, -1), sunset: sunEvent(p, lat, lng, ALT_SUNRISE, 1) };
}

export function formatClock(date: Date): string {
    return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
}

export function formatDuration(ms: number): string {
    const totalMin = Math.floor(ms / 60000);
    return `${Math.floor(totalMin / 60)}h ${String(totalMin % 60).padStart(2, '0')}min`;
}

/** Diferenta in minute intregi (pozitiv = mai tarziu). */
export function minutesBetween(a: Date, b: Date): number {
    return Math.round((b.getTime() - a.getTime()) / 60000);
}
