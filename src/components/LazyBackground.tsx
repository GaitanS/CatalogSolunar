'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const ConstellationBackground = dynamic(
    () => import('./ConstellationBackground'),
    {
        ssr: false,
        loading: () => null, // Don't show anything while loading
    }
);

export default function LazyBackground() {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Defer loading until after initial paint
        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => setShouldLoad(true), { timeout: 2000 });
        } else {
            setTimeout(() => setShouldLoad(true), 100);
        }
    }, []);

    if (!shouldLoad) {
        // Return a simple static background instead
        return (
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#020617]" />
            </div>
        );
    }

    return <ConstellationBackground />;
}
