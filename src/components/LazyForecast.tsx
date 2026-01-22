'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { type DaySolunarData } from '@/lib/solunar';

const ForecastCarousel = dynamic(() => import('./ForecastCarousel'), {
    ssr: false,
    loading: () => (
        <div className="h-[180px] bg-night-900/50 rounded-2xl animate-pulse" />
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
        <div id="forecast-section" className="mb-8 md:mb-12">
            <h2 className="text-sm md:text-base font-bold text-white mb-3 md:mb-4 px-1">
                Prognoza 14 zile
            </h2>
            {isVisible ? (
                <ForecastCarousel>
                    {weekData.map((d, i) => (
                        <div key={i} className="snap-center shrink-0">
                            <ForecastCard data={d} isToday={i === 0} />
                        </div>
                    ))}
                </ForecastCarousel>
            ) : (
                <div className="h-[180px] bg-night-900/30 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-moon border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
