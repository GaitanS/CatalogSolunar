import { notFound } from 'next/navigation';
import { getSolunarData, getMoonPhaseName, formatTime, getActiveFish, getMoonage } from '@/lib/solunar';
import { getFishingAdvice } from '@/lib/advice';
import Moon3DWrapper from '@/components/Moon3DWrapper';
import ActivityGraph from '@/components/ActivityGraph';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getLocationBySlug, getAllLocations, getLocationsByCounty } from '@/data/fishingLocations';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
    return getAllLocations().map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const loc = getLocationBySlug(slug);
    if (!loc) return {};

    const year = new Date().getFullYear();
    const fishStr = loc.fish.slice(0, 3).join(', ');

    return {
        title: `Pescuit ${loc.name} ${year} ✓ Solunar GPS și ${loc.fish.length} Specii`,
        description: `✅ Pescuit la ${loc.name} (${loc.county}): ${fishStr} + alte ${loc.fish.length - 3} specii. Ore exacte solunar pe GPS, ${loc.paid ? 'cu taxă' : 'acces gratuit'}. Verifică când trage peștele!`,
        keywords: [
            `pescuit ${loc.name.toLowerCase()}`,
            `${loc.name.toLowerCase()} pescuit`,
            `solunar ${loc.name.toLowerCase()}`,
            `locuri pescuit ${loc.county.toLowerCase()}`,
            `pescuit ${loc.county.toLowerCase()}`,
            ...loc.fish.slice(0, 3).map(f => `pescuit ${f}`),
        ],
        alternates: { canonical: `https://calendarsolunar.ro/locuri-pescuit/${loc.slug}` },
        openGraph: {
            title: `Pescuit ${loc.name} - Calendar Solunar ${year}`,
            description: `${loc.name} (${loc.county}): ${fishStr}. Solunar pe ore exacte pentru locatia GPS.`,
            url: `https://calendarsolunar.ro/locuri-pescuit/${loc.slug}`,
            siteName: 'Calendar Solunar',
            locale: 'ro_RO',
            type: 'website',
        },
    };
}

const typeLabels: Record<string, string> = {
    lac: 'Lac natural',
    balta: 'Balta',
    acumulare: 'Lac de acumulare',
    iaz: 'Iaz',
    rau: 'Rau',
    canal: 'Canal',
    delta: 'Delta',
};

// All JSON-LD data below is constructed from our internal static database (fishingLocations.ts),
// not from user input. Safe for use with dangerouslySetInnerHTML.
function LocationJsonLd({ loc }: { loc: { name: string; slug: string; county: string; locality: string; lat: number; lng: number; description: string } }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: loc.name,
        description: loc.description,
        url: `https://calendarsolunar.ro/locuri-pescuit/${loc.slug}`,
        address: {
            '@type': 'PostalAddress',
            addressLocality: loc.locality,
            addressRegion: loc.county,
            addressCountry: 'RO',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: loc.lat,
            longitude: loc.lng,
        },
        isPartOf: { '@type': 'WebSite', name: 'Calendar Solunar', url: 'https://calendarsolunar.ro' },
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function LocationFAQSchema({ loc }: { loc: { name: string; county: string; fish: string[]; paid: boolean } }) {
    const faqs = [
        {
            question: `Ce pesti se prind la ${loc.name}?`,
            answer: `La ${loc.name} (${loc.county}) se prind: ${loc.fish.join(', ')}. Verifica calendarul solunar pentru orele optime.`,
        },
        {
            question: `Este gratuit pescuitul la ${loc.name}?`,
            answer: loc.paid
                ? `Pescuitul la ${loc.name} necesita taxa/permis. Verifica la administratorul apei conditiile de acces.`
                : `Da, pescuitul la ${loc.name} este gratuit. Este necesara doar autorizatia ANPA valabila.`,
        },
        {
            question: `Cand este cel mai bun moment pentru pescuit la ${loc.name}?`,
            answer: `Foloseste calendarul solunar de pe aceasta pagina, calculat pentru coordonatele GPS exacte ale ${loc.name}. Perioadele majore (2 ore) ofera activitate maxima.`,
        },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const loc = getLocationBySlug(slug);
    if (!loc) notFound();

    const today = new Date();
    const data = getSolunarData(today, loc.lat, loc.lng);
    const weather = { temperature: 15, pressure: 1013, windSpeed: 5, windDirection: 180, waterTemp: 12 };
    const advice = getFishingAdvice(weather, data);
    const activeFish = getActiveFish(today, data.moonPhase);

    const dateStr = today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    const ratingLabels = ['', 'Slaba', 'Moderata', 'Buna', 'Foarte Buna', 'Excelenta'];
    const ratingColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400', 'text-green-400'];

    const nearbyLocations = getLocationsByCounty(loc.county).filter(l => l.slug !== loc.slug).slice(0, 6);
    const allLocations = getAllLocations();
    const otherLocations = allLocations.filter(l => l.county !== loc.county).slice(0, 6);

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <LocationJsonLd loc={loc} />
            <LocationFAQSchema loc={loc} />
            <Breadcrumbs items={[
                { label: 'Acasa', href: '/' },
                { label: 'Locuri de Pescuit', href: '/locuri-pescuit' },
                { label: loc.name },
            ]} />
            <div className="container-custom px-4 relative z-10">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                        Pescuit la <span className="text-amber-400">{loc.name}</span>
                    </h1>
                    <p className="text-night-400 text-sm md:text-base mb-2">
                        {capitalizedDate} &bull; {loc.locality}, {loc.county} &bull; {typeLabels[loc.type] || loc.type}
                        {loc.paid ? ' &bull; Cu taxa' : ' &bull; Acces gratuit'}
                    </p>
                    <p className="text-night-300 text-sm md:text-lg max-w-2xl mx-auto">{loc.description}</p>
                </div>

                {/* Solunar Rating */}
                <div className="card-panel p-6 md:p-8 mb-8 text-center">
                    <h2 className="text-lg font-display font-bold text-night-400 mb-4">Solunar {loc.name} - Azi</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                        <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]">
                            <Moon3DWrapper phase={getMoonage(today) / 29.53} illumination={data.moonIllumination} size={160} />
                        </div>
                        <div>
                            <div className="text-6xl md:text-8xl font-display font-bold text-white mb-1">
                                {data.overallRating}<span className="text-3xl md:text-4xl text-night-500">/5</span>
                            </div>
                            <div className={`text-lg md:text-xl font-bold ${ratingColors[data.overallRating]}`}>
                                Activitate {ratingLabels[data.overallRating]}
                            </div>
                            <div className="flex justify-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <svg key={s} className={`w-5 h-5 ${s <= data.overallRating ? 'text-amber-400' : 'text-night-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-amber-200 font-bold text-lg">{getMoonPhaseName(data.moonPhase)}</p>
                            <p className="text-night-400 text-sm">{data.moonIllumination}% iluminare</p>
                            <p className="text-night-500 text-xs mt-1">GPS: {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</p>
                        </div>
                    </div>
                </div>

                <AdUnit slotId="2812628769" format="horizontal" className="min-h-[90px] mb-8" label="Reclama" />

                {/* Solunar Periods */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-amber-400 mb-4">Perioade Majore</h2>
                        <p className="text-night-400 text-sm mb-4">Durata ~2 ore. Activitate maxima a pestilor la {loc.name}.</p>
                        <div className="space-y-3">
                            {data.majorPeriods.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-white font-mono font-bold">{formatTime(p.start)} - {formatTime(p.end)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-cyan-400 mb-4">Perioade Minore</h2>
                        <p className="text-night-400 text-sm mb-4">Durata ~1 ora. Activitate moderata.</p>
                        <div className="space-y-3">
                            {data.minorPeriods.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                        <span className="text-white font-mono font-bold">{formatTime(p.start)} - {formatTime(p.end)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Graph */}
                <div className="card-panel p-6 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Grafic Activitate - {loc.name}</h2>
                    <ActivityGraph majorPeriods={data.majorPeriods} minorPeriods={data.minorPeriods} />
                </div>

                {/* Fish Species & Advice */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-emerald-400 mb-4">Specii de Pesti</h2>
                        {loc.fish.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {loc.fish.map((fish, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm">{fish}</span>
                                ))}
                            </div>
                        ) : <p className="text-night-400 text-sm">Informatii indisponibile.</p>}
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">Sfatul Zilei</h2>
                        <p className="text-night-300 text-sm leading-relaxed">{advice}</p>
                    </div>
                </div>

                {/* Location Details */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Detalii Locatie</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-night-500 block">Tip</span>
                            <span className="text-white font-medium">{typeLabels[loc.type] || loc.type}</span>
                        </div>
                        <div>
                            <span className="text-night-500 block">Judet</span>
                            <span className="text-white font-medium">{loc.county}</span>
                        </div>
                        <div>
                            <span className="text-night-500 block">Localitate</span>
                            <span className="text-white font-medium">{loc.locality}</span>
                        </div>
                        <div>
                            <span className="text-night-500 block">Acces</span>
                            <span className={`font-medium ${loc.paid ? 'text-yellow-300' : 'text-emerald-300'}`}>
                                {loc.paid ? 'Cu taxa / permis' : 'Gratuit (autorizatie ANPA)'}
                            </span>
                        </div>
                    </div>
                </div>

                <LazyAdUnit slotId="6301173988" format="rectangle" style={{ minHeight: '280px' }} className="mb-8" label="Reclama" />

                {/* FAQ */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Intrebari Frecvente - {loc.name}</h2>
                    <div className="space-y-4">
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Ce pesti se prind la {loc.name}?</h3>
                            <p className="text-night-300 text-sm">La {loc.name} se prind: {loc.fish.join(', ')}.</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Cand este cel mai bun moment de pescuit?</h3>
                            <p className="text-night-300 text-sm">Verifica perioadele solunar majore de pe aceasta pagina, calculate pentru coordonatele GPS exacte ({loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}).</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Este gratuit pescuitul?</h3>
                            <p className="text-night-300 text-sm">
                                {loc.paid
                                    ? 'Pescuitul la aceasta locatie necesita taxa sau permis de la administratorul apei.'
                                    : 'Da, accesul este gratuit. Este necesara autorizatia ANPA valabila.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nearby Locations */}
                {nearbyLocations.length > 0 && (
                    <div className="card-panel p-6 md:p-8 mb-8">
                        <h2 className="text-xl font-display font-bold text-white mb-4">Alte Locuri in {loc.county}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {nearbyLocations.map((l) => (
                                <Link key={l.slug} href={`/locuri-pescuit/${l.slug}`} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                                    <p className="text-white font-bold text-sm">{l.name}</p>
                                    <p className="text-night-400 text-xs">{l.fish.slice(0, 2).join(', ')}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other Locations */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Locuri Populare din Romania</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {otherLocations.map((l) => (
                            <Link key={l.slug} href={`/locuri-pescuit/${l.slug}`} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                                <p className="text-white font-bold text-sm">{l.name}</p>
                                <p className="text-night-400 text-xs">{l.county}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link href="/locuri-pescuit" className="text-amber-400 hover:underline text-sm">
                            Vezi toate locurile de pescuit &rarr;
                        </Link>
                    </div>
                </div>

                <LazyAdUnit slotId="1044977874" format="auto" layout="in-article" className="min-h-[120px] mt-8" label="Reclama" />
            </div>
        </div>
    );
}
