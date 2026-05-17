import Link from 'next/link';
import { getMoonPhaseName, getSolunarData, formatTime } from '@/lib/solunar';
import { annualSeoLandingPages, monthlySeoLandingPages, type AnnualSeoLandingPage } from '@/data/seoLandingPages';

const baseUrl = 'https://calendarsolunar.ro';
const defaultLat = 44.4268;
const defaultLng = 26.1025;

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

function shortDate(date: Date) {
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' });
}

function AnnualJsonLd({ page }: { page: AnnualSeoLandingPage }) {
    const howToSteps = [
        {
            name: 'Alege luna de pescuit',
            text: `Porneste de la calendarul ${page.year} pe luni si alege luna potrivita pentru specie si sezon.`,
        },
        {
            name: 'Verifica zilele recomandate',
            text: 'Deschide pagina lunii si compara zilele cu rating mare, fazele lunii si perioadele majore.',
        },
        {
            name: 'Planifica partida dupa vreme',
            text: 'Confirma presiunea, vantul, temperatura apei si regulile locale inainte de plecare.',
        },
    ];
    const faqs = [
        {
            question: `Ce inseamna ${page.primaryKeyword}?`,
            answer: `${page.primaryKeyword} este un calendar care estimeaza zilele si orele bune de pescuit in functie de fazele lunii, perioadele majore, perioadele minore si sezon.`,
        },
        {
            question: `Care sunt cele mai bune luni de pescuit in ${page.year}?`,
            answer: `In general, lunile mai, iunie, septembrie si octombrie ofera multe ferestre bune, dar rezultatul depinde de specie, vreme si locul ales.`,
        },
        {
            question: `Cum aleg o zi buna din calendarul de pescuit ${page.year}?`,
            answer: `Alege o luna, verifica zilele cu rating mare, apoi programeaza partida in jurul perioadelor majore. Confirma si conditiile meteo inainte de plecare.`,
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
                itemListElement: monthlySeoLandingPages.map((month, index) => ({
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
                description: `Index anual cu pagini lunare, zile recomandate, faze lunare si perioade majore pentru pescuit in ${page.year}.`,
                url: `${baseUrl}/${page.slug}`,
                inLanguage: 'ro',
                variableMeasured: ['luna', 'zile bune pescuit', 'rating solunar', 'faza lunii', 'perioade majore'],
            },
            {
                '@type': 'HowTo',
                '@id': `${baseUrl}/${page.slug}#how-to-use`,
                name: `Cum folosesti ${page.primaryKeyword}`,
                description: `Metoda simpla pentru planificarea unei partide folosind calendarul solunar ${page.year}.`,
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
    const monthSummaries = monthlySeoLandingPages.map((month) => ({
        month,
        summary: getMonthSummary(month.monthIndex, month.year),
    }));
    const heroMonths = monthSummaries
        .filter(({ month }) => ['Mai', 'Iunie', 'Septembrie', 'Octombrie'].includes(month.monthName))
        .slice(0, 4);

    return (
        <div className="relative overflow-hidden pb-20 pt-3 md:pt-8">
            <AnnualJsonLd page={page} />
            <div className="container-custom px-4 relative z-10">
                <section className="card-panel taste-surface mb-6 p-5 md:p-8">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                        Ghid anual
                    </div>
                    <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
                        {page.title}
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
                        {page.description} Pagina este construita pentru cautarea <strong className="text-amber-200">{page.primaryKeyword}</strong> si trimite direct catre fiecare luna din 2026.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Link href="/solunar-mai-2026" className="rounded-xl bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950">Vezi luna Mai</Link>
                        {page.slug !== 'solunar-pescuit-2026' && (
                            <Link href="/solunar-pescuit-2026" className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-slate-200 hover:text-white">Solunar pescuit</Link>
                        )}
                        <Link href="/azi" className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-slate-200 hover:text-white">Solunar azi</Link>
                        <Link href="/locuri-pescuit" className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-bold text-slate-200 hover:text-white">Locuri pescuit</Link>
                    </div>
                </section>

                <section className="card-panel taste-surface mb-6 grid gap-5 p-5 md:grid-cols-3 md:p-6">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Context solunar</p>
                        <h2 className="mt-2 font-display text-2xl font-bold text-white">Ce arata calendarul solunar 2026</h2>
                    </div>
                    <div className="space-y-3 text-sm leading-relaxed text-slate-300 md:col-span-2">
                        <p>
                            Calendarul solunar ordoneaza zilele dupa influenta Lunii si a Soarelui asupra activitatii pestilor. Perioadele majore marcheaza intervale de aproximativ doua ore in care sansele cresc, iar perioadele minore sunt ferestre mai scurte, utile cand se suprapun cu rasaritul sau apusul.
                        </p>
                        <p>
                            Pentru 2026, foloseste pagina anuala ca hub si intra pe luna dorita pentru tabelul complet. Solunarul este un instrument de planificare, nu o garantie; vremea, presiunea, temperatura apei si locul ales raman decisive.
                        </p>
                    </div>
                </section>

                <section className="mb-6 grid gap-4 md:grid-cols-4">
                    {heroMonths.map(({ month, summary }) => (
                        <Link key={month.slug} href={`/${month.slug}`} className="interactive-lift card-panel taste-surface p-5">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200/80">Luna recomandata</p>
                            <h2 className="mt-2 font-display text-2xl font-bold text-white">{month.monthName}</h2>
                            <p className="mt-2 text-sm text-slate-300">{summary.excellentDays} zile cu rating 4/5 sau 5/5</p>
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
                                        <span className="rounded-full bg-amber-300/15 px-2 py-1 text-xs font-bold text-amber-100">{summary.excellentDays} bune</span>
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

                <section className="mb-6 grid gap-4 md:grid-cols-2">
                    <div className="card-panel taste-surface p-5 md:p-6">
                        <h2 className="font-display text-2xl font-bold text-white">De ce conteaza solunarul in pescuit</h2>
                        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
                            <p>
                                Calendarul solunar nu inlocuieste experienta de pe apa, dar iti arata ferestrele in care pestii tind sa fie mai activi. Pentru 2026, paginile pe luni iti dau o ruta clara: alegi luna, verifici zilele cu rating mare, apoi alegi ora majora.
                            </p>
                            <p>
                                Cele mai puternice partide apar cand solunarul bun se suprapune cu presiune stabila, apa potrivita pentru specie si un loc productiv.
                            </p>
                        </div>
                    </div>
                    <div className="card-panel taste-surface p-5 md:p-6">
                        <h2 className="font-display text-2xl font-bold text-white">Pagini utile pentru planificare</h2>
                        <div className="mt-4 grid gap-2 text-sm">
                            <Link href="/solunar-2026" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Solunar 2026</Link>
                            <Link href="/solunar-pescuit-2026" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Solunar pescuit 2026</Link>
                            <Link href="/calendar-pescuit-2026" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Calendar pescuit 2026</Link>
                            <Link href="/blog/cele-mai-bune-ore-pescuit-2026" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Cele mai bune ore de pescuit</Link>
                            <Link href="/lunar" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 hover:text-white">Faze lunare</Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
