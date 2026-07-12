'use client';

/**
 * Cardul „Activitate pescuit" din designul Solunar Mobile:
 * rating cu bare crescatoare + banda live cu perioada activa / countdown
 * pana la urmatoarea perioada (punct auriu pulsand).
 */

import { useEffect, useState } from 'react';
import { DaySolunarData, SolunarPeriod, formatTime } from '@/lib/solunar';
import { isGoldenPeriod } from '@/lib/biteScore';

interface ActivityNowCardProps {
    day: DaySolunarData;
    isToday: boolean;
}

const RATING_LABELS: Record<number, string> = {
    1: 'Foarte slabă',
    2: 'Slabă',
    3: 'Bună',
    4: 'Foarte bună',
    5: 'Excelentă',
};

const typeName = (t: SolunarPeriod['type']) => (t === 'major' ? 'majoră' : 'minoră');

export default function ActivityNowCard({ day, isToday }: ActivityNowCardProps) {
    // „acum" doar pe client, ca sa evitam hydration mismatch
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(id);
    }, []);

    const all = [...day.majorPeriods, ...day.minorPeriods].sort((a, b) => a.start.getTime() - b.start.getTime());

    let cdLine1 = 'Fără perioade optime azi';
    let cdLine2 = 'revino mâine';
    if (isToday && now) {
        const active = all.find((p) => now >= p.start && now <= p.end);
        const next = all.find((p) => p.start > now);
        if (active) {
            cdLine1 = `Perioadă ${typeName(active.type)} activă acum` + (isGoldenPeriod(active, day) ? ' ✦' : '');
            cdLine2 = `se încheie la ${formatTime(active.end)} · peștii se hrănesc`;
        } else if (next) {
            const ms = next.start.getTime() - now.getTime();
            const h = Math.floor(ms / 3600000);
            const min = Math.floor((ms % 3600000) / 60000);
            cdLine1 = `Următoarea perioadă ${typeName(next.type)}` + (isGoldenPeriod(next, day) ? ' ✦ fereastră de aur' : '');
            cdLine2 = `începe în ${h > 0 ? h + 'h ' : ''}${min}min · la ${formatTime(next.start)}`;
        } else if (all.length) {
            cdLine1 = 'Perioadele de azi s-au încheiat';
            cdLine2 = 'vezi prognoza pentru mâine';
        }
    } else if (all.length) {
        // Inainte de hidratare sau pentru alta zi: cea mai buna fereastra a zilei.
        const best = day.majorPeriods[0] || all[0];
        cdLine1 = 'Cea mai bună fereastră';
        cdLine2 = `${formatTime(best.start)} – ${formatTime(best.end)} · perioadă ${typeName(best.type)}`;
    }

    return (
        <div className="dc-card taste-surface px-4 pb-3.5 pt-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#8C96AB]">
                        Activitate pescuit
                    </div>
                    <div className="mt-1.5 text-[23px] font-bold text-[#F2CE72]">
                        {RATING_LABELS[day.overallRating] || 'Bună'}
                    </div>
                </div>
                <div className="mt-1 flex h-[26px] items-end gap-1">
                    {[0, 1, 2, 3, 4].map((i) => {
                        const on = i < day.overallRating;
                        return (
                            <span
                                key={i}
                                className="rounded"
                                style={{
                                    width: 7,
                                    height: 10 + i * 4,
                                    background: on ? '#F2CE72' : 'rgba(148,170,220,0.16)',
                                    boxShadow: on ? '0 0 8px rgba(242,206,114,0.45)' : 'none',
                                }}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="mt-3.5 flex items-center gap-2.5 rounded-[14px] border border-[#F2CE72]/[0.22] bg-[#F2CE72]/[0.08] px-3 py-2.5">
                <span
                    className="animate-cs-pulse shrink-0 rounded-full"
                    style={{ width: 9, height: 9, background: '#F2CE72', boxShadow: '0 0 10px rgba(242,206,114,0.85)' }}
                />
                <div>
                    <div className="text-[12.5px] font-semibold text-[#F2CE72]">{cdLine1}</div>
                    <div className="mt-px text-xs tabular-nums text-[#B9C0D0]">{cdLine2}</div>
                </div>
            </div>
        </div>
    );
}
