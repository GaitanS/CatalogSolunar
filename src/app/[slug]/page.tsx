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
import { getSpeciesBySlug, getAllSpecies } from '@/data/species';
import { getAllArticles } from '@/data/blogArticles';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
    const cityParams = getAllCities().map((city) => ({ slug: city.slug }));
    const speciesParams = getAllSpecies().map((species) => ({ slug: species.slug }));
    return [...cityParams, ...speciesParams];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    // Check if it's a city
    const city = getCityBySlug(slug);
    if (city) {
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
            alternates: { canonical: `https://calendarsolunar.ro/${city.slug}` },
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

    // Check if it's a species
    const species = getSpeciesBySlug(slug);
    if (species) {
        const year = new Date().getFullYear();
        return {
            title: `${species.name} - Ghid Complet ${year} | Cand Trage ${species.name}`,
            description: `Ghid pescuit ${species.name.toLowerCase()} ${year}. Afla cand trage ${species.name.toLowerCase()}: perioade solunar optime, tehnici, momeli, sezon si sfaturi practice.`,
            keywords: [
                `pescuit ${species.name.toLowerCase()}`,
                `cand trage ${species.name.toLowerCase()}`,
                `${species.name.toLowerCase()} solunar`,
                `ghid pescuit ${species.name.toLowerCase()}`,
            ],
            alternates: { canonical: `https://calendarsolunar.ro/${species.slug}` },
            openGraph: {
                title: `Pescuit ${species.name} - Cand Trage ${species.name}`,
                description: `Ghid complet pescuit ${species.name.toLowerCase()}. Perioade solunar optime, tehnici si momeli recomandate.`,
                url: `https://calendarsolunar.ro/${species.slug}`,
                siteName: 'Calendar Solunar',
                locale: 'ro_RO',
                type: 'website',
            },
        };
    }

    return {};
}

// JSON-LD components use static data from our internal database, safe for script injection
// City JSON-LD Schema
function CityJsonLd({ city }: { city: { name: string; slug: string; county: string; lat: number; lng: number } }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `Calendar Solunar ${city.name}`,
        description: `Calendar solunar pentru pescuit in ${city.name}, ${city.county}`,
        url: `https://calendarsolunar.ro/${city.slug}`,
        isPartOf: { '@type': 'WebSite', name: 'Calendar Solunar', url: 'https://calendarsolunar.ro' },
        about: {
            '@type': 'Place',
            name: city.name,
            address: { '@type': 'PostalAddress', addressLocality: city.name, addressRegion: city.county, addressCountry: 'RO' },
            geo: { '@type': 'GeoCoordinates', latitude: city.lat, longitude: city.lng },
        },
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

// City FAQ Schema
function CityFAQSchema({ city, nearbyWaters }: { city: { name: string; county: string }; nearbyWaters: string[] }) {
    const faqs = [
        { question: `Cand trage pestele in ${city.name}?`, answer: `Pestele este cel mai activ in ${city.name} in perioadele solunar majore, care dureaza aproximativ 2 ore. Verifica calendarul solunar zilnic pentru orele exacte calculate pentru zona ${city.county}.` },
        { question: `Care sunt cele mai bune locuri de pescuit in ${city.name}?`, answer: `Cele mai populare locuri de pescuit in zona ${city.name}, judetul ${city.county} sunt: ${nearbyWaters.slice(0, 4).join(', ')}.` },
        { question: `Cum functioneaza calendarul solunar pentru ${city.name}?`, answer: `Calendarul solunar pentru ${city.name} calculeaza perioadele de activitate a pestilor pe baza pozitiei lunii fata de coordonatele exacte ale orasului.` },
    ];
    const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

// Species JSON-LD Schema
function SpeciesJsonLd({ species }: { species: { name: string; slug: string; scientificName: string; description: string } }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: `Ghid Pescuit ${species.name}`,
        description: species.description,
        url: `https://calendarsolunar.ro/${species.slug}`,
        author: { '@type': 'Organization', name: 'Calendar Solunar' },
        publisher: { '@type': 'Organization', name: 'Calendar Solunar', url: 'https://calendarsolunar.ro' },
        about: { '@type': 'Thing', name: species.name, alternateName: species.scientificName },
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

// Species FAQ Schema
function SpeciesFAQSchema({ species }: { species: { name: string; season: string; bestMoonPhase: string; bestTime: string; bait: string[] } }) {
    const faqs = [
        { question: `Cand trage ${species.name.toLowerCase()}ul cel mai bine?`, answer: `${species.name} este cel mai activ in perioadele solunar majore, in special ${species.bestTime}. Sezonul optim este ${species.season}.` },
        { question: `Care este cea mai buna faza lunara pentru ${species.name.toLowerCase()}?`, answer: `Pentru ${species.name.toLowerCase()}, cele mai bune faze lunare sunt: ${species.bestMoonPhase}.` },
        { question: `Ce momeli folosesc pentru ${species.name.toLowerCase()}?`, answer: `Cele mai eficiente momeli pentru ${species.name.toLowerCase()} sunt: ${species.bait.slice(0, 4).join(', ')}.` },
    ];
    const jsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

// City Page Component
function CityPageContent({ city }: { city: ReturnType<typeof getCityBySlug> & {} }) {
    const today = new Date();
    const data = getSolunarData(today, city.lat, city.lng);
    const weather = { temperature: 15, pressure: 1013, windSpeed: 5, windDirection: 180, waterTemp: 12 }; // Simplified for SSG
    const advice = getFishingAdvice(weather, data);
    const activeFish = getActiveFish(today, data.moonPhase);

    const dateStr = today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    const ratingLabels = ['', 'Slaba', 'Moderata', 'Buna', 'Foarte Buna', 'Excelenta'];
    const ratingColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400', 'text-green-400'];
    const otherCities = getAllCities().filter(c => c.slug !== city.slug).slice(0, 6);

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <CityJsonLd city={city} />
            <CityFAQSchema city={city} nearbyWaters={city.nearbyWaters} />
            <Breadcrumbs items={[{ label: 'Acasă', href: '/' }, { label: `Solunar ${city.name}` }]} />
            <div className="container-custom px-4 relative z-10">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                        Solunar <span className="text-amber-400">{city.name}</span>
                    </h1>
                    <p className="text-night-400 text-sm md:text-base mb-2">{capitalizedDate} &bull; {city.county}</p>
                    <p className="text-night-300 text-sm md:text-lg max-w-2xl mx-auto">{city.description}</p>
                </div>

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
                        </div>
                    </div>
                </div>

                <AdUnit slotId="2812628769" format="horizontal" className="min-h-[90px] mb-8" label="Reclama" />

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-amber-400 mb-4">Perioade Majore {city.name}</h2>
                        <p className="text-night-400 text-sm mb-4">Durata ~2 ore. Activitate maxima a pestilor.</p>
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
                        <h2 className="text-xl font-display font-bold text-cyan-400 mb-4">Perioade Minore {city.name}</h2>
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

                <div className="card-panel p-6 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Grafic Activitate {city.name}</h2>
                    <ActivityGraph majorPeriods={data.majorPeriods} minorPeriods={data.minorPeriods} />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-emerald-400 mb-4">Specii Active in {city.name}</h2>
                        {activeFish.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {activeFish.map((fish, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm">{fish}</span>
                                ))}
                            </div>
                        ) : <p className="text-night-400">Activitate generala redusa astazi.</p>}
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">Sfatul Zilei</h2>
                        <p className="text-night-300 text-sm leading-relaxed">{advice}</p>
                    </div>
                </div>

                <LazyAdUnit slotId="6301173988" format="rectangle" style={{ minHeight: '280px' }} className="mb-8" label="Reclama" />

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-4">Locuri de Pescuit langa {city.name}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {city.nearbyWaters.map((water, i) => (
                            <div key={i} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <span className="text-white text-sm font-medium">{water}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Intrebari Frecvente - {city.name}</h2>
                    <div className="space-y-4">
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Cand trage pestele in {city.name}?</h3>
                            <p className="text-night-300 text-sm">Pestele este cel mai activ in {city.name} in perioadele solunar majore, care dureaza aproximativ 2 ore.</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Care sunt cele mai bune locuri de pescuit?</h3>
                            <p className="text-night-300 text-sm">Cele mai populare locuri: {city.nearbyWaters.slice(0, 4).join(', ')}.</p>
                        </div>
                    </div>
                </div>

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

                <LazyAdUnit slotId="1044977874" format="auto" layout="in-article" className="min-h-[120px] mt-8" label="Reclama" />
            </div>
        </div>
    );
}

// Species Page Component
function SpeciesPageContent({ species }: { species: ReturnType<typeof getSpeciesBySlug> & {} }) {
    const today = new Date();
    const data = getSolunarData(today, 44.4268, 26.1025);

    const dateStr = today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    const ratingLabels = ['', 'Slaba', 'Moderata', 'Buna', 'Foarte Buna', 'Excelenta'];
    const ratingColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400', 'text-green-400'];
    const otherSpecies = getAllSpecies().filter(s => s.slug !== species.slug);

    const allArticles = getAllArticles();
    const relatedArticles = allArticles.filter(a =>
        a.title.toLowerCase().includes(species.name.toLowerCase()) ||
        a.keywords.some(k => k.toLowerCase().includes(species.name.toLowerCase()))
    ).slice(0, 3);

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <SpeciesJsonLd species={species} />
            <SpeciesFAQSchema species={species} />
            <Breadcrumbs items={[{ label: 'Acasa', href: '/' }, { label: `Pescuit ${species.name}` }]} />
            <div className="container-custom px-4 relative z-10">
                <div className="text-center mb-8 md:mb-12">
                    <div className="text-5xl mb-4">{species.icon}</div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                        Pescuit <span className="text-amber-400">{species.name}</span>
                    </h1>
                    <p className="text-night-400 text-sm md:text-base mb-2 italic">{species.scientificName}</p>
                    <p className="text-night-300 text-sm md:text-lg max-w-2xl mx-auto">{species.description}</p>
                </div>

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Solunar {species.name} Azi - {capitalizedDate}</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                        <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px]">
                            <Moon3DWrapper phase={getMoonage(today) / 29.53} illumination={data.moonIllumination} size={120} />
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-4xl md:text-5xl font-display font-bold text-white mb-1">
                                {data.overallRating}<span className="text-2xl text-night-500">/5</span>
                            </div>
                            <div className={`text-lg font-bold ${ratingColors[data.overallRating]}`}>
                                Activitate {ratingLabels[data.overallRating]}
                            </div>
                            <p className="text-night-400 text-sm mt-1">{getMoonPhaseName(data.moonPhase)} - {data.moonIllumination}%</p>
                        </div>
                        <div className="text-center md:text-left text-sm">
                            <p className="text-amber-400 font-bold">Perioade Majore:</p>
                            {data.majorPeriods.map((p, i) => (
                                <p key={i} className="text-white font-mono">{formatTime(p.start)} - {formatTime(p.end)}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <AdUnit slotId="2812628769" format="horizontal" className="min-h-[90px] mb-8" label="Reclama" />

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-emerald-400 mb-4">Sezon si Ora Optima</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-night-400">Sezon:</span><span className="text-white font-medium">{species.season}</span></div>
                            <div className="flex justify-between"><span className="text-night-400">Faza lunara optima:</span><span className="text-white font-medium">{species.bestMoonPhase}</span></div>
                            <div className="flex justify-between"><span className="text-night-400">Ore optime:</span><span className="text-white font-medium">{species.bestTime}</span></div>
                        </div>
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-blue-400 mb-4">Habitat</h2>
                        <p className="text-night-300 text-sm leading-relaxed">{species.habitat}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-amber-400 mb-4">Tehnici de Pescuit</h2>
                        <div className="flex flex-wrap gap-2">
                            {species.techniques.map((tech, i) => (
                                <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-sm">{tech}</span>
                            ))}
                        </div>
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-cyan-400 mb-4">Momeli Recomandate</h2>
                        <div className="flex flex-wrap gap-2">
                            {species.bait.map((b, i) => (
                                <span key={i} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-300 text-sm">{b}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card-panel p-6 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Grafic Activitate {species.name} Azi</h2>
                    <ActivityGraph majorPeriods={data.majorPeriods} minorPeriods={data.minorPeriods} />
                </div>

                <LazyAdUnit slotId="6301173988" format="rectangle" style={{ minHeight: '280px' }} className="mb-8" label="Reclama" />

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-4">Sfat Solunar pentru {species.name}</h2>
                    <p className="text-night-300 leading-relaxed">{species.solunarTip}</p>
                </div>

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Intrebari Frecvente</h2>
                    <div className="space-y-4">
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Cand trage {species.name.toLowerCase()}ul cel mai bine?</h3>
                            <p className="text-night-300 text-sm">{species.name} este cel mai activ in perioadele solunar majore, in special {species.bestTime}. Sezonul optim este {species.season}.</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Ce momeli folosesc?</h3>
                            <p className="text-night-300 text-sm">Cele mai eficiente momeli: {species.bait.slice(0, 4).join(', ')}.</p>
                        </div>
                    </div>
                </div>

                {relatedArticles.length > 0 && (
                    <div className="card-panel p-6 md:p-8 mb-8">
                        <h2 className="text-xl font-display font-bold text-white mb-4">Articole despre {species.name}</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {relatedArticles.map((article) => (
                                <Link key={article.slug} href={`/blog/${article.slug}`} className="p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                                    <p className="text-white font-bold text-sm line-clamp-2">{article.title}</p>
                                    <p className="text-night-400 text-xs mt-2">{article.category}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Alte Specii</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {otherSpecies.map((s) => (
                            <Link key={s.slug} href={`/${s.slug}`} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3">
                                <span className="text-2xl">{s.icon}</span>
                                <div><p className="text-white font-bold text-sm">{s.name}</p><p className="text-night-400 text-xs">{s.season}</p></div>
                            </Link>
                        ))}
                    </div>
                </div>

                <LazyAdUnit slotId="1044977874" format="auto" layout="in-article" className="min-h-[120px] mt-8" label="Reclama" />
            </div>
        </div>
    );
}

// Main Page Component
export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Check if it's a city
    const city = getCityBySlug(slug);
    if (city) {
        return <CityPageContent city={city} />;
    }

    // Check if it's a species
    const species = getSpeciesBySlug(slug);
    if (species) {
        return <SpeciesPageContent species={species} />;
    }

    notFound();
}
