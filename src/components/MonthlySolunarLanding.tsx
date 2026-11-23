import Link from 'next/link';
import { getActiveFish, getMoonPhaseName, getSolunarData, formatTime, type SolunarPeriod } from '@/lib/solunar';
import { formatDayList, formatPhaseMoment, getMonthHighlights, monthBestDaysAnswer, monthMetaDescription, type MonthHighlights } from '@/lib/monthHighlights';
import { middayOf } from '@/lib/sunTimes';
import { getAllCities } from '@/data/cities';
import { monthlySeoLandingPages, getAnnualLandingSlug, type MonthlySeoLandingPage } from '@/data/seoLandingPages';
import { getMonthGuide, MONTH_GUIDE_NOTE_LABEL, type MonthGuide } from '@/data/monthGuides';
import { guideDaysSentence } from '@/lib/monthGuideDays';
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

/** Shown where a day has no second (or no first) period of a kind. */
const NO_PERIOD = '–';

function formatPeriod(period?: SolunarPeriod) {
    return period ? `${formatTime(period.start)} - ${formatTime(period.end)}` : NO_PERIOD;
}

/** "07:10 - 09:10 și 19:35 - 21:35", or just the one that exists. */
function joinPeriods(...periods: string[]) {
    return periods.filter((period) => period !== NO_PERIOD).join(' și ') || NO_PERIOD;
}

function getDaysInMonth(page: MonthlySeoLandingPage) {
    const daysCount = new Date(page.year, page.monthIndex + 1, 0).getDate();

    return Array.from({ length: daysCount }, (_, index) => {
        // Romanian midday, so the page is the same whatever the server's timezone is.
        const date = middayOf({ y: page.year, m: page.monthIndex + 1, d: index + 1 });
        const data = getSolunarData(date, defaultLat, defaultLng);
        const majorOne = data.majorPeriods[0];
        const majorTwo = data.majorPeriods[1];
        // Moonrise comes first in the data; show the two in clock order.
        const [minorOne, minorTwo] = [...data.minorPeriods].sort((a, b) => a.start.getTime() - b.start.getTime());

        return {
            date,
            rating: data.overallRating,
            illumination: data.moonIllumination,
            moonPhase: getMoonPhaseName(data.moonPhase),
            majorOneStart: majorOne?.start,
            majorOneEnd: majorOne?.end,
            majorTwoStart: majorTwo?.start,
            majorTwoEnd: majorTwo?.end,
            majorOne: formatPeriod(majorOne),
            majorTwo: formatPeriod(majorTwo),
            minorOne: formatPeriod(minorOne),
            minorTwo: formatPeriod(minorTwo),
            activeFish: getActiveFish(date, data.moonPhase).slice(0, 4),
        };
    });
}

function MonthGuideSection({ guide, monthName, daysSentence }: { guide: MonthGuide; monthName: string; daysSentence: string }) {
    return (
        <section className="card-panel taste-surface mb-6 p-5 md:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Ghidul lunii {monthName.toLowerCase()}</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">{guide.heading}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">{guide.intro}</p>

            <h3 className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Ce prinzi</h3>
            <ul className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                {guide.species.map((species) => (
                    <li key={species.name} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-relaxed text-slate-300">
                        <span className="font-bold text-amber-100">{species.name}</span>: {species.text}
                    </li>
                ))}
            </ul>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-amber-200/15 bg-amber-200/[0.07] p-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Când ieși la apă</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">{guide.timing}</p>
                    <p className="mt-2 text-sm leading-relaxed text-amber-100">{daysSentence}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{MONTH_GUIDE_NOTE_LABEL[guide.note.kind]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">{guide.note.text}</p>
                </div>
            </div>
        </section>
    );
}

function MonthJsonLd({ page, topDays, highlights }: { page: MonthlySeoLandingPage; topDays: ReturnType<typeof getDaysInMonth>; highlights: MonthHighlights }) {
    const guide = getMonthGuide(page.monthIndex);
    const howToSteps = [
        {
            name: 'Alege zilele cu rating mare',
            text: 'Începe cu zilele de 4/5 sau 5/5 din tabelul lunar: cad în jurul lunii noi și al lunii pline.',
        },
        {
            name: 'Verifică perioadele majore',
            text: 'Programează partida în jurul perioadelor majore, care durează aproximativ două ore și indică activitate crescută.',
        },
        {
            name: 'Confirmă vremea și locul',
            text: 'Compară solunarul cu presiunea, vântul, temperatura apei și speciile active din zona aleasă.',
        },
    ];
    const faqs = [
        {
            question: `Care sunt cele mai bune zile de pescuit în ${page.monthName} ${page.year}?`,
            answer: monthBestDaysAnswer(page.monthName, page.year, highlights),
        },
        {
            question: `Ce pești se prind în ${page.monthName.toLowerCase()}?`,
            answer: guide.species.map((species) => `${species.name}: ${species.text}`).join(' '),
        },
        {
            question: `Cum folosesc solunarul pentru ${page.monthName} ${page.year}?`,
            answer: `Alege mai întâi zilele cu rating mare, apoi programează partida în jurul perioadelor majore. Verifică și presiunea, vântul, temperatura apei și speciile active în zona ta.`,
        },
        {
            question: `Este solunarul suficient pentru o partidă reușită?`,
            answer: `Solunarul arată ferestrele cu potențial ridicat, dar cele mai bune rezultate apar când îl combini cu vreme stabilă, un loc bun, nadă potrivită și observații locale.`,
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
                description: monthMetaDescription(page.monthName, page.year, highlights),
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
                    description: `${day.moonPhase}, ${day.illumination}% iluminare, perioadă majoră ${day.majorOne}`,
                })),
            },
            {
                '@type': 'Dataset',
                '@id': `${baseUrl}/${page.slug}#solunar-table`,
                name: `Tabel solunar ${page.monthName} ${page.year}`,
                description: `Date solunare zilnice pentru ${page.monthName} ${page.year}: rating, faza Lunii, iluminare, perioade majore și minore de pescuit.`,
                url: `${baseUrl}/${page.slug}`,
                inLanguage: 'ro',
                creator: datasetCreator,
                license: datasetLicense,
                variableMeasured: ['rating pescuit', 'faza lunii', 'iluminare luna', 'perioada majora', 'perioada minora', 'specii active'],
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
                            name: `Perioada majoră ${window.label} pescuit - ${roDate(day.date)}`,
                            description: `${day.moonPhase}, rating ${day.rating}/5, ${day.illumination}% iluminare. Fereastra este orientativă și trebuie verificată cu vremea locală.`,
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
                name: `Cum folosești solunarul pentru ${page.monthName} ${page.year}`,
                description: `Metodă rapidă pentru alegerea unei zile bune de pescuit folosind solunarul ${page.monthName} ${page.year}.`,
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
    // The six cards sit in a grid, so they read better in calendar order.
    const topDayCards = topDays.slice(0, 6).sort((a, b) => a.date.getTime() - b.date.getTime());
    const highlights = getMonthHighlights(page.year, page.monthIndex);
    const monthLower = page.monthName.toLowerCase();
    const currentIndex = monthlySeoLandingPages.findIndex((item) => item.slug === page.slug);
    const previousPage = monthlySeoLandingPages[currentIndex - 1];
    const nextPage = monthlySeoLandingPages[currentIndex + 1];
    const cities = getAllCities().slice(0, 8);
    const annualSlug = getAnnualLandingSlug('solunar', page.year);
    const sameMonthOtherYear = monthlySeoLandingPages.find(
        (item) => item.monthIndex === page.monthIndex && item.year !== page.year,
    );

    return (
        <div className="relative overflow-hidden pb-20 pt-3 md:pt-8">
            <MonthJsonLd page={page} topDays={topDays} highlights={highlights} />
            <div className="container-custom relative z-10">
                <section className="card-panel taste-surface mb-6 md:mb-8 p-5 md:p-8">
                    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                            Calendar pescuit
                        </div>
                        <Link href="/" className="text-sm font-bold text-amber-200 hover:text-white">
                            Solunar azi, live &rarr;
                        </Link>
                    </div>

                    <h1 className="max-w-4xl font-editorial text-4xl leading-tight text-white md:text-6xl tracking-tight">
                        {page.title}
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                        {page.description}
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-amber-200/15 bg-amber-200/[0.07] p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Cele mai bune zile din {monthLower} {page.year}</p>
                            <dl className="mt-2 space-y-1.5 text-sm">
                                {highlights.excellentDays.length > 0 && (
                                    <div className="flex gap-3">
                                        <dt className="shrink-0 font-mono font-bold text-amber-200">5/5</dt>
                                        <dd className="font-bold text-white">{formatDayList(highlights.excellentDays)} {monthLower}</dd>
                                    </div>
                                )}
                                {highlights.veryGoodDays.length > 0 && (
                                    <div className="flex gap-3">
                                        <dt className="shrink-0 font-mono font-bold text-amber-200">4/5</dt>
                                        <dd className="text-slate-200">{formatDayList(highlights.veryGoodDays)} {monthLower}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Fazele Lunii</p>
                            <dl className="mt-2 space-y-1.5 text-sm">
                                {highlights.moonPhases.map((row) => (
                                    <div key={row.phase} className="flex gap-3">
                                        <dt className="w-[5.5rem] shrink-0 font-bold text-amber-100">{row.label}</dt>
                                        <dd className="text-slate-200">
                                            {row.dates.map((date) => (
                                                <span key={date.toISOString()} className="block">{formatPhaseMoment(date)}</span>
                                            ))}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                            <p className="mt-2 text-xs text-slate-400">Ora României.</p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
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
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Teoria solunară</p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-white">Cum se calculează solunarul</h2>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed text-slate-300 md:col-span-2">
                        <p>
                            Solunarul estimează activitatea peștilor după poziția Lunii față de locul ales. Perioadele majore apar când Luna trece deasupra sau dedesubtul locului și durează aproximativ două ore; perioadele minore apar la răsăritul și apusul Lunii și durează aproximativ o oră. Orele din tabel sunt calculate pentru București.
                        </p>
                        <p>
                            Ratingul zilei vine din faza Lunii: 5/5 în jurul lunii noi și al lunii pline, 1/5 în jurul pătrarelor. Nu garantează captura; folosește tabelul împreună cu presiunea atmosferică, temperatura apei, vântul și experiența locală.
                        </p>
                    </div>
                </section>

                <section className="card-panel taste-surface mb-6 p-5 md:p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Top zile recomandate</p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-white">Cele mai bune zile din {page.monthName}</h2>
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {topDayCards.map((day) => (
                            <div key={day.date.toISOString()} className="rounded-2xl border border-amber-200/15 bg-amber-200/[0.07] p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-white">{roDate(day.date)}</p>
                                        <p className="text-xs text-slate-400">{day.moonPhase}, {day.illumination}% iluminare</p>
                                    </div>
                                    <div className="rounded-xl bg-amber-300 px-3 py-1 font-mono text-lg font-bold text-slate-950">{day.rating}/5</div>
                                </div>
                                <p className="mt-3 text-sm text-amber-100">Major: {joinPeriods(day.majorOne, day.majorTwo)}</p>
                                <p className="mt-1 text-sm text-slate-300">Minor: {joinPeriods(day.minorOne, day.minorTwo)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <MonthGuideSection
                    guide={getMonthGuide(page.monthIndex)}
                    monthName={page.monthName}
                    daysSentence={guideDaysSentence(page.year, page.monthIndex)}
                />

                <section className="card-panel taste-surface mb-6 overflow-hidden p-0">
                    <div className="border-b border-white/10 p-5 md:p-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Tabel complet</p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-white">Solunar {page.monthName} {page.year} pe zile</h2>
                        <p className="mt-2 text-sm text-slate-400">Perioadele majore țin aproximativ 2 ore, cele minore aproximativ 1 oră. Ora României, calculat pentru București.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1040px] text-left text-sm">
                            <thead className="bg-white/[0.035] text-[11px] uppercase tracking-[0.16em] text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Zi</th>
                                    <th className="px-4 py-3">Rating</th>
                                    <th className="px-4 py-3">Faza Lunii</th>
                                    <th className="px-4 py-3">Majoră 1</th>
                                    <th className="px-4 py-3">Majoră 2</th>
                                    <th className="px-4 py-3">Minoră 1</th>
                                    <th className="px-4 py-3">Minoră 2</th>
                                    <th className="px-4 py-3">Specii</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {days.map((day) => (
                                    <tr key={day.date.toISOString()} className={day.rating >= 4 ? 'bg-amber-300/[0.045]' : ''}>
                                        <td className="whitespace-nowrap px-4 py-3 font-bold text-white">{roDate(day.date)}</td>
                                        <td className="px-4 py-3 font-mono font-bold text-amber-200">{day.rating}/5</td>
                                        <td className="px-4 py-3 text-slate-300">{day.moonPhase} ({day.illumination}%)</td>
                                        <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-200">{day.majorOne}</td>
                                        <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-200">{day.majorTwo}</td>
                                        <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">{day.minorOne}</td>
                                        <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-300">{day.minorTwo}</td>
                                        <td className="px-4 py-3 text-slate-300">{day.activeFish.join(', ') || 'general'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Ad: mid-content rectangle after the full table (lazy) */}
                <LazyAdUnit slotId="6301173988" format="rectangle" className="mb-6" />

                <section className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="card-panel taste-surface p-5 md:p-6 md:col-span-2">
                        <h2 className="font-display text-2xl font-bold text-white">Cum alegi ziua bună de pescuit</h2>
                        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                            <p>
                                Primul filtru este ratingul zilnic. Zilele de 4/5 și 5/5 merită puse în calendar, mai ales dacă perioada majoră cade dimineața devreme, seara sau noaptea.
                            </p>
                            <p>
                                Al doilea filtru este vremea. O presiune stabilă, vânt moderat și apă cu temperatură constantă pot transforma o zi bună într-o partidă excelentă. Dacă vremea se schimbă brusc, păstrează perioada majoră, dar mută locul spre zone mai adăpostite.
                            </p>
                            <p>
                                {page.blogHref ? (
                                    <>Pentru detalii tactice, vezi și <Link href={page.blogHref} className="text-amber-200 hover:text-white">ghidul complet pentru {page.monthName} {page.year}</Link>.</>
                                ) : (
                                    <>Dacă ești la început cu solunarul, citește și <Link href="/blog/ce-este-calendarul-solunar" className="text-amber-200 hover:text-white">ghidul despre cum funcționează calendarul solunar</Link>.</>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="card-panel taste-surface p-5 md:p-6">
                        <h2 className="font-display text-xl font-bold text-white">Navigare rapidă</h2>
                        <div className="mt-4 grid gap-2 text-sm">
                            {annualSlug && <Link href={`/${annualSlug}`} className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Solunar {page.year}</Link>}
                            {sameMonthOtherYear && <Link href={`/${sameMonthOtherYear.slug}`} className="rounded-xl border border-amber-200/20 bg-amber-300/10 px-3 py-2 text-amber-100 hover:text-white">Solunar {sameMonthOtherYear.monthName} {sameMonthOtherYear.year}</Link>}
                            <Link href="/azi" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Solunar azi</Link>
                            <Link href="/locuri-pescuit" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Locuri pescuit</Link>
                        </div>
                    </div>
                </section>

                <section className="mb-6 grid gap-4 md:grid-cols-2">
                    {previousPage && (
                        <Link href={`/${previousPage.slug}`} className="interactive-lift card-panel taste-surface p-5 md:p-6">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Luna anterioară</p>
                            <p className="mt-2 font-display text-2xl font-bold text-white">Solunar {previousPage.monthName} {previousPage.year}</p>
                        </Link>
                    )}
                    {nextPage && (
                        <Link href={`/${nextPage.slug}`} className="interactive-lift card-panel taste-surface p-5 md:p-6">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Luna următoare</p>
                            <p className="mt-2 font-display text-2xl font-bold text-white">Solunar {nextPage.monthName} {nextPage.year}</p>
                        </Link>
                    )}
                </section>

                {/* Ad: end-of-page (lazy) */}
                <LazyAdUnit slotId="1044977874" format="auto" className="mb-6" />

                <section className="mb-8 card-panel taste-surface p-5 md:p-6">
                    <h2 className="font-display text-2xl font-bold text-white">Solunar în orașele mari</h2>
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
