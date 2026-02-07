'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
    slotId: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
    layout?: string;
    style?: React.CSSProperties;
    className?: string;
    label?: string; // e.g., "Advertisement" label
}

export default function AdUnit({ slotId, format = 'auto', layout, style, className, label }: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        const pushAd = () => {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error('AdSense error:', err);
            }
        };

        // If script already loaded, push immediately
        // @ts-ignore
        if (window.adsbygoogle) {
            pushAd();
        } else {
            // Wait for the script to load, then push
            const script = document.querySelector('script[src*="adsbygoogle"]');
            if (script) {
                script.addEventListener('load', pushAd);
                return () => script.removeEventListener('load', pushAd);
            }
        }
    }, []);

    // Development placeholder
    if (process.env.NODE_ENV !== 'production') {
        return (
            <div className={`bg-night-800/50 border border-night-700 border-dashed rounded-lg flex flex-col items-center justify-center text-night-400 text-xs p-4 my-4 ${className}`} style={style}>
                <span className="font-bold mb-1">AdSpace: {label || 'Google Ad'}</span>
                <span>Slot: {slotId}</span>
                <span>Format: {format}</span>
            </div>
        );
    }

    return (
        <div className={`ad-container flex flex-col items-center justify-center my-6 overflow-hidden ${className}`}>
            {label && <span className="text-[10px] text-night-500 uppercase tracking-widest mb-1">Publicitate</span>}
            <ins
                className="adsbygoogle"
                style={{ display: 'block', textAlign: 'center', ...style }}
                data-ad-client="ca-pub-4509784482094331"
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
                data-ad-layout={layout}
            />
        </div>
    );
}
