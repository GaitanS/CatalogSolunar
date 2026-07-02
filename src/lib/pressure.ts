/**
 * Istoric presiune barometrică (Open-Meteo, gratuit, fără cheie API).
 * Server-side, cu același pattern de timeout/fallback ca lib/weather.ts.
 */

export interface PressurePoint {
    t: number; // epoch ms
    p: number; // hPa (pressure_msl)
}

export interface PressureHistory {
    series: PressurePoint[];  // ultimele ~30h, până la ora curentă
    trend6h: number;          // Δ hPa pe ultimele 6 ore (negativ = în scădere)
}

const EMPTY: PressureHistory = { series: [], trend6h: 0 };

export async function getPressureHistory(lat: number, lng: number): Promise<PressureHistory> {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=pressure_msl&timezone=auto&past_days=1&forecast_days=1`;
        const res = await fetch(url, {
            next: { revalidate: 1800 },
            signal: AbortSignal.timeout(2500),
        });
        if (!res.ok) return EMPTY;
        const data = await res.json();
        const times: string[] = data?.hourly?.time ?? [];
        const vals: number[] = data?.hourly?.pressure_msl ?? [];
        const nowMs = Date.now();
        const pts: PressurePoint[] = [];
        for (let i = 0; i < times.length; i++) {
            const t = new Date(times[i]).getTime();
            if (t <= nowMs && typeof vals[i] === 'number') pts.push({ t, p: vals[i] });
        }
        const series = pts.slice(-30);
        let trend6h = 0;
        if (series.length >= 7) {
            trend6h = Math.round((series[series.length - 1].p - series[series.length - 7].p) * 10) / 10;
        }
        return { series, trend6h };
    } catch {
        return EMPTY;
    }
}

/** Interpretare pentru pescari. */
export function pressureTrendLabel(trend6h: number): { arrow: string; text: string; tone: 'good' | 'bad' | 'neutral' } {
    if (trend6h <= -1.5) return { arrow: '▼', text: 'Presiune în scădere — peștii se hrănesc activ înaintea frontului.', tone: 'good' };
    if (trend6h >= 1.5) return { arrow: '▲', text: 'Presiune în creștere — activitate mai redusă, insistă la adâncime.', tone: 'bad' };
    return { arrow: '→', text: 'Presiune stabilă — condiții normale de hrănire.', tone: 'neutral' };
}
