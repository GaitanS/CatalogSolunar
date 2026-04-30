'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function NavActiveMarker() {
    const pathname = usePathname();

    useEffect(() => {
        document.querySelectorAll<HTMLElement>('[data-nav-match]').forEach((item) => {
            const href = item.getAttribute('data-nav-match') || '/';
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

            item.dataset.navActive = active ? 'true' : 'false';
            if (active) item.setAttribute('aria-current', 'page');
            else item.removeAttribute('aria-current');
        });
    }, [pathname]);

    return null;
}
