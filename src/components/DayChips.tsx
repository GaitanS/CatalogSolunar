/**
 * Selectorul orizontal de zile (14 zile) din designul Solunar Mobile.
 * Chips-uri server-side: fiecare zi e un link ?d=N (ziua 0 = /), pastrand
 * parametrii de locatie. Punctul de sub numar reflecta ratingul zilei.
 */

import Link from 'next/link';

export interface DayChipInfo {
    dow: string;    // 'Azi' sau 'Lun', 'Mar', ...
    num: number;    // ziua din luna
    rating: number; // 1-5
}

interface DayChipsProps {
    days: DayChipInfo[];
    selected: number;
    /** Query string existent pentru locatie (fara `d`), ex. "lat=..&lng=..&loc=.." */
    locationQuery?: string;
}

export default function DayChips({ days, selected, locationQuery = '' }: DayChipsProps) {
    const hrefFor = (i: number) => {
        const parts = [] as string[];
        if (i > 0) parts.push(`d=${i}`);
        if (locationQuery) parts.push(locationQuery);
        return parts.length ? `/?${parts.join('&')}` : '/';
    };

    return (
        <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
            {days.map((d, i) => {
                const sel = i === selected;
                return (
                    <Link
                        key={i}
                        href={hrefFor(i)}
                        scroll={false}
                        className="flex min-w-[48px] shrink-0 flex-col items-center rounded-[14px] px-1.5 pb-[7px] pt-2"
                        style={{
                            color: sel ? '#0A0F1C' : '#C7CEDD',
                            background: sel
                                ? 'linear-gradient(180deg, #F5D98C, #E9BE5D)'
                                : 'rgba(148,170,220,0.07)',
                            border: sel
                                ? '1px solid rgba(242,206,114,0.8)'
                                : '1px solid rgba(148,170,220,0.12)',
                            boxShadow: sel ? '0 4px 18px rgba(242,206,114,0.25)' : 'none',
                        }}
                    >
                        <span className="text-[10px] uppercase tracking-[0.08em] opacity-70">{d.dow}</span>
                        <span className="mt-0.5 text-[15px] font-semibold">{d.num}</span>
                        <span
                            className="mt-1 rounded-full"
                            style={{
                                width: 5,
                                height: 5,
                                background: sel ? '#0A0F1C' : '#F2CE72',
                                opacity: sel ? 0.7 : 0.25 + (d.rating / 5) * 0.75,
                            }}
                        />
                    </Link>
                );
            })}
        </div>
    );
}
