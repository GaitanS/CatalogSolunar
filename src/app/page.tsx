import { getSolunarData, getWeekSolunarData, getMoonPhaseName, formatTime, formatDate, getActiveFish, getMoonage } from '@/lib/solunar';
import { getWeatherData, getWindDirectionString } from '@/lib/weather';
import { getFishingAdvice, getMajorPeriodsDescription, getMinorPeriodsDescription } from '@/lib/advice';
import Moon3DWrapper from '@/components/Moon3DWrapper';
import LocationPicker from '@/components/LocationPicker';
import ActivityGraph from '@/components/ActivityGraph';
import LazyForecast from '@/components/LazyForecast';
import FAQSection from '@/components/FAQSection';
import AdUnit from '@/components/AdUnit';
import LazyAdUnit from '@/components/LazyAdUnit';
import BiteScoreChart from '@/components/BiteScoreChart';
import PressureTrendCard from '@/components/PressureTrendCard';
import CatchJournal from '@/components/CatchJournal';
import GoldenWindowBadge from '@/components/GoldenWindowBadge';
import { getPressureHistory } from '@/lib/pressure';
import { isGoldenPeriod } from '@/lib/biteScore';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { getAllCities } from '@/data/cities';
import { getAllArticles } from '@/data/blogArticles';
import { getAllLocations } from '@/data/fishingLocations';
import { monthlySeoLandingPages } from '@/data/seoLandingPages';

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

export default async function HomePage({ searchParams }: { searchParams: Promise<{ lat?: string; lng?: string; loc?: string }> }) {
    const params = await searchParams;
    const today = new Date();
    const lat = params.lat ? parseFloat(params.lat) : 44.4268;
    const lng = params.lng ? parseFloat(params.lng) : 26.1025;
    const locationName = params.loc || 'București';
    const currentMonth = getMonthTarget(today);
    const nextMonth = getMonthTarget(today, 1);
    const priorityMonth = getPriorityMonth(currentMonth, nextMonth, today);
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
    // Meteo si presiune in paralel — ambele au timeout + fallback propriu.
    const [weather, pressure] = await Promise.all([
        getWeatherData(lat, lng),
        getPressureHistory(lat, lng),
    ]);

    const advice = getFishingAdvice(weather, todayData);
    const majorDesc = getMajorPeriodsDescription(todayData.majorPeriods);
    const minorDesc = getMinorPeriodsDescription(todayData.minorPeriods);

    // Calculate generic bad time (simulation)
    const bestStart = todayData.majorPeriods[0] ? todayData.majorPeriods[0].start : new Date(today.setHours(12, 0, 0, 0));
    const bestEnd = todayData.majorPeriods[0] ? todayData.majorPeriods[0].end : new Date(today.setHours(14, 0, 0, 0));

    const badStart = new Date(bestStart);
    badStart.setHours(badStart.getHours() - 6);
    const badEnd = new Date(badStart);
    badEnd.setHours(badEnd.getHours() + 2);
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
        <div className="relative overflow-hidden pb-20 pt-3 md:pt-8">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: homepageSchemaJson }} />
            <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none bg-[radial-gradient(circle_at_18%_12%,rgba(245,208,111,0.16),transparent_28%),radial-gradient(circle_at_86%_6%,rgba(52,211,153,0.12),transparent_30%)]" />

            <div className="container-custom px-4 relative z-10">

                <section className="mb-6 md:mb-8">
                    <div className="animate-soft-rise card-panel taste-surface relative overflow-hidden p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between border-amber-200/10">
                        <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl pointer-events-none" />
                        <div className="relative text-center sm:text-left">
                            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                                <div className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-100">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
                                    Solunar live
                                </div>
                                <div className="mx-auto w-full max-w-[340px] sm:mx-0 sm:w-auto">
                                    <LocationPicker />
                                </div>
                            </div>

                            <h1 className="mx-auto max-w-[12ch] text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-none tracking-tight text-white sm:mx-0">
                                Calendar Solunar <span className="text-amber-300">{today.getFullYear()}</span>
                            </h1>
                            <p className="mx-auto mt-4 max-w-[62ch] text-sm md:text-base leading-relaxed text-slate-300 sm:mx-0">
                                Solunar {currentMonth.name} {today.getFullYear()} pentru {locationName}. Ore exacte, perioade majore și minore, vreme, faza lunii și activitate pe specii pentru {today.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}.
                            </p>
                        </div>

                        <div className="relative mt-8 md:hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-center">
                            <div className="flex items-center justify-between gap-3">
                                <div className="font-display text-lg font-bold text-white">{formatDate(today)}</div>
                                <div className="px-2 py-0.5 bg-white/[0.045] rounded-full text-[10px] font-mono border border-white/10 text-slate-300">
                                    {locationName}
                                </div>
                            </div>

                            <div className="animate-breathe mx-auto my-4 h-[150px] w-[150px] relative">
                                <Moon3DWrapper phase={getMoonage(today) / 29.53} illumination={todayData.moonIllumination} size={180} />
                            </div>

                            <div>
                                <div className="text-amber-200 font-bold text-base tracking-wide">
                                    {getMoonPhaseName(todayData.moonPhase).startsWith('În') ? `Lună ${getMoonPhaseName(todayData.moonPhase).toLowerCase()}` : getMoonPhaseName(todayData.moonPhase)}
                                </div>
                                <div className="text-slate-400 text-xs mb-3">{todayData.moonIllumination}% iluminare</div>

                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-300/10 border border-amber-200/25 rounded-full mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                                    <span className="text-amber-100 font-bold text-[10px] uppercase tracking-wide">Activitate {todayData.overallRating >= 4 ? 'Excelentă' : todayData.overallRating >= 3 ? 'Bună' : 'Medie'}</span>
                                </div>

                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <svg key={s} className={`w-4 h-4 ${s <= todayData.overallRating ? 'text-amber-300' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="relative mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                            {[
                                { label: 'Presiune', value: `${weather.pressure} hPa`, subtext: 'Stabilă' },
                                { label: 'Temp. aer', value: `${weather.temperature}°C` },
                                { label: 'Temp. apă', value: `${weather.waterTemp}°C` },
                                { label: 'Vânt', value: `${weather.windSpeed} km/h`, subtext: getWindDirectionString(weather.windDirection) },
                                { label: 'Faza lunii', value: `${todayData.moonIllumination}%`, subtext: getMoonPhaseName(todayData.moonPhase) },
                                { label: 'Rating', value: `${todayData.overallRating}/5`, subtext: 'Activitate bună' },
                            ].map((stat, index) => (
                                <div key={stat.label} className="animate-soft-rise rounded-2xl border border-white/10 bg-white/[0.045] p-3 min-h-[86px]" style={{ '--stagger': index + 1 } as CSSProperties}>
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                                    <p className="mt-1 font-mono text-lg font-bold text-white">{stat.value}</p>
                                    {stat.subtext && <p className="mt-1 text-[11px] leading-tight text-amber-100/70">{stat.subtext}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Ad: top in-content banner (eager — above the fold after hero, high viewability) */}
                <AdUnit slotId="2812628769" format="horizontal" className="mb-6" />

                {/* Active Fish Banner (Mobile + Desktop) — species names link to guides */}
                <div className="animate-soft-rise mb-6 taste-surface bg-[#151b25]/76 border border-amber-200/15 rounded-2xl p-3 flex items-center gap-3 overflow-hidden relative" style={{ '--stagger': 2 } as CSSProperties}>
                    <div className="shrink-0 text-amber-100 font-bold text-xs md:text-sm uppercase tracking-wider whitespace-nowrap px-2 border-r border-amber-200/15">
                        Specii Active
                    </div>
                    <div className="flex-1 overflow-hidden relative h-6">
                        <div className="animate-marquee absolute whitespace-nowrap text-slate-200 text-sm font-mono flex gap-8 items-center h-full">
                            {(() => {
                                const activeFish = getActiveFish(today, todayData.moonPhase);
                                const fishSlugMap: Record<string, string> = {
                                    'Crap': '/pescuit-crap', 'Șalău': '/pescuit-salau', 'Somn': '/pescuit-somn',
                                    'Știucă': '/pescuit-stiuca', 'Păstrăv': '/pescuit-pastrav', 'Caras': '/pescuit-caras',
                                    'Plătică': '/pescuit-platica', 'Biban': '/pescuit-biban', 'Lin': '/pescuit-lin',
                                    'Babușcă': '/pescuit-babusca', 'Clean': '/pescuit-clean', 'Fitofag': '/pescuit-fitofag',
                                };
                                return activeFish.length > 0
                                    ? [...activeFish, ...activeFish, ...activeFish].map((fish, i) => {
                                        const href = fishSlugMap[fish];
                                        return href ? (
                                            <Link key={i} href={href} className="flex items-center gap-2 hover:text-amber-100 transition-colors">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                                                {fish}
                                            </Link>
                                        ) : (
                                            <span key={i} className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                                                {fish}
                                            </span>
                                        );
                                    })
                                    : <span className="opacity-70">Activitate generală redusă</span>;
                            })()}
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-8 md:mb-12">

                    {/* Left: Moon Card */}
                    <div className="animate-soft-rise hidden md:flex lg:col-span-4 card-panel taste-surface p-4 md:p-6 flex-col items-center justify-between min-h-[300px] md:min-h-[400px] relative overflow-hidden group" style={{ '--stagger': 3 } as CSSProperties}>
                        {/* Header */}
                        <div className="w-full flex justify-between items-center mb-1 md:mb-2 z-10">
                            <div className="font-display font-bold text-base md:text-xl text-white">{formatDate(today)}</div>
                            <div className="px-2 py-0.5 bg-white/[0.045] rounded-full text-[9px] md:text-xs font-mono border border-white/10 text-slate-300">
                                {locationName}
                            </div>
                        </div>

                        {/* Main Moon */}
                        <div className="animate-breathe w-[120px] h-[120px] md:w-[200px] md:h-[200px] relative z-10 my-1 md:my-2 lg:scale-125 transition-transform duration-700 group-hover:scale-110">
                            <Moon3DWrapper phase={getMoonage(today) / 29.53} illumination={todayData.moonIllumination} size={200} />
                        </div>

                        {/* Status Badge */}
                        <div className="z-10 text-center w-full">
                            <div className="text-amber-200 font-bold mb-0 text-sm md:text-lg tracking-wide">
                                {getMoonPhaseName(todayData.moonPhase).startsWith('În') ? `Lună ${getMoonPhaseName(todayData.moonPhase).toLowerCase()}` : getMoonPhaseName(todayData.moonPhase)}
                            </div>
                            <div className="text-slate-400 text-[10px] md:text-xs mb-2 md:mb-4">{todayData.moonIllumination}% iluminare</div>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 md:px-6 md:py-2 bg-amber-300/10 border border-amber-200/25 rounded-full mb-2 md:mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                                <span className="text-amber-100 font-bold text-[10px] md:text-sm uppercase tracking-wide">Activitate {todayData.overallRating >= 4 ? 'Excelentă' : todayData.overallRating >= 3 ? 'Bună' : 'Medie'}</span>
                            </div>

                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <svg key={s} className={`w-3.5 h-3.5 md:w-5 md:h-5 ${s <= todayData.overallRating ? 'text-amber-300' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-amber-400/5 blur-[80px] rounded-full pointer-events-none" />
                    </div>

                    {/* Right: Unified day plan */}
                    <div className="animate-soft-rise lg:col-span-8 card-panel taste-surface p-4 md:p-6 flex flex-col gap-5" style={{ '--stagger': 4 } as CSSProperties}>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200/75 font-bold">Planul zilei</p>
                                <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-white">Fereastră, grafic și ore</h2>
                            </div>
                            <div className="rounded-2xl border border-amber-200/20 bg-amber-300/10 px-4 py-3">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-amber-100/75 font-bold">Recomandat</p>
                                <p className="mt-1 font-mono text-2xl font-bold text-white">{formatTime(bestStart)} <span className="text-amber-200">→</span> {formatTime(bestEnd)}</p>
                            </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {todayData.majorPeriods.map((period, index) => (
                                <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Majoră {index + 1}</p>
                                    <p className="mt-1 font-mono text-lg font-bold text-white">{formatTime(period.start)} <span className="text-amber-200">→</span> {formatTime(period.end)}</p>
                                    {isGoldenPeriod(period, todayData) && <div className="mt-1"><GoldenWindowBadge /></div>}
                                </div>
                            ))}
                            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Evită</p>
                                <p className="mt-1 font-mono text-lg font-bold text-slate-200">{formatTime(badStart)} <span className="text-slate-500">→</span> {formatTime(badEnd)}</p>
                            </div>
                        </div>

                        <ActivityGraph majorPeriods={todayData.majorPeriods} minorPeriods={todayData.minorPeriods} showHeader={false} />

                        <BiteScoreChart day={todayData} pressureTrend6h={pressure.trend6h} isToday />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Răsărit soare', value: formatTime(todayData.sunrise) },
                                { label: 'Apus soare', value: formatTime(todayData.sunset) },
                                { label: 'Răsărit lună', value: todayData.moonrise ? formatTime(todayData.moonrise) : '--:--' },
                                { label: 'Apus lună', value: todayData.moonset ? formatTime(todayData.moonset) : '--:--' },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                                    <p className="text-[9px] md:text-[10px] uppercase text-slate-400 font-bold tracking-wider">{item.label}</p>
                                    <p className="mt-1 text-base md:text-xl font-mono text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <PressureTrendCard history={pressure} currentPressure={weather.pressure} />
                    </div>
                </div>

                <section className="mb-6 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                    <Link
                        href={priorityMonth.href}
                        className="interactive-lift taste-surface relative overflow-hidden rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 md:p-5 group"
                    >
                        <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-amber-300/10 blur-2xl pointer-events-none" />
                        <div className="relative">
                            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-amber-100/75 font-bold">
                                Căutat acum
                            </p>
                            <h2 className="mt-1 text-xl md:text-2xl font-display font-bold text-white">
                                Solunar {priorityMonth.name} {priorityMonth.year} pentru pescuit
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                Pagina lunii prioritare cu zile bune, perioade majore, faze lunare și recomandări pe specii. Este legătura principală pentru cei care caută calendar pescuit {priorityMonth.name.toLowerCase()} {priorityMonth.year}.
                            </p>
                            <span className="mt-4 inline-flex rounded-xl bg-amber-300 px-4 py-2 text-sm font-bold text-[#111827] transition-colors group-hover:bg-amber-200">
                                Vezi Solunar {priorityMonth.name} {priorityMonth.year} &rarr;
                            </span>
                        </div>
                    </Link>
                    <div className="taste-surface rounded-2xl border border-white/10 bg-white/[0.045] p-4 md:p-5">
                        <h2 className="text-base md:text-lg font-display font-bold text-white">Cautări rapide</h2>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <Link href={currentMonth.href} className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 transition-colors hover:text-white">Solunar {currentMonth.name} {currentMonth.year}</Link>
                            <Link href={priorityMonth.href} className="rounded-xl border border-amber-200/20 bg-amber-300/10 px-3 py-2 text-amber-100 transition-colors hover:text-white">Solunar {priorityMonth.name} {priorityMonth.year}</Link>
                            <Link href="/azi" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 transition-colors hover:text-white">Solunar azi</Link>
                            <Link href="/lunar" className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-slate-300 transition-colors hover:text-white">Faze lunare</Link>
                        </div>
                    </div>
                </section>

                {/* CTA Strip: Solunar Azi */}
                <Link href="/azi" className="interactive-lift taste-surface mb-4 bg-slate-900/70 border border-amber-400/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 group hover:border-amber-300/40 transition-colors block">
                    <div>
                        <p className="text-white font-bold text-sm md:text-base">Solunar Azi — Ore Exacte pentru {today.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })}</p>
                        <p className="text-amber-100/70 text-xs md:text-sm">Pagina dedicată cu scor detaliat, perioade pe ore și sfaturi meteo.</p>
                    </div>
                    <span className="shrink-0 px-5 py-2 bg-amber-300 group-hover:bg-amber-200 text-[#111827] font-bold rounded-xl transition-colors text-sm whitespace-nowrap">
                        Vezi Solunar Azi &rarr;
                    </span>
                </Link>

                <section className="mb-6 grid md:grid-cols-[1.15fr_0.85fr] gap-3">
                    <Link
                        href={nextMonth.href}
                        className="interactive-lift taste-surface relative overflow-hidden rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 md:p-5 group"
                    >
                        <div className="relative">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/80 font-bold mb-1">Calendar pescuit următoarea lună</p>
                            <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                                Solunar {nextMonth.name} {nextMonth.year} - zile bune și ore exacte
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                                Ghid lunar cu perioade majore, perioade minore, faze lunare și specii active, pregătit pentru pescarii care își aleg ieșirile din timp.
                            </p>
                        </div>
                        <span className="relative mt-4 inline-flex text-sm font-bold text-amber-200 group-hover:text-white transition-colors">
                            Vezi calendarul pentru {nextMonth.name} &rarr;
                        </span>
                    </Link>
                    <div className="taste-surface rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
                        <h2 className="text-base md:text-lg font-display font-bold text-white mb-2">
                            Acces rapid
                        </h2>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <Link href="/solunar-2026" className="rounded-xl bg-white/[0.045] px-3 py-2 text-slate-300 border border-white/10 hover:text-white transition-colors">Solunar 2026</Link>
                            <Link href="/solunar-pescuit-2026" className="rounded-xl bg-white/[0.045] px-3 py-2 text-slate-300 border border-white/10 hover:text-white transition-colors">Solunar pescuit</Link>
                            <Link href="/calendar-pescuit-2026" className="rounded-xl bg-white/[0.045] px-3 py-2 text-slate-300 border border-white/10 hover:text-white transition-colors">Calendar pescuit</Link>
                            <Link href="/azi" className="rounded-xl bg-white/[0.045] px-3 py-2 text-slate-300 border border-white/10 hover:text-white transition-colors">Solunar azi</Link>
                        </div>
                    </div>
                </section>

                {/* Forecast Stripes - Lazy loaded */}
                <LazyForecast weekData={weekData} />

                {/* Info Cards Bottom */}
                <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4">Detalii Activitate Pescuit</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 pb-8">
                    {/* Card 1 */}
                    <div className="card-glass taste-surface p-4 min-h-[120px] flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 justify-between group hover:bg-white/[0.075] transition-colors">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-amber-400 text-sm md:text-base">Perioade Majore</h3>
                            <div className="text-amber-500 hidden md:block">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" /></svg>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed md:mt-2 text-right md:text-left max-w-[200px] md:max-w-none">
                            {majorDesc}
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="card-glass taste-surface p-4 min-h-[120px] flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 justify-between group hover:bg-white/[0.075] transition-colors">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-amber-200 text-sm md:text-base">Perioade Minore</h3>
                            <div className="text-amber-300 hidden md:block">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed md:mt-2 text-right md:text-left max-w-[200px] md:max-w-none">
                            {minorDesc}
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="card-glass taste-surface p-4 min-h-[120px] flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 justify-between group hover:bg-white/[0.075] transition-colors">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-white text-sm md:text-base">Sfatul Zilei</h3>
                            <div className="text-amber-300 hidden md:block">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed md:mt-2 text-right md:text-left max-w-[200px] md:max-w-none">
                            {advice}
                        </p>
                    </div>
                </div>

                {/* Ad: in-feed rectangle (lazy — loads as the user scrolls toward the monthly list) */}
                <LazyAdUnit slotId="6301173988" format="rectangle" className="mb-8 md:mb-12" />

                {/* Jurnal de capturi — statistica personala a pescarului, salvata local in browser */}
                <section className="mb-8 md:mb-12 max-w-2xl">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4">Jurnalul Tău de Capturi</h2>
                    <CatchJournal lat={lat} lng={lng} locationName={locationName} />
                </section>

                {/* Solunar pe Luni - target monthly search queries */}
                <section className="mb-8 md:mb-12">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4">Solunar {today.getFullYear()} pe Luni</h2>
                    <Link
                        href={priorityMonth.href}
                        className="mb-3 block rounded-2xl border border-amber-300/25 bg-amber-300/10 p-3 text-sm text-amber-100 transition-colors hover:border-amber-200/50 hover:text-white"
                    >
                        Recomandat acum: <strong>Solunar {priorityMonth.name} {priorityMonth.year}</strong> - calendar pescuit, faze lunare și ore exacte &rarr;
                    </Link>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                        {monthLinks.map((month) => {
                            return (
                                <Link
                                    key={month.slug}
                                    href={month.href}
                                    className={`interactive-lift taste-surface p-2 md:p-3 rounded-xl text-center text-xs md:text-sm font-medium transition-colors ${month.isCurrent
                                        ? 'bg-amber-300/12 border border-amber-200/35 text-amber-100'
                                        : month.isNext
                                            ? 'bg-amber-300/8 border border-amber-200/20 text-amber-100 hover:bg-amber-300/12'
                                            : 'bg-white/[0.045] border border-white/10 hover:bg-white/[0.075] text-slate-300 hover:text-white'
                                    }`}
                                >
                                    <span className="block">Solunar</span>
                                    <span className="block font-bold">{month.name}</span>
                                    {month.isNext && <span className="block text-[9px] text-amber-100/75 mt-0.5">următor</span>}
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Orașe Populare - internal links for city pages */}
                <section className="mb-8 md:mb-12">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4">Calendar Solunar pe Orașe</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                        {getAllCities().slice(0, 12).map((city) => (
                            <Link
                                key={city.slug}
                                href={`/${city.slug}`}
                                className="interactive-lift taste-surface p-3 bg-white/[0.045] border border-white/10 hover:bg-white/[0.075] rounded-xl transition-colors"
                            >
                                <p className="text-white font-bold text-sm">{city.name}</p>
                                <p className="text-slate-400 text-xs">{city.county}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Locuri de Pescuit - internal links */}
                <section className="mb-8 md:mb-12">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4">Locuri de Pescuit Populare</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {getAllLocations().slice(0, 8).map((loc) => (
                            <Link
                                key={loc.slug}
                                href={`/locuri-pescuit/${loc.slug}`}
                                className="card-glass taste-surface p-3 group hover:bg-white/[0.075] transition-colors"
                            >
                                <h3 className="text-sm font-bold text-white group-hover:text-amber-100 transition-colors line-clamp-1">
                                    {loc.name}
                                </h3>
                                <p className="text-slate-400 text-xs">{loc.county} &bull; {loc.fish.slice(0, 2).join(', ')}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link href="/locuri-pescuit" className="text-amber-200 text-sm hover:underline">
                            Vezi toate cele {getAllLocations().length} locuri de pescuit &rarr;
                        </Link>
                    </div>
                </section>

                {/* Articole Populare - internal links for blog */}
                <section className="mb-8 md:mb-12">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-4">Ghiduri de Pescuit</h2>
                    <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                        {getAllArticles().slice(0, 6).map((article) => (
                            <Link
                                key={article.slug}
                                href={`/blog/${article.slug}`}
                                className="card-glass taste-surface p-4 group hover:bg-white/[0.075] transition-colors"
                            >
                                <h3 className="text-sm font-bold text-white group-hover:text-amber-100 transition-colors line-clamp-2 mb-1">
                                    {article.title}
                                </h3>
                                <p className="text-slate-400 text-xs">{article.readTime} min citire</p>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link href="/blog" className="text-amber-200 text-sm hover:underline">
                            Vezi toate ghidurile &rarr;
                        </Link>
                    </div>
                </section>

                {/* SEO Text Content */}
                <section className="mb-8 md:mb-12 card-panel taste-surface p-6 md:p-8">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-3">Ce este Calendarul Solunar?</h2>
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
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
                </section>

                {/* Ad: in-article fluid (lazy — sits between two long-form text blocks) */}
                <LazyAdUnit slotId="1044977874" format="fluid" layout="in-article" className="mb-8 md:mb-12" />

                {/* Cum se citeste solunarul - educational content for SEO depth */}
                <section className="mb-8 md:mb-12 card-panel taste-surface p-6 md:p-8">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-3">Cum se Citește Tabelul Solunar?</h2>
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
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
                <section className="mb-8 md:mb-12 card-panel taste-surface p-6 md:p-8">
                    <h2 className="text-lg md:text-xl font-display font-bold text-white mb-3">Sezon Pescuit {today.getFullYear()} — Când se Deschide?</h2>
                    <div className="text-slate-300 text-sm leading-relaxed space-y-3">
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

                {/* Ad: bottom in-content unit before FAQ (lazy) */}
                <LazyAdUnit slotId="2812628769" format="auto" className="mb-8 md:mb-12" />

                {/* FAQ Section with Schema Markup */}
                <FAQSection />

            </div >
        </div >
    );
}
