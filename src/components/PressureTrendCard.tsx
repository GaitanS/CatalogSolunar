/**
 * Trend presiune barometrică — sparkline 30h + interpretare pentru pescari.
 * Server component (datele vin din getPressureHistory, în page.tsx).
 */

import { PressureHistory, pressureTrendLabel } from '@/lib/pressure';

interface PressureTrendCardProps {
    history: PressureHistory;
    currentPressure?: number; // hPa, din lib/weather.ts
}

export default function PressureTrendCard({ history, currentPressure }: PressureTrendCardProps) {
    const { series, trend6h } = history;
    const { arrow, text, tone } = pressureTrendLabel(trend6h);

    const toneClass = tone === 'good' ? 'text-emerald-300' : tone === 'bad' ? 'text-orange-300' : 'text-night-300';

    let sparkD = '';
    if (series.length >= 2) {
        const vals = series.map((s) => s.p);
        const mn = Math.min(...vals);
        const range = Math.max(1, Math.max(...vals) - mn);
        series.forEach((s, i) => {
            const x = (i / (series.length - 1)) * 320;
            const y = 27 - ((s.p - mn) / range) * 22;
            sparkD += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        });
    }

    return (
        <div className="p-4 rounded-2xl bg-[#151b25]/86 border border-white/10 taste-surface">
            <div className="flex items-center justify-between">
                <p className="text-[10px] text-night-400 uppercase font-bold tracking-wider">Presiune ultimele 30h</p>
                <p className={`text-xs font-semibold tabular-nums ${toneClass}`}>
                    {arrow} {trend6h > 0 ? '+' : ''}{trend6h} hPa/6h
                    {currentPressure ? ` · ${currentPressure} hPa` : ''}
                </p>
            </div>
            {sparkD && (
                <svg viewBox="0 0 320 30" preserveAspectRatio="none" className="block w-full h-8 mt-2">
                    <path d={sparkD} className="fill-none stroke-sky-300/80" strokeWidth={1.4} />
                </svg>
            )}
            <p className="text-[11px] text-night-300 mt-2">{text}</p>
        </div>
    );
}
