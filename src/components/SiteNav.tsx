'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
            <nav className="mobile-bottom-nav fixed bottom-3 left-3 right-3 z-50 bg-[#111827]/92 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around py-2 px-3 taste-surface md:hidden">
                <a href="/" {...navState(pathname, '/')} className="site-nav-link flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] text-slate-400 transition-colors hover:bg-white/[0.055] hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" /></svg>
                    Acasă
                </a>
                <a href="/azi" {...navState(pathname, '/azi')} className="site-nav-link flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] text-slate-400 transition-colors hover:bg-white/[0.055] hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Azi
                </a>
                <a href="/locuri-pescuit" {...navState(pathname, '/locuri-pescuit')} className="site-nav-link flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] text-slate-400 transition-colors hover:bg-white/[0.055] hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Locuri
                </a>
                <a href="/blog" {...navState(pathname, '/blog')} className="site-nav-link flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] text-slate-400 transition-colors hover:bg-white/[0.055] hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    Ghiduri
                </a>
            </nav>
        </>
    );
}
