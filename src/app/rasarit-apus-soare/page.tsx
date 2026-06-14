import type { Metadata } from 'next';
import Link from 'next/link';
import { getSolunarData, formatTime } from '@/lib/solunar';
import { getAllCities } from '@/data/cities';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import JsonLd from '@/components/JsonLd';

// Shows today's sunrise/sunset — regenerate hourly so static output stays fresh.
export const revalidate = 3600;

const BUCHAREST = { lat: 44.4268, lng: 26.1025 };

function dayLength(sunrise: Date, sunset: Date): string {
    const ms = sunset.getTime() - sunrise.getTime();
    const h = Math.floor(ms / 3_600_000);
    const m = Math.round((ms % 3_600_000) / 60_000);
    return `${h}h ${m}min`;
}

export async function generateMetadata(): Promise<Metadata> {
    const today = new Date();
    const day = today.getDate();
    const monthName = today.toLocaleDateString('ro-RO', { month: 'long' });
    const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    const year = today.getFullYear();
    const data = getSolunarData(today, BUCHAREST.lat, BUCHAREST.lng);

    return {
        title: { absolute: `Răsărit și Apus Soare Azi, ${day} ${monthCap} - Ore Exacte` },
        description: `Răsăritul soarelui azi la ${formatTime(data.sunrise)} și apusul la ${formatTime(data.sunset)} (București). Ore exacte de răsărit și apus pentru orașele din România, ${day} ${monthName} ${year}, plus răsărit/apus lună.`,
        keywords: [
            'apusul azi', 'rasaritul azi', 'apusul soarelui azi', 'rasaritul soarelui azi',
            'ora apus soare', 'ora rasarit soare', 'cat e ziua azi', 'apus soare romania',
            'rasarit apus luna', 'apusul soarelui',
        ],
        alternates: { canonical: 'https://calendarsolunar.ro/rasarit-apus-soare' },
        openGraph: {
            title: `Răsărit și Apus Soare Azi, ${day} ${monthCap}`,
            description: `Ore exacte de răsărit (${formatTime(data.sunrise)}) și apus (${formatTime(data.sunset)}) pentru orașele din România.`,
            url: 'https://calendarsolunar.ro/rasarit-apus-soare',
            siteName: 'Calendar Solunar',
            locale: 'ro_RO',
            type: 'website',
        },
    };
}

export default function RasaritApusPage() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    const buc = getSolunarData(today, BUCHAREST.lat, BUCHAREST.lng);
    const cities = getAllCities().map((city) => {
        const d = getSolunarData(today, city.lat, city.lng);
        return { city, sunrise: d.sunrise, sunset: d.sunset, moonrise: d.moonrise, moonset: d.moonset };
    });

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': 'https://calendarsolunar.ro/rasarit-apus-soare#webpage',
                url: 'https://calendarsolunar.ro/rasarit-apus-soare',
                name: `Răsărit și Apus Soare Azi, ${capitalizedDate}`,
                description: `Ore exacte de răsărit (${formatTime(buc.sunrise)}) și apus (${formatTime(buc.sunset)}) ale soarelui pentru orașele din România.`,
                inLanguage: 'ro',
                isPartOf: { '@id': 'https://calendarsolunar.ro/#website' },
                datePublished: today.toISOString().slice(0, 10),
                dateModified: today.toISOString().slice(0, 10),
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Acasă', item: 'https://calendarsolunar.ro/' },
                    { '@type': 'ListItem', position: 2, name: 'Răsărit și Apus Soare', item: 'https://calendarsolunar.ro/rasarit-apus-soare' },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'La ce oră răsare și apune soarele azi?',
                        acceptedAnswer: { '@type': 'Answer', text: `Azi, ${capitalizedDate}, în București soarele răsare la ${formatTime(buc.sunrise)} și apune la ${formatTime(buc.sunset)}. Durata zilei este ${dayLength(buc.sunrise, buc.sunset)}. Pentru alte orașe, vezi tabelul de pe pagină.` },
                    },
                    {
                        '@type': 'Question',
                        name: 'De ce contează răsăritul și apusul pentru pescuit?',
                        acceptedAnswer: { '@type': 'Answer', text: 'Răsăritul și apusul soarelui sunt cele mai active intervale pentru pești. Când o perioadă majoră solunar coincide cu răsăritul sau apusul, activitatea peștilor poate fi de câteva ori mai mare decât în restul zilei.' },
                    },
                    {
                        '@type': 'Question',
                        name: 'La ce oră răsare și apune luna azi?',
                        acceptedAnswer: { '@type': 'Answer', text: `Azi, în București, luna răsare la ${buc.moonrise ? formatTime(buc.moonrise) : '—'} și apune la ${buc.moonset ? formatTime(buc.moonset) : '—'}. Răsăritul și apusul lunii marchează perioadele minore solunar.` },
                    },
                ],
            },
        ],
    };

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <JsonLd data={schema} />
            <Breadcrumbs items={[{ label: 'Acasă', href: '/' }, { label: 'Răsărit și Apus Soare' }]} />
            <div className="container-custom px-4 relative z-10">
                {/* Hero */}
                <div className="mb-8 card-panel taste-surface p-5 md:p-8">
                    <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-none text-white mb-3">
                        Răsărit și Apus <span className="text-amber-400">Soare Azi</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base mb-6">{capitalizedDate} &bull; România</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 text-center">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-amber-100/80 font-bold mb-1">Răsărit soare</p>
                            <p className="font-mono text-2xl font-bold text-white">{formatTime(buc.sunrise)}</p>
                        </div>
                        <div className="rounded-2xl border border-amber-200/20 bg-amber-300/10 p-4 text-center">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-amber-100/80 font-bold mb-1">Apus soare</p>
                            <p className="font-mono text-2xl font-bold text-white">{formatTime(buc.sunset)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-center">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold mb-1">Durata zilei</p>
                            <p className="font-mono text-2xl font-bold text-white">{dayLength(buc.sunrise, buc.sunset)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-center">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold mb-1">Răsărit / apus lună</p>
                            <p className="font-mono text-lg font-bold text-white">{buc.moonrise ? formatTime(buc.moonrise) : '—'} / {buc.moonset ? formatTime(buc.moonset) : '—'}</p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-xs mt-3">Orele afișate sunt pentru București. Vezi tabelul de mai jos pentru orașul tău.</p>
                </div>

                {/* Ad: top in-content (eager) */}
                <AdUnit slotId="2812628769" format="horizontal" className="mb-8" />

                {/* City table */}
                <h2 className="text-xl font-display font-bold text-white mb-4">Ore de Răsărit și Apus pe Orașe — {capitalizedDate}</h2>
                <div className="overflow-x-auto card-panel taste-surface p-4 md:p-6 mb-8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-[11px] uppercase tracking-[0.14em]">
                                <th className="text-left py-2 px-2">Oraș</th>
                                <th className="text-left py-2 px-2">🌅 Răsărit</th>
                                <th className="text-left py-2 px-2">🌇 Apus</th>
                                <th className="text-left py-2 px-2">Durata zilei</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {cities.map(({ city, sunrise, sunset }) => (
                                <tr key={city.slug}>
                                    <td className="py-2 px-2 font-bold text-white">
                                        <Link href={`/${city.slug}`} className="hover:text-amber-300 transition-colors">{city.name}</Link>
                                    </td>
                                    <td className="py-2 px-2 font-mono text-amber-300">{formatTime(sunrise)}</td>
                                    <td className="py-2 px-2 font-mono text-amber-200">{formatTime(sunset)}</td>
                                    <td className="py-2 px-2 font-mono text-slate-300">{dayLength(sunrise, sunset)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Why it matters */}
                <section className="card-panel taste-surface p-6 md:p-8 mb-8">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-3">Răsăritul, Apusul și Pescuitul — Fereastra de Aur</h2>
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                        <p>
                            Răsăritul și apusul soarelui sunt cele mai productive momente ale zilei pentru pescuit. Lumina scăzută reduce vigilența peștilor, iar temperatura apei se schimbă, declanșând activitatea de hrănire.
                        </p>
                        <p>
                            <strong className="text-white">Fereastra de aur</strong> apare când o <Link href="/azi" className="text-amber-200 hover:underline">perioadă majoră solunar</Link> se suprapune cu răsăritul sau apusul soarelui. În aceste intervale, activitatea peștilor poate fi de 3–4 ori mai mare. Combină orele de mai sus cu calendarul solunar pentru a planifica ieșirea perfectă.
                        </p>
                        <p>
                            Răsăritul și apusul lunii marchează <Link href="/lunar" className="text-amber-200 hover:underline">perioadele minore</Link>, mai scurte dar și ele productive. Vezi <Link href="/" className="text-amber-200 hover:underline">calendarul solunar complet</Link> pentru ore exacte pe locația ta.
                        </p>
                    </div>
                </section>

                {/* Ad: bottom (lazy) */}
                <LazyAdUnit slotId="1044977874" format="auto" className="mb-8" />

                {/* FAQ */}
                <section className="card-panel taste-surface p-6 md:p-8">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4">Întrebări Frecvente</h2>
                    <div className="space-y-4">
                        <div className="border-b border-white/10 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">La ce oră răsare și apune soarele azi?</h3>
                            <p className="text-slate-300 text-sm">Azi, {capitalizedDate}, în București soarele răsare la {formatTime(buc.sunrise)} și apune la {formatTime(buc.sunset)}. Durata zilei este {dayLength(buc.sunrise, buc.sunset)}.</p>
                        </div>
                        <div className="border-b border-white/10 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">De ce contează răsăritul și apusul pentru pescuit?</h3>
                            <p className="text-slate-300 text-sm">Sunt cele mai active intervale pentru pești. Când o perioadă majoră solunar coincide cu răsăritul sau apusul, activitatea peștilor poate fi de câteva ori mai mare.</p>
                        </div>
                        <div className="pb-2">
                            <h3 className="text-base font-bold text-amber-400 mb-2">La ce oră răsare și apune luna azi?</h3>
                            <p className="text-slate-300 text-sm">Azi, în București, luna răsare la {buc.moonrise ? formatTime(buc.moonrise) : '—'} și apune la {buc.moonset ? formatTime(buc.moonset) : '—'}.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
