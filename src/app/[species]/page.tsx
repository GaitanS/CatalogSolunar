import { notFound } from 'next/navigation';
import { getSolunarData, getMoonPhaseName, formatTime, getMoonage } from '@/lib/solunar';
import { getWeatherData } from '@/lib/weather';
import Moon3DWrapper from '@/components/Moon3DWrapper';
import ActivityGraph from '@/components/ActivityGraph';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSpeciesBySlug, getAllSpecies } from '@/data/species';
import { getAllArticles } from '@/data/blogArticles';
import type { Metadata } from 'next';

export const dynamicParams = false;

export function generateStaticParams() {
    return getAllSpecies().map((species) => ({
        species: species.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ species: string }> }): Promise<Metadata> {
    const { species: slug } = await params;
    const species = getSpeciesBySlug(slug);
    if (!species) return {};

    const today = new Date();
    const year = today.getFullYear();

    return {
        title: `${species.name} - Ghid Complet ${year} | Cand Trage ${species.name}`,
        description: `Ghid pescuit ${species.name.toLowerCase()} ${year}. Afla cand trage ${species.name.toLowerCase()}: perioade solunar optime, tehnici, momeli, sezon si sfaturi practice. Calendar lunar pentru ${species.name.toLowerCase()}.`,
        keywords: [
            `pescuit ${species.name.toLowerCase()}`,
            `cand trage ${species.name.toLowerCase()}`,
            `${species.name.toLowerCase()} solunar`,
            `ghid pescuit ${species.name.toLowerCase()}`,
            `tehnici pescuit ${species.name.toLowerCase()}`,
            `momeli ${species.name.toLowerCase()}`,
        ],
        alternates: {
            canonical: `https://calendarsolunar.ro/${species.slug}`,
        },
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

// JSON-LD schemas use static data from our species database - safe for dangerouslySetInnerHTML
function SpeciesJsonLd({ species }: { species: { name: string; slug: string; scientificName: string; description: string } }) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: `Ghid Pescuit ${species.name}`,
        description: species.description,
        url: `https://calendarsolunar.ro/${species.slug}`,
        author: { '@type': 'Organization', name: 'Calendar Solunar' },
        publisher: { '@type': 'Organization', name: 'Calendar Solunar', url: 'https://calendarsolunar.ro' },
        about: {
            '@type': 'Thing',
            name: species.name,
            alternateName: species.scientificName,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

function FAQSchema({ species }: { species: { name: string; season: string; bestMoonPhase: string; bestTime: string; bait: string[] } }) {
    const faqs = [
        {
            question: `Cand trage ${species.name.toLowerCase()}ul cel mai bine?`,
            answer: `${species.name} este cel mai activ in perioadele solunar majore, in special ${species.bestTime}. Sezonul optim este ${species.season}.`,
        },
        {
            question: `Care este cea mai buna faza lunara pentru ${species.name.toLowerCase()}?`,
            answer: `Pentru ${species.name.toLowerCase()}, cele mai bune faze lunare sunt: ${species.bestMoonPhase}. Combinate cu perioadele majore solunar, aceste faze ofera cele mai mari sanse de succes.`,
        },
        {
            question: `Ce momeli folosesc pentru ${species.name.toLowerCase()}?`,
            answer: `Cele mai eficiente momeli pentru ${species.name.toLowerCase()} sunt: ${species.bait.slice(0, 4).join(', ')}. Alegerea depinde de sezon si conditiile apei.`,
        },
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default async function SpeciesPage({ params }: { params: Promise<{ species: string }> }) {
    const { species: slug } = await params;
    const species = getSpeciesBySlug(slug);
    if (!species) notFound();

    const today = new Date();
    // Use Bucharest coordinates as default
    const data = getSolunarData(today, 44.4268, 26.1025);
    const weather = await getWeatherData(44.4268, 26.1025);

    const dateStr = today.toLocaleDateString('ro-RO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    const ratingLabels = ['', 'Slaba', 'Moderata', 'Buna', 'Foarte Buna', 'Excelenta'];
    const ratingColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400', 'text-green-400'];

    const otherSpecies = getAllSpecies().filter(s => s.slug !== species.slug);

    // Find related articles
    const allArticles = getAllArticles();
    const relatedArticles = allArticles.filter(a =>
        a.title.toLowerCase().includes(species.name.toLowerCase()) ||
        a.keywords.some(k => k.toLowerCase().includes(species.name.toLowerCase()))
    ).slice(0, 3);

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <SpeciesJsonLd species={species} />
            <FAQSchema species={species} />
            <Breadcrumbs items={[
                { label: 'Acasa', href: '/' },
                { label: `Pescuit ${species.name}` },
            ]} />
            <div className="container-custom px-4 relative z-10">
                {/* Hero */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="text-5xl mb-4">{species.icon}</div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                        Pescuit <span className="text-amber-400">{species.name}</span>
                    </h1>
                    <p className="text-night-400 text-sm md:text-base mb-2 italic">{species.scientificName}</p>
                    <p className="text-night-300 text-sm md:text-lg max-w-2xl mx-auto">
                        {species.description}
                    </p>
                </div>

                {/* Today's Solunar for this species */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">
                        Solunar {species.name} Azi - {capitalizedDate}
                    </h2>
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

                <AdUnit slotId="1234567890" format="horizontal" className="min-h-[90px] mb-8" label="Reclama" />

                {/* Species Info Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-emerald-400 mb-4">Sezon si Ora Optima</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-night-400">Sezon:</span>
                                <span className="text-white font-medium">{species.season}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-night-400">Faza lunara optima:</span>
                                <span className="text-white font-medium">{species.bestMoonPhase}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-night-400">Ore optime:</span>
                                <span className="text-white font-medium">{species.bestTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-blue-400 mb-4">Habitat</h2>
                        <p className="text-night-300 text-sm leading-relaxed">{species.habitat}</p>
                    </div>
                </div>

                {/* Techniques & Bait */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-amber-400 mb-4">Tehnici de Pescuit</h2>
                        <div className="flex flex-wrap gap-2">
                            {species.techniques.map((tech, i) => (
                                <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-sm">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-cyan-400 mb-4">Momeli Recomandate</h2>
                        <div className="flex flex-wrap gap-2">
                            {species.bait.map((b, i) => (
                                <span key={i} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-300 text-sm">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Graph */}
                <div className="card-panel p-6 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Grafic Activitate {species.name} Azi</h2>
                    <ActivityGraph majorPeriods={data.majorPeriods} minorPeriods={data.minorPeriods} />
                    <div className="flex justify-center gap-6 mt-3 text-xs font-mono text-night-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Majora</span>
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Minora</span>
                    </div>
                </div>

                <LazyAdUnit slotId="1234567890" format="rectangle" style={{ minHeight: '280px' }} className="mb-8" label="Reclama" />

                {/* Solunar Tip */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-4">Sfat Solunar pentru {species.name}</h2>
                    <p className="text-night-300 leading-relaxed">{species.solunarTip}</p>
                </div>

                {/* FAQ Section */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-6">Intrebari Frecvente</h2>
                    <div className="space-y-4">
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Cand trage {species.name.toLowerCase()}ul cel mai bine?</h3>
                            <p className="text-night-300 text-sm">{species.name} este cel mai activ in perioadele solunar majore, in special {species.bestTime}. Sezonul optim este {species.season}.</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Care este cea mai buna faza lunara pentru {species.name.toLowerCase()}?</h3>
                            <p className="text-night-300 text-sm">Pentru {species.name.toLowerCase()}, cele mai bune faze lunare sunt: {species.bestMoonPhase}.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-amber-400 mb-2">Ce momeli folosesc pentru {species.name.toLowerCase()}?</h3>
                            <p className="text-night-300 text-sm">Cele mai eficiente momeli: {species.bait.slice(0, 4).join(', ')}.</p>
                        </div>
                    </div>
                </div>

                {/* Related Articles */}
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

                {/* Other Species */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Alte Specii</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {otherSpecies.map((s) => (
                            <Link key={s.slug} href={`/${s.slug}`} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3">
                                <span className="text-2xl">{s.icon}</span>
                                <div>
                                    <p className="text-white font-bold text-sm">{s.name}</p>
                                    <p className="text-night-400 text-xs">{s.season}</p>
                                </div>
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
                            <p className="text-night-400 text-xs mt-1">Calendar lunar</p>
                        </Link>
                        <Link href="/blog" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Ghiduri Pescuit</p>
                            <p className="text-night-400 text-xs mt-1">Articole si sfaturi</p>
                        </Link>
                    </div>
                </div>

                <LazyAdUnit slotId="1234567890" format="auto" layout="in-article" className="min-h-[120px] mt-8" label="Reclama" />
            </div>
        </div>
    );
}
