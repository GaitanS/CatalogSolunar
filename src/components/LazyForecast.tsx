'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { type DaySolunarData } from '@/lib/solunar';

const ForecastCarousel = dynamic(() => import('./ForecastCarousel'), {
    ssr: false,
    loading: () => (
        <div className="h-[180px] bg-white/[0.045] rounded-2xl animate-pulse border border-white/10" />
    ),
});

const ForecastCard = dynamic(() => import('./ForecastCard'), {
    ssr: false,
});

interface LazyForecastProps {
    weekData: DaySolunarData[];
}

export default function LazyForecast({ weekData }: LazyForecastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Use Intersection Observer to load only when visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );

        const element = document.getElementById('forecast-section');
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <section id="forecast-section" className="mb-8 md:mb-12 card-panel taste-surface overflow-hidden p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200/75 font-bold">
                        Următoarele ieșiri
                    </p>
                    <h2 className="mt-1 text-xl md:text-2xl font-display font-bold text-white">
                        Prognoza 14 zile
                    </h2>
                </div>
                <p className="text-xs text-slate-400">Ferestre majore, faza lunii și activitate estimată</p>
            </div>
            {isVisible ? (
                <ForecastCarousel>
                    {weekData.map((d, i) => (
                        <div key={i} className="snap-center shrink-0">
                            <ForecastCard data={d} isToday={i === 0} />
                        </div>
                    ))}
                </ForecastCarousel>
            ) : (
                <div className="h-[180px] bg-white/[0.045] rounded-2xl border border-white/10 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </section>
    );
}
