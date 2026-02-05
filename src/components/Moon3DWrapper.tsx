'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SimpleMoon2D from './SimpleMoon2D';

const Moon3D = dynamic(() => import('./Moon3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 animate-pulse" />
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

export default function Moon3DWrapper(props: Moon3DWrapperProps) {
    const [use2D, setUse2D] = useState(true); // Default to 2D for SSR safety

    useEffect(() => {
        // Check if we should use 3D (desktop + WebGL available)
        const shouldUse3D = window.innerWidth >= 768 && isWebGLAvailable();
        setUse2D(!shouldUse3D);

        const handleResize = () => {
            const shouldUse3D = window.innerWidth >= 768 && isWebGLAvailable();
            setUse2D(!shouldUse3D);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Use simple 2D moon on mobile or when WebGL is not available
    if (use2D) {
        return <SimpleMoon2D {...props} />;
    }

    return <Moon3D {...props} />;
}
