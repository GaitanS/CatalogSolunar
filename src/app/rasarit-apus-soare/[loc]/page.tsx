import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import JsonLd from '@/components/JsonLd';
import { getAllCities } from '@/data/cities';
import { KIND_LABELS, distanceKm, getSunLocation, sunLocations, type SunLocation } from '@/data/sunLocations';
import { getMoonPhaseName, getSolunarData } from '@/lib/solunar';
import { isGoldenPeriod } from '@/lib/biteScore';
import {
    MONTHS_RO,
    addDays,
    daysInMonth,
    formatClock,
    formatDuration,
    getSunDay,
    middayOf,
    minutesBetween,
    todayInRomania,
    weekdayRo,
    type DateParts,
} from '@/lib/sunTimes';

// Times are for "today" in Romania: regenerate hourly.
export const revalidate = 3600;
export const dynamicParams = false;

const BASE = 'https://calendarsolunar.ro';
const BUCHAREST = getAllCities().find((c) => c.slug === 'bucuresti')!;

export function generateStaticParams() {
    return sunLocations.map((l) => ({ loc: l.slug }));
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function vsBucharest(riseDiff: number, setDiff: number): string {
    const part = (diff: number, verb: string) => {
        if (diff === 0) return `${verb} la aceeași oră`;
        const n = Math.abs(diff);
        return `${verb} cu ${n} ${n === 1 ? 'minut' : 'minute'} mai ${diff < 0 ? 'devreme' : 'târziu'}`;
    };
    return `${part(riseDiff, 'răsare')} și ${part(setDiff, 'apune')} decât în București`;
}

function dayDeltaText(delta: number): string {
    if (delta === 0) return 'Ziua de azi are practic aceeași durată ca ieri.';
    const n = Math.abs(delta);
    return `Ziua de azi este cu ${n} ${n === 1 ? 'minut' : 'minute'} mai ${delta > 0 ? 'lungă' : 'scurtă'} decât ieri.`;
}

export async function generateMetadata({ params }: { params: Promise<{ loc: string }> }): Promise<Metadata> {
    const { loc } = await params;
    const place = getSunLocation(loc);
    if (!place) return {};
    const today = todayInRomania();
    const sun = getSunDay(today, place.lat, place.lng);
    const month = MONTHS_RO[today.m - 1];
    const url = `${BASE}/rasarit-apus-soare/${place.slug}`;
    const sunTomorrow = getSunDay(addDays(today, 1), place.lat, place.lng);
    const title = `Răsărit și Apus Soare ${place.name} Azi și Mâine, ${today.d} ${cap(month)}`;
    const description = `Azi, ${today.d} ${month}, în ${place.name} soarele răsare la ${formatClock(sun.sunrise)}, apune la ${formatClock(sun.sunset)} și se întunecă la ${formatClock(sun.dusk)}. Mâine răsare la ${formatClock(sunTomorrow.sunrise)}. Ora de aur, tabel pe ${month} și ore de pescuit.`;
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, siteName: 'Calendar Solunar', locale: 'ro_RO', type: 'website' },
        twitter: { card: 'summary_large_image', title, description },
    };
}

function nearestSolunarCity(place: SunLocation) {
    return getAllCities()
        .map((c) => ({ c, km: distanceKm(place, c) }))
        .sort((a, b) => a.km - b.km)[0];
}

function yearExtremes(year: number, place: SunLocation) {
    let longest = { p: { y: year, m: 1, d: 1 } as DateParts, ms: 0 };
    let shortest = { p: { y: year, m: 1, d: 1 } as DateParts, ms: Infinity };
    for (let m = 1; m <= 12; m++) {
        for (let d = 1; d <= daysInMonth(year, m); d++) {
            const p = { y: year, m, d };
            const ms = getSunDay(p, place.lat, place.lng).dayLengthMs;
            if (ms > longest.ms) longest = { p, ms };
            if (ms < shortest.ms) shortest = { p, ms };
        }
    }
    return { longest, shortest };
}

const fmtDay = (p: DateParts) => `${p.d} ${MONTHS_RO[p.m - 1]}`;

export default async function SunLocationPage({ params }: { params: Promise<{ loc: string }> }) {
    const { loc } = await params;
    const place = getSunLocation(loc);
    if (!place) notFound();

    const today = todayInRomania();
    const tomorrow = addDays(today, 1);
    const sun = getSunDay(today, place.lat, place.lng);
    const sunTomorrow = getSunDay(tomorrow, place.lat, place.lng);
    const sunYesterday = getSunDay(addDays(today, -1), place.lat, place.lng);
    const bucharest = getSunDay(today, BUCHAREST.lat, BUCHAREST.lng);
    const monthName = MONTHS_RO[today.m - 1];
    const dateLabel = `${cap(weekdayRo(today))}, ${today.d} ${monthName} ${today.y}`;
    const dayDelta = Math.round((sun.dayLengthMs - sunYesterday.dayLengthMs) / 60000);

    const solunar = getSolunarData(middayOf(today), place.lat, place.lng);
    const periods = [...solunar.majorPeriods, ...solunar.minorPeriods].sort((a, b) => a.start.getTime() - b.start.getTime());
    const nearest = nearestSolunarCity(place);
    const solunarHref = `/${nearest.c.slug}`;
    const homeHref = `/?lat=${place.lat}&lng=${place.lng}&loc=${encodeURIComponent(place.name)}`;

    const monthRows = Array.from({ length: daysInMonth(today.y, today.m) }, (_, i) => {
        const p = { y: today.y, m: today.m, d: i + 1 };
        return { p, sun: getSunDay(p, place.lat, place.lng) };
    });
    const yearRows = MONTHS_RO.map((name, i) => ({ name, sun: getSunDay({ y: today.y, m: i + 1, d: 15 }, place.lat, place.lng) }));
    const { longest, shortest } = yearExtremes(today.y, place);

    const nearby = sunLocations
        .filter((l) => l.slug !== place.slug)
        .map((l) => ({ l, km: distanceKm(place, l) }))
        .sort((a, b) => a.km - b.km)
        .slice(0, 6)
        .map(({ l, km }) => ({ l, km, sun: getSunDay(today, l.lat, l.lng) }));

    const isBucharest = place.slug === 'bucuresti';
    const riseDiff = minutesBetween(bucharest.sunrise, sun.sunrise);
    const setDiff = minutesBetween(bucharest.sunset, sun.sunset);
    const reliefNote = place.kind === 'munte'
        ? 'Orele sunt calculate pentru orizont liber. În văile dintre munți, soarele apare efectiv deasupra crestelor mai târziu și dispare mai devreme.'
        : null;

    const faq = [
        {
            q: `La ce oră răsare soarele azi în ${place.name}?`,
            a: `Azi, ${dateLabel.toLowerCase()}, soarele răsare în ${place.name} la ${formatClock(sun.sunrise)}. Primele lumini (zorii civili) apar de la ${formatClock(sun.dawn)}.`,
        },
        {
            q: `La ce oră răsare soarele mâine în ${place.name}?`,
            a: `Mâine, ${weekdayRo(tomorrow)} ${tomorrow.d} ${MONTHS_RO[tomorrow.m - 1]}, soarele răsare în ${place.name} la ${formatClock(sunTomorrow.sunrise)} și apune la ${formatClock(sunTomorrow.sunset)}. Se luminează de la ${formatClock(sunTomorrow.dawn)}.`,
        },
        {
            q: `La ce oră apune soarele azi în ${place.name}?`,
            a: `Soarele apune azi în ${place.name} la ${formatClock(sun.sunset)}. Durata zilei este ${formatDuration(sun.dayLengthMs)}.`,
        },
        {
            q: `La ce oră se întunecă azi în ${place.name}?`,
            a: `După apusul de la ${formatClock(sun.sunset)} mai e lumină încă aproximativ ${Math.floor(sun.dusk.getTime() / 60000) - Math.floor(sun.sunset.getTime() / 60000)} de minute. Se întunecă la ${formatClock(sun.dusk)}, când se încheie amurgul civil și e nevoie de lumină artificială afară.`,
        },
        {
            q: `Când este ora de aur în ${place.name} azi?`,
            a: `Dimineața, ora de aur ține de la ${formatClock(sun.sunrise)} până la ${formatClock(sun.goldenHourEnd)}. Seara începe la ${formatClock(sun.goldenHour)} și ține până la apus, la ${formatClock(sun.sunset)}.`,
        },
        {
            q: `Care este cea mai lungă zi din ${today.y} în ${place.name}?`,
            a: `Cea mai lungă zi din ${today.y} în ${place.name} este ${fmtDay(longest.p)}, cu ${formatDuration(longest.ms)} de lumină. Cea mai scurtă este ${fmtDay(shortest.p)}, cu ${formatDuration(shortest.ms)}.`,
        },
    ];

    const url = `${BASE}/rasarit-apus-soare/${place.slug}`;
    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${url}#webpage`,
                url,
                name: `Răsărit și apus soare ${place.name} azi`,
                inLanguage: 'ro',
                isPartOf: { '@id': `${BASE}/#website` },
                about: { '@type': 'Place', name: place.name, geo: { '@type': 'GeoCoordinates', latitude: place.lat, longitude: place.lng } },
                dateModified: `${today.y}-${String(today.m).padStart(2, '0')}-${String(today.d).padStart(2, '0')}`,
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Acasă', item: `${BASE}/` },
                    { '@type': 'ListItem', position: 2, name: 'Răsărit și Apus Soare', item: `${BASE}/rasarit-apus-soare` },
                    { '@type': 'ListItem', position: 3, name: place.name, item: url },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            },
        ],
    };

    const tiles = [
        { label: 'Răsărit soare', value: formatClock(sun.sunrise), dot: '#F2CE72', gold: true },
        { label: 'Apus soare', value: formatClock(sun.sunset), dot: '#E8A15C', gold: true },
        { label: 'Durata zilei', value: formatDuration(sun.dayLengthMs), dot: '#93B4E8' },
        { label: 'Amiaza solară', value: formatClock(sun.solarNoon), dot: '#FFE9A8' },
    ];
    const light = [
        { label: 'Se luminează (zori)', value: formatClock(sun.dawn) },
        { label: 'Ora de aur dimineața', value: `${formatClock(sun.sunrise)} – ${formatClock(sun.goldenHourEnd)}` },
        { label: 'Ora de aur seara', value: `${formatClock(sun.goldenHour)} – ${formatClock(sun.sunset)}` },
        { label: 'Se întunecă (amurg)', value: formatClock(sun.dusk) },
    ];

    return (
        <div className="relative pb-20 pt-4 md:pt-8">
            <JsonLd data={schema} />
            <Breadcrumbs items={[{ label: 'Acasă', href: '/' }, { label: 'Răsărit și Apus Soare', href: '/rasarit-apus-soare' }, { label: place.name }]} />
            <div className="container-custom relative z-10">
                {/* Hero */}
                <section className="card-panel relative mb-6 overflow-hidden p-6 sm:p-8 lg:p-10">
                    <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-amber-200/10 blur-3xl" />
                    <p className="eyebrow relative">{KIND_LABELS[place.kind]} · județul {place.county}</p>
                    <h1 className="relative mt-3 font-editorial text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
                        Răsărit și apus soare <span className="gold-text">{place.name}</span>
                    </h1>
                    <p className="relative mt-3 text-sm text-slate-400 md:text-base">{dateLabel} · ora României</p>

                    <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {tiles.map((t) => (
                            <div key={t.label} className={`glass-tile px-4 py-4 ${t.gold ? 'border-amber-200/20 bg-amber-300/[0.07]' : ''}`}>
                                <p className="flex items-center gap-1.5 whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400 md:text-[11px] md:tracking-[0.12em]">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.dot, boxShadow: `0 0 8px ${t.dot}` }} />
                                    {t.label}
                                </p>
                                <p className="mt-1.5 whitespace-nowrap text-[22px] font-semibold tabular-nums text-white sm:text-2xl md:text-3xl">{t.value}</p>
                            </div>
                        ))}
                    </div>

                    <p className="relative mt-5 max-w-[70ch] text-sm leading-relaxed text-slate-300">
                        Mâine soarele răsare la <strong className="text-white">{formatClock(sunTomorrow.sunrise)}</strong> și apune la{' '}
                        <strong className="text-white">{formatClock(sunTomorrow.sunset)}</strong>. {dayDeltaText(dayDelta)}
                        {!isBucharest && <> În {place.name} soarele {vsBucharest(riseDiff, setDiff)}.</>}
                    </p>
                </section>

                {/* Lumina zilei */}
                <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {light.map((l) => (
                        <div key={l.label} className="dc-card px-4 py-3.5">
                            <p className="text-[11px] text-slate-400">{l.label}</p>
                            <p className="mt-1 text-lg font-semibold tabular-nums text-white">{l.value}</p>
                        </div>
                    ))}
                </section>

                <section className="mb-6">
                    <p className="eyebrow">Mâine, {weekdayRo(tomorrow)} {tomorrow.d} {MONTHS_RO[tomorrow.m - 1]}</p>
                    <h2 className="mt-1.5 mb-3 font-editorial text-2xl text-white">Răsăritul de mâine în {place.name}</h2>
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {[
                            { label: 'Răsare mâine', value: formatClock(sunTomorrow.sunrise) },
                            { label: 'Apune mâine', value: formatClock(sunTomorrow.sunset) },
                            { label: 'Se întunecă mâine', value: formatClock(sunTomorrow.dusk) },
                            { label: 'Durata zilei mâine', value: formatDuration(sunTomorrow.dayLengthMs) },
                        ].map((l) => (
                            <div key={l.label} className="dc-card px-4 py-3.5">
                                <p className="text-[11px] text-slate-400">{l.label}</p>
                                <p className="mt-1 text-lg font-semibold tabular-nums text-white">{l.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <AdUnit slotId="2812628769" format="horizontal" className="mb-8" />

                {/* Despre loc + pescuit */}
                <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                    <section className="card-panel p-6 md:p-8 lg:col-span-7">
                        <p className="eyebrow">Despre loc</p>
                        <h2 className="mt-2 font-editorial text-2xl text-white">Soarele în {place.name}</h2>
                        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300 md:text-[15px]">
                            {place.note && <p>{place.note}</p>}
                            {reliefNote && <p>{reliefNote}</p>}
                            {place.alsoFor && (
                                <p>Orele de pe această pagină sunt valabile și pentru {place.alsoFor.join(' și ')}: diferența este sub un minut.</p>
                            )}
                            <p>
                                Orele sunt calculate astronomic pentru coordonatele {place.lat.toFixed(4)}° N, {place.lng.toFixed(4)}° E, cu precizie de un minut,
                                și țin cont de ora de vară. Răsăritul și apusul înseamnă momentul în care marginea de sus a soarelui atinge orizontul.
                            </p>
                        </div>
                    </section>

                    <section className="card-panel p-6 md:p-8 lg:col-span-5">
                        <p className="eyebrow">Pescuit azi</p>
                        <h2 className="mt-2 font-editorial text-2xl text-white">Ore solunare în {place.name}</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Faza lunii: {getMoonPhaseName(solunar.moonPhase).toLowerCase()} ({solunar.moonIllumination}% iluminată).
                        </p>
                        <ul className="mt-4 space-y-2">
                            {periods.map((p, i) => {
                                const major = p.type === 'major';
                                const golden = isGoldenPeriod(p, solunar);
                                return (
                                    <li key={i} className="glass-tile flex items-center justify-between gap-3 px-3.5 py-2.5">
                                        <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${major ? 'text-moon' : 'text-sky-200'}`}>
                                            {major ? 'Majoră' : 'Minoră'}
                                        </span>
                                        <span className="flex-1 text-sm font-semibold tabular-nums text-white">
                                            {formatClock(p.start)} – {formatClock(p.end)}
                                        </span>
                                        {golden && <span className="text-[11px] font-semibold text-amber-100">✦ cu răsăritul/apusul</span>}
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Link href={homeHref} rel="nofollow" className="glass-chip rounded-xl px-3.5 py-2 text-xs font-semibold text-moon hover:bg-white/10">
                                Ziua completă de pescuit &rarr;
                            </Link>
                            <Link href={solunarHref} className="glass-chip rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white">
                                Solunar {nearest.c.name}
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Tabel luna curenta */}
                <section className="mb-8">
                    <p className="eyebrow">Zi cu zi</p>
                    <h2 className="mt-1.5 mb-4 font-editorial text-2xl text-white md:text-[28px]">
                        Răsărit și apus {place.name} — {cap(monthName)} {today.y}
                    </h2>
                    <div className="card-panel overflow-x-auto p-3 md:p-5">
                        <table className="w-full min-w-[440px] text-sm">
                            <thead>
                                <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-slate-400">
                                    <th className="px-3 py-2 font-semibold">Ziua</th>
                                    <th className="px-3 py-2 font-semibold">Răsărit</th>
                                    <th className="px-3 py-2 font-semibold">Apus</th>
                                    <th className="px-3 py-2 font-semibold">Durata zilei</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthRows.map(({ p, sun: s }) => {
                                    const isToday = p.d === today.d;
                                    return (
                                        <tr
                                            key={p.d}
                                            aria-current={isToday ? 'date' : undefined}
                                            className={`border-t border-white/[0.06] ${isToday ? 'bg-amber-300/[0.08]' : ''}`}
                                        >
                                            <td className={`px-3 py-2 ${isToday ? 'font-bold text-moon' : 'text-slate-300'}`}>
                                                {p.d} {monthName.slice(0, 3)} <span className="text-xs text-slate-500">{weekdayRo(p).slice(0, 3)}</span>
                                                {isToday && <span className="ml-1.5 text-[10px] uppercase tracking-wider">azi</span>}
                                            </td>
                                            <td className="px-3 py-2 font-semibold tabular-nums text-amber-200">{formatClock(s.sunrise)}</td>
                                            <td className="px-3 py-2 font-semibold tabular-nums text-orange-200">{formatClock(s.sunset)}</td>
                                            <td className="px-3 py-2 tabular-nums text-slate-400">{formatDuration(s.dayLengthMs)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <LazyAdUnit slotId="6301173988" format="rectangle" className="mb-8" />

                {/* Pe tot anul */}
                <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                    <div className="lg:col-span-7">
                        <p className="eyebrow">Pe tot anul</p>
                        <h2 className="mt-1.5 mb-4 font-editorial text-2xl text-white md:text-[28px]">
                            Răsărit și apus în {place.name} pe luni, {today.y}
                        </h2>
                        <div className="card-panel overflow-x-auto p-3 md:p-5">
                            <table className="w-full min-w-[400px] text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-slate-400">
                                        <th className="px-3 py-2 font-semibold">15 ale lunii</th>
                                        <th className="px-3 py-2 font-semibold">Răsărit</th>
                                        <th className="px-3 py-2 font-semibold">Apus</th>
                                        <th className="px-3 py-2 font-semibold">Zi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {yearRows.map(({ name, sun: s }, i) => (
                                        <tr key={name} className={`border-t border-white/[0.06] ${i === today.m - 1 ? 'bg-amber-300/[0.08]' : ''}`}>
                                            <td className="px-3 py-2 text-slate-300">{cap(name)}</td>
                                            <td className="px-3 py-2 tabular-nums text-amber-200">{formatClock(s.sunrise)}</td>
                                            <td className="px-3 py-2 tabular-nums text-orange-200">{formatClock(s.sunset)}</td>
                                            <td className="px-3 py-2 tabular-nums text-slate-400">{formatDuration(s.dayLengthMs)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 lg:col-span-5 lg:pt-[68px]">
                        <div className="dc-card p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Cea mai lungă zi din {today.y}</p>
                            <p className="mt-1.5 font-editorial text-2xl text-white">{fmtDay(longest.p)}</p>
                            <p className="mt-1 text-sm text-slate-400">{formatDuration(longest.ms)} de lumină</p>
                        </div>
                        <div className="dc-card p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Cea mai scurtă zi din {today.y}</p>
                            <p className="mt-1.5 font-editorial text-2xl text-white">{fmtDay(shortest.p)}</p>
                            <p className="mt-1 text-sm text-slate-400">{formatDuration(shortest.ms)} de lumină</p>
                        </div>
                    </div>
                </section>

                {/* In apropiere */}
                <section className="mb-8">
                    <p className="eyebrow">În apropiere</p>
                    <h2 className="mt-1.5 mb-4 font-editorial text-2xl text-white md:text-[28px]">Răsărit și apus azi în localitățile apropiate</h2>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {nearby.map(({ l, km, sun: s }) => (
                            <Link key={l.slug} href={`/rasarit-apus-soare/${l.slug}`} className="glass-tile interactive-lift group flex items-center justify-between gap-3 px-4 py-3">
                                <span>
                                    <span className="block text-[15px] font-semibold text-white transition-colors group-hover:text-amber-100">{l.name}</span>
                                    <span className="text-xs text-slate-500">{Math.round(km)} km · {KIND_LABELS[l.kind].toLowerCase()}</span>
                                </span>
                                <span className="text-right text-xs tabular-nums text-slate-300">
                                    <span className="block text-amber-200">↑ {formatClock(s.sunrise)}</span>
                                    <span className="block text-orange-200">↓ {formatClock(s.sunset)}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="/rasarit-apus-soare" className="text-sm text-amber-200 hover:underline">
                            Toate localitățile &rarr;
                        </Link>
                    </div>
                </section>

                {/* FAQ */}
                <section className="card-panel mx-auto max-w-4xl p-6 md:p-8">
                    <p className="eyebrow">Întrebări frecvente</p>
                    <h2 className="mt-2 mb-4 font-editorial text-2xl text-white">Răsărit și apus în {place.name}</h2>
                    <div className="divide-y divide-white/[0.07]">
                        {faq.map((f) => (
                            <div key={f.q} className="py-4">
                                <h3 className="text-[15px] font-semibold text-amber-100">{f.q}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
