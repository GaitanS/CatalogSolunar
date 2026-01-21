import { getSolunarData, getWeekSolunarData, getMoonPhaseName, formatTime, formatDate, getActiveFish, getMoonage } from '@/lib/solunar';
import { getWeatherData, getWindDirectionString } from '@/lib/weather';
import { getFishingAdvice, getMajorPeriodsDescription, getMinorPeriodsDescription } from '@/lib/advice';
import Moon3DWrapper from '@/components/Moon3DWrapper';
import LocationPicker from '@/components/LocationPicker';
import ActivityGraph from '@/components/ActivityGraph';
import ForecastCarousel from '@/components/ForecastCarousel';
import QuickStatCard from '@/components/QuickStatCard';
import ForecastCard from '@/components/ForecastCard';
import ScheduleCard from '@/components/ScheduleCard';
import AdUnit from '@/components/AdUnit';


export async function generateMetadata({ searchParams }: { searchParams: Promise<{ loc?: string }> }) {
    const params = await searchParams;
    const locationName = params.loc || 'București';
    const date = new Date();
    const monthName = date.toLocaleDateString('ro-RO', { month: 'long' });
    const year = date.getFullYear();
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return {
        title: `Solunar ${capitalizedMonth} ${year} ${locationName} - Pescuit pe Ore`,
        description: `Vezi Solunar ${capitalizedMonth} ${year} pentru ${locationName}. Activitate majoră și minoră detaliată, prognoză pescuit 14 zile și fazele lunii actualizate.`,
        alternates: {
            canonical: 'https://calendarsolunar.ro',
        }
    };
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ lat?: string; lng?: string; loc?: string }> }) {
    const params = await searchParams;
    const today = new Date();
    const lat = params.lat ? parseFloat(params.lat) : 44.4268;
    const lng = params.lng ? parseFloat(params.lng) : 26.1025;
    const locationName = params.loc || 'București';

    // Fetch data
    const todayData = getSolunarData(today, lat, lng);
    const weekData = getWeekSolunarData(today, lat, lng);
    const weather = await getWeatherData(lat, lng);

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

    return (
        <div className="pb-20 pt-4 md:pt-8 relative">
            {/* Background is now handled by layout.tsx */}

            <div className="container-custom px-4 relative z-10">

                {/* Header / Location */}
                <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between mb-4 md:mb-8 gap-3 md:gap-4 text-center md:text-left relative z-50">
                    <div>
                        <h1 className="text-2xl md:text-5xl font-display font-bold text-white mb-1 drop-shadow-lg">
                            Solunar <span className="text-amber-400">{locationName}</span>
                        </h1>
                        <p className="text-night-400 text-xs md:text-base">
                            {today.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="scale-90 md:scale-100 origin-center md:origin-right">
                        <LocationPicker />
                    </div>
                </div>

                {/* Top Ad (Mobile/Desktop Leaderboard) */}
                <AdUnit
                    slotId="1234567890" // REPLACE WITH ACTUAL SLOT ID
                    format="horizontal"
                    className="min-h-[90px]"
                    label="Reclamă"
                />

                {/* Mobile Quick Stats Slider (Visible only on mobile/tablet) */}
                <div className="lg:hidden mb-6">
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-4 px-4">
                        {/* Presiune */}
                        <QuickStatCard
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            label="Presiune"
                            value={`${weather.pressure} hPa`}
                            subtext="Stabilă"
                            colorClass="text-amber-400"
                        />
                        {/* Temp Aer */}
                        <QuickStatCard
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>}
                            label="Temp. Aer"
                            value={`${weather.temperature}°C`}
                            colorClass="text-orange-400"
                        />
                        {/* Temp Apa */}
                        <QuickStatCard
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            label="Temp. Apă"
                            value={`${weather.waterTemp}°C`}
                            colorClass="text-cyan-400"
                        />
                        {/* Vant */}
                        <QuickStatCard
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            label="Vânt"
                            value={`${weather.windSpeed} km/h`}
                            subtext={getWindDirectionString(weather.windDirection)}
                            colorClass="text-blue-400"
                        />
                        {/* Faza Lunii */}
                        <QuickStatCard
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                            label="Faza Lunii"
                            value={`${todayData.moonIllumination}%`}
                            subtext={getMoonPhaseName(todayData.moonPhase)}
                            colorClass="text-indigo-300"
                        />
                        {/* Rating */}
                        <QuickStatCard
                            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                            label="Rating"
                            value={`${todayData.overallRating}/5`}
                            subtext="Activitate Bună"
                            colorClass="text-amber-300"
                        />
                    </div>
                </div>

                {/* Active Fish Banner (Mobile + Desktop) */}
                <div className="mb-6 bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3 overflow-hidden relative">
                    <div className="shrink-0 text-emerald-400 font-bold text-xs md:text-sm uppercase tracking-wider whitespace-nowrap px-2 border-r border-emerald-500/30">
                        Specii Active
                    </div>
                    <div className="flex-1 overflow-hidden relative h-6">
                        <div className="animate-marquee absolute whitespace-nowrap text-emerald-200 text-sm font-mono flex gap-8 items-center h-full">
                            {(() => {
                                const activeFish = getActiveFish(today, todayData.moonPhase);
                                return activeFish.length > 0
                                    ? [...activeFish, ...activeFish, ...activeFish].map((fish, i) => (
                                        <span key={i} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            {fish}
                                        </span>
                                    ))
                                    : <span className="opacity-70">Activitate generală redusă</span>;
                            })()}
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 mb-8 md:mb-12">

                    {/* Left: Moon Card */}
                    <div className="lg:col-span-4 card-panel p-4 md:p-6 flex flex-col items-center justify-between min-h-[300px] md:min-h-[400px] relative overflow-hidden group">
                        {/* Header */}
                        <div className="w-full flex justify-between items-center mb-1 md:mb-2 z-10">
                            <div className="font-display font-bold text-base md:text-xl text-white">{formatDate(today)}</div>
                            <div className="px-2 py-0.5 bg-white/5 rounded-full text-[9px] md:text-xs font-mono border border-white/10 text-night-300">
                                {locationName}
                            </div>
                        </div>

                        {/* Main Moon */}
                        <div className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] relative z-10 my-1 md:my-2 lg:scale-125 transition-transform duration-700 group-hover:scale-110">
                            <Moon3DWrapper phase={getMoonage(today) / 29.53} illumination={todayData.moonIllumination} size={200} />
                        </div>

                        {/* Status Badge */}
                        <div className="z-10 text-center w-full">
                            <div className="text-amber-200 font-bold mb-0 text-sm md:text-lg tracking-wide">
                                {getMoonPhaseName(todayData.moonPhase).startsWith('În') ? `Lună ${getMoonPhaseName(todayData.moonPhase).toLowerCase()}` : getMoonPhaseName(todayData.moonPhase)}
                            </div>
                            <div className="text-night-400 text-[10px] md:text-xs mb-2 md:mb-4">{todayData.moonIllumination}% iluminare</div>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 md:px-6 md:py-2 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/30 rounded-full mb-2 md:mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                                <span className="text-teal-300 font-bold text-[10px] md:text-sm uppercase tracking-wide">Activitate {todayData.overallRating >= 4 ? 'Excelentă' : todayData.overallRating >= 3 ? 'Bună' : 'Medie'}</span>
                            </div>

                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <svg key={s} className={`w-3.5 h-3.5 md:w-5 md:h-5 ${s <= todayData.overallRating ? 'text-amber-400' : 'text-night-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-amber-400/5 blur-[80px] rounded-full pointer-events-none" />
                    </div>

                    {/* Right: Graph, Schedule & Times */}
                    <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6">
                        {/* Graph & Schedule Grid */}
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6 flex-1">
                            {/* 1. Graph Card */}
                            <div className="card-panel p-4 md:p-6 min-h-[220px] relative flex flex-col justify-center">
                                <ActivityGraph majorPeriods={todayData.majorPeriods} minorPeriods={todayData.minorPeriods} />
                                <div className="flex justify-center gap-4 md:gap-6 mt-3 text-[10px] md:text-xs font-mono text-night-400 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Majoră</span>
                                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Minoră</span>
                                </div>
                            </div>

                            {/* 2. Fishing Schedule (New!) */}
                            <div className="card-panel p-5 flex flex-col justify-center">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-moon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Orar Pescuit
                                </h3>
                                <ScheduleCard type="good" start={formatTime(bestStart)} end={formatTime(bestEnd)} />
                                <div className="my-2 border-t border-white/5" />
                                <ScheduleCard type="bad" start={formatTime(badStart)} end={formatTime(badEnd)} />
                            </div>
                        </div>

                        {/* Sun/Moon Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <div className="card-glass p-3 md:p-4 flex items-center justify-between md:justify-start gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <div className="text-right md:text-left">
                                    <p className="text-[9px] md:text-[10px] uppercase text-night-400 font-bold tracking-wider">Răsărit Soare</p>
                                    <p className="text-base md:text-xl font-mono text-white">{formatTime(todayData.sunrise)}</p>
                                </div>
                            </div>
                            <div className="card-glass p-3 md:p-4 flex items-center justify-between md:justify-start gap-3">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <div className="text-right md:text-left">
                                    <p className="text-[9px] md:text-[10px] uppercase text-night-400 font-bold tracking-wider">Apus Soare</p>
                                    <p className="text-base md:text-xl font-mono text-white">{formatTime(todayData.sunset)}</p>
                                </div>
                            </div>
                            <div className="card-glass p-3 md:p-4 flex items-center justify-between md:justify-start gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                </div>
                                <div className="text-right md:text-left">
                                    <p className="text-[9px] md:text-[10px] uppercase text-night-400 font-bold tracking-wider">Răsărit Lună</p>
                                    <p className="text-base md:text-xl font-mono text-white">{todayData.moonrise ? formatTime(todayData.moonrise) : '--:--'}</p>
                                </div>
                            </div>
                            <div className="card-glass p-3 md:p-4 flex items-center justify-between md:justify-start gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                </div>
                                <div className="text-right md:text-left">
                                    <p className="text-[9px] md:text-[10px] uppercase text-night-400 font-bold tracking-wider">Apus Lună</p>
                                    <p className="text-base md:text-xl font-mono text-white">{todayData.moonset ? formatTime(todayData.moonset) : '--:--'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Middle Ad (Medium Rectangle) */}
                <AdUnit
                    slotId="1234567890" // REPLACE WITH ACTUAL SLOT ID
                    format="rectangle"
                    style={{ minHeight: '280px' }}
                    className="mb-8"
                    label="Reclamă"
                />

                {/* Forecast Stripes */}
                <div className="mb-8 md:mb-12">
                    <h2 className="text-sm md:text-base font-bold text-white mb-3 md:mb-4 px-1">Prognoza 14 zile</h2>
                    <ForecastCarousel>
                        {weekData.map((d, i) => (
                            <div key={i} className="snap-center shrink-0">
                                <ForecastCard data={d} isToday={i === 0} />
                            </div>
                        ))}
                    </ForecastCarousel>
                </div>

                {/* Info Cards Bottom */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 pb-8">
                    {/* Card 1 */}
                    <div className="card-glass p-4 min-h-[120px] flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 justify-between group hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-amber-400 text-sm md:text-base">Perioade Majore</h3>
                            <div className="text-amber-500 hidden md:block">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" /></svg>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-xs text-night-300 leading-relaxed md:mt-2 text-right md:text-left max-w-[200px] md:max-w-none">
                            {majorDesc}
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="card-glass p-4 min-h-[120px] flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 justify-between group hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-cyan-400 text-sm md:text-base">Perioade Minore</h3>
                            <div className="text-cyan-500 hidden md:block">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-xs text-night-300 leading-relaxed md:mt-2 text-right md:text-left max-w-[200px] md:max-w-none">
                            {minorDesc}
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="card-glass p-4 min-h-[120px] flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 justify-between group hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-white text-sm md:text-base">Sfatul Zilei</h3>
                            <div className="text-yellow-400 hidden md:block">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
                            </div>
                        </div>
                        <p className="text-[10px] md:text-xs text-night-300 leading-relaxed md:mt-2 text-right md:text-left max-w-[200px] md:max-w-none">
                            {advice}
                        </p>
                    </div>
                </div>

                {/* Bottom Ad (Responsive) */}
                <AdUnit
                    slotId="1234567890" // REPLACE WITH ACTUAL SLOT ID
                    format="auto"
                    layout="in-article"
                    className="min-h-[120px]"
                    label="Reclamă"
                />

            </div >
        </div >
    );
}
