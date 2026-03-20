'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const AdUnit = dynamic(() => import('./AdUnit'), {
    ssr: false,
    loading: () => null,
});

interface LazyAdUnitProps {
    slotId: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
    layout?: string;
    className?: string;
    style?: React.CSSProperties;
    label?: string;
}

export default function LazyAdUnit(props: LazyAdUnitProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [adFilled, setAdFilled] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    // Check if the ad inside actually filled
    useEffect(() => {
        if (!isVisible) return;
        const timer = setTimeout(() => {
            if (ref.current) {
                const ins = ref.current.querySelector('ins');
                if (ins && ins.getAttribute('data-ad-status') === 'filled') {
                    setAdFilled(true);
                }
            }
        }, 3500);
        return () => clearTimeout(timer);
    }, [isVisible]);

    return (
        <div ref={ref} className={props.className} style={adFilled ? props.style : { minHeight: 0, maxHeight: 0, overflow: 'hidden' }}>
            {isVisible && <AdUnit {...props} />}
        </div>
    );
}
