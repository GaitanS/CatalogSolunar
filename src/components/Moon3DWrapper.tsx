'use client';

import dynamic from 'next/dynamic';

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
    return <Moon3D {...props} />;
}
