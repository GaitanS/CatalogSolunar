import type { Metadata } from 'next';
import Link from 'next/link';
import { getMoonPhase, getMoonPhaseName } from '@/lib/solunar';
import { fishSpecies } from '@/data/species';
import SpeciesGuide from '@/components/SpeciesGuide';
import Breadcrumbs from '@/components/Breadcrumbs';
import LazyAdUnit from '@/components/LazyAdUnit';

export const metadata: Metadata = {
    title: { absolute: 'Ghid Specii de Pești - Când Trage Fiecare Specie' },
    description:
        'Ghid interactiv pe specii de pești: sezon, ore optime, faza lunară ideală, tehnici și momeli pentru crap, șalău, somn, știucă, păstrăv, caras și altele.',
    keywords: [
        'specii de pesti', 'ghid pescuit pe specii', 'cand trage crapul',
        'cand trage salaul', 'momeli pescuit', 'tehnici pescuit',
    ],
    alternates: { canonical: 'https://calendarsolunar.ro/specii' },
    openGraph: {
        title: 'Ghid Specii de Pești - Când Trage Fiecare Specie',
        description: 'Sezon, ore optime, fază lunară ideală, tehnici și momeli pentru fiecare specie.',
        url: 'https://calendarsolunar.ro/specii',
    },
};

export default function SpeciiPage() {
    const today = new Date();
    const currentPhase = getMoonPhase(today);
    const phaseName = getMoonPhaseName(currentPhase);

    return (
        <div className="relative pb-20 pt-4 md:pt-8">
            <Breadcrumbs items={[
                { label: 'Acasă', href: '/' },
                { label: 'Ghid Specii' },
            ]} />
            <div className="container-custom relative z-10 px-4">
                <div className="mb-4">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
                        Ghid <span className="text-moon">specii</span>
                    </h1>
                    <p className="mt-1.5 max-w-xl text-sm text-[#8C96AB]">
                        Faza lunii azi: {phaseName.toLowerCase()} · alege specia pentru sezon, ore optime, tehnici și momeli
                    </p>
                </div>

                <div className="max-w-2xl">
                    <SpeciesGuide currentPhase={currentPhase} />
                </div>

                <LazyAdUnit slotId="6301173988" format="rectangle" className="mt-8" />

                {/* Linkuri SEO catre ghidurile complete pe specii */}
                <div className="card-panel mt-8 max-w-2xl p-5 md:p-6">
                    <h2 className="font-display text-lg font-bold text-white">Ghiduri complete pe specii</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        Fiecare specie are un ghid dedicat cu perioadele solunar optime, habitat, echipament recomandat
                        și sfaturi de sezon:
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                        {fishSpecies.map((sp) => (
                            <Link
                                key={sp.slug}
                                href={`/${sp.slug}`}
                                className="rounded-xl border border-white/10 bg-white/[0.045] p-3 text-center transition-colors hover:bg-white/[0.075]"
                            >
                                <p className="text-sm font-bold text-white">{sp.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
