'use client';

import Image from 'next/image';
import logo from '@/assets/logo.webp';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactElement } from 'react';

function navState(pathname: string, href: string) {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return {
        'data-nav-active': active ? 'true' : 'false',
        'aria-current': active ? ('page' as const) : undefined,
    };
}

// Links beyond the first four only fit from lg up.
const DESKTOP_LINKS = [
    { href: '/', label: 'Acasă', wide: true },
    { href: '/azi', label: 'Solunar Azi', wide: false },
    { href: '/prognoza', label: 'Prognoză', wide: false },
    { href: '/lunar', label: 'Faze Lunare', wide: true },
    { href: '/locuri-pescuit', label: 'Locuri Pescuit', wide: false },
    { href: '/blog', label: 'Ghiduri', wide: false },
    { href: '/despre', label: 'Despre', wide: true },
];

// Sections the five bottom tabs do not cover; reachable from the mobile menu.
const MENU_LINKS = [
    { href: '/azi', label: 'Solunar Azi' },
    { href: '/locuri-pescuit', label: 'Locuri de Pescuit' },
    { href: '/blog', label: 'Ghiduri și Articole' },
    { href: '/rasarit-apus-soare', label: 'Răsărit și Apus' },
    { href: '/despre', label: 'Despre' },
    { href: '/contact', label: 'Contact' },
];

const ICON_PROPS = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
};

const TAB_ICONS: Record<string, ReactElement> = {
    Azi: (
        <svg {...ICON_PROPS}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
        </svg>
    ),
    Prognoză: (
        <svg {...ICON_PROPS}>
            <rect x="3.5" y="5" width="17" height="15" rx="3" />
            <path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" />
        </svg>
    ),
    Lună: (
        <svg {...ICON_PROPS}>
            <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        </svg>
    ),
    Specii: (
        <svg {...ICON_PROPS}>
            <path d="M3 12c3-4.5 7.5-6 11-4.5 2 .9 3.6 2.5 4.5 4.5-.9 2-2.5 3.6-4.5 4.5C10.5 18 6 16.5 3 12Z" />
            <path d="m18.5 12 2.5-3v6l-2.5-3Z" />
            <circle cx="13.5" cy="11" r=".6" fill="currentColor" />
        </svg>
    ),
    Jurnal: (
        <svg {...ICON_PROPS}>
            <path d="M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Z" />
            <path d="M8.5 8h6M8.5 11.5h6M8.5 15h3.5" />
        </svg>
    ),
};

const TABS = [
    { label: 'Azi', href: '/' },
    { label: 'Prognoză', href: '/prognoza' },
    { label: 'Lună', href: '/lunar' },
    { label: 'Specii', href: '/specii' },
    { label: 'Jurnal', href: '/#jurnal' },
];

// Client-side navigation (desktop header + mobile bars). Reading the
// active route via usePathname here means the root layout no longer needs
// headers(), so every page can be statically rendered / ISR-cached.
export default function SiteNav() {
    const pathname = usePathname() || '/';
    // Ancora curenta (#prognoza/#specii/#jurnal) pentru tab-ul activ de jos
    const [hash, setHash] = useState('');
    useEffect(() => {
        const sync = () => setHash(window.location.hash);
        sync();
        window.addEventListener('hashchange', sync);
        return () => window.removeEventListener('hashchange', sync);
    }, [pathname]);

    return (
        <>
            <header className="desktop-header fixed inset-x-0 top-3 z-50">
                <div className="container-custom">
                    <div className="glass flex h-[60px] items-center justify-between gap-4 rounded-[20px] pl-3 pr-2">
                        <a href="/" className="group flex shrink-0 items-center gap-2.5 rounded-xl pr-2">
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                                <Image src={logo} alt="Calendar Solunar" width={24} height={24} className="object-contain transition-transform group-hover:scale-110" loading="lazy" />
                            </span>
                            <span className="leading-tight">
                                <span className="block font-display text-[15px] font-bold tracking-tight text-white">Calendar Solunar</span>
                                <span className="block text-[11px] text-slate-400">ore de pescuit · România</span>
                            </span>
                        </a>
                        <nav className="flex items-center gap-0.5 text-[13px] font-medium" aria-label="Navigare principală">
                            {DESKTOP_LINKS.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    {...navState(pathname, l.href)}
                                    className={`site-nav-link items-center rounded-xl px-3 py-2 text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white ${l.wide ? 'hidden lg:inline-flex' : 'inline-flex'}`}
                                >
                                    {l.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Bara de sus pe mobil, doar pe subpagini: homepage-ul are propriul antet */}
            {pathname !== '/' && (
                <div className="sticky top-0 z-40 px-3 pt-3 md:hidden">
                    <div className="glass flex h-14 items-center justify-between rounded-[18px] pl-2.5 pr-1.5">
                        <a href="/" className="flex items-center gap-2">
                            <Image src={logo} alt="Calendar Solunar" width={26} height={26} className="object-contain" />
                            <span className="font-display text-[15px] font-bold tracking-tight text-white">Calendar Solunar</span>
                        </a>
                        <details className="group relative">
                            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-slate-200 hover:bg-white/[0.06] [&::-webkit-details-marker]:hidden">
                                Meniu
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-open:rotate-180" aria-hidden>
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </summary>
                            <nav className="glass absolute right-0 top-[calc(100%+10px)] w-56 rounded-[18px] p-1.5" aria-label="Meniu">
                                {MENU_LINKS.map((l) => (
                                    <a
                                        key={l.href}
                                        href={l.href}
                                        {...navState(pathname, l.href)}
                                        className="site-nav-link block rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-white/[0.06]"
                                    >
                                        {l.label}
                                    </a>
                                ))}
                            </nav>
                        </details>
                    </div>
                </div>
            )}

            {/* Bara de jos: capsula de sticla cu 5 tab-uri */}
            <div
                className="mobile-bottom-nav pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 md:hidden"
                style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
            >
                <nav className="glass pointer-events-auto flex w-full gap-1 rounded-[24px] p-1.5" aria-label="Secțiuni">
                    {TABS.map((t) => {
                        const anchor = t.href.includes('#') ? t.href.slice(t.href.indexOf('#')) : '';
                        const active = anchor
                            ? pathname === '/' && hash === anchor
                            : t.href === '/'
                                ? pathname === '/' && !hash
                                : pathname.startsWith(t.href);
                        return (
                            <a
                                key={t.label}
                                href={t.href}
                                aria-current={active ? 'page' : undefined}
                                className={`flex flex-1 flex-col items-center gap-0.5 rounded-[18px] py-2 text-[10.5px] font-semibold transition-colors ${
                                    active
                                        ? 'bg-moon/[0.14] text-moon shadow-[inset_0_0_0_1px_rgba(242,206,114,0.28)]'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {TAB_ICONS[t.label]}
                                {t.label}
                            </a>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
