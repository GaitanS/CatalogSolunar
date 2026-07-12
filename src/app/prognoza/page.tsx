import type { Metadata } from 'next';
import Link from 'next/link';
import { getSolunarData, getMoonPhaseName, formatTime, getMoonage } from '@/lib/solunar';
import MiniMoon from '@/components/MiniMoon';
import CityPickerPill from '@/components/CityPickerPill';
import Breadcrumbs from '@/components/Breadcrumbs';
import LazyAdUnit from '@/components/LazyAdUnit';

export async function generateMetadata(): Promise<Metadata> {
    const today = new Date();
    const dateStr = today.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' });
    return {
        title: { absolute: `Prognoză Pescuit 14 Zile de la ${dateStr} - Solunar pe Ore` },
        description: `Prognoză solunar pescuit pe 14 zile: cea mai bună fereastră majoră pentru fiecare zi, faza lunii, iluminare și rating de activitate. Actualizat zilnic.`,
        keywords: [
            'prognoza pescuit', 'prognoza pescuit 14 zile', 'solunar 14 zile',
            'prognoza solunar', 'zile bune pescuit', 'cand trage pestele saptamana asta',
        ],
        alternates: { canonical: 'https://calendarsolunar.ro/prognoza' },
        openGraph: {
            title: 'Prognoză Pescuit 14 Zile - Solunar pe Ore',
            description: 'Cea mai bună fereastră de pescuit pentru fiecare din următoarele 14 zile.',
            url: 'https://calendarsolunar.ro/prognoza',
        },
    };
}

const DOW3 = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];

export default async function PrognozaPage({ searchParams }: { searchParams: Promise<{ lat?: string; lng?: string; loc?: string }> }) {
    const params = await searchParams;
    const lat = params.lat ? parseFloat(params.lat) : 44.4268;
    const lng = params.lng ? parseFloat(params.lng) : 26.1025;
    const locationName = params.loc || 'București';
    const today = new Date();

    const locationQuery = [
        params.lat ? `lat=${encodeURIComponent(params.lat)}` : null,
        params.lng ? `lng=${encodeURIComponent(params.lng)}` : null,
        params.loc ? `loc=${encodeURIComponent(params.loc)}` : null,
    ].filter(Boolean).join('&');

    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const data = getSolunarData(d, lat, lng);
        return { data, moonAge: getMoonage(d) };
    });

    return (
        <div className="relative pb-20 pt-4 md:pt-8">
            <Breadcrumbs items={[
                { label: 'Acasă', href: '/' },
                { label: 'Prognoză 14 Zile' },
            ]} />
            <div className="container-custom relative z-10 px-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-4xl">
                            Prognoză <span className="text-moon">14 zile</span>
                        </h1>
                        <p className="mt-1.5 max-w-xl text-sm text-[#8C96AB]">
                            Cea mai bună fereastră majoră afișată pentru fiecare zi · {locationName}
                        </p>
                    </div>
                    <div className="shrink-0 pt-1">
                        <CityPickerPill />
                    </div>
                </div>

                <div className="max-w-2xl">
                    {days.map(({ data, moonAge }, i) => {
                        const best = data.majorPeriods[0];
                        const first = i === 0;
                        return (
                            <Link
                                key={i}
                                href={first ? (locationQuery ? `/?${locationQuery}` : '/') : `/?d=${i}${locationQuery ? `&${locationQuery}` : ''}`}
                                className="mb-2 flex w-full items-center gap-3 rounded-2xl px-[13px] py-[11px] text-left text-[#EEF1F7]"
                                style={{
                                    background: first ? 'rgba(242,206,114,0.07)' : 'rgba(148,170,220,0.055)',
                                    border: first ? '1px solid rgba(242,206,114,0.3)' : '1px solid rgba(148,170,220,0.12)',
                                }}
                            >
                                <div className="w-10 shrink-0 text-center">
                                    <div className="text-[10px] uppercase tracking-[0.06em] text-[#8C96AB]">
                                        {first ? 'Azi' : DOW3[data.date.getDay()]}
                                    </div>
                                    <div className="mt-px text-base font-semibold">{data.date.getDate()}</div>
                                </div>
                                <MiniMoon fraction={data.moonIllumination / 100} phaseValue={moonAge / 29.53058867} size={30} />
                                <div className="min-w-0 flex-1">
                                    <div className="text-[13.5px] font-semibold tabular-nums">
                                        {best ? `${formatTime(best.start)} – ${formatTime(best.end)}` : '—'}
                                    </div>
                                    <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[10.5px] text-[#8C96AB]">
                                        {getMoonPhaseName(data.moonPhase)} · {data.moonIllumination}%
                                    </div>
                                </div>
                                <div className="w-11 shrink-0">
                                    <div className="text-right text-[11px] font-semibold text-moon">{data.overallRating}/5</div>
                                    <div className="mt-[5px] h-1 overflow-hidden rounded bg-[#94AADC]/[0.14]">
                                        <div
                                            className="h-full rounded"
                                            style={{
                                                width: `${(data.overallRating / 5) * 100}%`,
                                                background: 'linear-gradient(90deg, rgba(242,206,114,0.5), #F2CE72)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                    <p className="mt-2.5 text-center text-[10px] text-[#4E586F]">
                        Cea mai bună fereastră majoră afișată pentru fiecare zi · apasă pe o zi pentru detalii complete
                    </p>
                </div>

                <LazyAdUnit slotId="1044977874" format="auto" className="mt-8" />

                {/* Text SEO scurt */}
                <div className="card-panel mt-8 max-w-2xl p-5 md:p-6">
                    <h2 className="font-display text-lg font-bold text-white">Cum folosești prognoza solunar pe 14 zile</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        Prognoza afișează pentru fiecare zi cea mai productivă fereastră de pescuit — perioada majoră
                        principală, calculată din tranzitul lunar pentru locația ta. Ratingul (1-5) combină faza lunii,
                        durata perioadelor și alinierea cu răsăritul și apusul soarelui. Alege zilele cu rating 4-5 și
                        planifică-ți ieșirea în jurul ferestrei afișate. Pentru detalii pe ore — perioade minore, scor
                        de mușcătură și meteo — apasă pe ziua dorită sau vezi <Link href="/azi" className="text-moon hover:underline">solunarul de azi</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
