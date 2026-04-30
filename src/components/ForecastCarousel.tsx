'use client';

import { useRef } from 'react';

interface ForecastCarouselProps {
    children: React.ReactNode;
}

export default function ForecastCarousel({ children }: ForecastCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative group">
            {/* Left Arrow */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[#151b25]/90 hover:bg-[#1f2937] border border-white/10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"
                aria-label="Scroll left"
            >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-3 md:gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x scroll-smooth px-[calc(50vw-95px)] md:px-0"
            >
                {children}
            </div>

            {/* Right Arrow */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-[#151b25]/90 hover:bg-[#1f2937] border border-white/10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2"
                aria-label="Scroll right"
            >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Gradient Edges */}
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-[#111827] to-transparent pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#111827] to-transparent pointer-events-none md:hidden" />
        </div>
    );
}
