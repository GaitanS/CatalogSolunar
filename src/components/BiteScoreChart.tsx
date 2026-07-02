'use client';

/**
 * Scor mușcătură pe ore — curbă 24h (0–100) cu vârful zilei și punctul „acum".
 * Design: card dark premium, accent auriu, în linia vizuală a redesign-ului mobil.
 */

import { useEffect, useState } from 'react';
import { DaySolunarData, formatTime } from '@/lib/solunar';
import { computeBiteCurve, getBitePeak } from '@/lib/biteScore';

interface BiteScoreChartProps {
    day: DaySolunarData;
    pressureTrend6h?: number;
    isToday?: boolean;
}

const W = 320;
const H = 64;

export default function BiteScoreChart({ day, pressureTrend6h = 0, isToday = true }: BiteScoreChartProps) {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        // „acum" doar pe client, ca să evităm hydration mismatch
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(id);
    }, []);

    const curve = computeBiteCurve(day, pressureTrend6h);
    const peak = getBitePeak(curve, day);

    let lineD = '';
    curve.forEach((v, i) => {
        const x = (i / (curve.length - 1)) * W;
        const y = H - 3 - (v / 100) * (H - 8);
        lineD += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    });
    const areaD = `${lineD} L${W} ${H} L0 ${H} Z`;

    let nowX = -20;
    let nowY = -20;
    if (isToday && now) {
        const dayStart = new Date(day.date);
        dayStart.setHours(0, 0, 0, 0);
        const frac = Math.max(0, Math.min(1, (now.getTime() - dayStart.getTime()) / 86400000));
        const fi = frac * 96;
        const i0 = Math.floor(fi);
        const v = curve[i0] + (curve[Math.min(96, i0 + 1)] - curve[i0]) * (fi - i0);
        nowX = frac * W;
        nowY = H - 3 - (v / 100) * (H - 8);
    }

    return (
        <div className="p-4 rounded-2xl bg-[#151b25]/86 border border-white/10 taste-surface">
            <div className="flex items-baseline justify-between">
                <p className="text-[10px] text-night-400 uppercase font-bold tracking-wider">Scor mușcătură pe ore</p>
                <p className="text-[11px] font-semibold text-amber-300 tabular-nums">
                    vârf {formatTime(peak.time)} · scor {peak.score}
                </p>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block w-full h-16 mt-3">
                <path d={areaD} className="fill-amber-300/15" />
                <path d={lineD} className="fill-none stroke-amber-300" strokeWidth={1.6} />
                <circle cx={nowX} cy={nowY} r={3.2} className="fill-white stroke-white/30" strokeWidth={3} />
            </svg>
            <div className="flex justify-between mt-1 text-[10px] text-night-400 tabular-nums">
                <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>
            <p className="text-[10px] text-night-400/80 mt-2 leading-relaxed">
                Combină perioadele solunare, răsăritul și apusul, faza lunii și trendul presiunii.
            </p>
        </div>
    );
}
