'use client';

import { useEffect } from 'react';

const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4509784482094331';
const INTERACTION_EVENTS = ['scroll', 'pointerdown', 'touchstart', 'keydown'] as const;

// Loads AdSense only after the first paint: on the first user interaction, or a
// short while after the page has loaded. Loading it in <head> made its scripts
// compete with the first frame on slow phones. Ad units queue their
// adsbygoogle.push() calls until the script arrives, so no slot is lost.
export default function AdSenseScript() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') return;

        let loaded = false;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const load = () => {
            if (loaded) return;
            loaded = true;
            INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, load));
            if (timer) clearTimeout(timer);
            if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
            const script = document.createElement('script');
            script.src = ADSENSE_SRC;
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
        };

        const loadWhenIdle = () => {
            timer = setTimeout(() => {
                if (typeof window.requestIdleCallback === 'function') {
                    window.requestIdleCallback(load, { timeout: 1500 });
                } else {
                    load();
                }
            }, 2500);
        };

        INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
        if (document.readyState === 'complete') loadWhenIdle();
        else window.addEventListener('load', loadWhenIdle, { once: true });

        return () => {
            INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, load));
            window.removeEventListener('load', loadWhenIdle);
            if (timer) clearTimeout(timer);
        };
    }, []);

    return null;
}
