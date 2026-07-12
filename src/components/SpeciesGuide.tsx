'use client';

/**
 * Ecranul „Ghid specii" din designul Solunar Mobile: chips-uri orizontale de
 * specii + card de detaliu cu verdict pe faza curenta, sezon, ore optime,
 * faza ideala, tehnici, momeli si sfatul solunar.
 */

import { useState } from 'react';
import Link from 'next/link';
import { fishSpecies } from '@/data/species';
import type { MoonPhase } from '@/lib/solunar';

interface SpeciesGuideProps {
    currentPhase: MoonPhase;
}

// Cuvinte-cheie (fara diacritice) prin care faza curenta se regaseste in
// textul bestMoonPhase al speciei.
const PHASE_KEYWORDS: Partial<Record<MoonPhase, string[]>> = {
    'full': ['plina'],
    'new': ['noua'],
    'first-quarter': ['primul patrar'],
    'last-quarter': ['ultimul patrar'],
};

const strip = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function SpeciesGuide({ currentPhase }: SpeciesGuideProps) {
    const [idx, setIdx] = useState(0);
    const sp = fishSpecies[idx];

    const keywords = PHASE_KEYWORDS[currentPhase] ?? [];
    const favorable = keywords.some((k) => strip(sp.bestMoonPhase).includes(k));

    return (
        <div>
            {/* Chips-uri specii */}
            <div className="scrollbar-hide -mx-1 flex gap-[7px] overflow-x-auto px-1 pb-2.5">
                {fishSpecies.map((s, i) => {
                    const sel = i === idx;
                    return (
                        <button
                            key={s.slug}
                            onClick={() => setIdx(i)}
                            className="shrink-0 whitespace-nowrap rounded-full px-[13px] py-2 text-xs font-semibold"
                            style={{
                                color: sel ? '#0A0F1C' : '#C7CEDD',
                                background: sel
                                    ? 'linear-gradient(180deg, #F5D98C, #E9BE5D)'
                                    : 'rgba(148,170,220,0.07)',
                                border: sel
                                    ? '1px solid rgba(242,206,114,0.8)'
                                    : '1px solid rgba(148,170,220,0.14)',
                            }}
                        >
                            {s.name}
                        </button>
                    );
                })}
            </div>

            {/* Card detaliu */}
            <div className="dc-card taste-surface p-4">
                <div className="flex items-start justify-between gap-2.5">
                    <div>
                        <div className="text-[19px] font-bold text-white">{sp.name}</div>
                        <div className="mt-0.5 text-[11px] italic text-[#8C96AB]">{sp.scientificName}</div>
                    </div>
                    <span
                        className="shrink-0 whitespace-nowrap rounded-lg px-[9px] py-[5px] text-[10px] font-bold"
                        style={{
                            color: favorable ? '#F2CE72' : '#8C96AB',
                            background: favorable ? 'rgba(242,206,114,0.12)' : 'rgba(148,170,220,0.08)',
                            border: favorable ? '1px solid rgba(242,206,114,0.35)' : '1px solid rgba(148,170,220,0.16)',
                        }}
                    >
                        {favorable ? '✓ Fază favorabilă azi' : 'Fază neutră azi'}
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                        <div className="text-[9.5px] uppercase tracking-[0.1em] text-[#67718A]">Sezon</div>
                        <div className="mt-[3px] text-[12.5px] font-semibold text-white">{sp.season}</div>
                    </div>
                    <div>
                        <div className="text-[9.5px] uppercase tracking-[0.1em] text-[#67718A]">Ore optime</div>
                        <div className="mt-[3px] text-[12.5px] font-semibold tabular-nums text-white">{sp.bestTime}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-[9.5px] uppercase tracking-[0.1em] text-[#67718A]">Fază lunară ideală</div>
                        <div className="mt-[3px] text-[12.5px] font-semibold text-white">{sp.bestMoonPhase}</div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="text-[9.5px] uppercase tracking-[0.1em] text-[#67718A]">Tehnici</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {sp.techniques.map((t) => (
                            <span key={t} className="rounded-full border border-[#F2CE72]/[0.22] bg-[#F2CE72]/[0.08] px-2.5 py-[5px] text-[11.5px] text-[#EFE3C2]">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-3">
                    <div className="text-[9.5px] uppercase tracking-[0.1em] text-[#67718A]">Momeli</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {sp.bait.map((b) => (
                            <span key={b} className="rounded-full border border-[#93B4E8]/20 bg-[#93B4E8]/[0.09] px-2.5 py-[5px] text-[11.5px] text-[#C9D6EE]">
                                {b}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#F2CE72]/20 bg-[#F2CE72]/[0.07] px-3 py-2.5 text-[11.5px] leading-relaxed text-[#EFE3C2]">
                    {sp.solunarTip}
                </div>

                <Link
                    href={`/${sp.slug}`}
                    className="mt-4 inline-flex rounded-xl bg-moon px-4 py-2 text-sm font-bold text-[#0A0F1C] transition-colors hover:bg-moon/90"
                >
                    Ghid complet {sp.name} →
                </Link>
            </div>
        </div>
    );
}
