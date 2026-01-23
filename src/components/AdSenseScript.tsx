'use client';

import { useEffect } from 'react';

export default function AdSenseScript() {
    useEffect(() => {
        // Ezoic integration - load privacy scripts first, then header script
        const alreadyLoaded = document.querySelector('script[src*="ezojs.com"]');
        if (process.env.NODE_ENV === 'production' && !alreadyLoaded) {
            // Privacy script 1
            const privacyScript1 = document.createElement('script');
            privacyScript1.src = 'https://cmp.gatekeeperconsent.com/min.js';
            privacyScript1.setAttribute('data-cfasync', 'false');
            document.head.appendChild(privacyScript1);

            // Privacy script 2
            const privacyScript2 = document.createElement('script');
            privacyScript2.src = 'https://the.gatekeeperconsent.com/cmp.min.js';
            privacyScript2.setAttribute('data-cfasync', 'false');
            document.head.appendChild(privacyScript2);

            // Ezoic header script
            const ezoicScript = document.createElement('script');
            ezoicScript.src = '//www.ezojs.com/ezoic/sa.min.js';
            ezoicScript.async = true;
            document.head.appendChild(ezoicScript);

            // Initialize ezstandalone
            (window as typeof window & { ezstandalone: { cmd: Array<() => void> } }).ezstandalone =
                (window as typeof window & { ezstandalone: { cmd: Array<() => void> } }).ezstandalone || {};
            (window as typeof window & { ezstandalone: { cmd: Array<() => void> } }).ezstandalone.cmd =
                (window as typeof window & { ezstandalone: { cmd: Array<() => void> } }).ezstandalone.cmd || [];
        }
    }, []);

    return null;
}
