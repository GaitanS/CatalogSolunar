'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const AD_CLIENT = 'ca-pub-4509784482094331';

type AdFormat = 'auto' | 'fluid' | 'rectangle' | 'horizontal';

interface AdUnitProps {
    slotId: string;
    format?: AdFormat;
    layout?: string;
    style?: CSSProperties;
    className?: string;
    label?: string;
}

// Reserved height per format prevents layout shift (CLS) while the ad loads.
// IMPORTANT: we reserve height but NEVER force width to 0 — AdSense needs a
// real, non-zero width on the <ins> at push time or it reports availableWidth=0
// and never fills the slot (the historical bug that killed fill rate).
const RESERVE_HEIGHT: Record<AdFormat, number> = {
    horizontal: 100,
    auto: 120,
    rectangle: 280,
    fluid: 250,
};

declare global {
    interface Window {
        adsbygoogle?: unknown[];
    }
}

export default function AdUnit({ slotId, format = 'auto', layout, style, className = '', label = 'Publicitate' }: AdUnitProps) {
    const insRef = useRef<HTMLModElement>(null);
    const pushedRef = useRef(false);
    // 'pending' = reserve space; 'filled' = show with margin; 'empty' = collapse.
    const [state, setState] = useState<'pending' | 'filled' | 'empty'>('pending');

    useEffect(() => {
        const ins = insRef.current;
        if (!ins) return;

        // Guard against double-push (React strict mode / re-renders). AdSense
        // sets data-adsbygoogle-status on an <ins> once it has processed it.
        if (!pushedRef.current && !ins.getAttribute('data-adsbygoogle-status')) {
            pushedRef.current = true;
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch {
                // adsbygoogle.js not ready yet — it will process this <ins> on load.
            }
        }

        // Watch the fill status and collapse ONLY when AdSense reports "unfilled".
        const sync = () => {
            const status = ins.getAttribute('data-ad-status');
            if (status === 'filled') setState('filled');
            else if (status === 'unfilled') setState('empty');
        };
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
        return () => observer.disconnect();
    }, []);

    // Development placeholder so the layout is visible without serving real ads.
    if (process.env.NODE_ENV !== 'production') {
        return (
            <div
                className={`ad-reserve flex flex-col items-center justify-center text-night-400 text-xs p-4 my-6 ${className}`}
                style={{ minHeight: RESERVE_HEIGHT[format], ...style }}
            >
                <span className="font-bold mb-1 uppercase tracking-widest text-[10px]">{label}</span>
                <span className="opacity-70">slot {slotId} · {format}</span>
            </div>
        );
    }

    if (state === 'empty') return null;

    return (
        <div
            className={`flex flex-col items-center justify-center overflow-hidden ${state === 'filled' ? 'my-6' : 'my-6'} ${className}`}
            style={state === 'pending' ? { minHeight: RESERVE_HEIGHT[format] } : undefined}
        >
            {state === 'filled' && (
                <span className="text-[10px] text-night-500 uppercase tracking-widest mb-1">{label}</span>
            )}
            <ins
                ref={insRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', textAlign: 'center', ...style }}
                data-ad-client={AD_CLIENT}
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
                {...(layout ? { 'data-ad-layout': layout } : {})}
            />
        </div>
    );
}
