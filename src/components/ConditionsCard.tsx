/**
 * Cardul „Conditii meteo" din designul Solunar Mobile:
 * metrici (aer, apa estimata, vant, presiune) + sectiunea de presiune pe 30h
 * cu sparkline si interpretare + sfatul zilei. Server component.
 */

import { WeatherData, getWindDirectionString } from '@/lib/weather';
import { PressureHistory, pressureTrendLabel } from '@/lib/pressure';

interface ConditionsCardProps {
    weather: WeatherData;
    history: PressureHistory;
    advice: string;
}

const TONE_COLOR: Record<'good' | 'bad' | 'neutral', string> = {
    good: '#7DD3A8',
    bad: '#E8A15C',
    neutral: '#B9C0D0',
};

export default function ConditionsCard({ weather, history, advice }: ConditionsCardProps) {
    const { series, trend6h } = history;
    const { arrow, text, tone } = pressureTrendLabel(trend6h);

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

    const metrics = [
        { value: `${weather.temperature}°`, label: 'Aer' },
        { value: `~${weather.waterTemp}°`, label: 'Apă est.' },
        { value: `${weather.windSpeed} km/h`, label: `Vânt ${getWindDirectionString(weather.windDirection)}` },
        { value: String(weather.pressure), label: 'hPa' },
    ];

    return (
        <div className="dc-card taste-surface p-4">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#8C96AB]">
                Condiții meteo
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
                {metrics.map((m) => (
                    <div key={m.label}>
                        <div className="text-base font-semibold tabular-nums text-white">{m.value}</div>
                        <div className="mt-0.5 text-[10px] text-[#8C96AB]">{m.label}</div>
                    </div>
                ))}
            </div>
            <div className="mt-3.5 border-t border-[#94AADC]/10 pt-3">
                <div className="flex items-center justify-between">
                    <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#8C96AB]">
                        Presiune ultimele 30h
                    </div>
                    <div className="text-xs font-semibold tabular-nums" style={{ color: TONE_COLOR[tone] }}>
                        {arrow} {trend6h > 0 ? '+' : ''}{trend6h} hPa/6h
                    </div>
                </div>
                {sparkD && (
                    <svg viewBox="0 0 320 30" preserveAspectRatio="none" className="mt-2 block h-[30px] w-full">
                        <path d={sparkD} style={{ fill: 'none', stroke: '#93B4E8', strokeWidth: 1.4 }} />
                    </svg>
                )}
                <div className="mt-1.5 text-[10.5px] text-[#8C96AB]">{text}</div>
                <div className="mt-2.5 rounded-xl border border-[#7DD3A8]/[0.18] bg-[#7DD3A8]/[0.07] px-3 py-2 text-[11.5px] leading-normal text-[#C9E8D6]">
                    {advice}
                </div>
            </div>
        </div>
    );
}
