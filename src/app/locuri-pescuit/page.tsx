import Link from 'next/link';
import { getAllLocations, getAllCounties, getLocationsByCounty } from '@/data/fishingLocations';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import type { Metadata } from 'next';

const year = new Date().getFullYear();

export const metadata: Metadata = {
    title: `Locuri de Pescuit Romania ${year} - Lacuri, Balti si Rauri`,
    description: `Ghid complet locuri de pescuit in Romania ${year}. Peste 60 de lacuri, balti, rauri si acumulari cu coordonate GPS, specii de pesti si calendar solunar. Gratuit!`,
    keywords: [
        'locuri de pescuit', 'locuri pescuit romania', 'balti de pescuit',
        'lacuri pescuit', 'pescuit romania', 'unde sa pescuiesti',
        'locuri pescuit gratis', 'balti pescuit langa bucuresti',
    ],
    alternates: { canonical: 'https://calendarsolunar.ro/locuri-pescuit' },
    openGraph: {
        title: `Locuri de Pescuit Romania ${year}`,
        description: `Peste 60 de locuri de pescuit verificate din Romania. Lacuri, balti, rauri cu specii, GPS si solunar.`,
        url: 'https://calendarsolunar.ro/locuri-pescuit',
        siteName: 'Calendar Solunar',
        locale: 'ro_RO',
        type: 'website',
    },
};

const typeLabels: Record<string, string> = {
    lac: 'Lac',
    balta: 'Balta',
    acumulare: 'Acumulare',
    iaz: 'Iaz',
    rau: 'Rau',
    canal: 'Canal',
    delta: 'Delta',
};

const typeColors: Record<string, string> = {
    lac: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    balta: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    acumulare: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    iaz: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    rau: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    canal: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    delta: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export default function LocuriPescuitPage() {
    const counties = getAllCounties();
    const allLocations = getAllLocations();

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <Breadcrumbs items={[{ label: 'Acasa', href: '/' }, { label: 'Locuri de Pescuit' }]} />
            <div className="container-custom px-4 relative z-10">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                        Locuri de Pescuit <span className="text-amber-400">Romania</span>
                    </h1>
                    <p className="text-night-300 text-sm md:text-lg max-w-2xl mx-auto">
                        Peste {allLocations.length} de locuri de pescuit verificate din toata Romania.
                        Fiecare loc include coordonate GPS, specii de pesti si calendar solunar calculat pentru locatia exacta.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-amber-400">{allLocations.length}</div>
                        <div className="text-night-400 text-xs">Locuri</div>
                    </div>
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-blue-400">{counties.length}</div>
                        <div className="text-night-400 text-xs">Judete</div>
                    </div>
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-emerald-400">{allLocations.filter(l => !l.paid).length}</div>
                        <div className="text-night-400 text-xs">Gratuite</div>
                    </div>
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-cyan-400">{allLocations.filter(l => l.paid).length}</div>
                        <div className="text-night-400 text-xs">Cu Taxa</div>
                    </div>
                </div>

                <AdUnit slotId="2812628769" format="horizontal" className="min-h-[90px] mb-8" label="Reclama" />

                {counties.map((county, idx) => {
                    const locations = getLocationsByCounty(county);
                    return (
                        <div key={county} className="mb-8">
                            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                Judetul {county}
                                <span className="text-night-500 text-sm font-normal">({locations.length} locuri)</span>
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {locations.map((loc) => (
                                    <Link
                                        key={loc.slug}
                                        href={`/locuri-pescuit/${loc.slug}`}
                                        className="card-panel p-4 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-white font-bold group-hover:text-amber-400 transition-colors">{loc.name}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${typeColors[loc.type] || 'bg-white/10 text-night-300'}`}>
                                                {typeLabels[loc.type] || loc.type}
                                            </span>
                                        </div>
                                        <p className="text-night-400 text-xs mb-2">{loc.locality}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {loc.fish.slice(0, 4).map((f, i) => (
                                                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-night-300">{f}</span>
                                            ))}
                                            {loc.fish.length > 4 && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-night-500">+{loc.fish.length - 4}</span>
                                            )}
                                        </div>
                                        {loc.paid && <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">Cu taxa</span>}
                                    </Link>
                                ))}
                            </div>
                            {idx === 2 && <LazyAdUnit slotId="6301173988" format="rectangle" style={{ minHeight: '280px' }} className="mt-6" label="Reclama" />}
                        </div>
                    );
                })}

                <LazyAdUnit slotId="1044977874" format="auto" layout="in-article" className="min-h-[120px] mt-8" label="Reclama" />

                <div className="card-panel p-6 md:p-8 mt-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Despre Locurile de Pescuit</h2>
                    <div className="text-night-300 text-sm leading-relaxed space-y-3">
                        <p>
                            Romania dispune de o retea extraordinara de ape interioare, de la raurile montane populate cu pastrav si lipan,
                            pana la lacurile de campie bogate in crap, caras si somn. Delta Dunarii ramane paradisul pescarilor,
                            cu cele mai diverse populatii de pesti din Europa.
                        </p>
                        <p>
                            Fiecare loc de pescuit din aceasta lista include <strong className="text-white">calendar solunar calculat pentru coordonatele exacte</strong> ale locatiei,
                            oferindu-ti cele mai precise ore de activitate a pestilor. Foloseste <Link href="/" className="text-amber-400 hover:underline">calendarul solunar</Link> pentru
                            a planifica urmatoarea sesiune de pescuit.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
