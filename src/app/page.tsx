import { getSolunarData, getWeekSolunarData, getMoonPhaseName, formatTime, getActiveFish, getMoonage } from '@/lib/solunar';
import { getWeatherData } from '@/lib/weather';
import { getFishingAdvice, getMajorPeriodsDescription, getMinorPeriodsDescription } from '@/lib/advice';
import Image from 'next/image';
import logo from '@/assets/logo.webp';
import CityPickerPill from '@/components/CityPickerPill';
import LazyForecast from '@/components/LazyForecast';
import FAQSection from '@/components/FAQSection';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import BiteScoreChart from '@/components/BiteScoreChart';
import CatchJournal from '@/components/CatchJournal';
import MoonHero from '@/components/MoonHero';
import ActivityNowCard from '@/components/ActivityNowCard';
import PeriodsTimeline from '@/components/PeriodsTimeline';
import ConditionsCard from '@/components/ConditionsCard';
import SpeciesChips from '@/components/SpeciesChips';
import DayChips from '@/components/DayChips';
import { getPressureHistory } from '@/lib/pressure';
import Link from 'next/link';
import { getAllCities } from '@/data/cities';
import { getAllArticles } from '@/data/blogArticles';
import { getAllLocations } from '@/data/fishingLocations';
import { getAnnualLandingSlug, monthlySeoLandingPages } from '@/data/seoLandingPages';

const monthSlugs = [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
];

function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function getMonthTarget(date: Date, offset = 0) {
    const target = new Date(date.getFullYear(), date.getMonth() + offset, 1);
    const slug = monthSlugs[target.getMonth()];
    const name = capitalize(slug);
    const year = target.getFullYear();
    const landing = monthlySeoLandingPages.find((page) => page.monthIndex === target.getMonth() && page.year === year);
    return {
        slug,
        name,
        year,
        href: landing ? `/${landing.slug}` : `/blog/solunar-${slug}-${year}-ghid`,
    };
}

function getPriorityMonth(currentMonth: ReturnType<typeof getMonthTarget>, nextMonth: ReturnType<typeof getMonthTarget>, date: Date) {
    return date.getDate() >= 24 ? nextMonth : currentMonth;
}

// Ape de pescuit din apropierea oraselor principale (nota de subsol din design)
const CITY_WATERS: Record<string, string> = {
    'București': 'Cernica, Snagov, Lacul Morii',
    'Cluj-Napoca': 'Tarnița, Gilău, Someșul Mic',
    'Timișoara': 'Bega, Surduc',
    'Iași': 'Ciric, Prut',
    'Constanța': 'Siutghiol, Tăbăcărie, Marea Neagră',
    'Brașov': 'Noua, Olt',
    'Galați': 'Dunărea, Brateș',
    'Craiova': 'Jiu, Fântânele',
    'Oradea': 'Crișul Repede',
    'Sibiu': 'Olt, Cibin',
    'Târgu Mureș': 'Mureș',
    'Bacău': 'Siret, Bistrița',
};


// Titlu de sectiune: eticheta mica + H2 editorial.
function SectionTitle({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
    return (
        <div className="mb-4 md:mb-5">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-1.5 font-editorial text-2xl text-white md:text-[28px]">{children}</h2>
        </div>
    );
}

export async function generateMetadata() {
    const date = new Date();
    const currentMonth = getMonthTarget(date);
    const nextMonth = getMonthTarget(date, 1);
    const priorityMonth = getPriorityMonth(currentMonth, nextMonth, date);
    const year = currentMonth.year;

    return {
        title: `Solunar ${priorityMonth.name} ${priorityMonth.year} - Calendar Solunar ${year} Pescuit`,
        description: `Solunar ${priorityMonth.slug} ${priorityMonth.year} și calendar solunar ${year} pentru pescuit: ore exacte, perioade majore și minore, faze lunare, prognoză 14 zile și solunar azi.`,
        alternates: {
            canonical: 'https://calendarsolunar.ro/',
        },
        openGraph: {
            title: `Solunar ${priorityMonth.name} ${priorityMonth.year} — Calendar Solunar ${year}`,
            description: `Calendar solunar pentru pescuit: ${currentMonth.name} ${year}, ${priorityMonth.name} ${priorityMonth.year}, perioade majore, faze lunare și prognoză.`,
            url: 'https://calendarsolunar.ro/',
        },
    };
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ lat?: string; lng?: string; loc?: string; d?: string }> }) {
    const params = await searchParams;
    const today = new Date();
    const lat = params.lat ? parseFloat(params.lat) : 44.4268;
    const lng = params.lng ? parseFloat(params.lng) : 26.1025;
    const locationName = params.loc || 'București';
    // Ziua selectata din chips-urile de zile (0 = azi, max +13)
    const dayOffset = Math.min(13, Math.max(0, parseInt(params.d ?? '0', 10) || 0));
    const selDate = new Date(today);
    selDate.setDate(selDate.getDate() + dayOffset);
    const isToday = dayOffset === 0;
    const currentMonth = getMonthTarget(today);
    const nextMonth = getMonthTarget(today, 1);
    const priorityMonth = getPriorityMonth(currentMonth, nextMonth, today);
    const nextYearHub = getAnnualLandingSlug('solunar', today.getFullYear() + 1);
    const monthLinks = monthSlugs.map((luna, index) => {
        const isCurrent = index === today.getMonth();
        const isNext = index === ((today.getMonth() + 1) % 12);
        const targetYear = today.getFullYear();
        const landing = monthlySeoLandingPages.find((page) => page.monthIndex === index && page.year === targetYear);
        return {
            slug: luna,
            name: capitalize(luna),
            year: targetYear,
            href: landing ? `/${landing.slug}` : `/blog/solunar-${luna}-${targetYear}-ghid`,
            isCurrent,
            isNext,
        };
    });

    // Fetch data
    const todayData = getSolunarData(today, lat, lng);
    const weekData = getWeekSolunarData(today, lat, lng);
    const dayData = isToday ? todayData : getSolunarData(selDate, lat, lng);
    // Meteo si presiune in paralel — ambele au timeout + fallback propriu.
    const [weather, pressure] = await Promise.all([
        getWeatherData(lat, lng),
        getPressureHistory(lat, lng),
    ]);

    const advice = getFishingAdvice(weather, todayData);
    const majorDesc = getMajorPeriodsDescription(todayData.majorPeriods);
    const minorDesc = getMinorPeriodsDescription(todayData.minorPeriods);

    // Chips-urile de zile (14 zile, design Solunar Mobile)
    const DOW3 = ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'];
    const dayChips = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const data = i === 0 ? todayData : (i === dayOffset ? dayData : getSolunarData(d, lat, lng));
        return {
            dow: i === 0 ? 'Azi' : DOW3[d.getDay()],
            num: d.getDate(),
            rating: data.overallRating,
        };
    });
    const locationQuery = [
        params.lat ? `lat=${encodeURIComponent(params.lat)}` : null,
        params.lng ? `lng=${encodeURIComponent(params.lng)}` : null,
        params.loc ? `loc=${encodeURIComponent(params.loc)}` : null,
    ].filter(Boolean).join('&');

    const phaseNameRaw = getMoonPhaseName(dayData.moonPhase);
    const phaseName = phaseNameRaw.startsWith('În') ? `Lună ${phaseNameRaw.toLowerCase()}` : phaseNameRaw;

    // Eticheta de data din antetul aplicatiei (design Solunar Mobile)
    const DOW_FULL = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];
    const dateLabel = `${isToday ? 'Azi · ' : ''}${DOW_FULL[selDate.getDay()]}, ${selDate.getDate()} ${monthSlugs[selDate.getMonth()]}`;
    const cityWaters = CITY_WATERS[locationName];
    const homepageSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": "https://calendarsolunar.ro/#webpage",
                "url": "https://calendarsolunar.ro/",
                "name": `Solunar ${priorityMonth.name} ${priorityMonth.year} - Calendar Solunar ${today.getFullYear()} Pescuit`,
                "description": `Calendar solunar ${today.getFullYear()} pentru pescuit în România, cu solunar ${currentMonth.name} ${currentMonth.year}, solunar ${priorityMonth.name} ${priorityMonth.year}, ore exacte, faze lunare și prognoză 14 zile.`,
                "inLanguage": "ro",
                "isPartOf": {
                    "@id": "https://calendarsolunar.ro/#website"
                },
                "about": [
                    `solunar ${currentMonth.slug} ${currentMonth.year}`,
                    `solunar ${priorityMonth.slug} ${priorityMonth.year}`,
                    "calendar solunar 2026",
                    "solunar pescuit 2026",
                    "ore pescuit",
                    "faze lunare"
                ],
                "mainEntity": {
                    "@id": "https://calendarsolunar.ro/#monthly-solunar-list"
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://calendarsolunar.ro/#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Calendar Solunar",
                        "item": "https://calendarsolunar.ro/"
                    }
                ]
            },
            {
                "@type": "ItemList",
                "@id": "https://calendarsolunar.ro/#monthly-solunar-list",
                "name": `Calendar solunar ${today.getFullYear()} pe luni`,
                "itemListElement": monthLinks.map((month, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": `Solunar ${month.name} ${month.year}`,
                    "url": `https://calendarsolunar.ro${month.href}`
                }))
            }
        ]
    };
    const homepageSchemaJson = JSON.stringify(homepageSchema);

    return (
        <div className="relative pb-12 pt-3 md:pt-4">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homepageSchemaJson }} />

            <div className="container-custom relative z-10">

                {/* Antet de aplicatie: compact pe mobil, titlu editorial pe desktop */}
                <div className="mb-3 flex items-center justify-between gap-3 md:mb-5">
                    <div className="flex items-center gap-2.5">
                        <Image src={logo} alt="Calendar Solunar" width={30} height={30} className="rounded-[9px] object-contain md:hidden" loading="eager" />
                        <div>
                            <div className="text-[15px] font-bold leading-none tracking-[0.01em] text-white md:hidden">Solunar</div>
                            <div className="eyebrow hidden md:block">Solunar · {locationName}</div>
                            <div className="mt-[3px] text-[10.5px] text-[#8C96AB] md:mt-1 md:font-editorial md:text-[32px] md:leading-tight md:text-white">{dateLabel}</div>
                        </div>
                    </div>
                    <CityPickerPill />
                </div>

                {/* Selector de zile */}
                <div className="mb-4 md:mb-6">
                    <DayChips days={dayChips} selected={dayOffset} locationQuery={locationQuery} />
                </div>

                {/* Dashboard: o coloana pe mobil (ordinea din prototip), doua coloane pe desktop.
                    Pe mobil wrapper-ele de coloana sunt display:contents si ordinea vine din order-*. */}
                <div className="mb-4 flex flex-col gap-4 lg:mb-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
                    <div className="contents lg:col-span-5 lg:flex lg:flex-col lg:gap-6">
                        <div className="order-1 lg:order-none lg:dc-card lg:py-5">
                            <MoonHero phaseName={phaseName} illumination={dayData.moonIllumination} moonAgeDays={getMoonage(dayData.date)} />
                        </div>
                        <div className="order-5 grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:order-none lg:grid-cols-2 lg:gap-3">
                            {[
                                { label: 'Răsărit soare', value: formatTime(dayData.sunrise), dot: '#F2CE72' },
                                { label: 'Apus soare', value: formatTime(dayData.sunset), dot: '#E8A15C' },
                                { label: 'Răsărit lună', value: dayData.moonrise ? formatTime(dayData.moonrise) : '—', dot: '#93B4E8' },
                                { label: 'Apus lună', value: dayData.moonset ? formatTime(dayData.moonset) : '—', dot: '#5F718F' },
                            ].map((item) => (
                                <div key={item.label} className="dc-card px-3.5 py-3 lg:px-4 lg:py-3.5">
                                    <p className="flex items-center gap-1.5 text-[10.5px] text-[#8C96AB] lg:text-[11.5px]">
                                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.dot, boxShadow: `0 0 8px ${item.dot}` }} />
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-[17px] font-semibold tabular-nums text-white lg:text-xl">{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <div id="specii" className="order-6 scroll-mt-24 lg:order-none">
                            <ConditionsCard weather={weather} history={pressure} advice={advice} />
                        </div>
                    </div>
                    <div className="contents lg:col-span-7 lg:flex lg:flex-col lg:gap-6">
                        <div className="order-2 lg:order-none">
                            <ActivityNowCard day={dayData} isToday={isToday} />
                        </div>
                        <div className="order-3 lg:order-none">
                            <BiteScoreChart day={dayData} pressureTrend6h={pressure.trend6h} isToday={isToday} />
                        </div>
                        <div className="order-4 lg:order-none">
                            <PeriodsTimeline day={dayData} isToday={isToday} />
                        </div>
                        <div className="order-7 lg:order-none">
                            <SpeciesChips fish={getActiveFish(dayData.date, dayData.moonPhase)} />
                        </div>
                    </div>
                </div>

                {/* Nota de subsol a ecranului-aplicatie */}
                <div className="mb-8 text-center text-[10px] leading-relaxed text-[#4E586F] md:text-[11px]">
                    Calcul astronomic în timp real · precizie ±1 min
                    {cityWaters ? <><br />Ape aproape: {cityWaters}</> : null}
                </div>

                {/* Ad: banner sub ecranul-aplicatie (pastreaza layoutul de design curat sus) */}
                <AdUnit slotId="2812628769" format="horizontal" className="mb-8" />

                {/* SEO hero: H1 + luna cautata acum */}
                <section className="cv-auto mb-4 grid grid-cols-1 gap-4 lg:mb-6 lg:grid-cols-12 lg:gap-6">
                    <div className="card-panel relative overflow-hidden p-6 sm:p-8 lg:col-span-7 lg:p-10">
                        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-amber-200/10 blur-3xl" />
                        <p className="eyebrow relative">Calendar pescuit · România</p>
                        <h1 className="relative mt-3 max-w-[14ch] font-editorial text-[40px] leading-[1.02] tracking-tight text-white md:text-6xl">
                            Calendar Solunar <span className="gold-text">{today.getFullYear()}</span>
                        </h1>
                        <p className="relative mt-5 max-w-[60ch] text-sm leading-relaxed text-slate-300 md:text-base">
                            Solunar {currentMonth.name} {today.getFullYear()} pentru {locationName}. Ore exacte, perioade majore și minore, vreme, faza lunii și activitate pe specii pentru {today.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}.
                        </p>
                    </div>
                    <Link
                        href={priorityMonth.href}
                        className="interactive-lift card-panel group relative flex flex-col justify-between overflow-hidden p-6 sm:p-8 lg:col-span-5"
                        style={{ background: 'linear-gradient(160deg, rgba(242,206,114,0.16), rgba(242,206,114,0.04) 55%, rgba(15,23,42,0.5))' }}
                    >
                        <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-amber-300/15 blur-3xl" />
                        <div className="relative">
                            <p className="eyebrow !text-amber-200/80">Căutat acum</p>
                            <h2 className="mt-2 font-editorial text-2xl leading-snug text-white md:text-[28px]">
                                Solunar {priorityMonth.name} {priorityMonth.year} pentru pescuit
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                Pagina lunii prioritare cu zile bune, perioade majore, faze lunare și recomandări pe specii. Este legătura principală pentru cei care caută calendar pescuit {priorityMonth.name.toLowerCase()} {priorityMonth.year}.
                            </p>
                        </div>
                        <span className="relative mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-b from-[#F7DC92] to-[#E8BC5A] px-4 py-2.5 text-sm font-bold text-[#0b1120] shadow-[0_8px_24px_-8px_rgba(242,206,114,0.6)] transition-transform group-hover:translate-x-0.5">
                            Vezi Solunar {priorityMonth.name} {priorityMonth.year} &rarr;
                        </span>
                    </Link>
                </section>

                {/* CTA Strip: Solunar Azi */}
                <Link href="/azi" className="interactive-lift card-panel group mb-4 flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center lg:mb-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-300/15 text-moon ring-1 ring-amber-200/25 sm:grid">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>
                        </span>
                        <div>
                            <p className="text-sm font-bold text-white md:text-base">Solunar Azi — Ore Exacte pentru {today.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })}</p>
                            <p className="text-xs text-slate-400 md:text-sm">Pagina dedicată cu scor detaliat, perioade pe ore și sfaturi meteo.</p>
                        </div>
                    </div>
                    <span className="glass-chip shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold text-moon transition-colors group-hover:bg-white/10">
                        Vezi Solunar Azi &rarr;
                    </span>
                </Link>

                <section className="cv-auto mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mb-12 lg:grid-cols-3 lg:gap-6">
                    <Link
                        href={nextMonth.href}
                        className="interactive-lift card-panel group flex flex-col justify-between p-5 md:col-span-2 lg:col-span-1 lg:p-6"
                    >
                        <div>
                            <p className="eyebrow">Calendar pescuit următoarea lună</p>
                            <h2 className="mt-2 font-editorial text-xl leading-snug text-white md:text-2xl">
                                Solunar {nextMonth.name} {nextMonth.year} - zile bune și ore exacte
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                Ghid lunar cu perioade majore, perioade minore, faze lunare și specii active, pregătit pentru pescarii care își aleg ieșirile din timp.
                            </p>
                        </div>
                        <span className="mt-4 inline-flex text-sm font-bold text-amber-200 transition-colors group-hover:text-white">
                            Vezi calendarul pentru {nextMonth.name} &rarr;
                        </span>
                    </Link>
                    <div className="card-panel p-5 lg:p-6">
                        <p className="eyebrow">Scurtături</p>
                        <h2 className="mt-2 font-editorial text-xl text-white">Cautări rapide</h2>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <Link href={currentMonth.href} className="glass-chip rounded-xl px-3 py-2.5 text-slate-300 transition-colors hover:text-white">Solunar {currentMonth.name} {currentMonth.year}</Link>
                            <Link href={priorityMonth.href} data-active="true" className="glass-chip rounded-xl px-3 py-2.5 transition-colors hover:text-white">Solunar {priorityMonth.name} {priorityMonth.year}</Link>
                            <Link href="/azi" className="glass-chip rounded-xl px-3 py-2.5 text-slate-300 transition-colors hover:text-white">Solunar azi</Link>
                            <Link href="/lunar" className="glass-chip rounded-xl px-3 py-2.5 text-slate-300 transition-colors hover:text-white">Faze lunare</Link>
                        </div>
                    </div>
                    <div className="card-panel p-5 lg:p-6">
                        <p className="eyebrow">Calendar anual</p>
                        <h2 className="mt-2 font-editorial text-xl text-white">Acces rapid</h2>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <Link href="/solunar-2026" className="glass-chip rounded-xl px-3 py-2.5 text-slate-300 transition-colors hover:text-white">Solunar 2026</Link>
                            <Link href="/solunar-pescuit-2026" className="glass-chip rounded-xl px-3 py-2.5 text-slate-300 transition-colors hover:text-white">Solunar pescuit</Link>
                            <Link href="/calendar-pescuit-2026" className="glass-chip rounded-xl px-3 py-2.5 text-slate-300 transition-colors hover:text-white">Calendar pescuit</Link>
                            <Link href="/azi" className="glass-chip rounded-xl px-3 py-2.5 text-slate-300 transition-colors hover:text-white">Solunar azi</Link>
                        </div>
                    </div>
                </section>

                {/* Forecast Stripes - Lazy loaded */}
                <div id="prognoza" className="cv-auto scroll-mt-24">
                    <LazyForecast weekData={weekData} />
                </div>

                {/* Detalii activitate */}
                <section className="cv-auto mb-8 lg:mb-12">
                    <SectionTitle eyebrow="Ziua de azi">Detalii Activitate Pescuit</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
                        {[
                            { title: 'Perioade Majore', text: majorDesc, tone: 'text-amber-300', icon: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></> },
                            { title: 'Perioade Minore', text: minorDesc, tone: 'text-amber-100', icon: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8v4" /></> },
                            { title: 'Sfatul Zilei', text: advice, tone: 'text-white', icon: <path d="M9.5 17h5M10 20h4M12 4a5 5 0 0 0-3 9c.6.5 1 1.2 1 2h4c0-.8.4-1.5 1-2a5 5 0 0 0-3-9Z" /> },
                        ].map((card) => (
                            <div key={card.title} className="card-glass p-5">
                                <div className="flex items-center gap-3">
                                    <span className="glass-chip grid grid-cols-1 h-9 w-9 place-items-center rounded-xl text-amber-300">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                            {card.icon}
                                        </svg>
                                    </span>
                                    <h3 className={`text-[15px] font-bold ${card.tone}`}>{card.title}</h3>
                                </div>
                                <p className="mt-3 text-[13px] leading-relaxed text-slate-300">{card.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Ad: in-feed rectangle (lazy — loads as the user scrolls toward the monthly list) */}
                <LazyAdUnit slotId="6301173988" format="rectangle" className="mb-8 md:mb-12" />

                <div className="mb-8 grid grid-cols-1 gap-8 lg:mb-12 lg:grid-cols-12 lg:gap-6">
                    {/* Jurnal de capturi — statistica personala a pescarului, salvata local in browser */}
                    <section id="jurnal" className="cv-auto scroll-mt-24 lg:col-span-5">
                        <SectionTitle eyebrow="Statistica ta">Jurnalul Tău de Capturi</SectionTitle>
                        <CatchJournal lat={lat} lng={lng} locationName={locationName} />
                    </section>

                    {/* Solunar pe Luni - target monthly search queries */}
                    <section className="cv-auto lg:col-span-7">
                        <SectionTitle eyebrow="Calendar lunar">Solunar {today.getFullYear()} pe Luni</SectionTitle>
                        <Link
                            href={priorityMonth.href}
                            className="mb-3 block rounded-2xl border border-amber-300/25 bg-amber-300/10 p-3.5 text-sm text-amber-100 transition-colors hover:border-amber-200/50 hover:text-white"
                        >
                            Recomandat acum: <strong>Solunar {priorityMonth.name} {priorityMonth.year}</strong> - calendar pescuit, faze lunare și ore exacte &rarr;
                        </Link>
                        <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-4">
                            {monthLinks.map((month) => (
                                <Link
                                    key={month.slug}
                                    href={month.href}
                                    data-active={month.isCurrent ? 'true' : undefined}
                                    className={`glass-chip interactive-lift rounded-2xl p-2.5 text-center text-xs font-medium md:p-3 md:text-sm ${month.isCurrent
                                        ? ''
                                        : month.isNext
                                            ? 'border-amber-200/20 text-amber-100'
                                            : 'text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <span className="block text-[10px] uppercase tracking-[0.12em] opacity-70 md:text-[11px]">Solunar</span>
                                    <span className="mt-0.5 block font-bold">{month.name}</span>
                                    {month.isNext && <span className="mt-0.5 block text-[9px] text-amber-100/75">următor</span>}
                                </Link>
                            ))}
                        </div>
                        {nextYearHub && (
                            <Link
                                href={`/${nextYearHub}`}
                                className="glass-chip mt-3 block rounded-2xl p-3.5 text-sm text-slate-300 transition-colors hover:text-white"
                            >
                                Planifici deja anul viitor? Vezi <strong className="text-amber-100">Solunar {today.getFullYear() + 1}</strong> pe luni &rarr;
                            </Link>
                        )}
                    </section>
                </div>

                {/* Orașe Populare - internal links for city pages */}
                <section className="cv-auto mb-8 lg:mb-12">
                    <SectionTitle eyebrow="Ore calculate local">Calendar Solunar pe Orașe</SectionTitle>
                    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:grid-cols-6 lg:gap-3">
                        {getAllCities().slice(0, 12).map((city) => (
                            <Link
                                key={city.slug}
                                href={`/${city.slug}`}
                                className="glass-tile interactive-lift group px-3.5 py-3"
                            >
                                <p className="text-sm font-bold text-white transition-colors group-hover:text-amber-100">{city.name}</p>
                                <p className="text-xs text-slate-400">{city.county}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Locuri de Pescuit - internal links */}
                <section className="cv-auto mb-8 lg:mb-12">
                    <SectionTitle eyebrow="Ape din România">Locuri de Pescuit Populare</SectionTitle>
                    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 lg:gap-3">
                        {getAllLocations().slice(0, 8).map((loc) => (
                            <Link
                                key={loc.slug}
                                href={`/locuri-pescuit/${loc.slug}`}
                                className="glass-tile interactive-lift group px-3.5 py-3"
                            >
                                <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-amber-100">
                                    {loc.name}
                                </h3>
                                <p className="text-xs text-slate-400">{loc.county} &bull; {loc.fish.slice(0, 2).join(', ')}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="/locuri-pescuit" className="text-sm text-amber-200 hover:underline">
                            Vezi toate cele {getAllLocations().length} locuri de pescuit &rarr;
                        </Link>
                    </div>
                </section>

                {/* Articole Populare - internal links for blog */}
                <section className="cv-auto mb-8 lg:mb-12">
                    <SectionTitle eyebrow="Învață din teren">Ghiduri de Pescuit</SectionTitle>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:gap-4">
                        {getAllArticles().slice(0, 6).map((article) => (
                            <Link
                                key={article.slug}
                                href={`/blog/${article.slug}`}
                                className="card-glass interactive-lift group flex flex-col justify-between p-5"
                            >
                                <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-amber-100">
                                    {article.title}
                                </h3>
                                <p className="mt-3 text-xs text-slate-400">{article.readTime} min citire &rarr;</p>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href="/blog" className="text-sm text-amber-200 hover:underline">
                            Vezi toate ghidurile &rarr;
                        </Link>
                    </div>
                </section>

                {/* SEO Text Content */}
                <section className="cv-auto card-panel mb-8 p-6 md:p-10 lg:mb-12">
                    <div className="max-w-[75ch]">
                        <p className="eyebrow">Ghid rapid</p>
                        <h2 className="mt-2 mb-4 font-editorial text-2xl text-white md:text-3xl">Ce este Calendarul Solunar?</h2>
                        <div className="space-y-3 text-sm leading-relaxed text-slate-300 md:text-[15px] md:leading-7">
                            <p>
                                Calendarul solunar este un instrument esențial pentru pescari, bazat pe teoria dezvoltată de John Alden Knight în 1926.
                                Acesta calculează perioadele de activitate maximă a peștilor în funcție de pozițiile Soarelui și Lunii.
                            </p>
                            <p>
                                <strong className="text-white">Perioadele majore</strong> durează aproximativ 2 ore și coincid cu tranzitul lunar și cu luna opusă.
                                <strong className="text-white"> Perioadele minore</strong> durează circa 1 oră și apar la răsăritul și apusul lunii.
                                În aceste intervale, peștii sunt semnificativ mai activi și mai predispuși să muște.
                            </p>
                            <p>
                                Calendarul nostru solunar {today.getFullYear()} este actualizat zilnic și calculat pentru coordonatele exacte ale orașului tău din România.
                                Verifică solunar-ul pentru <Link href="/azi" className="text-amber-200 hover:underline">azi</Link>,
                                consultă <Link href="/lunar" className="text-amber-200 hover:underline">fazele lunii</Link>,
                                explorează <Link href="/locuri-pescuit" className="text-amber-200 hover:underline">locuri de pescuit din România</Link>,
                                sau citește <Link href="/blog/ce-este-calendarul-solunar" className="text-amber-200 hover:underline">ghidul complet despre calendarul solunar</Link>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Ad: in-article fluid (lazy — sits between two long-form text blocks) */}
                <LazyAdUnit slotId="1044977874" format="fluid" layout="in-article" className="mb-8 md:mb-12" />

                <div className="mb-8 grid grid-cols-1 gap-4 lg:mb-12 lg:grid-cols-2 lg:gap-6">
                    {/* Cum se citeste solunarul - educational content for SEO depth */}
                    <section className="cv-auto card-panel p-6 md:p-8">
                        <p className="eyebrow">Tabelul solunar</p>
                        <h2 className="mt-2 mb-4 font-editorial text-2xl text-white">Cum se Citește Tabelul Solunar?</h2>
                        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
                            <p>
                                Pentru a folosi eficient calendarul solunar, trebuie să înțelegi cele 3 elemente cheie:
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-2">
                                <li><strong className="text-amber-400">Perioadele majore</strong> — durează ~2 ore, sunt cele mai intense momente de activitate. Coincid cu tranzitul lunar (luna direct deasupra sau sub orizont). Prioritizează aceste ferestre!</li>
                                <li><strong className="text-amber-200">Perioadele minore</strong> — durează ~1 oră, activitate bună dar mai puțin intensă. Apar la răsăritul și apusul lunii.</li>
                                <li><strong className="text-white">Rating-ul zilnic</strong> (1-5 stele) — combină faza lunii, durata perioadelor și alinierea cu răsăritul/apusul soarelui. Zilele cu 4-5 stele sunt optime.</li>
                            </ul>
                            <p>
                                <strong className="text-white">Sfat pro:</strong> Cel mai bun moment de pescuit este când o <em>perioadă majoră solunar</em> coincide cu răsăritul sau apusul soarelui.
                                În aceste momente, activitatea peștilor poate fi de 3-4 ori mai mare decât în mod normal. Solunarul este corect în aproximativ 60-70% din cazuri,
                                dar combinat cu presiune atmosferică stabilă (1013-1025 hPa) și vânt slab, rata de succes crește considerabil.
                            </p>
                        </div>
                    </section>

                    {/* Sezon Pescuit - target seasonal queries */}
                    <section className="cv-auto card-panel p-6 md:p-8">
                        <p className="eyebrow">Reglementări</p>
                        <h2 className="mt-2 mb-4 font-editorial text-2xl text-white">Sezon Pescuit {today.getFullYear()} — Când se Deschide?</h2>
                        <div className="space-y-3 text-sm leading-relaxed text-slate-300">
                            <p>
                                <strong className="text-white">Sezonul de pescuit {today.getFullYear()}</strong> este deschis tot anul pentru speciile comune (crap, caras, plătică, babușcă).
                                Prohibiția generală pentru răpitori (șalău, știucă, somn) se aplică de obicei între 15 aprilie - 15 iunie,
                                iar pentru păstrăv între 1 octombrie - 30 aprilie. Vezi calendarul complet în <Link href="/blog/prohibitie-pescuit-2026" className="text-amber-200 hover:underline">ghidul prohibiției la pescuit {today.getFullYear()}</Link>.
                            </p>
                            <p>
                                Pentru cele mai bune rezultate, combină informațiile despre <strong className="text-white">sezonul de pescuit</strong> cu
                                calendarul solunar. Perioadele majore și minore din tabelul solunar îți arată orele exacte când peștii sunt cei mai activi,
                                indiferent de sezon. Consultă <Link href="/blog/cele-mai-bune-ore-pescuit-2026" className="text-amber-200 hover:underline">ghidul orelor optime de pescuit {today.getFullYear()}</Link> pentru
                                detalii complete pe luni și specii.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Ad: bottom in-content unit before FAQ (lazy) */}
                <LazyAdUnit slotId="2812628769" format="auto" className="mb-8 md:mb-12" />

                {/* FAQ Section with Schema Markup */}
                <div className="cv-auto mx-auto max-w-4xl"><FAQSection /></div>

            </div>
        </div>
    );
}
