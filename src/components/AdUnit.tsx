'use client';

import { useEffect, useRef, useState } from 'react';

interface AdUnitProps {
    slotId: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
    layout?: string;
    style?: React.CSSProperties;
    className?: string;
    label?: string;
}

export default function AdUnit({ slotId, format = 'auto', layout, style, className, label }: AdUnitProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        const pushAd = () => {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                // silent
            }
        };

        // @ts-ignore
        if (window.adsbygoogle) {
            pushAd();
        } else {
            const script = document.querySelector('script[src*="adsbygoogle"]');
            if (script) {
                script.addEventListener('load', pushAd);
                return () => script.removeEventListener('load', pushAd);
            }
        }

        // Check if ad filled after a delay
        const timer = setTimeout(() => {
            if (containerRef.current) {
                const ins = containerRef.current.querySelector('ins');
                if (ins && ins.getAttribute('data-ad-status') === 'filled') {
                    setAdLoaded(true);
                }
            }
        }, 3000);

        return () => clearTimeout(timer);
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
        <div
            ref={containerRef}
            className={`ad-container flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${adLoaded ? 'my-6' : 'my-0'} ${className}`}
            style={adLoaded ? undefined : { minHeight: 0, maxHeight: 0 }}
        >
            {adLoaded && label && <span className="text-[10px] text-night-500 uppercase tracking-widest mb-1">Publicitate</span>}
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
