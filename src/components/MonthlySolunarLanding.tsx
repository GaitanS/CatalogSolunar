import Link from 'next/link';
import { getActiveFish, getMoonPhaseName, getSolunarData, formatTime } from '@/lib/solunar';
import { getAllCities } from '@/data/cities';
import { monthlySeoLandingPages, annualSeoLandingPages, type MonthlySeoLandingPage } from '@/data/seoLandingPages';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';

const baseUrl = 'https://calendarsolunar.ro';
const defaultLat = 44.4268;
const defaultLng = 26.1025;
const datasetCreator = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Calendar Solunar',
    url: baseUrl,
};
const datasetLicense = `${baseUrl}/termeni`;

function roDate(date: Date) {
    return date.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getDaysInMonth(page: MonthlySeoLandingPage) {
    const daysCount = new Date(page.year, page.monthIndex + 1, 0).getDate();

    return Array.from({ length: daysCount }, (_, index) => {
        const date = new Date(page.year, page.monthIndex, index + 1, 12, 0, 0);
        const data = getSolunarData(date, defaultLat, defaultLng);
        const majorOne = data.majorPeriods[0];
        const majorTwo = data.majorPeriods[1];

        return {
            date,
            rating: data.overallRating,
            illumination: data.moonIllumination,
            moonPhase: getMoonPhaseName(data.moonPhase),
            majorOneStart: majorOne?.start,
            majorOneEnd: majorOne?.end,
            majorTwoStart: majorTwo?.start,
            majorTwoEnd: majorTwo?.end,
            majorOne: majorOne ? `${formatTime(majorOne.start)} - ${formatTime(majorOne.end)}` : 'n/a',
            majorTwo: majorTwo ? `${formatTime(majorTwo.start)} - ${formatTime(majorTwo.end)}` : 'n/a',
            activeFish: getActiveFish(date, data.moonPhase).slice(0, 4),
        };
    });
}

function MonthJsonLd({ page, topDays }: { page: MonthlySeoLandingPage; topDays: ReturnType<typeof getDaysInMonth> }) {
    const howToSteps = [
        {
            name: 'Alege zilele cu rating mare',
            text: `Pentru ${page.primaryKeyword}, incepe cu zilele de 4/5 sau 5/5 din tabelul lunar.`,
        },
        {
            name: 'Verifica perioadele majore',
            text: 'Programeaza partida in jurul perioadelor majore, care dureaza aproximativ doua ore si indica activitate crescuta.',
        },
        {
            name: 'Confirma vremea si locul',
            text: 'Compara solunarul cu presiunea, vantul, temperatura apei si speciile active din zona aleasa.',
        },
    ];
    const faqs = [
        {
            question: `Care sunt cele mai bune zile de pescuit in ${page.monthName} ${page.year}?`,
            answer: `Cele mai bune zile sunt cele cu rating 4/5 sau 5/5, mai ales cand perioadele majore se suprapun cu rasaritul, apusul sau vreme stabila. In tabelul de pe pagina vezi zilele recomandate pentru ${page.monthName} ${page.year}.`,
        },
        {
            question: `Cum folosesc solunarul pentru ${page.monthName} ${page.year}?`,
            answer: `Alege mai intai zilele cu rating mare, apoi programeaza partida in jurul perioadelor majore. Verifica si presiunea, vantul, temperatura apei si speciile active in zona ta.`,
        },
        {
            question: `Este solunarul suficient pentru o partida reusita?`,
            answer: `Solunarul arata ferestrele cu potential ridicat, dar cele mai bune rezultate apar cand il combini cu vreme stabila, loc bun, nada potrivita si observatii locale.`,
        },
    ];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${baseUrl}/${page.slug}#webpage`,
                url: `${baseUrl}/${page.slug}`,
                name: page.title,
                description: page.description,
                inLanguage: 'ro',
                isPartOf: { '@id': `${baseUrl}/#website` },
                about: page.keywords,
                mainEntity: { '@id': `${baseUrl}/${page.slug}#best-days` },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${baseUrl}/${page.slug}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Calendar Solunar', item: baseUrl },
                    { '@type': 'ListItem', position: 2, name: page.title, item: `${baseUrl}/${page.slug}` },
                ],
            },
            {
                '@type': 'ItemList',
                '@id': `${baseUrl}/${page.slug}#best-days`,
                name: `Cele mai bune zile de pescuit ${page.monthName} ${page.year}`,
                itemListElement: topDays.slice(0, 10).map((day, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: `${roDate(day.date)} - rating ${day.rating}/5`,
                    description: `${day.moonPhase}, ${day.illumination}% iluminare, perioada majora ${day.majorOne}`,
                })),
            },
            {
                '@type': 'Dataset',
                '@id': `${baseUrl}/${page.slug}#solunar-table`,
                name: `Tabel solunar ${page.monthName} ${page.year}`,
                description: `Date solunare zilnice pentru ${page.monthName} ${page.year}: rating, faza lunii, iluminare si perioade majore de pescuit.`,
                url: `${baseUrl}/${page.slug}`,
                inLanguage: 'ro',
                creator: datasetCreator,
                license: datasetLicense,
                variableMeasured: ['rating pescuit', 'faza lunii', 'iluminare luna', 'perioada majora', 'specii active'],
            },
            {
                '@type': 'ItemList',
                '@id': `${baseUrl}/${page.slug}#major-windows`,
                name: `Ferestre majore de pescuit ${page.monthName} ${page.year}`,
                itemListElement: topDays.slice(0, 6).flatMap((day, dayIndex) => {
                    const windows = [
                        day.majorOneStart && day.majorOneEnd ? { start: day.majorOneStart, end: day.majorOneEnd, label: '1' } : null,
                        day.majorTwoStart && day.majorTwoEnd ? { start: day.majorTwoStart, end: day.majorTwoEnd, label: '2' } : null,
                    ].filter(Boolean) as { start: Date; end: Date; label: string }[];

                    return windows.map((window, windowIndex) => ({
                        '@type': 'ListItem',
                        position: dayIndex * 2 + windowIndex + 1,
                        item: {
                            '@type': 'Thing',
                            name: `Perioada majora ${window.label} pescuit - ${roDate(day.date)}`,
                            description: `${day.moonPhase}, rating ${day.rating}/5, ${day.illumination}% iluminare. Fereastra este orientativa si trebuie verificata cu vremea locala.`,
                            additionalProperty: [
                                {
                                    '@type': 'PropertyValue',
                                    name: 'startDate',
                                    value: window.start.toISOString(),
                                },
                                {
                                    '@type': 'PropertyValue',
                                    name: 'endDate',
                                    value: window.end.toISOString(),
                                },
                            ],
                        },
                    }));
                }),
            },
            {
                '@type': 'HowTo',
                '@id': `${baseUrl}/${page.slug}#how-to-use`,
                name: `Cum folosesti solunarul pentru ${page.monthName} ${page.year}`,
                description: `Metoda rapida pentru alegerea unei zile bune de pescuit folosind solunarul ${page.monthName} ${page.year}.`,
                step: howToSteps.map((step, index) => ({
                    '@type': 'HowToStep',
                    position: index + 1,
                    name: step.name,
                    text: step.text,
                })),
            },
            {
                '@type': 'FAQPage',
                '@id': `${baseUrl}/${page.slug}#faq`,
                mainEntity: faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
            },
        ],
    };

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function MonthlySolunarLanding({ page }: { page: MonthlySeoLandingPage }) {
    const days = getDaysInMonth(page);
    const topDays = [...days].sort((a, b) => b.rating - a.rating || b.illumination - a.illumination);
    const currentIndex = monthlySeoLandingPages.findIndex((item) => item.slug === page.slug);
    const previousPage = monthlySeoLandingPages[currentIndex - 1];
    const nextPage = monthlySeoLandingPages[currentIndex + 1];
    const cities = getAllCities().slice(0, 8);
    const annualPage = annualSeoLandingPages.find((item) => item.slug === 'solunar-2026');

    return (
        <div className="relative overflow-hidden pb-20 pt-3 md:pt-8">
            <MonthJsonLd page={page} topDays={topDays} />
            <div className="container-custom px-4 relative z-10">
                <section className="card-panel taste-surface mb-6 md:mb-8 p-5 md:p-8">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                            Calendar pescuit
                        </div>
                        <Link href="/" className="text-sm font-bold text-amber-200 hover:text-white">
                            Solunar azi si live &rarr;
                        </Link>
                    </div>

                    <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
                        {page.title}
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                        {page.description} Pentru cautarea <strong className="text-amber-200">{page.primaryKeyword}</strong>, pagina concentreaza zilele bune, perioadele majore, fazele lunii si recomandarile lunii intr-un singur loc.
                    </p>

                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Context sezon</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-200">{page.seasonContext}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Specii active</p>
                            <p className="mt-2 text-sm font-bold text-amber-100">{page.speciesFocus.join(', ')}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Strategie</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-200">{page.strategy}</p>
                        </div>
                    </div>
                </section>

                {/* Ad: top in-content (eager, below hero) */}
                <AdUnit slotId="2812628769" format="horizontal" className="mb-6" />

                <section className="card-panel taste-surface mb-6 grid gap-5 p-5 md:grid-cols-3 md:p-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Teoria solunara</p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-white">Cum se calculeaza solunarul</h2>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed text-slate-300 md:col-span-2">
                        <p>
                            Solunarul estimeaza activitatea pestilor dupa pozitia Lunii si a Soarelui fata de locul ales. Perioadele majore apar in jurul tranzitului lunar si dureaza de obicei aproximativ doua ore; perioadele minore apar in jurul rasaritului si apusului Lunii si sunt mai scurte.
                        </p>
                        <p>
                            Luna noua si luna plina pot amplifica activitatea, dar nu garanteaza captura. Pentru rezultate mai bune, foloseste tabelul impreuna cu presiunea atmosferica, temperatura apei, vantul si experienta locala.
                        </p>
                    </div>
                </section>

                <section className="mb-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="card-panel taste-surface p-5 md:p-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Top zile recomandate</p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-white">Cele mai bune zile din {page.monthName}</h2>
                        <div className="mt-5 space-y-3">
                            {topDays.slice(0, 6).map((day) => (
                                <div key={day.date.toISOString()} className="rounded-2xl border border-amber-200/15 bg-amber-200/[0.07] p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-bold text-white">{roDate(day.date)}</p>
                                            <p className="text-xs text-slate-400">{day.moonPhase}, {day.illumination}% iluminare</p>
                                        </div>
                                        <div className="rounded-xl bg-amber-300 px-3 py-1 font-mono text-lg font-bold text-slate-950">{day.rating}/5</div>
                                    </div>
                                    <p className="mt-3 text-sm text-amber-100">Major: {day.majorOne}{day.majorTwo !== 'n/a' ? ` si ${day.majorTwo}` : ''}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-panel taste-surface overflow-hidden p-0">
                        <div className="border-b border-white/10 p-5 md:p-6">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Tabel complet</p>
                            <h2 className="mt-2 font-display text-2xl font-bold text-white">Solunar {page.monthName} {page.year} pe zile</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="bg-white/[0.035] text-[11px] uppercase tracking-[0.16em] text-slate-400">
                                    <tr>
                                        <th className="px-4 py-3">Zi</th>
                                        <th className="px-4 py-3">Rating</th>
                                        <th className="px-4 py-3">Luna</th>
                                        <th className="px-4 py-3">Majora 1</th>
                                        <th className="px-4 py-3">Majora 2</th>
                                        <th className="px-4 py-3">Specii</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {days.map((day) => (
                                        <tr key={day.date.toISOString()} className={day.rating >= 4 ? 'bg-amber-300/[0.045]' : ''}>
                                            <td className="px-4 py-3 font-bold text-white">{roDate(day.date)}</td>
                                            <td className="px-4 py-3 font-mono font-bold text-amber-200">{day.rating}/5</td>
                                            <td className="px-4 py-3 text-slate-300">{day.moonPhase} ({day.illumination}%)</td>
                                            <td className="px-4 py-3 font-mono text-slate-200">{day.majorOne}</td>
                                            <td className="px-4 py-3 font-mono text-slate-200">{day.majorTwo}</td>
                                            <td className="px-4 py-3 text-slate-300">{day.activeFish.join(', ') || 'general'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Ad: mid-content rectangle after the full table (lazy) */}
                <LazyAdUnit slotId="6301173988" format="rectangle" className="mb-6" />

                <section className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="card-panel taste-surface p-5 md:p-6 md:col-span-2">
                        <h2 className="font-display text-2xl font-bold text-white">Cum alegi ziua buna de pescuit</h2>
                        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                            <p>
                                Pentru {page.primaryKeyword}, primul filtru este ratingul zilnic. Zilele de 4/5 si 5/5 merita puse in calendar, mai ales daca perioada majora cade dimineata devreme, seara sau noaptea.
                            </p>
                            <p>
                                Al doilea filtru este vremea. O presiune stabila, vant moderat si apa cu temperatura constanta pot transforma o zi buna in partida excelenta. Daca vremea se schimba brusc, pastreaza perioada majora, dar muta locul spre zone mai adapostite.
                            </p>
                            <p>
                                Pentru detalii tactice, vezi si <Link href={page.blogHref} className="text-amber-200 hover:text-white">ghidul complet pentru {page.monthName} {page.year}</Link>.
                            </p>
                        </div>
                    </div>
                    <div className="card-panel taste-surface p-5 md:p-6">
                        <h2 className="font-display text-xl font-bold text-white">Navigare rapida</h2>
                        <div className="mt-4 grid gap-2 text-sm">
                            {annualPage && <Link href={`/${annualPage.slug}`} className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Solunar 2026</Link>}
                            <Link href="/solunar-pescuit-2026" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Solunar pescuit 2026</Link>
                            <Link href="/calendar-pescuit-2026" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Calendar pescuit 2026</Link>
                            <Link href="/azi" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Solunar azi</Link>
                            <Link href="/locuri-pescuit" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Locuri pescuit</Link>
                        </div>
                    </div>
                </section>

                <section className="mb-6 grid gap-4 md:grid-cols-2">
                    {previousPage && (
                        <Link href={`/${previousPage.slug}`} className="interactive-lift card-panel taste-surface p-5 md:p-6">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Luna anterioara</p>
                            <p className="mt-2 font-display text-2xl font-bold text-white">Solunar {previousPage.monthName} {previousPage.year}</p>
                        </Link>
                    )}
                    {nextPage && (
                        <Link href={`/${nextPage.slug}`} className="interactive-lift card-panel taste-surface p-5 md:p-6">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Luna urmatoare</p>
                            <p className="mt-2 font-display text-2xl font-bold text-white">Solunar {nextPage.monthName} {nextPage.year}</p>
                        </Link>
                    )}
                </section>

                {/* Ad: end-of-page (lazy) */}
                <LazyAdUnit slotId="1044977874" format="auto" className="mb-6" />

                <section className="mb-8 card-panel taste-surface p-5 md:p-6">
                    <h2 className="font-display text-2xl font-bold text-white">Solunar pe orase populare</h2>
                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                        {cities.map((city) => (
                            <Link key={city.slug} href={`/${city.slug}`} className="rounded-xl border border-white/10 bg-white/[0.045] p-3 hover:bg-white/[0.075]">
                                <p className="font-bold text-white">{city.name}</p>
                                <p className="text-xs text-slate-400">{city.county}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
