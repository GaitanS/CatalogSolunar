'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SimpleMoon2D from './SimpleMoon2D';

const Moon3D = dynamic(() => import('./Moon3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div
                className="w-24 h-24 rounded-full animate-pulse bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/moon-texture-512.webp)',
                    boxShadow: '0 0 46px rgba(148, 163, 184, 0.18)',
                    filter: 'grayscale(1) contrast(1.08) brightness(0.95)',
                }}
            />
        </div>
    ),
});

interface Moon3DWrapperProps {
    phase: number;
    illumination: number;
    size?: number;
}

// Check if WebGL is available
function isWebGLAvailable(): boolean {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch {
        return false;
    }
}

export default function Moon3DWrapper({ phase, illumination, size = 200 }: Moon3DWrapperProps) {
    const [use2D, setUse2D] = useState(true); // Default to 2D for SSR safety
    const [actualSize, setActualSize] = useState(120); // Default to mobile size for SSR

    useEffect(() => {
        // Only load the three.js moon on desktop with capable hardware. Mobile
        // (91% of traffic) keeps the lightweight 2D moon — saves ~130KB gzip of
        // JS + WebGL init, cutting TBT/INP on mid-range Android.
        const decide = () => {
            const isMobile = window.innerWidth < 768;
            const nav = navigator as Navigator & { connection?: { saveData?: boolean }; hardwareConcurrency?: number };
            const capable = !nav.connection?.saveData && (nav.hardwareConcurrency ?? 8) > 4;
            const shouldUse3D = !isMobile && capable && isWebGLAvailable();
            setUse2D(!shouldUse3D);
            setActualSize(isMobile ? Math.min(size, 180) : size);
        };
        decide();
        window.addEventListener('resize', decide);
        return () => window.removeEventListener('resize', decide);
    }, [size]);

    const moonProps = { phase, illumination, size: actualSize };

    // Use simple 2D moon on mobile or when WebGL is not available
    if (use2D) {
        return <SimpleMoon2D {...moonProps} />;
    }

    return <Moon3D {...moonProps} />;
}
