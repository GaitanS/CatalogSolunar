'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { CSSProperties } from 'react';

const AdUnit = dynamic(() => import('./AdUnit'), {
    ssr: false,
    loading: () => null,
});

type AdFormat = 'auto' | 'fluid' | 'rectangle' | 'horizontal';

interface LazyAdUnitProps {
    slotId: string;
    format?: AdFormat;
    layout?: string;
    className?: string;
    style?: CSSProperties;
    label?: string;
    /** Distance before the unit enters the viewport at which to start loading. */
    rootMargin?: string;
}

const RESERVE_HEIGHT: Record<AdFormat, number> = {
    horizontal: 100,
    auto: 120,
    rectangle: 280,
    fluid: 250,
};

// Defers mounting the real AdUnit until the user scrolls near it. Reserves the
// same height the ad will occupy so there is no layout shift when it mounts.
export default function LazyAdUnit({ rootMargin = '600px', ...props }: LazyAdUnitProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return (
        <div ref={ref} style={visible ? undefined : { minHeight: RESERVE_HEIGHT[props.format ?? 'auto'] }}>
            {visible && <AdUnit {...props} />}
        </div>
    );
}
