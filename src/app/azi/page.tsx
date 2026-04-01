import { getSolunarData, getMoonPhaseName, formatTime, getActiveFish, getMoonage } from '@/lib/solunar';
import { getWeatherData } from '@/lib/weather';
import { getFishingAdvice } from '@/lib/advice';
import Moon3DWrapper from '@/components/Moon3DWrapper';
import ActivityGraph from '@/components/ActivityGraph';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const today = new Date();
    const dayNum = today.getDate();
    const monthName = today.toLocaleDateString('ro-RO', { month: 'long' });
    const year = today.getFullYear();

    return {
        title: `Solunar Azi ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year} ✓ Ore Exacte Pescuit`,
        description: `✅ Solunar azi ${dayNum} ${monthName} ${year}: perioade majore și minore, faza lunii, specii active și ore optime de pescuit. Actualizat zilnic, verifică acum!`,
        keywords: [
            'solunar azi', 'calendar solunar azi', 'activitate pesti azi',
            'cand trage pestele azi', 'pescuit azi', 'faza lunii azi',
            'perioade majore azi', 'solunar pescuit azi', 'luna azi pescuit',
            'cand musca pestele azi', 'ore pescuit azi',
        ],
        alternates: {
            canonical: 'https://calendarsolunar.ro/azi',
        },
        openGraph: {
            title: `Solunar Azi ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} — Ce Pești Sunt Activi?`,
            description: `Verifică solunar-ul pentru azi ${dayNum} ${monthName}: perioade majore, faza lunii, vremea și specii active.`,
            url: 'https://calendarsolunar.ro/azi',
            siteName: 'Calendar Solunar',
            locale: 'ro_RO',
            type: 'website',
        },
    };
}

export default async function AziPage() {
    const today = new Date();
    const lat = 44.4268; // București default
    const lng = 26.1025;

    const data = getSolunarData(today, lat, lng);
    const weather = await getWeatherData(lat, lng);
    const advice = getFishingAdvice(weather, data);
    const activeFish = getActiveFish(today, data.moonPhase);

    const dateStr = today.toLocaleDateString('ro-RO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    const ratingLabels = ['', 'Slabă', 'Moderată', 'Bună', 'Foarte Bună', 'Excelentă'];
    const ratingColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400', 'text-green-400'];

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            <Breadcrumbs items={[
                { label: 'Acasă', href: '/' },
                { label: 'Solunar Azi' },
            ]} />
            <div className="container-custom px-4 relative z-10">
                {/* Hero */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
                        Solunar <span className="text-amber-400">Azi</span>
                    </h1>
                    <p className="text-night-400 text-sm md:text-base mb-2">{capitalizedDate} &bull; București</p>
                    <p className="text-night-300 text-sm md:text-lg max-w-2xl mx-auto">
                        Verifică activitatea peștilor pentru ziua de azi. Date calculate cu algoritmi astronomici preciși.
                    </p>
                </div>

                {/* Rating Hero Card */}
                <div className="card-panel p-6 md:p-8 mb-8 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                        {/* Moon */}
                        <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]">
                            <Moon3DWrapper phase={getMoonage(today) / 29.53} illumination={data.moonIllumination} size={160} />
                        </div>

                        {/* Rating */}
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

                        {/* Moon Info */}
                        <div className="text-center md:text-left">
                            <p className="text-amber-200 font-bold text-lg">{getMoonPhaseName(data.moonPhase)}</p>
                            <p className="text-night-400 text-sm">{data.moonIllumination}% iluminare</p>
                            <p className="text-night-400 text-sm mt-1">Temp: {weather.temperature}°C</p>
                            <p className="text-night-400 text-sm">Presiune: {weather.pressure} hPa</p>
                        </div>
                    </div>
                </div>

                <AdUnit slotId="2812628769" format="horizontal" className="min-h-[90px] mb-8" label="Reclamă" />

                {/* Periods Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Major Periods */}
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-amber-400 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" /></svg>
                            Perioade Majore Azi
                        </h2>
                        <p className="text-night-400 text-sm mb-4">Durată ~2 ore. Activitate maximă a peștilor.</p>
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

                    {/* Minor Periods */}
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-cyan-400 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            Perioade Minore Azi
                        </h2>
                        <p className="text-night-400 text-sm mb-4">Durată ~1 oră. Activitate moderată.</p>
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
                    <h2 className="text-xl font-display font-bold text-white mb-4">Grafic Activitate Azi</h2>
                    <ActivityGraph majorPeriods={data.majorPeriods} minorPeriods={data.minorPeriods} />
                    <div className="flex justify-center gap-6 mt-3 text-xs font-mono text-night-400 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Majoră</span>
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Minoră</span>
                    </div>
                </div>

                {/* Sun/Moon Times */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <div className="card-glass p-4 text-center">
                        <p className="text-[10px] uppercase text-night-400 font-bold tracking-wider mb-1">Răsărit Soare</p>
                        <p className="text-xl font-mono text-amber-400">{formatTime(data.sunrise)}</p>
                    </div>
                    <div className="card-glass p-4 text-center">
                        <p className="text-[10px] uppercase text-night-400 font-bold tracking-wider mb-1">Apus Soare</p>
                        <p className="text-xl font-mono text-orange-400">{formatTime(data.sunset)}</p>
                    </div>
                    <div className="card-glass p-4 text-center">
                        <p className="text-[10px] uppercase text-night-400 font-bold tracking-wider mb-1">Răsărit Lună</p>
                        <p className="text-xl font-mono text-blue-400">{data.moonrise ? formatTime(data.moonrise) : '--:--'}</p>
                    </div>
                    <div className="card-glass p-4 text-center">
                        <p className="text-[10px] uppercase text-night-400 font-bold tracking-wider mb-1">Apus Lună</p>
                        <p className="text-xl font-mono text-indigo-400">{data.moonset ? formatTime(data.moonset) : '--:--'}</p>
                    </div>
                </div>

                {/* Active Fish & Advice */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-emerald-400 mb-4">Specii Active Azi</h2>
                        {activeFish.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {activeFish.map((fish, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium">
                                        {fish}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-night-400">Activitate generală redusă astăzi.</p>
                        )}
                    </div>
                    <div className="card-panel p-6">
                        <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">Sfatul Zilei</h2>
                        <p className="text-night-300 text-sm leading-relaxed">{advice}</p>
                    </div>
                </div>

                <LazyAdUnit slotId="6301173988" format="rectangle" style={{ minHeight: '280px' }} className="mb-8" label="Reclamă" />

                {/* SEO Content Section */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-4">Ce este Calendarul Solunar?</h2>
                    <div className="prose prose-invert prose-sm max-w-none text-night-300 space-y-4">
                        <p>
                            Calendarul solunar este un instrument esențial pentru pescari care doresc să știe <strong className="text-white">când trage peștele</strong>.
                            Bazat pe teoria solunar dezvoltată de John Alden Knight în 1926, calendarul calculează perioadele de activitate maximă
                            a peștilor în funcție de poziția lunii și a soarelui.
                        </p>
                        <p>
                            <strong className="text-white">Perioadele majore</strong> (aproximativ 2 ore) coincid cu tranzitul lunar superior și inferior
                            &mdash; momentele când luna se află direct deasupra sau dedesubt. <strong className="text-white">Perioadele minore</strong> (aproximativ 1 oră)
                            coincid cu răsăritul și apusul lunii.
                        </p>
                        <p>
                            Factori care influențează activitatea peștilor: faza lunii (luna plină și luna nouă = activitate maximă),
                            presiunea atmosferică (stabilă sau în ușoară scădere = ideal), temperatura apei, și condițiile meteo generale.
                        </p>
                    </div>
                </div>

                {/* Specii Populare */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Ghiduri pe Specii de Pești</h2>
                    <p className="text-night-400 text-sm mb-4">Află când trage fiecare specie, ce momeli să folosești și care sunt perioadele solunar optime:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { name: 'Crap', slug: 'pescuit-crap', icon: '🐟' },
                            { name: 'Șalău', slug: 'pescuit-salau', icon: '🐠' },
                            { name: 'Somn', slug: 'pescuit-somn', icon: '🐋' },
                            { name: 'Știucă', slug: 'pescuit-stiuca', icon: '🐊' },
                            { name: 'Păstrăv', slug: 'pescuit-pastrav', icon: '🐟' },
                            { name: 'Caras', slug: 'pescuit-caras', icon: '🐟' },
                            { name: 'Biban', slug: 'pescuit-biban', icon: '🐠' },
                            { name: 'Plătică', slug: 'pescuit-platica', icon: '🐟' },
                        ].map(fish => (
                            <Link key={fish.slug} href={`/${fish.slug}`} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-center">
                                <span className="text-lg">{fish.icon}</span>
                                <p className="text-white font-bold text-sm mt-1">{fish.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* FAQ Solunar Azi */}
                <div className="card-panel p-6 md:p-8 mb-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Întrebări Frecvente — Solunar Azi</h2>
                    <div className="space-y-4">
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">Când mușcă peștele cel mai bine azi?</h3>
                            <p className="text-night-300 text-sm">Peștele mușcă cel mai bine în perioadele majore solunar (durată ~2 ore) afișate mai sus. Acestea coincid cu tranzitul lunar și oferă cea mai intensă activitate. Perioadele minore (~1 oră) sunt de asemenea productive.</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">Cât de precis este calendarul solunar?</h3>
                            <p className="text-night-300 text-sm">Teoria solunar are o rată de succes de aproximativ 60-70% conform studiilor. Precizia crește semnificativ când perioadele solunar coincid cu condiții meteo favorabile: presiune atmosferică stabilă (1013-1025 hPa), vânt slab și temperatură optimă a apei.</p>
                        </div>
                        <div className="border-b border-night-800 pb-4">
                            <h3 className="text-base font-bold text-amber-400 mb-2">Ce fază a lunii este azi și cum afectează pescuitul?</h3>
                            <p className="text-night-300 text-sm">Faza lunii de azi este afișată în secțiunea de rating de mai sus. Luna plină și luna nouă oferă activitate maximă (rating 4-5), în timp ce pătrarii oferă activitate moderată (rating 3). Consultă <Link href="/lunar" className="text-moon hover:underline">calendarul lunar complet</Link> pentru prognoză pe toată luna.</p>
                        </div>
                        <div className="pb-2">
                            <h3 className="text-base font-bold text-amber-400 mb-2">Cum aleg locul de pescuit în funcție de solunar?</h3>
                            <p className="text-night-300 text-sm">Datele solunar variază în funcție de locație deoarece tranzitul lunar diferă. Folosește <Link href="/" className="text-moon hover:underline">calendarul solunar</Link> cu selectare de locație pentru date calculate pe coordonatele exacte ale zonei tale, sau explorează <Link href="/locuri-pescuit" className="text-moon hover:underline">locuri de pescuit din România</Link>.</p>
                        </div>
                    </div>
                </div>

                {/* Internal Links */}
                <div className="card-panel p-6 md:p-8">
                    <h2 className="text-xl font-display font-bold text-white mb-4">Explorează Mai Multe</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Link href="/" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Calendar Complet</p>
                            <p className="text-night-400 text-xs mt-1">Prognoză 14 zile</p>
                        </Link>
                        <Link href="/lunar" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Faze Lunare</p>
                            <p className="text-night-400 text-xs mt-1">Calendar lunar 2026</p>
                        </Link>
                        <Link href="/blog" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Ghiduri Pescuit</p>
                            <p className="text-night-400 text-xs mt-1">Articole și sfaturi</p>
                        </Link>
                        <Link href="/blog/cum-functioneaza-calendarul-solunar" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
                            <p className="text-white font-bold text-sm">Cum Funcționează?</p>
                            <p className="text-night-400 text-xs mt-1">Teoria solunar</p>
                        </Link>
                    </div>
                </div>

                <LazyAdUnit slotId="1044977874" format="auto" layout="in-article" className="min-h-[120px] mt-8" label="Reclamă" />
            </div>
        </div>
    );
}
