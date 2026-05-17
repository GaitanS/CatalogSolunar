import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
    getAllCountySlugs,
    getCountyBySlug,
    getLocationsByCounty,
} from '@/data/fishingLocations';
import Breadcrumbs from '@/components/Breadcrumbs';
import CountyJsonLd from './CountyJsonLd';

export const dynamicParams = false;

export function generateStaticParams() {
    return getAllCountySlugs().map((c) => ({ slug: c.slug }));
}

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

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const county = getCountyBySlug(slug);
    if (!county) return {};

    const locations = getLocationsByCounty(county);
    const year = new Date().getFullYear();
    const n = locations.length;

    return {
        title: `Locuri Pescuit ${county} ${year} - ${n} Bălți, Lacuri și Râuri`,
        description: `${n} locuri de pescuit în județul ${county}: bălți, lacuri și râuri cu coordonate GPS, specii de pești și calendar solunar pe fiecare locație.`,
        keywords: [
            `locuri pescuit ${county.toLowerCase()}`,
            `balti pescuit ${county.toLowerCase()}`,
            `balti de pescuit ${county.toLowerCase()}`,
            `lacuri pescuit ${county.toLowerCase()}`,
            `lacuri de pescuit ${county.toLowerCase()}`,
            `pescuit ${county.toLowerCase()}`,
            `solunar ${county.toLowerCase()}`,
            `balti pescuit judet ${county.toLowerCase()}`,
        ],
        alternates: {
            canonical: `https://calendarsolunar.ro/locuri-pescuit/judet/${slug}`,
        },
        openGraph: {
            title: `Locuri Pescuit ${county} - ${n} bălți, lacuri și râuri`,
            description: `${n} locuri de pescuit din județul ${county} cu GPS, specii și calendar solunar.`,
            url: `https://calendarsolunar.ro/locuri-pescuit/judet/${slug}`,
            siteName: 'Calendar Solunar',
            locale: 'ro_RO',
            type: 'website',
        },
    };
}

export default async function CountyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const county = getCountyBySlug(slug);
    if (!county) notFound();

    const locations = getLocationsByCounty(county);
    const paidCount = locations.filter((l) => l.paid).length;
    const freeCount = locations.length - paidCount;

    const paidLocations = locations.filter((l) => l.paid);
    const freeLocations = locations.filter((l) => !l.paid);

    const allSpecies = [...new Set(locations.flatMap((l) => l.fish))].slice(0, 12);

    const otherCounties = getAllCountySlugs().filter((c) => c.slug !== slug);

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <CountyJsonLd
                county={county}
                totalLocations={locations.length}
                paidCount={paidCount}
                species={allSpecies}
            />
            <Breadcrumbs
                items={[
                    { label: 'Acasa', href: '/' },
                    { label: 'Locuri de Pescuit', href: '/locuri-pescuit' },
                    { label: `Judet ${county}` },
                ]}
            />
            <div className="container-custom px-4 relative z-10">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                        Locuri Pescuit <span className="text-amber-400">{county}</span>
                    </h1>
                    <p className="text-night-300 text-sm md:text-lg max-w-2xl mx-auto">
                        {locations.length} locuri de pescuit verificate în județul {county}:
                        bălți amenajate, lacuri naturale, acumulări și râuri. Fiecare locație
                        are coordonate GPS, specii de pești și calendar solunar calculat
                        pentru locul exact.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-amber-400">
                            {locations.length}
                        </div>
                        <div className="text-night-400 text-xs">Locuri totale</div>
                    </div>
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-amber-400">
                            {freeCount}
                        </div>
                        <div className="text-night-400 text-xs">Gratuite</div>
                    </div>
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-yellow-400">
                            {paidCount}
                        </div>
                        <div className="text-night-400 text-xs">Cu taxă</div>
                    </div>
                    <div className="card-panel p-4 text-center">
                        <div className="text-2xl md:text-3xl font-display font-bold text-amber-400">
                            {allSpecies.length}
                        </div>
                        <div className="text-night-400 text-xs">Specii</div>
                    </div>
                </div>
{allSpecies.length > 0 && (
                    <div className="card-panel p-6 mb-8">
                        <h2 className="text-lg md:text-xl font-display font-bold text-white mb-3">
                            Specii întâlnite în {county}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {allSpecies.map((fish, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-sm"
                                >
                                    {fish}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {paidLocations.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-yellow-400 rounded-full" />
                            Bălți cu taxă din {county}
                            <span className="text-night-500 text-sm font-normal">
                                ({paidLocations.length})
                            </span>
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paidLocations.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    href={`/locuri-pescuit/${loc.slug}`}
                                    className="card-panel p-4 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-white font-bold group-hover:text-amber-400 transition-colors">
                                            {loc.name}
                                        </h3>
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                                typeColors[loc.type] ||
                                                'bg-white/10 text-night-300'
                                            }`}
                                        >
                                            {typeLabels[loc.type] || loc.type}
                                        </span>
                                    </div>
                                    <p className="text-night-400 text-xs mb-2">
                                        {loc.locality}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {loc.fish.slice(0, 4).map((f, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-night-300"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                        {loc.fish.length > 4 && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-night-500">
                                                +{loc.fish.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
{freeLocations.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-amber-400 rounded-full" />
                            Lacuri și râuri gratuite din {county}
                            <span className="text-night-500 text-sm font-normal">
                                ({freeLocations.length})
                            </span>
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {freeLocations.map((loc) => (
                                <Link
                                    key={loc.slug}
                                    href={`/locuri-pescuit/${loc.slug}`}
                                    className="card-panel p-4 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-white font-bold group-hover:text-amber-400 transition-colors">
                                            {loc.name}
                                        </h3>
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                                typeColors[loc.type] ||
                                                'bg-white/10 text-night-300'
                                            }`}
                                        >
                                            {typeLabels[loc.type] || loc.type}
                                        </span>
                                    </div>
                                    <p className="text-night-400 text-xs mb-2">
                                        {loc.locality}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {loc.fish.slice(0, 4).map((f, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-night-300"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                        {loc.fish.length > 4 && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-night-500">
                                                +{loc.fish.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">
                        Despre pescuit în {county}
                    </h2>
                    <div className="text-night-300 text-sm leading-relaxed space-y-3">
                        <p>
                            Județul <strong className="text-white">{county}</strong> oferă{' '}
                            {locations.length} locuri de pescuit catalogate, de la bălți
                            amenajate cu taxă până la lacuri de acumulare și râuri cu acces
                            gratuit. Fiecare pescar găsește condiții potrivite nivelului său,
                            de la sesiuni relaxante de weekend până la pescuit de trofee.
                        </p>
                        <p>
                            Calendarul solunar este personalizat pe coordonatele GPS exacte
                            ale fiecărei locații din {county}. Tranzitul lunar și fazele lunii
                            influențează momentele când peștii sunt cei mai activi —{' '}
                            <Link href="/" className="text-amber-400 hover:underline">
                                verifică calendarul solunar
                            </Link>{' '}
                            înainte de fiecare sesiune.
                        </p>
                        <p>
                            Pentru pescuitul gratuit pe lacurile naturale și râurile din{' '}
                            {county}, ai nevoie de{' '}
                            <strong className="text-white">autorizație ANPA</strong> valabilă.
                            Pentru bălțile private, taxa zilnică sau permisul sunt plătite
                            direct administratorului apei.
                        </p>
                    </div>
                </div>

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">
                        Întrebări frecvente — pescuit {county}
                    </h2>
                    <div className="space-y-4">
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">
                                Câte locuri de pescuit sunt în {county}?
                            </h3>
                            <p className="text-night-300 text-sm">
                                În județul {county} sunt {locations.length} locuri de pescuit
                                catalogate: {paidCount} cu taxă și {freeCount} cu acces
                                gratuit.
                            </p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">
                                Unde pot pescui gratuit în {county}?
                            </h3>
                            <p className="text-night-300 text-sm">
                                Râurile și lacurile naturale/de acumulare din județul {county}{' '}
                                permit pescuitul gratuit cu permis AJVPS sau autorizație ANPA.
                                Bălțile private necesită taxă separată.
                            </p>
                        </div>
                        <div className="pb-2">
                            <h3 className="text-base font-bold text-amber-400 mb-2">
                                Ce specii se prind în {county}?
                            </h3>
                            <p className="text-night-300 text-sm">
                                Speciile întâlnite: {allSpecies.join(', ')}. Vezi fiecare
                                locație pentru specii exacte și calendar solunar pe GPS.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">
                        Explorează locurile din alte județe
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {otherCounties.map((c) => (
                            <Link
                                key={c.slug}
                                href={`/locuri-pescuit/judet/${c.slug}`}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded text-center text-sm text-night-300 hover:text-amber-400 transition-colors"
                            >
                                {c.name}
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link
                            href="/locuri-pescuit"
                            className="text-amber-400 hover:underline text-sm"
                        >
                            Vezi toate locurile de pescuit din România &rarr;
                        </Link>
                    </div>
                </div>
</div>
        </div>
    );
}
