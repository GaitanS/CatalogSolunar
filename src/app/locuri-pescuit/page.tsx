import Link from 'next/link';
import { getAllLocations, getAllCounties, getLocationsByCounty, countyToSlug } from '@/data/fishingLocations';
import Breadcrumbs from '@/components/Breadcrumbs';
import LocationExplorer from '@/components/LocationExplorer';
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

export default function LocuriPescuitPage() {
    const counties = getAllCounties();
    const allLocations = getAllLocations();

    const explorerCounties = counties.map((county) => ({
        name: county,
        slug: countyToSlug(county),
        locations: getLocationsByCounty(county).map((loc) => ({
            slug: loc.slug,
            name: loc.name,
            locality: loc.locality,
            type: loc.type,
            fish: loc.fish,
            paid: Boolean(loc.paid),
        })),
    }));
    const stats = [
        { value: allLocations.length, label: 'Locuri' },
        { value: counties.length, label: 'Județe' },
        { value: allLocations.filter(l => !l.paid).length, label: 'Gratuite' },
        { value: allLocations.filter(l => l.paid).length, label: 'Cu taxă' },
    ];

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <Breadcrumbs items={[{ label: 'Acasa', href: '/' }, { label: 'Locuri de Pescuit' }]} />
            <div className="container-custom relative z-10">
                <div className="card-panel relative mb-6 overflow-hidden p-6 sm:p-8 lg:p-10">
                    <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-sky-300/10 blur-3xl" />
                    <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                        <div>
                            <p className="eyebrow">Ghid de ape · GPS · solunar</p>
                            <h1 className="mt-3 font-editorial text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
                                Locuri de Pescuit <span className="gold-text">Romania</span>
                            </h1>
                            <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-slate-300 md:text-base">
                                Peste {allLocations.length} de locuri de pescuit verificate din toata Romania.
                                Fiecare loc include coordonate GPS, specii de pesti si calendar solunar calculat pentru locatia exacta.
                            </p>
                        </div>
                        <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:gap-3">
                            {stats.map((stat) => (
                                <div key={stat.label} className="glass-tile px-2 py-3 text-center lg:px-4 lg:py-4">
                                    <div className="text-xl font-bold tabular-nums text-moon md:text-3xl">{stat.value}</div>
                                    <div className="mt-0.5 text-[10.5px] text-slate-400 md:text-xs">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick navigation by county — targets "balti pescuit [judet]" queries */}
                <details className="card-panel group mb-6 p-4 md:p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                        <h2 className="text-base font-bold text-white md:text-lg">Salt rapid pe județe</h2>
                        <span className="glass-chip rounded-full px-3 py-1 text-xs font-semibold text-slate-300">
                            {counties.length} județe
                            <span className="ml-1 inline-block transition-transform group-open:rotate-180">▾</span>
                        </span>
                    </summary>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {counties.map((county) => (
                            <Link
                                key={county}
                                href={`/locuri-pescuit/judet/${countyToSlug(county)}`}
                                className="glass-chip rounded-full px-3 py-1.5 text-xs text-slate-300 transition-colors hover:text-amber-100"
                            >
                                {county} <span className="opacity-60">({getLocationsByCounty(county).length})</span>
                            </Link>
                        ))}
                    </div>
                </details>

                <LocationExplorer counties={explorerCounties} />

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
