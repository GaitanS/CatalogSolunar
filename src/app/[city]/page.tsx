import { notFound } from 'next/navigation';
import { getSolunarData, getMoonPhaseName, formatTime, getActiveFish, getMoonage } from '@/lib/solunar';
import { getWeatherData } from '@/lib/weather';
import { getFishingAdvice } from '@/lib/advice';
import Moon3DWrapper from '@/components/Moon3DWrapper';
import ActivityGraph from '@/components/ActivityGraph';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getCityBySlug, getAllCities } from '@/data/cities';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
    return getAllCities().map((city) => ({
        city: city.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);
    if (!city) return {};

    const today = new Date();
    const monthName = today.toLocaleDateString('ro-RO', { month: 'long' });
    const year = today.getFullYear();
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return {
        title: `Solunar ${city.name} ${capitalizedMonth} ${year} - Pescuit pe Ore`,
        description: `Calendar solunar ${city.name} ${year}. Perioade majore și minore de activitate a peștilor, faze lunare, vremea și locuri de pescuit în ${city.county}. Actualizat zilnic.`,
        keywords: [
            `solunar ${city.name.toLowerCase()}`,
            `pescuit ${city.name.toLowerCase()}`,
            `calendar solunar ${city.name.toLowerCase()}`,
            `cand trage pestele ${city.name.toLowerCase()}`,
            `locuri pescuit ${city.county.toLowerCase()}`,
        ],
        alternates: {
            canonical: `https://calendarsolunar.ro/${city.slug}`,
        },
        openGraph: {
            title: `Solunar ${city.name} - Calendar Pescuit ${year}`,
            description: `Află când trage peștele în ${city.name}! Calendar solunar cu perioade majore, faze lunare și locuri de pescuit în ${city.county}.`,
            url: `https://calendarsolunar.ro/${city.slug}`,
            siteName: 'Calendar Solunar',
            locale: 'ro_RO',
            type: 'website',
        },
    };
}

// FAQ Schema for city pages - data is from our static city database
function CityFAQSchema({ city, nearbyWaters }: { city: { name: string; county: string }; nearbyWaters: string[] }) {
    const faqs = [
        {
            question: `Cand trage pestele in ${city.name}?`,
            answer: `Pestele este cel mai activ in ${city.name} in perioadele solunar majore, care dureaza aproximativ 2 ore. Verifica calendarul solunar zilnic pentru orele exacte calculate pentru zona ${city.county}.`,
        },
        {
            question: `Care sunt cele mai bune locuri de pescuit in ${city.name}?`,
            answer: `Cele mai populare locuri de pescuit in zona ${city.name}, judetul ${city.county} sunt: ${nearbyWaters.slice(0, 4).join(', ')}. Fiecare locatie are conditii specifice si specii diferite.`,
        },
        {
            question: `Cum functioneaza calendarul solunar pentru ${city.name}?`,
            answer: `Calendarul solunar pentru ${city.name} calculeaza perioadele de activitate a pestilor pe baza pozitiei lunii fata de coordonatele exacte ale orasului. Perioadele majore coincid cu tranzitul lunar, iar cele minore cu rasaritul si apusul lunii.`,
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

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

function CityJsonLd({ city }: { city: { name: string; slug: string; county: string; lat: number; lng: number } }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `Calendar Solunar ${city.name}`,
        description: `Calendar solunar pentru pescuit in ${city.name}, ${city.county}`,
        url: `https://calendarsolunar.ro/${city.slug}`,
        isPartOf: {
            '@type': 'WebSite',
            name: 'Calendar Solunar',
            url: 'https://calendarsolunar.ro',
        },
        about: {
            '@type': 'Place',
            name: city.name,
            address: {
                '@type': 'PostalAddress',
                addressLocality: city.name,
                addressRegion: city.county,
                addressCountry: 'RO',
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: city.lat,
                longitude: city.lng,
            },
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
    const { city: citySlug } = await params;
    const city = getCityBySlug(citySlug);
    if (!city) notFound();

    const today = new Date();
    const data = getSolunarData(today, city.lat, city.lng);
    const weather = await getWeatherData(city.lat, city.lng);
    const advice = getFishingAdvice(weather, data);
    const activeFish = getActiveFish(today, data.moonPhase);

    const dateStr = today.toLocaleDateString('ro-RO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    const ratingLabels = ['', 'Slaba', 'Moderata', 'Buna', 'Foarte Buna', 'Excelenta'];
    const ratingColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400', 'text-green-400'];

    const otherCities = getAllCities().filter(c => c.slug !== city.slug).slice(0, 6);

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <CityJsonLd city={city} />
            <CityFAQSchema city={city} nearbyWaters={city.nearbyWaters} />
            <Breadcrumbs items={[
                { label: 'Acasă', href: '/' },
                { label: `Solunar ${city.name}` },
            ]} />
            <div className="container-custom px-4 relative z-10">
                {/* Hero */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                        Solunar <span className="text-amber-400">{city.name}</span>
                    </h1>
                    <p className="text-night-400 text-sm md:text-base mb-2">{capitalizedDate} &bull; {city.county}</p>
                    <p className="text-night-300 text-sm md:text-lg max-w-2xl mx-auto">
                        {city.description}
                    </p>
                </div>

                {/* Rating Hero */}
                <div className="card-panel p-6 md:p-8 mb-8 text-center">
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
                            <p className="text-night-400 text-sm mt-1">Temp: {weather.temperature}°C</p>
                            <p className="text-night-400 text-sm">Presiune: {weather.pressure} hPa</p>
                        </div>
                    </div>
                </div>

                <AdUnit slotId="2812628769" format="horizontal" className="min-h-[90px] mb-8" label="Reclama" />

                {/* Periods */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-amber-400 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" /></svg>
                            Perioade Majore {city.name}
                        </h2>
                        <p className="text-night-400 text-sm mb-4">Durata ~2 ore. Activitate maxima a pestilor.</p>
                        <div className="space-y-3">
                            {data.majorPeriods.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-white font-mono font-bold">{formatTime(p.start)} - {formatTime(p.end)}</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <svg key={s} className={`w-3.5 h-3.5 ${s <= p.rating ? 'text-amber-400' : 'text-night-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-cyan-400 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            Perioade Minore {city.name}
                        </h2>
                        <p className="text-night-400 text-sm mb-4">Durata ~1 ora. Activitate moderata.</p>
                        <div className="space-y-3">
                            {data.minorPeriods.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                        <span className="text-white font-mono font-bold">{formatTime(p.start)} - {formatTime(p.end)}</span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <svg key={s} className={`w-3.5 h-3.5 ${s <= p.rating ? 'text-cyan-400' : 'text-night-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Graph */}
                <div className="card-panel p-6 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Grafic Activitate {city.name}</h2>
                    <ActivityGraph majorPeriods={data.majorPeriods} minorPeriods={data.minorPeriods} />
                    <div className="flex justify-center gap-6 mt-3 text-xs font-mono text-night-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Majora</span>
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Minora</span>
                    </div>
                </div>

                {/* Sun/Moon Times */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="card-glass p-4 text-center">
                        <p className="text-[10px] uppercase text-night-400 font-bold tracking-wider mb-1">Rasarit Soare</p>
                        <p className="text-xl font-mono text-amber-400">{formatTime(data.sunrise)}</p>
                    </div>
                    <div className="card-glass p-4 text-center">
                        <p className="text-[10px] uppercase text-night-400 font-bold tracking-wider mb-1">Apus Soare</p>
                        <p className="text-xl font-mono text-orange-400">{formatTime(data.sunset)}</p>
                    </div>
                    <div className="card-glass p-4 text-center">
                        <p className="text-[10px] uppercase text-night-400 font-bold tracking-wider mb-1">Rasarit Luna</p>
                        <p className="text-xl font-mono text-blue-400">{data.moonrise ? formatTime(data.moonrise) : '--:--'}</p>
                    </div>
                    <div className="card-glass p-4 text-center">
                        <p className="text-[10px] uppercase text-night-400 font-bold tracking-wider mb-1">Apus Luna</p>
                        <p className="text-xl font-mono text-indigo-400">{data.moonset ? formatTime(data.moonset) : '--:--'}</p>
                    </div>
                </div>

                {/* Active Fish & Advice */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-emerald-400 mb-4">Specii Active in {city.name}</h2>
                        {activeFish.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {activeFish.map((fish, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium">
                                        {fish}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-night-400">Activitate generala redusa astazi.</p>
                        )}
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">Sfatul Zilei</h2>
                        <p className="text-night-300 text-sm leading-relaxed">{advice}</p>
                    </div>
                </div>

                <LazyAdUnit slotId="6301173988" format="rectangle" style={{ minHeight: '280px' }} className="mb-8" label="Reclama" />

                {/* Nearby Waters */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-4">Locuri de Pescuit langa {city.name}</h2>
                    <p className="text-night-300 text-sm mb-4">
                        Cele mai populare ape pentru pescuit din zona {city.name}, judetul {city.county}:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {city.nearbyWaters.map((water, i) => (
                            <div key={i} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-white text-sm font-medium">{water}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SEO Content */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-4">Calendar Solunar {city.name}</h2>
                    <div className="prose prose-invert prose-sm max-w-none text-night-300 space-y-4">
                        <p>
                            Calendarul solunar pentru <strong className="text-white">{city.name}</strong> calculeaza perioadele de activitate maxima
                            a pestilor pe baza coordonatelor geografice exacte ale orasului ({city.lat.toFixed(2)}°N, {city.lng.toFixed(2)}°E).
                            Timpii de rasarit/apus ai soarelui si lunii variaza fata de alte orase din Romania, influentand orele optime de pescuit.
                        </p>
                        <p>
                            <strong className="text-white">Perioadele majore</strong> dureaza aproximativ 2 ore si coincid cu tranzitul lunar
                            &mdash; momentele cand luna este direct deasupra sau dedesubtul locatiei tale din {city.name}.
                            Aceste perioade ofera cele mai mari sanse de succes la pescuit.
                        </p>
                        <p>
                            Pentru rezultate optime, combina datele solunar cu conditiile meteo locale din {city.county}:
                            presiune atmosferica stabila, vant slab si temperaturi moderate cresc semnificativ activitatea pestilor.
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Intrebari Frecvente - {city.name}</h2>
                    <div className="space-y-4">
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Cand trage pestele in {city.name}?</h3>
                            <p className="text-night-300 text-sm">Pestele este cel mai activ in {city.name} in perioadele solunar majore, care dureaza aproximativ 2 ore. Verifica calendarul solunar zilnic pentru orele exacte calculate pentru zona {city.county}.</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Care sunt cele mai bune locuri de pescuit in {city.name}?</h3>
                            <p className="text-night-300 text-sm">Cele mai populare locuri de pescuit in zona {city.name}, judetul {city.county} sunt: {city.nearbyWaters.slice(0, 4).join(', ')}.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Cum functioneaza calendarul solunar pentru {city.name}?</h3>
                            <p className="text-night-300 text-sm">Calendarul solunar pentru {city.name} calculeaza perioadele de activitate a pestilor pe baza pozitiei lunii fata de coordonatele exacte ale orasului. Perioadele majore coincid cu tranzitul lunar.</p>
                        </div>
                    </div>
                </div>

                {/* Other Cities */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Solunar in Alte Orase</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {otherCities.map((c) => (
                            <Link key={c.slug} href={`/${c.slug}`} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                                <p className="text-white font-bold text-sm">{c.name}</p>
                                <p className="text-night-400 text-xs">{c.county}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="card-panel p-6 md:p-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Exploreaza</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link href="/" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Calendar Complet</p>
                            <p className="text-night-400 text-xs mt-1">Prognoza 14 zile</p>
                        </Link>
                        <Link href="/azi" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Solunar Azi</p>
                            <p className="text-night-400 text-xs mt-1">Date zilnice</p>
                        </Link>
                        <Link href="/lunar" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Faze Lunare</p>
                            <p className="text-night-400 text-xs mt-1">Calendar lunar 2026</p>
                        </Link>
                        <Link href="/blog" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Ghiduri Pescuit</p>
                            <p className="text-night-400 text-xs mt-1">Articole si sfaturi</p>
                        </Link>
                    </div>
                </div>

                <LazyAdUnit slotId="1044977874" format="auto" layout="in-article" className="min-h-[120px] mt-8" label="Reclama" />
            </div>
        </div>
    );
}
