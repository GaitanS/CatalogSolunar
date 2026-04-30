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
                    backgroundImage: 'url(/moon-texture.jpg)',
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
        // Use the textured 3D moon on mobile too when WebGL is available.
        const isMobile = window.innerWidth < 768;
        const shouldUse3D = isWebGLAvailable();
        setUse2D(!shouldUse3D);
        setActualSize(isMobile ? Math.min(size, 180) : size);

        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            const shouldUse3D = isWebGLAvailable();
            setUse2D(!shouldUse3D);
            setActualSize(isMobile ? Math.min(size, 180) : size);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [size]);

    const moonProps = { phase, illumination, size: actualSize };

    // Use simple 2D moon on mobile or when WebGL is not available
    if (use2D) {
        return <SimpleMoon2D {...moonProps} />;
    }

    return <Moon3D {...moonProps} />;
}
