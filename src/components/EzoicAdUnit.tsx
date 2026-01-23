'use client';

import { useEffect, useRef } from 'react';

interface EzoicAdUnitProps {
    placeholderId: number;
    className?: string;
    label?: string;
}

declare global {
    interface Window {
        ezstandalone?: {
            cmd: Array<() => void>;
            showAds: (...ids: number[]) => void;
        };
    }
}

export default function EzoicAdUnit({ placeholderId, className = '', label }: EzoicAdUnitProps) {
    const adRef = useRef<HTMLDivElement>(null);
    const hasShownAd = useRef(false);

    useEffect(() => {
        if (process.env.NODE_ENV === 'production' && !hasShownAd.current && window.ezstandalone) {
            window.ezstandalone.cmd.push(function () {
                window.ezstandalone?.showAds(placeholderId);
            });
            hasShownAd.current = true;
        }
    }, [placeholderId]);

    // Development placeholder
    if (process.env.NODE_ENV !== 'production') {
        return (
            <div className={`bg-night-800/50 border border-night-700 border-dashed rounded-lg flex flex-col items-center justify-center text-night-400 text-xs p-4 my-4 ${className}`}>
                <span className="font-bold mb-1">Ezoic Ad: {label || 'Advertisement'}</span>
                <span>Placeholder ID: {placeholderId}</span>
            </div>
        );
    }

    return (
        <div className={`ad-container flex flex-col items-center justify-center my-6 overflow-hidden ${className}`}>
            {label && <span className="text-[10px] text-night-500 uppercase tracking-widest mb-1">Publicitate</span>}
            <div id={`ezoic-pub-ad-placeholder-${placeholderId}`} ref={adRef} />
        </div>
    );
}
