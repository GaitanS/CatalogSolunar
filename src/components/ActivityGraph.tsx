'use client';

import { SolunarPeriod, formatTime } from '@/lib/solunar';

interface ActivityGraphProps {
    majorPeriods: SolunarPeriod[];
    minorPeriods: SolunarPeriod[];
}

export default function ActivityGraph({ majorPeriods, minorPeriods }: ActivityGraphProps) {
    // 1. Convert time to X (0-100)
    const timeToX = (date: Date): number => {
        const hours = date.getHours() + date.getMinutes() / 60;
        return (hours / 24) * 100;
    };

    // 2. Calculate "Activity Potential" (0 to 1)
    const getActivityAtTime = (hour: number): number => {
        let maxActivity = 0;

        const checkPeriod = (p: SolunarPeriod, peakHeight: number) => {
            const startHour = p.start.getHours() + p.start.getMinutes() / 60;
            const endHour = p.end.getHours() + p.end.getMinutes() / 60;

            let centerHour = (startHour + endHour) / 2;
            if (endHour < startHour) centerHour += 12;

            const duration = (endHour < startHour ? endHour + 24 : endHour) - startHour;
            const sigma = duration / 2.2;

            let distance = Math.abs(hour - centerHour);
            if (distance > 12) distance = 24 - distance;

            if (distance < duration * 2) {
                const val = Math.exp(-(distance * distance) / (2 * sigma * sigma)) * peakHeight;
                maxActivity = Math.max(maxActivity, val);
            }
        };

        majorPeriods.forEach(p => checkPeriod(p, 1.0));
        // minorPeriods.forEach(p => checkPeriod(p, 0.6)); // REMOVED: User requested to eliminate minor periods completely

        return maxActivity;
    };

    // 3. Generate path
    const generatePath = (): string => {
        const points: { x: number, y: number }[] = [];
        const samples = 48;

        const baseY = 45;
        const peakY = 10;

        for (let i = 0; i <= samples; i++) {
            const hour = (i / samples) * 24;
            const x = (i / samples) * 100;
            const act = getActivityAtTime(hour);
            const y = baseY - (act * (baseY - peakY));
            points.push({ x, y });
        }

        let d = `M ${points[0].x},${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? i : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = Math.min(p1.y + (p2.y - p0.y) / 6, baseY);

            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = Math.min(p2.y - (p3.y - p1.y) / 6, baseY);

            d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
        }
        return d;
    };

    const curvePath = generatePath();

    return (
        <div className="w-full bg-[#0B1221] rounded-2xl border border-white/5 shadow-inner flex flex-col overflow-hidden">
            {/* Header: Centered Major Periods Only */}
            <div className="flex flex-col items-center justify-center px-4 py-3 border-b border-white/5 bg-white/[0.02] gap-1 relative">
                <div className="absolute left-4 top-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden sm:inline">Activitate</span>
                </div>

                <span className="text-[10px] text-amber-500/80 uppercase font-bold tracking-widest mb-0.5">Intervale Majore</span>
                <div className="flex gap-3 font-mono text-sm font-bold text-amber-400">
                    {majorPeriods.length > 0 ? majorPeriods.map((p, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <span>{formatTime(p.start)}</span>
                            <span className="text-amber-500/40">-</span>
                            <span>{formatTime(p.end)}</span>
                        </div>
                    )) : (
                        <span className="text-slate-500 text-xs italic">Fără activitate majoră azi</span>
                    )}
                </div>
            </div>

            {/* Graph Area */}
            <div className="relative h-32 w-full mt-2">
                {/* X-Axis Grid Lines (vertical) */}
                <div className="absolute inset-0 grid grid-cols-4 divide-x divide-white/5 opacity-30 pointer-events-none">
                    <div /><div /><div /><div />
                </div>

                <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 100 50">
                    <defs>
                        <linearGradient id="gradFill" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.2" /> {/* Much lighter fill */}
                            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Fill Area - Very subtle */}
                    <path
                        d={`${curvePath} L 100,50 L 0,50 Z`}
                        fill="url(#gradFill)"
                        className="opacity-40"
                    />

                    {/* Thinner Curve Line - Major Only now */}
                    <path
                        d={curvePath} // curvePath is generated based on combined activity, but if we want ONLY major...
                        fill="none"
                        stroke="#FBBF24"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-90"
                    />

                    {/* Minor Curve Removed per user request "elimina minora cu totul" */}
                </svg>
            </div>

            {/* X-Axis Footer */}
            <div className="flex justify-between px-4 pb-2 text-[9px] text-slate-600 font-mono">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
            </div>
        </div>
    );
}
