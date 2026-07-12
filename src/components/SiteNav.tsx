'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function navState(pathname: string, href: string) {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return {
        'data-nav-active': active ? 'true' : 'false',
        'aria-current': active ? ('page' as const) : undefined,
    };
}

// Client-side navigation (desktop header + mobile bottom bar). Reading the
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
            <header className="desktop-header fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#111827]/88 backdrop-blur-xl">
                <div className="container-custom py-3 flex items-center justify-center md:justify-between">
                    <a href="/" className="interactive-lift flex items-center gap-3 group rounded-2xl pr-3">
                        <Image
                            src="/logo.webp"
                            alt="Solunar Logo"
                            width={32}
                            height={32}
                            className="object-contain group-hover:scale-110 transition-transform"
                            priority
                        />
                        <span className="font-display text-lg md:text-xl font-bold text-white tracking-tight">Calendar Solunar</span>
                    </a>
                    <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.045] p-1 font-medium text-sm taste-surface">
                        <a href="/" {...navState(pathname, '/')} className="site-nav-link rounded-xl px-3 py-2 text-slate-300 transition-colors hover:text-white hover:bg-white/[0.055]">Acasă</a>
                        <a href="/azi" {...navState(pathname, '/azi')} className="site-nav-link rounded-xl px-3 py-2 text-slate-300 transition-colors hover:text-white hover:bg-white/[0.055]">Solunar Azi</a>
                        <a href="/lunar" {...navState(pathname, '/lunar')} className="site-nav-link rounded-xl px-3 py-2 text-slate-300 transition-colors hover:text-white hover:bg-white/[0.055]">Faze Lunare</a>
                        <a href="/locuri-pescuit" {...navState(pathname, '/locuri-pescuit')} className="site-nav-link rounded-xl px-3 py-2 text-slate-300 transition-colors hover:text-white hover:bg-white/[0.055]">Locuri Pescuit</a>
                        <a href="/blog" {...navState(pathname, '/blog')} className="site-nav-link rounded-xl px-3 py-2 text-slate-300 transition-colors hover:text-white hover:bg-white/[0.055]">Ghiduri</a>
                        <a href="/despre" {...navState(pathname, '/despre')} className="site-nav-link rounded-xl px-3 py-2 text-slate-300 transition-colors hover:text-white hover:bg-white/[0.055]">Despre</a>
                    </nav>
                </div>
            </header>
            {/* Bara de jos cu 5 tab-uri text (design Solunar Mobile) */}
            <nav
                className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 flex gap-1.5 px-3.5 pt-2.5 backdrop-blur-xl md:hidden"
                style={{
                    background: 'rgba(7,11,22,0.92)',
                    borderTop: '1px solid rgba(148,170,220,0.1)',
                    paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
                }}
            >
                {[
                    { label: 'Azi', href: '/' },
                    { label: 'Prognoză', href: '/#prognoza' },
                    { label: 'Lună', href: '/lunar' },
                    { label: 'Specii', href: '/#specii' },
                    { label: 'Jurnal', href: '/#jurnal' },
                ].map((t) => {
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
                            className="flex-1 rounded-xl py-[9px] text-center text-[11px] font-semibold transition-colors"
                            style={{
                                background: active ? 'rgba(242,206,114,0.13)' : 'transparent',
                                boxShadow: active ? 'inset 0 0 0 1px rgba(242,206,114,0.25)' : 'none',
                                color: active ? '#F2CE72' : '#8C96AB',
                            }}
                        >
                            {t.label}
                        </a>
                    );
                })}
            </nav>
        </>
    );
}
