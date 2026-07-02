'use client';

/**
 * Jurnal de capturi — persistă în localStorage.
 * Fiecare captură se salvează cu ora, faza lunii și perioada solunară curentă,
 * ca pescarul să-și vadă propria statistică („X% în perioade solunare").
 */

import { useEffect, useState } from 'react';
import { getSolunarData, getMoonPhaseName } from '@/lib/solunar';
import { getAllSpecies } from '@/data/species';

interface CatchEntry {
    ts: number;
    species: string;
    weight: number | null;
    periodType: 'major' | 'minor' | null;
    phaseName: string;
    city: string;
}

interface CatchJournalProps {
    lat: number;
    lng: number;
    locationName: string;
}

const STORAGE_KEY = 'cs-catches';
const MONTHS = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'noi', 'dec'];

function fmtTime(d: Date): string {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function CatchJournal({ lat, lng, locationName }: CatchJournalProps) {
    const species = getAllSpecies();
    const [catches, setCatches] = useState<CatchEntry[]>([]);
    const [speciesIdx, setSpeciesIdx] = useState(0);
    const [weight, setWeight] = useState('');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) setCatches(parsed);
            }
        } catch { /* noop */ }
        setLoaded(true);
    }, []);

    const persist = (next: CatchEntry[]) => {
        setCatches(next);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
    };

    const addCatch = () => {
        const now = new Date();
        const day = getSolunarData(now, lat, lng);
        const all = [...day.majorPeriods, ...day.minorPeriods];
        const active = all.find((p) => now >= p.start && now <= p.end);
        const w = parseFloat(weight.replace(',', '.'));
        persist([...catches, {
            ts: Date.now(),
            species: species[speciesIdx]?.name ?? 'Necunoscut',
            weight: isNaN(w) ? null : w,
            periodType: active ? active.type : null,
            phaseName: getMoonPhaseName(day.moonPhase),
            city: locationName,
        }]);
        setWeight('');
    };

    const removeCatch = (ts: number) => persist(catches.filter((c) => c.ts !== ts));

    const total = catches.length;
    const inSolunar = catches.filter((c) => c.periodType).length;
    const pct = Math.round((inSolunar / Math.max(1, total)) * 100);

    return (
        <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#151b25]/86 border border-white/10 taste-surface">
                <p className="text-[10px] text-night-400 uppercase font-bold tracking-wider">Adaugă captură</p>
                <div className="flex gap-1.5 overflow-x-auto mt-2.5 pb-1 -mx-1 px-1 [scrollbar-width:none]">
                    {species.map((s, i) => (
                        <button
                            key={s.slug}
                            onClick={() => setSpeciesIdx(i)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
                                i === speciesIdx
                                    ? 'bg-amber-300 text-slate-900 border-amber-300'
                                    : 'bg-white/[0.06] text-night-200 border-white/10'
                            }`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 mt-2.5">
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Greutate kg (opțional)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white placeholder:text-night-400 outline-none focus:border-amber-300/50"
                    />
                    <button
                        onClick={addCatch}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-b from-amber-200 to-amber-400 text-slate-900 text-sm font-bold shrink-0"
                    >
                        Salvează
                    </button>
                </div>
                <p className="text-[10px] text-night-400 mt-2 leading-relaxed">
                    Se salvează automat cu ora, faza lunii și perioada solunară curentă.
                </p>
            </div>

            {loaded && total >= 2 && (
                <div className="px-3.5 py-3 rounded-2xl bg-amber-300/[0.07] border border-amber-300/25 text-xs font-semibold text-amber-100">
                    {total} capturi înregistrate · {pct}% în perioade solunare
                </div>
            )}

            {loaded && total === 0 && (
                <p className="text-center text-xs text-night-400 py-4 leading-relaxed">
                    Nicio captură încă.<br />Prima intrare pornește statistica ta personală.
                </p>
            )}

            {[...catches].sort((a, b) => b.ts - a.ts).map((c) => {
                const d = new Date(c.ts);
                const badge = c.periodType === 'major' ? 'MAJORĂ' : c.periodType === 'minor' ? 'MINORĂ' : 'NORMAL';
                const badgeClass = c.periodType === 'major'
                    ? 'text-amber-300 bg-amber-300/[0.13] border-amber-300/30'
                    : c.periodType === 'minor'
                        ? 'text-sky-300 bg-sky-300/10 border-sky-300/30'
                        : 'text-night-300 bg-white/[0.06] border-white/15';
                return (
                    <div key={c.ts} className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-[#151b25]/86 border border-white/10">
                        <span className={`w-[54px] text-center text-[9px] font-bold tracking-wider px-1.5 py-1 rounded-md border shrink-0 ${badgeClass}`}>
                            {badge}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">
                                {c.species}{c.weight ? ` · ${c.weight} kg` : ''}
                            </p>
                            <p className="text-[10px] text-night-400 mt-0.5">
                                {d.getDate()} {MONTHS[d.getMonth()]} {fmtTime(d)} · {c.phaseName} · {c.city}
                            </p>
                        </div>
                        <button
                            onClick={() => removeCatch(c.ts)}
                            aria-label="Șterge captura"
                            className="w-7 h-7 rounded-lg border border-white/15 text-night-400 text-sm shrink-0"
                        >
                            ×
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
