import Link from 'next/link';
import { getMoonPhaseName, getSolunarData, formatTime } from '@/lib/solunar';
import { annualSeoLandingPages, getMonthlyLandingsForYear, type AnnualSeoLandingPage } from '@/data/seoLandingPages';
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

function getMonthSummary(monthIndex: number, year: number) {
    const daysCount = new Date(year, monthIndex + 1, 0).getDate();
    const days = Array.from({ length: daysCount }, (_, index) => {
        const date = new Date(year, monthIndex, index + 1, 12, 0, 0);
        const data = getSolunarData(date, defaultLat, defaultLng);
        return { date, data };
    });
    const bestDays = [...days]
        .sort((a, b) => b.data.overallRating - a.data.overallRating || b.data.moonIllumination - a.data.moonIllumination)
        .slice(0, 3);
    const excellentDays = days.filter((day) => day.data.overallRating >= 4).length;

    return { bestDays, excellentDays };
}

/** "1 zi", "5 zile", "20 de zile". */
function countDays(n: number) {
    if (n === 1) return '1 zi';
    return `${n} ${n % 100 >= 20 || (n > 0 && n % 100 === 0) ? 'de ' : ''}zile`;
}

function shortDate(date: Date) {
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

function AnnualJsonLd({ page }: { page: AnnualSeoLandingPage }) {
    const howToSteps = [
        {
            name: 'Alege luna de pescuit',
            text: `Pornește de la calendarul ${page.year} pe luni și alege luna potrivită pentru specie și sezon.`,
        },
        {
            name: 'Verifică zilele recomandate',
            text: 'Deschide pagina lunii și compară zilele cu rating mare, fazele lunii și perioadele majore.',
        },
        {
            name: 'Planifică partida după vreme',
            text: 'Confirmă presiunea, vântul, temperatura apei și regulile locale înainte de plecare.',
        },
    ];
    const faqs = [
        {
            question: `Ce înseamnă ${page.primaryKeyword}?`,
            answer: `Este un calendar care estimează zilele și orele bune de pescuit în funcție de fazele Lunii, perioadele majore, perioadele minore și sezon.`,
        },
        {
            question: `Care sunt cele mai bune luni de pescuit în ${page.year}?`,
            answer: `În general, lunile mai, iunie, septembrie și octombrie oferă multe ferestre bune, dar rezultatul depinde de specie, vreme și locul ales.`,
        },
        {
            question: `Cum aleg o zi bună din calendarul de pescuit ${page.year}?`,
            answer: `Alege o lună, verifică zilele cu rating mare, apoi programează partida în jurul perioadelor majore. Confirmă și condițiile meteo înainte de plecare.`,
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
                mainEntity: { '@id': `${baseUrl}/${page.slug}#months` },
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
                '@id': `${baseUrl}/${page.slug}#months`,
                name: `${page.primaryKeyword} pe luni`,
                itemListElement: getMonthlyLandingsForYear(page.year).map((month, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: `Solunar ${month.monthName} ${month.year}`,
                    url: `${baseUrl}/${month.slug}`,
                })),
            },
            {
                '@type': 'Dataset',
                '@id': `${baseUrl}/${page.slug}#annual-solunar-dataset`,
                name: `${page.primaryKeyword} pe luni`,
                description: `Index anual cu pagini lunare, zile recomandate, faze lunare și perioade majore pentru pescuit în ${page.year}.`,
                url: `${baseUrl}/${page.slug}`,
                inLanguage: 'ro',
                creator: datasetCreator,
                license: datasetLicense,
                variableMeasured: ['luna', 'zile bune pescuit', 'rating solunar', 'faza lunii', 'perioade majore'],
            },
            {
                '@type': 'HowTo',
                '@id': `${baseUrl}/${page.slug}#how-to-use`,
                name: `Cum folosești ${page.primaryKeyword}`,
                description: `Metodă simplă pentru planificarea unei partide folosind calendarul solunar ${page.year}.`,
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

export default function AnnualSolunarLanding({ page }: { page: AnnualSeoLandingPage }) {
    const yearMonths = getMonthlyLandingsForYear(page.year);
    const monthSummaries = yearMonths.map((month) => ({
        month,
        summary: getMonthSummary(month.monthIndex, month.year),
    }));
    const now = new Date();
    const curIdx = now.getMonth();
    const isFutureYear = page.year > now.getFullYear();
    // A future year's hub starts with its first months; the current year's hub
    // surfaces the current month first, then the upcoming ones.
    const heroMonths = isFutureYear
        ? monthSummaries.slice(0, 4)
        : [...monthSummaries]
            .sort((a, b) => ((a.month.monthIndex - curIdx + 12) % 12) - ((b.month.monthIndex - curIdx + 12) % 12))
            .slice(0, 4);
    // Primary CTA: the month people search now (next month from the 24th),
    // or January when the hub is for a year that has not started yet.
    const target = new Date(now.getFullYear(), curIdx + (now.getDate() >= 24 ? 1 : 0), 1);
    const priorityLanding = (isFutureYear ? undefined : yearMonths.find((m) => m.monthIndex === target.getMonth()))
        ?? yearMonths[0];
    const otherYearHub = annualSeoLandingPages.find((p) => p.year !== page.year && p.slug === page.slug.replace(String(page.year), String(p.year)));

    return (
        <div className="relative overflow-hidden pb-20 pt-3 md:pt-8">
            <AnnualJsonLd page={page} />
            <div className="container-custom relative z-10">
                <section className="card-panel taste-surface mb-6 p-5 md:p-8">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                        Ghid anual
                    </div>
                    <h1 className="mt-5 max-w-4xl font-editorial text-4xl leading-tight text-white md:text-6xl tracking-tight">
                        {page.title}
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                        {page.description} Alege luna de mai jos pentru tabelul zi cu zi.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Link href={`/${priorityLanding.slug}`} className="rounded-xl bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950">Vezi luna {priorityLanding.monthName}</Link>
                        {otherYearHub && (
                            <Link href={`/${otherYearHub.slug}`} className="rounded-xl border border-amber-200/20 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100 hover:text-white">{otherYearHub.primaryKeyword.charAt(0).toUpperCase() + otherYearHub.primaryKeyword.slice(1)} &rarr;</Link>
                        )}
                        <Link href="/azi" className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-slate-200 hover:text-white">Solunar azi</Link>
                        <Link href="/locuri-pescuit" className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-slate-200 hover:text-white">Locuri pescuit</Link>
                    </div>
                </section>

                {/* Ad: top in-content (eager, below hero) */}
                <AdUnit slotId="2812628769" format="horizontal" className="mb-6" />

                <section className="card-panel taste-surface mb-6 grid gap-5 p-5 md:grid-cols-3 md:p-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Context solunar</p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-white">Ce arată calendarul solunar {page.year}</h2>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed text-slate-300 md:col-span-2">
                        <p>
                            Calendarul solunar notează zilele după poziția Lunii față de Soare. Cele mai bune zile cad în jurul lunii noi și al lunii pline, cele mai slabe în jurul pătrarelor. Perioadele majore sunt intervale de aproximativ două ore în jurul momentului în care Luna trece deasupra sau dedesubtul locului, iar perioadele minore sunt ferestre de aproximativ o oră la răsăritul și apusul Lunii, utile mai ales când se suprapun cu zorii sau amurgul.
                        </p>
                        <p>
                            Orele de mai jos sunt calculate pentru București; în vestul țării perioadele vin cu până la o jumătate de oră mai târziu. Solunarul este un instrument de planificare, nu o garanție: vremea, presiunea, temperatura apei și locul ales rămân decisive.
                        </p>
                    </div>
                </section>

                <section className="mb-6 grid gap-4 md:grid-cols-4">
                    {heroMonths.map(({ month, summary }) => (
                        <Link key={month.slug} href={`/${month.slug}`} className="interactive-lift card-panel taste-surface p-5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Solunar {month.year}</p>
                            <h2 className="mt-2 font-display text-2xl font-bold text-white">{month.monthName}</h2>
                            <p className="mt-2 text-sm text-slate-300">{countDays(summary.excellentDays)} cu rating 4/5 sau 5/5</p>
                            <p className="mt-4 text-xs text-amber-100">Top: {summary.bestDays.map(({ date }) => shortDate(date)).join(', ')}</p>
                        </Link>
                    ))}
                </section>

                <section className="card-panel taste-surface mb-6 overflow-hidden p-0">
                    <div className="border-b border-white/10 p-5 md:p-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Calendar complet</p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-white">{page.primaryKeyword} pe luni</h2>
                    </div>
                    <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                        {monthSummaries.map(({ month, summary }) => {
                            const firstBest = summary.bestDays[0];
                            const firstMajor = firstBest?.data.majorPeriods[0];
                            return (
                                <Link key={month.slug} href={`/${month.slug}`} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 hover:bg-white/[0.075]">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-display text-xl font-bold text-white">Solunar {month.monthName}</p>
                                            <p className="mt-1 text-xs text-slate-400">{month.seasonContext}</p>
                                        </div>
                                        <span className="rounded-full bg-amber-300/15 px-2 py-1 text-xs font-bold text-amber-100">{countDays(summary.excellentDays)} bune</span>
                                    </div>
                                    {firstBest && (
                                        <div className="mt-4 rounded-xl border border-amber-200/15 bg-amber-200/[0.06] p-3">
                                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-200/80">Zi top</p>
                                            <p className="mt-1 font-mono text-lg font-bold text-white">
                                                {shortDate(firstBest.date)} · {firstBest.data.overallRating}/5
                                            </p>
                                            <p className="text-xs text-slate-300">
                                                {getMoonPhaseName(firstBest.data.moonPhase)}, major {firstMajor ? `${formatTime(firstMajor.start)} - ${formatTime(firstMajor.end)}` : 'n/a'}
                                            </p>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Ad: mid-content rectangle after the full month grid (lazy) */}
                <LazyAdUnit slotId="6301173988" format="rectangle" className="mb-6" />

                <section className="mb-6 grid gap-4 md:grid-cols-2">
                    <div className="card-panel taste-surface p-5 md:p-6">
                        <h2 className="font-display text-2xl font-bold text-white">De ce contează solunarul în pescuit</h2>
                        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                            <p>
                                Calendarul solunar nu înlocuiește experiența de pe apă, dar îți arată ferestrele în care peștii tind să fie mai activi. Pentru {page.year}, paginile pe luni îți dau o rută clară: alegi luna, verifici zilele cu rating mare, apoi alegi ora majoră.
                            </p>
                            <p>
                                Cele mai bune partide apar când un solunar bun se suprapune cu presiune stabilă, apă potrivită pentru specie și un loc productiv.
                            </p>
                        </div>
                    </div>
                    <div className="card-panel taste-surface p-5 md:p-6">
                        <h2 className="font-display text-2xl font-bold text-white">Pagini utile pentru planificare</h2>
                        <div className="mt-4 grid gap-2 text-sm">
                            {otherYearHub && (
                                <Link href={`/${otherYearHub.slug}`} className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">{otherYearHub.primaryKeyword.charAt(0).toUpperCase() + otherYearHub.primaryKeyword.slice(1)}</Link>
                            )}
                            <Link href="/blog/cele-mai-bune-ore-pescuit-2026" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Cele mai bune ore de pescuit</Link>
                            <Link href="/lunar" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Faze lunare</Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
