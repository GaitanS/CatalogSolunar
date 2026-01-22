'use client';

import { useEffect } from 'react';

export default function AdSenseScript() {
    useEffect(() => {
        // Only load in production and if not already loaded
        const alreadyLoaded = document.querySelector('script[src*="adsbygoogle"]');
        if (process.env.NODE_ENV === 'production' && !alreadyLoaded) {
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4509784482094331';
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
        }
    }, []);

    return null;
}
