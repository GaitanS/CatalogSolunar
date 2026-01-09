import { formatTime, type DaySolunarData } from '@/lib/solunar';

interface ForecastCardProps {
    data: DaySolunarData;
    isToday: boolean;
}

export default function ForecastCard({ data, isToday }: ForecastCardProps) {
    const dayName = data.date.toLocaleDateString('ro-RO', { weekday: 'short' });
    const dayNum = data.date.getDate();
    const monthName = data.date.toLocaleDateString('ro-RO', { month: 'short' });

    return (
        <div className={`min-w-[170px] sm:min-w-[190px] p-4 rounded-xl border flex flex-col gap-3 transition-all ${isToday
                ? 'bg-gradient-to-b from-moon/10 to-transparent border-moon/50 shadow-lg shadow-moon/10'
                : 'bg-[#111827] border-white/5 hover:border-white/20'
            }`}>
            {/* Header: Date & Moon */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-night-400 text-[9px] uppercase font-bold tracking-wider">{dayName}</p>
                    <p className="text-lg font-bold text-white leading-tight">
                        {dayNum} <span className="text-night-500 text-xs font-normal">{monthName}</span>
                    </p>
                </div>
                <div className="w-10 h-10 relative">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-gray-700 to-gray-300 shadow-inner" />
                    <div className="absolute inset-0 flex items-center justify-center text-[9px] text-black font-bold">
                        {Math.round(data.moonIllumination)}%
                    </div>
                </div>
            </div>

            {/* Rating Stars - Unified Signal Bars */}
            <div className="flex gap-1 justify-center h-4 items-end">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`w-1.5 rounded-sm transition-all duration-500 ${level <= data.overallRating
                                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                : 'bg-night-800'
                            }`}
                        style={{ height: `${level * 20}%` }}
                    />
                ))}
            </div>

            {/* Fishing Schedule - List all Major Periods */}
            <div className="mt-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    <span className="font-bold text-[10px] tracking-wide uppercase">Favorabil:</span>
                </div>

                {data.majorPeriods.length > 0 ? (
                    data.majorPeriods.map((period, i) => (
                        <div key={i} className="flex items-center justify-between p-1.5 bg-night-950/50 rounded-lg border border-emerald-500/20">
                            <div className="bg-night-800 px-1.5 py-0.5 rounded text-white font-mono font-bold text-xs">
                                {formatTime(period.start)}
                            </div>
                            <div className="text-xs text-emerald-500">→</div>
                            <div className="bg-night-800 px-1.5 py-0.5 rounded text-white font-mono font-bold text-xs">
                                {formatTime(period.end)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-[10px] text-night-500 text-center italic">Fără activitate majoră</div>
                )}
            </div>

            {/* Minor Period - Just listing the first one if space permits, or maybe list count */}
            {data.minorPeriods.length > 0 && (
                <div className="flex items-center justify-between text-[10px] px-1 pt-1 border-t border-white/5 mt-1">
                    <span className="text-cyan-400 font-medium">Minoră:</span>
                    <div className="flex gap-1">
                        {data.minorPeriods.slice(0, 2).map((p, i) => (
                            <span key={i} className="font-mono text-night-300">{formatTime(p.start)}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
