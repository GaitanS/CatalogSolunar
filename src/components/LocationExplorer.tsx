'use client';

/**
 * Explorer pentru /locuri-pescuit: cautare, filtru pe tip de apa si taxa,
 * carduri compacte grupate pe judete. Toate locurile sunt in HTML-ul
 * initial (pentru crawlere); filtrele doar ascund carduri pe client.
 */

import Link from 'next/link';
import { useMemo, useState } from 'react';

export interface ExplorerLocation {
    slug: string;
    name: string;
    locality: string;
    type: string;
    fish: string[];
    paid: boolean;
}

export interface ExplorerCounty {
    name: string;
    slug: string;
    locations: ExplorerLocation[];
}

const TYPE_LABELS: Record<string, string> = {
    lac: 'Lac',
    balta: 'Baltă',
    acumulare: 'Acumulare',
    iaz: 'Iaz',
    rau: 'Râu',
    canal: 'Canal',
    delta: 'Deltă',
};

const TYPE_DOT: Record<string, string> = {
    lac: '#93B4E8',
    balta: '#6EE7B7',
    acumulare: '#7DD3FC',
    iaz: '#A7F3D0',
    rau: '#F2CE72',
    canal: '#C4B5FD',
    delta: '#5EEAD4',
};

type PaidFilter = 'toate' | 'gratuit' | 'taxa';

function normalize(value: string) {
    return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function LocationExplorer({ counties }: { counties: ExplorerCounty[] }) {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('toate');
    const [paid, setPaid] = useState<PaidFilter>('toate');

    const types = useMemo(() => {
        const set = new Set<string>();
        counties.forEach((c) => c.locations.forEach((l) => set.add(l.type)));
        return [...set];
    }, [counties]);

    const q = normalize(query.trim());
    const matches = (l: ExplorerLocation, county: string) => {
        if (type !== 'toate' && l.type !== type) return false;
        if (paid === 'gratuit' && l.paid) return false;
        if (paid === 'taxa' && !l.paid) return false;
        if (!q) return true;
        return normalize(`${l.name} ${l.locality} ${county} ${l.fish.join(' ')}`).includes(q);
    };

    const total = counties.reduce((n, c) => n + c.locations.filter((l) => matches(l, c.name)).length, 0);
    const filtering = q !== '' || type !== 'toate' || paid !== 'toate';

    return (
        <div>
            {/* Bara de filtre: lipita sub header cand derulezi */}
            <div className="sticky top-[76px] z-30 mb-6 md:top-[84px]">
                <div className="glass flex flex-col gap-3 rounded-[20px] p-3 md:flex-row md:items-center">
                    <label className="relative flex-1">
                        <span className="sr-only">Caută un loc de pescuit</span>
                        <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" />
                        </svg>
                        <input
                            type="search"
                            id="cauta-loc"
                            name="cauta"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Caută lac, localitate, județ sau specie…"
                            autoComplete="off"
                            className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-200/40 focus:outline-none"
                        />
                    </label>
                    <div className="scrollbar-hide -mx-1 flex gap-1.5 overflow-x-auto px-1">
                        {['toate', ...types].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                aria-pressed={type === t}
                                className="glass-chip shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
                            >
                                {t === 'toate' ? 'Toate apele' : TYPE_LABELS[t] || t}
                            </button>
                        ))}
                        <span className="mx-1 w-px shrink-0 bg-white/10" aria-hidden />
                        {(['gratuit', 'taxa'] as const).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPaid(paid === p ? 'toate' : p)}
                                aria-pressed={paid === p}
                                className="glass-chip shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:text-white"
                            >
                                {p === 'gratuit' ? 'Gratuite' : 'Cu taxă'}
                            </button>
                        ))}
                    </div>
                </div>
                {filtering && (
                    <p className="mt-2 px-2 text-xs text-slate-400" aria-live="polite">
                        {total} {total === 1 ? 'loc găsit' : 'locuri găsite'}
                        <button
                            type="button"
                            onClick={() => { setQuery(''); setType('toate'); setPaid('toate'); }}
                            className="ml-2 font-semibold text-amber-200 hover:text-white"
                        >
                            Resetează
                        </button>
                    </p>
                )}
            </div>

            {total === 0 && (
                <div className="card-panel p-8 text-center text-sm text-slate-400">
                    Niciun loc nu se potrivește filtrelor. Încearcă un alt termen sau resetează filtrele.
                </div>
            )}

            {counties.map((county) => {
                const visible = county.locations.filter((l) => matches(l, county.name));
                return (
                    <section key={county.slug} className={`mb-8 ${visible.length ? '' : 'hidden'}`}>
                        <div className="mb-3 flex items-baseline gap-3">
                            <h2 className="font-editorial text-xl text-white md:text-2xl">
                                <Link href={`/locuri-pescuit/judet/${county.slug}`} className="transition-colors hover:text-amber-200">
                                    Județul {county.name}
                                </Link>
                            </h2>
                            <span className="text-xs text-slate-500">{county.locations.length} locuri</span>
                            <Link href={`/locuri-pescuit/judet/${county.slug}`} className="ml-auto shrink-0 text-xs font-semibold text-amber-200/90 hover:text-white">
                                Vezi județul &rarr;
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {county.locations.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    href={`/locuri-pescuit/${loc.slug}`}
                                    className={`glass-tile interactive-lift group flex-col px-4 py-3 ${visible.includes(loc) ? 'flex' : 'hidden'}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="line-clamp-1 text-[15px] font-semibold text-white transition-colors group-hover:text-amber-100">{loc.name}</h3>
                                        <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-slate-400">
                                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: TYPE_DOT[loc.type] || '#93B4E8' }} />
                                            {TYPE_LABELS[loc.type] || loc.type}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                                        {loc.locality}
                                        {loc.paid && <span className="ml-1.5 text-amber-200/80">· cu taxă</span>}
                                    </p>
                                    <p className="mt-2 line-clamp-1 text-xs text-slate-300">
                                        {loc.fish.slice(0, 4).join(' · ')}
                                        {loc.fish.length > 4 && <span className="text-slate-500"> +{loc.fish.length - 4}</span>}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
