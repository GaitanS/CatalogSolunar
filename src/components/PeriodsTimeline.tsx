'use client';

/**
 * Cardul „Perioade solunare" din designul Solunar Mobile:
 * axa 00–24 cu banda de zi (rasarit→apus), benzi aurii (majore) si albastre
 * (minore), marcaje rasarit/apus, linia alba „acum" + lista perioadelor cu
 * badge, interval, nota astronomica si rating.
 */

import { useEffect, useState } from 'react';
import { DaySolunarData, SolunarPeriod, formatTime } from '@/lib/solunar';
import { isGoldenPeriod } from '@/lib/biteScore';

interface PeriodsTimelineProps {
    day: DaySolunarData;
    isToday: boolean;
}

export default function PeriodsTimeline({ day, isToday }: PeriodsTimelineProps) {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(id);
    }, []);

    const dayStart = new Date(day.date);
    dayStart.setHours(0, 0, 0, 0);
    const pct = (t: Date) => Math.max(0, Math.min(100, ((t.getTime() - dayStart.getTime()) / 86400000) * 100));

    const all = [...day.majorPeriods, ...day.minorPeriods].sort((a, b) => a.start.getTime() - b.start.getTime());

    const minorNote = (p: SolunarPeriod) => {
        const center = p.start.getTime() + 1800000;
        const dRise = day.moonrise ? Math.abs(center - day.moonrise.getTime()) : Infinity;
        const dSet = day.moonset ? Math.abs(center - day.moonset.getTime()) : Infinity;
        return dRise <= dSet ? 'Răsăritul lunii' : 'Apusul lunii';
    };

    return (
        <div className="dc-card taste-surface p-4">
            <div className="flex items-baseline justify-between">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#8C96AB]">
                    Perioade solunare
                </div>
                <div className="text-[10.5px] text-[#67718A]">ora locală</div>
            </div>

            {/* Axa 24h */}
            <div className="relative mt-3.5 h-[46px] overflow-hidden rounded-xl border border-[#94AADC]/10 bg-[#070B17]/80">
                {/* Banda de zi (soarele pe cer) */}
                <div
                    className="absolute bottom-0 top-0"
                    style={{
                        left: `${pct(day.sunrise)}%`,
                        width: `${pct(day.sunset) - pct(day.sunrise)}%`,
                        background: 'linear-gradient(180deg, rgba(255,205,130,0.09), rgba(255,205,130,0.02))',
                    }}
                />
                {day.majorPeriods.map((p, i) => {
                    const gld = isGoldenPeriod(p, day);
                    return (
                        <div
                            key={`M${i}`}
                            className="absolute rounded-[7px]"
                            style={{
                                top: 7,
                                bottom: 7,
                                left: `${pct(p.start)}%`,
                                width: `${Math.max(1.5, pct(p.end) - pct(p.start))}%`,
                                background: gld
                                    ? 'linear-gradient(180deg, rgba(255,233,168,0.98), rgba(242,206,114,0.45))'
                                    : 'linear-gradient(180deg, rgba(242,206,114,0.92), rgba(242,206,114,0.38))',
                                boxShadow: gld ? '0 0 18px rgba(255,226,150,0.6)' : '0 0 14px rgba(242,206,114,0.35)',
                            }}
                        />
                    );
                })}
                {day.minorPeriods.map((p, i) => (
                    <div
                        key={`m${i}`}
                        className="absolute rounded-md"
                        style={{
                            top: 11,
                            bottom: 11,
                            left: `${pct(p.start)}%`,
                            width: `${Math.max(1, pct(p.end) - pct(p.start))}%`,
                            background: 'linear-gradient(180deg, rgba(147,180,232,0.8), rgba(147,180,232,0.28))',
                        }}
                    />
                ))}
                {[day.sunrise, day.sunset].map((t, i) => (
                    <div
                        key={`s${i}`}
                        className="absolute top-0"
                        style={{
                            height: 9,
                            width: 2,
                            left: `${pct(t)}%`,
                            background: 'rgba(255,190,120,0.75)',
                            borderRadius: '0 0 2px 2px',
                        }}
                    />
                ))}
                {isToday && now && (
                    <div
                        className="absolute w-0.5 rounded-sm bg-white"
                        style={{
                            top: -1,
                            bottom: -1,
                            left: `${pct(now)}%`,
                            boxShadow: '0 0 8px rgba(255,255,255,0.85)',
                        }}
                    />
                )}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-[#67718A]">
                <span>00</span><span>06</span><span>12</span><span>18</span><span>24</span>
            </div>

            {/* Legenda */}
            <div className="mt-3 flex gap-4 text-[10.5px] text-[#8C96AB]">
                <span className="flex items-center gap-1.5">
                    <span className="h-[7px] w-3.5 rounded" style={{ background: 'linear-gradient(180deg, rgba(242,206,114,0.9), rgba(242,206,114,0.4))' }} />
                    Majoră
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-[7px] w-3.5 rounded" style={{ background: 'linear-gradient(180deg, rgba(147,180,232,0.8), rgba(147,180,232,0.3))' }} />
                    Minoră
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-0.5 rounded-sm bg-white" style={{ boxShadow: '0 0 6px rgba(255,255,255,0.8)' }} />
                    Acum
                </span>
            </div>

            {/* Lista perioadelor */}
            <div className="mt-2">
                {all.map((p, i) => {
                    const isMajor = p.type === 'major';
                    const golden = isGoldenPeriod(p, day);
                    const note = isMajor
                        ? (day.majorPeriods[0] === p
                            ? 'Luna la meridian — vârf de activitate'
                            : 'Luna la nadir — al doilea vârf')
                        : minorNote(p);
                    return (
                        <div
                            key={i}
                            className="flex items-center gap-3 pb-2.5 pt-[11px]"
                            style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(148,170,220,0.09)' }}
                        >
                            <span
                                className="w-[58px] shrink-0 rounded-[7px] px-2 py-1 text-center text-[9px] font-bold tracking-[0.1em]"
                                style={{
                                    background: isMajor ? 'rgba(242,206,114,0.14)' : 'rgba(147,180,232,0.12)',
                                    border: isMajor ? '1px solid rgba(242,206,114,0.35)' : '1px solid rgba(147,180,232,0.3)',
                                    color: isMajor ? '#F2CE72' : '#93B4E8',
                                }}
                            >
                                {isMajor ? 'MAJORĂ' : 'MINORĂ'}
                            </span>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[15px] font-semibold tabular-nums text-white">
                                        {formatTime(p.start)} – {formatTime(p.end)}
                                    </span>
                                    {golden && (
                                        <span className="text-[9.5px] font-semibold text-[#FFE9A8]">✦ Fereastră de aur</span>
                                    )}
                                </div>
                                <div className="mt-px text-[11px] text-[#8C96AB]">{note}</div>
                            </div>
                            <span className="text-[11px] tabular-nums text-[#8C96AB]">{p.rating}/5</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
