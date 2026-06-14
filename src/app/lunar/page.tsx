import { Metadata } from 'next';
import { getMoonPhase, getMoonIllumination, getMoonPhaseName, getSolunarData } from '@/lib/solunar';
import RatingBars from '@/components/RatingBars';
import MoonIcon from '@/components/MoonIcon';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';

// Shows today's moon phase + current month's calendar — regenerate hourly.
export const revalidate = 3600;

export const metadata: Metadata = {
    // Absolute title bypasses the global template so it stays short (~52 chars).
    title: { absolute: 'Faza Lunii Azi + Calendar Lunar 2026 - Fazele Lunii' },
    description: 'Faza lunii azi, calendar lunar 2026 cu toate fazele lunii pe luni, lună plină, lună nouă, procent de iluminare și rating solunar pentru pescuit. Actualizat zilnic.',
    keywords: [
        'fazele lunii azi', 'faza lunii azi', 'calendar lunar 2026', 'fazele lunii',
        'fazele lunii 2026', 'calendar lunar', 'luna plina', 'luna noua',
        'calendar fazele lunii', 'faze lunare pescuit',
        'calendar lunar fazele lunii', 'luna azi',
    ],
    alternates: { canonical: 'https://calendarsolunar.ro/lunar' },
    openGraph: {
        title: 'Faza Lunii Azi — Calendar Lunar 2026',
        description: 'Vezi faza lunii de azi, iluminarea, calendarul lunar 2026 cu toate fazele și impactul asupra pescuitului.',
        url: 'https://calendarsolunar.ro/lunar',
    },
};

function getMoonage(date: Date): number {
    const synodic = 29.53058867;
    const refNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
    const diff = date.getTime() - refNewMoon;
    const days = diff / 86400000;
    return ((days % synodic) + synodic) % synodic;
}

export default function LunarPage() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate calendar for current month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(new Date(currentYear, currentMonth, d));
    }

    // Find key moon phases this month
    const keyPhases: { date: Date; phase: string; name: string }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(currentYear, currentMonth, d);
        const age = getMoonage(date);
        const prevDate = new Date(currentYear, currentMonth, d - 1);
        const prevAge = getMoonage(prevDate);

        // New Moon (age crosses 0)
        if (age < 1 && prevAge > 28) {
            keyPhases.push({ date, phase: 'new', name: 'Lună Nouă' });
        }
        // First Quarter (age ~7.4)
        if (prevAge < 7.4 && age >= 7.4) {
            keyPhases.push({ date, phase: 'first-quarter', name: 'Primul Pătrar' });
        }
        // Full Moon (age ~14.8)
        if (prevAge < 14.8 && age >= 14.8) {
            keyPhases.push({ date, phase: 'full', name: 'Lună Plină' });
        }
        // Last Quarter (age ~22.1)
        if (prevAge < 22.1 && age >= 22.1) {
            keyPhases.push({ date, phase: 'last-quarter', name: 'Ultimul Pătrar' });
        }
    }

    const monthName = today.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });

    // Full-year moon phases — powers the "Fazele Lunii 2026" annual section,
    // which targets "fazele lunii 2026" / "calendar fazele lunii" queries.
    const monthNamesRo = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
    const annualPhases = monthNamesRo.map((mName, mIdx) => {
        const phases: { date: Date; phase: string; name: string }[] = [];
        const daysInThisMonth = new Date(currentYear, mIdx + 1, 0).getDate();
        for (let d = 1; d <= daysInThisMonth; d++) {
            const date = new Date(currentYear, mIdx, d);
            const age = getMoonage(date);
            const prevAge = getMoonage(new Date(currentYear, mIdx, d - 1));
            if (age < 1 && prevAge > 28) phases.push({ date, phase: 'new', name: 'Lună Nouă' });
            if (prevAge < 7.4 && age >= 7.4) phases.push({ date, phase: 'first-quarter', name: 'Primul Pătrar' });
            if (prevAge < 14.8 && age >= 14.8) phases.push({ date, phase: 'full', name: 'Lună Plină' });
            if (prevAge < 22.1 && age >= 22.1) phases.push({ date, phase: 'last-quarter', name: 'Ultimul Pătrar' });
        }
        return { monthName: mName, slug: mName.toLowerCase(), phases };
    });

    const lunarSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://calendarsolunar.ro/" },
            { "@type": "ListItem", "position": 2, "name": "Calendar Lunar", "item": "https://calendarsolunar.ro/lunar" }
        ]
    };

    return (
        <div className="min-h-[100dvh] py-12 md:py-20">
            <JsonLd data={lunarSchema} />
            <Breadcrumbs items={[
                { label: 'Acasă', href: '/' },
                { label: 'Calendar Lunar' },
            ]} />
            <div className="container-custom px-4">
                {/* Hero */}
                <div className="mb-12 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-none text-white mb-5">
                        Faza Lunii Azi <span className="text-moon capitalize">{monthName}</span>
                    </h1>
                    <p className="text-night-300 text-base md:text-lg leading-relaxed max-w-[65ch]">
                        Calendar lunar cu iluminare, faze importante și rating solunar pentru pescuit.
                    </p>
                </div>

                {/* Top Ad (eager) */}
                <AdUnit slotId="2812628769" format="horizontal" className="mb-8 max-w-2xl mx-auto" />
                {/* Today's Moon Info */}
                <div className="card-panel p-6 md:p-8 mb-8 max-w-2xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="text-moon">
                            <MoonIcon phase={getMoonPhase(today)} className="w-24 h-24" />
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-display font-bold text-white mb-2">
                                Azi: {getMoonPhaseName(getMoonPhase(today)).startsWith('În')
                                    ? `Lună ${getMoonPhaseName(getMoonPhase(today)).toLowerCase()}`
                                    : getMoonPhaseName(getMoonPhase(today))}
                            </h2>
                            <p className="text-moon text-lg font-bold mb-1">
                                {getMoonIllumination(today)}% iluminare
                            </p>
                            <p className="text-night-400">
                                {today.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 max-w-4xl mx-auto mb-10">
                    <Link href="/azi" className="interactive-lift taste-surface rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 hover:border-amber-400/40 transition-colors">
                        <p className="text-xs uppercase tracking-[0.14em] text-amber-200/80 font-bold mb-1">Azi</p>
                        <h2 className="text-lg font-display font-bold text-white">Solunar pe ore</h2>
                        <p className="text-night-300 text-xs mt-2">Perioade majore, minore și scorul zilei.</p>
                    </Link>
                    <Link href="/blog/cele-mai-bune-ore-pescuit-2026" className="interactive-lift taste-surface rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 hover:border-amber-400/40 transition-colors">
                        <p className="text-xs uppercase tracking-[0.14em] text-amber-200/80 font-bold mb-1">2026</p>
                        <h2 className="text-lg font-display font-bold text-white">Cele mai bune ore</h2>
                        <p className="text-night-300 text-xs mt-2">Ghid rapid pentru zile și intervale productive.</p>
                    </Link>
                    <Link href="/" className="interactive-lift taste-surface rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.07] transition-colors">
                        <p className="text-xs uppercase tracking-[0.14em] text-night-300 font-bold mb-1">Calendar</p>
                        <h2 className="text-lg font-display font-bold text-white">Solunar 2026</h2>
                        <p className="text-night-300 text-xs mt-2">Tabel zilnic, vreme și specii active.</p>
                    </Link>
                </div>

                {/* Key Phases This Month */}
                {keyPhases.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-display font-bold text-white mb-6 text-center">
                            Fazele Importante în {monthName}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            {keyPhases.map((p, i) => (
                                <div key={i} className="card-glass p-4 flex flex-col items-center text-center group hover:bg-white/5 transition-colors">
                                    <div className="mb-3 text-moon">
                                        <MoonIcon phase={p.phase} className="w-10 h-10" />
                                    </div>
                                    <div className="font-bold text-white text-sm mb-1">{p.name}</div>
                                    <div className="text-night-400 text-xs font-mono">
                                        {p.date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Middle Ad (lazy) */}
                <LazyAdUnit slotId="6301173988" format="rectangle" className="mb-8 max-w-2xl mx-auto" />
                {/* Calendar Grid */}
                <div className="card-panel p-4 md:p-6 max-w-4xl mx-auto">
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'].map(day => (
                            <div key={day} className="text-center text-xs font-bold text-night-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((date, i) => {
                            if (!date) {
                                return <div key={i} className="aspect-square" />;
                            }
                            const isToday = date.toDateString() === today.toDateString();
                            const phase = getMoonPhase(date);
                            const illumination = getMoonIllumination(date);
                            const data = getSolunarData(date);

                            return (
                                <div
                                    key={i}
                                    className={`aspect-square p-1 md:p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${isToday
                                        ? 'bg-moon/10 border border-moon/50'
                                        : 'bg-night-900/50 hover:bg-night-800/80'
                                        }`}
                                >
                                    <span className={`text-xs md:text-sm font-bold ${isToday ? 'text-moon' : 'text-white'}`}>
                                        {date.getDate()}
                                    </span>
                                    <div className="text-moon/80">
                                        <MoonIcon phase={phase} className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <span className="text-[8px] md:text-[10px] text-night-400 hidden sm:block">{illumination}%</span>

                                    <RatingBars rating={data.overallRating} className="h-2 w-full max-w-[40px]" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 max-w-2xl mx-auto">
                    <h3 className="text-lg font-bold text-white mb-4 text-center">Legendă</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="card-glass p-3 flex flex-col items-center text-center gap-2">
                            <MoonIcon phase="new" className="w-8 h-8 text-moon" />
                            <div className="text-white font-bold text-xs">Lună Nouă</div>
                            <RatingBars rating={5} className="h-2 w-16" />
                        </div>
                        <div className="card-glass p-3 flex flex-col items-center text-center gap-2">
                            <MoonIcon phase="first-quarter" className="w-8 h-8 text-moon" />
                            <div className="text-white font-bold text-xs">Primul Pătrar</div>
                            <RatingBars rating={3} className="h-2 w-16" />
                        </div>
                        <div className="card-glass p-3 flex flex-col items-center text-center gap-2">
                            <MoonIcon phase="full" className="w-8 h-8 text-moon" />
                            <div className="text-white font-bold text-xs">Lună Plină</div>
                            <RatingBars rating={5} className="h-2 w-16" />
                        </div>
                        <div className="card-glass p-3 flex flex-col items-center text-center gap-2">
                            <MoonIcon phase="last-quarter" className="w-8 h-8 text-moon" />
                            <div className="text-white font-bold text-xs">Ultimul Pătrar</div>
                            <RatingBars rating={3} className="h-2 w-16" />
                        </div>
                    </div>
                </div>

                {/* Fazele Lunii 2026 — annual calendar (targets "fazele lunii 2026", "calendar fazele lunii") */}
                <section className="mt-12 mb-8 max-w-4xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2 text-center">Fazele Lunii {currentYear} — Calendar Anual</h2>
                    <p className="text-night-400 text-sm text-center mb-6 max-w-2xl mx-auto">
                        Toate fazele lunii din {currentYear}: lună nouă, primul pătrar, lună plină și ultimul pătrar pentru fiecare lună. Datele exacte te ajută să planifici cele mai bune zile de pescuit.
                    </p>
                    <div className="overflow-x-auto card-panel p-4 md:p-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-night-700 text-night-300">
                                    <th className="text-left py-2 px-2 font-bold">Luna</th>
                                    <th className="text-left py-2 px-2 font-bold">🌑 Lună Nouă</th>
                                    <th className="text-left py-2 px-2 font-bold">🌓 Primul Pătrar</th>
                                    <th className="text-left py-2 px-2 font-bold">🌕 Lună Plină</th>
                                    <th className="text-left py-2 px-2 font-bold">🌗 Ultimul Pătrar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {annualPhases.map((m) => {
                                    const pick = (name: string) => {
                                        const p = m.phases.find((x) => x.name === name);
                                        return p ? p.date.getDate() : '—';
                                    };
                                    const isCurrent = monthNamesRo[currentMonth] === m.monthName;
                                    return (
                                        <tr key={m.slug} className={`border-b border-night-800 ${isCurrent ? 'bg-moon/5' : ''}`}>
                                            <td className="py-2 px-2 font-bold">
                                                <Link href={`/solunar-${m.slug}-${currentYear}`} className="text-white hover:text-moon transition-colors">
                                                    {m.monthName}
                                                </Link>
                                            </td>
                                            <td className="py-2 px-2 text-night-300">{pick('Lună Nouă')}</td>
                                            <td className="py-2 px-2 text-night-300">{pick('Primul Pătrar')}</td>
                                            <td className="py-2 px-2 text-night-300">{pick('Lună Plină')}</td>
                                            <td className="py-2 px-2 text-night-300">{pick('Ultimul Pătrar')}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-night-500 text-xs mt-3 text-center">
                        Zilele afișate sunt calculate astronomic pentru fusul orar al României. Apasă pe o lună pentru calendarul solunar complet.
                    </p>
                </section>

                {/* SEO Content - Fazele Lunii */}
                <section className="mt-12 mb-8 card-panel p-6 md:p-8 max-w-4xl mx-auto">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-3">Cum Influențează Fazele Lunii Pescuitul?</h2>
                    <div className="text-night-300 text-sm leading-relaxed space-y-3">
                        <p>
                            <strong className="text-white">Fazele lunii</strong> au un impact direct asupra comportamentului peștilor, demonstrat atât de teoria solunar
                            a lui John Alden Knight cât și de experiența pescarilor de-a lungul secolelor. Luna influențează mareele, presiunea
                            atmosferică subtilă și nivelul de lumină nocturnă — toți factori care afectează hrănirea peștilor.
                        </p>
                        <p>
                            <strong className="text-amber-400">Luna Nouă și Luna Plină</strong> sunt considerate cele mai bune perioade pentru pescuit,
                            cu rating solunar de 4-5 stele. În aceste faze, forțele gravitaționale combinate ale Soarelui și Lunii sunt maxime,
                            stimulând activitatea peștilor. <strong className="text-amber-400">Primul și Ultimul Pătrar</strong> oferă activitate moderată (3 stele).
                        </p>
                        <p>
                            Calendarul lunar de mai sus afișează pentru fiecare zi: faza lunii exactă, procentul de iluminare și rating-ul solunar
                            calculat pe baza algoritmilor astronomici. Folosește-l împreună cu <a href="/" className="text-moon hover:underline">calendarul solunar complet</a> pentru
                            a planifica sesiunile de pescuit în cele mai productive zile ale lunii.
                        </p>
                    </div>
                </section>

                {/* SEO Content - Detalii Faze Lunare */}
                <section className="mb-8 card-panel p-6 md:p-8 max-w-4xl mx-auto">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-3">Ghid Complet: Cele 4 Faze Lunare și Pescuitul</h2>
                    <div className="text-night-300 text-sm leading-relaxed space-y-4">
                        <div>
                            <h3 className="text-base font-bold text-amber-400 mb-1">Luna Nouă — Rating 5/5</h3>
                            <p>
                                În faza de <strong className="text-white">lună nouă</strong>, discul lunar nu este vizibil pe cer. Întunericul nocturn stimulează
                                prădătorii nocturn — somnul, șalăul și bibanul devin extrem de activi. Forța gravitațională combinată a Lunii și Soarelui
                                (care se află pe aceeași parte a Pământului) creează cele mai puternice efecte de maree, activând instinctul de hrănire
                                al peștilor. Este perioada ideală pentru pescuitul de noapte al răpitorilor.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white mb-1">Primul Pătrar — Rating 3/5</h3>
                            <p>
                                <strong className="text-white">Primul pătrar</strong> marchează jumătatea drumului între luna nouă și luna plină. Luna este
                                iluminată 50% și apune în jurul miezului nopții. Activitatea peștilor este moderată, dar consistentă. Specii ca păstrăvul,
                                cleanul și bibanul răspund bine în această fază. Orele de dimineață devreme și amurg rămân cele mai productive.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-amber-400 mb-1">Luna Plină — Rating 5/5</h3>
                            <p>
                                <strong className="text-white">Luna plină</strong> este una dintre cele mai bune perioade pentru pescuit. Lumina puternică
                                nocturnă permite peștilor să se hrănească activ toată noaptea, iar forțele gravitaționale sunt din nou la maxim.
                                Crapul, linul și fitofagul sunt deosebit de activi. Peștii care s-au hrănit noaptea pot fi mai puțin activi dimineața,
                                dar perioadele solunar majore rămân productive. Este excelentă pentru sesiunile de noapte cu boilies sau method feeder.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white mb-1">Ultimul Pătrar — Rating 3/5</h3>
                            <p>
                                <strong className="text-white">Ultimul pătrar</strong> oferă activitate moderată, similară primului pătrar. Luna răsare
                                la miezul nopții și este vizibilă dimineața. Carasul și babușca rămân activi, iar șalăul poate fi prins eficient
                                la zorii zilei. Presiunea atmosferică joacă un rol mai important în această fază — zilele cu presiune stabilă
                                (1013-1025 hPa) compensează efectul lunar mai slab.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Specii și Fazele Lunare */}
                <section className="mb-8 card-panel p-6 md:p-8 max-w-4xl mx-auto">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-3">Ce Pești Trag în Funcție de Faza Lunii?</h2>
                    <div className="text-night-300 text-sm leading-relaxed space-y-3">
                        <p>
                            Fiecare specie de pește reacționează diferit la fazele lunare. Iată un ghid rapid bazat pe teoria solunar și experiența
                            pescarilor din România:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-2">
                            <li><strong className="text-white">Luna Nouă:</strong> <a href="/pescuit-somn" className="text-moon hover:underline">somn</a>, <a href="/pescuit-salau" className="text-moon hover:underline">șalău</a>, <a href="/pescuit-stiuca" className="text-moon hover:underline">știucă</a> — prădătorii nocturn profită de întunericul total</li>
                            <li><strong className="text-white">Luna Plină:</strong> <a href="/pescuit-crap" className="text-moon hover:underline">crap</a>, <a href="/pescuit-lin" className="text-moon hover:underline">lin</a>, <a href="/pescuit-fitofag" className="text-moon hover:underline">fitofag</a> — se hrănesc activ noaptea sub lumina lunii</li>
                            <li><strong className="text-white">Primul Pătrar:</strong> <a href="/pescuit-pastrav" className="text-moon hover:underline">păstrăv</a>, <a href="/pescuit-clean" className="text-moon hover:underline">clean</a>, <a href="/pescuit-biban" className="text-moon hover:underline">biban</a> — activitate moderată, ideale pentru spinning ultralight</li>
                            <li><strong className="text-white">Ultimul Pătrar:</strong> <a href="/pescuit-caras" className="text-moon hover:underline">caras</a>, <a href="/pescuit-babusca" className="text-moon hover:underline">babușcă</a>, <a href="/pescuit-platica" className="text-moon hover:underline">plătică</a> — specii care se hrănesc constant, bune pentru feeder</li>
                        </ul>
                        <p>
                            Pentru prognoză completă cu perioade majore și minore calculate pe ore, consultă <a href="/" className="text-moon hover:underline">calendarul solunar</a> sau
                            verifică <a href="/azi" className="text-moon hover:underline">solunar-ul de azi</a>.
                        </p>
                    </div>
                </section>

                {/* Bottom Ad (lazy) */}
                <LazyAdUnit slotId="1044977874" format="auto" className="mb-8 max-w-2xl mx-auto" />
                {/* CTA */}
                <div className="text-center mt-12">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-moon text-night-950 font-bold rounded-xl hover:bg-moon/90 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calendar Solunar Complet
                    </a>
                </div>
            </div>
        </div>
    );
}
