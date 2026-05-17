import Link from 'next/link';
import { getAllLocations, getAllCounties, getLocationsByCounty, countyToSlug } from '@/data/fishingLocations';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';

const year = new Date().getFullYear();

export const metadata: Metadata = {
    title: `Locuri de Pescuit România ${year} - Lacuri, Bălți și Râuri cu GPS`,
    description: `Ghid cu peste 60 de locuri de pescuit din România ${year}: lacuri, bălți și râuri cu coordonate GPS, specii de pești și calendar solunar pe locație.`,
    keywords: [
        'locuri de pescuit', 'locuri pescuit romania', 'balti de pescuit',
        'lacuri pescuit', 'pescuit romania', 'unde sa pescuiesti',
        'locuri pescuit gratis', 'balti pescuit langa bucuresti',
        'lac de pescuit', 'balta de pescuit in apropiere',
        'locuri de pescuit fara taxa', 'iazuri de pescuit',
        'lacuri de pescuit', 'loc de pescuit',
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
    lac: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    balta: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    acumulare: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    iaz: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    rau: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    canal: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
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
                        <div className="text-2xl md:text-3xl font-display font-bold text-amber-400">{counties.length}</div>
                        <div className="text-night-400 text-xs">Judete</div>
                    </div>
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-amber-400">{allLocations.filter(l => !l.paid).length}</div>
                        <div className="text-night-400 text-xs">Gratuite</div>
                    </div>
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-amber-400">{allLocations.filter(l => l.paid).length}</div>
                        <div className="text-night-400 text-xs">Cu Taxa</div>
                    </div>
                </div>
{/* Quick navigation by county — targets "balti pescuit [judet]" queries */}
                <div className="card-panel p-4 md:p-6 mb-8">
                    <h2 className="text-base md:text-lg font-display font-bold text-white mb-3">
                        Salt rapid pe județe
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {counties.map((county) => (
                            <Link
                                key={county}
                                href={`/locuri-pescuit/judet/${countyToSlug(county)}`}
                                className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-xs hover:bg-amber-500/20 transition-colors"
                            >
                                {county} ({getLocationsByCounty(county).length})
                            </Link>
                        ))}
                    </div>
                </div>

                {counties.map((county, idx) => {
                    const locations = getLocationsByCounty(county);
                    return (
                        <div key={county} className="mb-8">
                            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2 flex-wrap">
                                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <Link
                                    href={`/locuri-pescuit/judet/${countyToSlug(county)}`}
                                    className="hover:text-amber-400 transition-colors"
                                >
                                    Județul {county}
                                </Link>
                                <span className="text-night-500 text-sm font-normal">({locations.length} locuri)</span>
                                <Link
                                    href={`/locuri-pescuit/judet/${countyToSlug(county)}`}
                                    className="text-amber-400 hover:underline text-xs font-normal ml-auto"
                                >
                                    Vezi toate &rarr;
                                </Link>
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
                            
                        </div>
                    );
                })}
<div className="card-panel p-6 md:p-8 mt-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Despre Locurile de Pescuit din Romania</h2>
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

                {/* Tipuri de ape */}
                <div className="card-panel p-6 md:p-8 mt-6">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Ghid pe Tipuri de Ape</h2>
                    <div className="text-night-300 text-sm leading-relaxed space-y-4">
                        <div>
                            <h3 className="text-base font-bold text-amber-400 mb-1">Lacuri si Acumulari</h3>
                            <p>
                                Lacurile de acumulare (Izvorul Muntelui, Vidraru, Siriu) sunt excelente pentru <Link href="/pescuit-salau" className="text-amber-400 hover:underline">salau</Link>,
                                {' '}<Link href="/pescuit-stiuca" className="text-amber-400 hover:underline">stiuca</Link> si <Link href="/pescuit-crap" className="text-amber-400 hover:underline">crap</Link>.
                                Adancimea variata si structura fundului ofera habitate diverse. Perioadele solunar majore sunt deosebit de eficiente
                                in aceste ape, deoarece pestii migreaza vertical in functie de tranzitul lunar.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-amber-400 mb-1">Balti si Iazuri</h3>
                            <p>
                                Baltile amenajate si iazurile sunt ideale pentru <Link href="/pescuit-crap" className="text-amber-400 hover:underline">crap</Link>,
                                {' '}<Link href="/pescuit-caras" className="text-amber-400 hover:underline">caras</Link>,
                                {' '}<Link href="/pescuit-lin" className="text-amber-400 hover:underline">lin</Link> si
                                {' '}<Link href="/pescuit-fitofag" className="text-amber-400 hover:underline">fitofag</Link>.
                                Apa relativ mica face ca perioadele minore solunar sa fie la fel de productive ca cele majore.
                                Majoritatea baltilor din Romania ofera conditii bune pentru pescuitul la feeder si method feeder.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-amber-400 mb-1">Rauri si Dunarea</h3>
                            <p>
                                Dunarea si raurile mari (Olt, Mures, Siret, Prut) adapostesc <Link href="/pescuit-somn" className="text-amber-400 hover:underline">somn</Link>,
                                {' '}<Link href="/pescuit-salau" className="text-amber-400 hover:underline">salau</Link> si
                                {' '}<Link href="/pescuit-platica" className="text-amber-400 hover:underline">platica</Link> de dimensiuni impresionante.
                                Raurile montane sunt domeniul <Link href="/pescuit-pastrav" className="text-amber-400 hover:underline">pastravului</Link> si al
                                {' '}<Link href="/pescuit-clean" className="text-amber-400 hover:underline">cleanului</Link>.
                                Curentul influenteaza modul in care pestii raspund la perioadele solunar — cauta zonele cu curent mai slab in perioadele majore.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Locuri Pescuit */}
                <div className="card-panel p-6 md:p-8 mt-6">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Intrebari Frecvente</h2>
                    <div className="space-y-4">
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">Unde pot pescui gratuit in Romania?</h3>
                            <p className="text-night-300 text-sm">Majoritatea raurilor si lacurilor naturale din Romania permit pescuitul gratuit cu permis AJVPS. Dunarea, raurile montane si multe lacuri de acumulare sunt accesibile cu permisul anual. Baltile private necesita taxa separata.</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">Cum aleg cel mai bun loc de pescuit?</h3>
                            <p className="text-night-300 text-sm">Alege locul in functie de specia tinta: lacuri si balti pentru crap si caras, rauri montane pentru pastrav, acumulari pentru salau, Dunarea pentru somn. Verifica <Link href="/" className="text-amber-400 hover:underline">calendarul solunar</Link> pentru orele optime la fiecare locatie.</p>
                        </div>
                        <div className="pb-2">
                            <h3 className="text-base font-bold text-amber-400 mb-2">De ce difera datele solunar de la un loc la altul?</h3>
                            <p className="text-night-300 text-sm">Calendarul solunar este calculat pe baza coordonatelor GPS ale fiecarei locatii. Tranzitul lunar (momentul cand luna se afla direct deasupra) difera in functie de longitudine, iar rasaritul/apusul lunii variaza cu latitudinea. De aceea oferim date specifice pentru fiecare loc de pescuit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
