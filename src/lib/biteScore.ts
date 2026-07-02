/**
 * Bite Score — scor mușcătură orar 0–100
 * Combină perioadele solunare, răsăritul/apusul soarelui, faza lunii
 * și trendul presiunii barometrice într-un singur scor pe ore.
 *
 * Adiție pură peste lib/solunar.ts — nu modifică logica existentă.
 */

import { DaySolunarData, SolunarPeriod } from '@/lib/solunar';

const gauss = (t: number, c: number, sigma: number): number =>
    Math.exp(-((t - c) * (t - c)) / (2 * sigma * sigma));

/**
 * Curba scorului de mușcătură pentru o zi: 97 puncte (pas de 15 minute, 00:00–24:00).
 * @param day Datele solunare ale zilei (getSolunarData)
 * @param pressureTrend6h Variația presiunii pe ultimele 6h în hPa (opțional, din lib/pressure.ts)
 */
export function computeBiteCurve(day: DaySolunarData, pressureTrend6h = 0): number[] {
    const dayStart = new Date(day.date);
    dayStart.setHours(0, 0, 0, 0);
    const start = dayStart.getTime();

    let phaseBoost = 0;
    if (day.moonPhase === 'full' || day.moonPhase === 'new') phaseBoost = 8;
    else if (day.moonPhase === 'first-quarter' || day.moonPhase === 'last-quarter') phaseBoost = 4;

    let pBoost = 0;
    if (pressureTrend6h <= -1.5) pBoost = 8;      // presiune în scădere = hrănire activă
    else if (pressureTrend6h >= 1.5) pBoost = -6; // presiune în creștere = activitate redusă

    const pts: number[] = [];
    for (let i = 0; i <= 96; i++) {
        const t = start + i * 900000;
        let s = 16 + phaseBoost + pBoost;
        for (const p of day.majorPeriods) {
            const c = (p.start.getTime() + p.end.getTime()) / 2;
            s += 46 * gauss(t, c, 4200000);
        }
        for (const p of day.minorPeriods) {
            const c = (p.start.getTime() + p.end.getTime()) / 2;
            s += 24 * gauss(t, c, 2700000);
        }
        s += 14 * gauss(t, day.sunrise.getTime(), 2700000);
        s += 14 * gauss(t, day.sunset.getTime(), 2700000);
        pts.push(Math.max(2, Math.min(100, s)));
    }
    return pts;
}

/** Ora și valoarea vârfului zilei. */
export function getBitePeak(curve: number[], day: DaySolunarData): { time: Date; score: number } {
    let bestI = 0;
    curve.forEach((v, i) => { if (v > curve[bestI]) bestI = i; });
    const dayStart = new Date(day.date);
    dayStart.setHours(0, 0, 0, 0);
    return { time: new Date(dayStart.getTime() + bestI * 900000), score: Math.round(curve[bestI]) };
}

/**
 * Fereastră de aur: perioadă solunară suprapusă (±15 min) cu răsăritul sau apusul soarelui.
 * Coincidența solunar × tranziție de lumină = cele mai productive ferestre.
 */
export function isGoldenPeriod(p: SolunarPeriod, day: DaySolunarData): boolean {
    const pad = 900000;
    for (const s of [day.sunrise, day.sunset]) {
        if (s && s.getTime() >= p.start.getTime() - pad && s.getTime() <= p.end.getTime() + pad) return true;
    }
    return false;
}
