import { Metadata } from 'next';
import { getMoonPhase, getMoonIllumination, getMoonPhaseName, getSolunarData } from '@/lib/solunar';
import RatingBars from '@/components/RatingBars';
import MoonIcon from '@/components/MoonIcon';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdUnit from '@/components/AdUnit';

export const metadata: Metadata = {
    title: 'Calendar Lunar 2026 - Fazele Lunii și Pescuit',
    description: 'Calendar lunar complet 2026: fazele lunii zi de zi, procent iluminare, lună plină și nouă. Cum influențează luna pescuitul și rating solunar zilnic.',
    alternates: { canonical: 'https://calendarsolunar.ro/lunar' },
    openGraph: {
        title: 'Calendar Lunar 2026 - Fazele Lunii și Pescuit',
        description: 'Calendar lunar complet 2026: fazele lunii zi de zi, procent iluminare, lună plină și nouă.',
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

    return (
        <div className="min-h-screen py-12 md:py-20">
            <Breadcrumbs items={[
                { label: 'Acasă', href: '/' },
                { label: 'Calendar Lunar' },
            ]} />
            <div className="container-custom px-4">
                {/* Hero */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                        Calendar Lunar <span className="text-moon capitalize">{monthName}</span>
                    </h1>
                    <p className="text-night-300 text-lg max-w-2xl mx-auto">
                        Fazele lunii și impactul lor asupra pescuitului.
                    </p>
                </div>

                {/* Top Ad */}
                <AdUnit slotId="2812628769" format="horizontal" className="mb-8" />

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

                {/* Middle Ad */}
                <AdUnit slotId="2812628769" format="auto" className="mb-12 max-w-4xl mx-auto" />

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

                {/* Bottom Ad */}
                <AdUnit slotId="2812628769" format="auto" className="my-12" />

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
