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

export default function Moon3DWrapper(props: Moon3DWrapperProps) {
    const [isMobile, setIsMobile] = useState(true); // Default to mobile for SSR

    useEffect(() => {
        // Check screen width on client
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Use simple 2D moon on mobile to avoid Three.js overhead
    if (isMobile) {
        return <SimpleMoon2D {...props} />;
    }

    return <Moon3D {...props} />;
}
