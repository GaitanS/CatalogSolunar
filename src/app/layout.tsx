import type { Metadata } from "next";
import { Outfit, Open_Sans } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Image from "next/image";
import LazyBackground from "@/components/LazyBackground";
import ClientProviders from "@/components/ClientProviders";
import SchemaMarkup from "@/components/SchemaMarkup";

const outfit = Outfit({
    subsets: ["latin", "latin-ext"],
    variable: "--font-outfit",
    display: "swap",
    preload: true,
    adjustFontFallback: true,
    weight: ["400", "500", "600", "700", "800"],
});
const openSans = Open_Sans({
    subsets: ["latin", "latin-ext"],
    variable: "--font-open-sans",
    display: "swap",
    preload: true,
    adjustFontFallback: true,
});

export const metadata: Metadata = {
    metadataBase: new URL('https://calendarsolunar.ro'),
    title: {
        default: 'Solunar 2026 Pescuit pe Ore ✓ Calendar Solunar | Când Trage Peștele',
        template: '%s | Calendar Solunar 2026 Pescuit'
    },
    description: "✅ Cel mai bun calendar solunar 2026 cu ore exacte de pescuit. Perioade majore și minore, faze lunare și prognoză 14 zile. Actualizat zilnic, gratuit pentru toată România!",
    keywords: [
        "solunar 2026", "solunar pescuit 2026", "calendar solunar",
        "calendar solunar 2026", "solunar pescuit pe ore", "calendar pescuit 2026",
        "cel mai bun solunar 2026", "calendarul pescarului 2026", "solunar azi",
        "cand trage pestele", "solunar aprilie 2026", "solunar mai 2026",
        "solunar pescuit", "faze lunare pescuit", "perioade majore solunar",
        "solunar romania", "calendar lunar pescuit", "calendarul pescarului",
        "tabel solunar", "cel mai bun solunar", "calendar de pescuit",
        "calendar pescuit", "solunar calendar 2026",
    ],
    openGraph: {
        title: 'Calendar Pescuit 2026 - Solunar pe Ore Exacte',
        description: 'Când trage peștele? Calendar de pescuit 2026 cu solunar pe ore, faze lunare și prognoză 14 zile. 100% Gratuit!',
        url: 'https://calendarsolunar.ro',
        siteName: 'Calendar Solunar',
        locale: 'ro_RO',
        type: 'website',
        images: [
            {
                url: 'https://calendarsolunar.ro/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Calendar Solunar Pescuit 2026',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Calendar Pescuit 2026 - Solunar pe Ore',
        description: 'Când trage peștele? Calendar de pescuit cu solunar pe ore exacte, faze lunare și prognoză 14 zile.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

function navState(pathname: string, href: string) {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

    return {
        'data-nav-active': active ? 'true' : 'false',
        'aria-current': active ? 'page' as const : undefined,
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const requestHeaders = await headers();
    const pathname = requestHeaders.get('x-pathname') || '/';

    return (
        <html lang="ro">
            <head>
                {/* Google AdSense */}
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4509784482094331"
                    crossOrigin="anonymous"
                />
                <meta name="google-adsense-account" content="ca-pub-4509784482094331" />
                {/* DNS prefetch for AdSense */}
                <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
                {/* Critical CSS inlined to eliminate render-blocking request - static string, no user input */}
                <style dangerouslySetInnerHTML={{ __html: 'body{background-color:#020617;color:#f1f5f9;margin:0;-webkit-font-smoothing:antialiased}.container-custom{width:100%;max-width:1400px;margin:0 auto;padding:0 1rem}@media(min-width:640px){.container-custom{padding:0 1.5rem}}.fixed{position:fixed}.top-0{top:0}.left-0{left:0}.right-0{right:0}.z-50{z-index:50}.flex{display:flex}.hidden{display:none}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.gap-8{gap:2rem}.py-4{padding-top:1rem;padding-bottom:1rem}.pt-20{padding-top:5rem}.text-white{color:#fff}.text-xl{font-size:1.25rem}.font-bold{font-weight:700}.text-sm{font-size:.875rem}.text-2xl{font-size:1.5rem}.text-3xl{font-size:1.875rem}.text-5xl{font-size:3rem}.mb-1{margin-bottom:.25rem}.mb-3{margin-bottom:.75rem}.text-center{text-align:center}.card-panel{background:#0B1221;border:1px solid rgba(255,255,255,.05);border-radius:1.5rem}.bg-night-950\\/90{background-color:rgba(2,6,23,.9)}.backdrop-blur-md{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.border-b{border-bottom-width:1px}.border-night-800{border-color:#1e293b}@media(min-width:768px){.md\\:flex{display:flex}.md\\:text-5xl{font-size:3rem}}' }} />
                {/* Schema.org JSON-LD structured data for SEO */}
                <SchemaMarkup />
            </head>
            <body className={`${openSans.variable} ${outfit.variable} font-body bg-night-950 text-slate-100 min-h-screen antialiased selection:bg-moon selection:text-night-950`}>
                <ClientProviders>
                    <LazyBackground />
                    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#111827]/88 backdrop-blur-xl">
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
                    <main className="pt-20 pb-20 md:pb-0">
                        {children}
                    </main>
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
                    <footer className="bg-night-950/80 backdrop-blur-sm border-t border-night-900 py-12 mt-20 relative z-10">
                        <div className="container-custom grid md:grid-cols-4 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <Image
                                        src="/logo.webp"
                                        alt="Solunar Logo"
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                        loading="lazy"
                                    />
                                    <span className="font-display text-lg font-bold text-white">Calendar Solunar</span>
                                </div>
                                <p className="text-night-400 text-sm leading-relaxed max-w-sm">
                                    Resursa ta numărul 1 pentru pescuit planificat inteligent.
                                    Folosim algoritmi astronomici preciși pentru a calcula cele mai bune momente de activitate a peștilor.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-white mb-4">Link-uri Utile</h3>
                                <ul className="space-y-2 text-sm text-night-400">
                                    <li><a href="/azi" className="hover:text-moon transition-colors">Solunar Azi</a></li>
                                    <li><a href="/lunar" className="hover:text-moon transition-colors">Calendar Lunar</a></li>
                                    <li><a href="/locuri-pescuit" className="hover:text-moon transition-colors">Locuri de Pescuit</a></li>
                                    <li><a href="/blog" className="hover:text-moon transition-colors">Articole și Ghiduri</a></li>
                                    <li><a href="/contact" className="hover:text-moon transition-colors">Contact</a></li>
                                </ul>
                                <h3 className="font-display font-bold text-white mb-3 mt-6">Orașe</h3>
                                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-night-400">
                                    <li><a href="/bucuresti" className="hover:text-moon transition-colors">București</a></li>
                                    <li><a href="/cluj-napoca" className="hover:text-moon transition-colors">Cluj-Napoca</a></li>
                                    <li><a href="/timisoara" className="hover:text-moon transition-colors">Timișoara</a></li>
                                    <li><a href="/iasi" className="hover:text-moon transition-colors">Iași</a></li>
                                    <li><a href="/constanta" className="hover:text-moon transition-colors">Constanța</a></li>
                                    <li><a href="/brasov" className="hover:text-moon transition-colors">Brașov</a></li>
                                    <li><a href="/galati" className="hover:text-moon transition-colors">Galați</a></li>
                                    <li><a href="/craiova" className="hover:text-moon transition-colors">Craiova</a></li>
                                    <li><a href="/oradea" className="hover:text-moon transition-colors">Oradea</a></li>
                                    <li><a href="/sibiu" className="hover:text-moon transition-colors">Sibiu</a></li>
                                    <li><a href="/targu-mures" className="hover:text-moon transition-colors">Târgu Mureș</a></li>
                                    <li><a href="/bacau" className="hover:text-moon transition-colors">Bacău</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-white mb-4">Legal</h3>
                                <ul className="space-y-2 text-sm text-night-400">
                                    <li><a href="/confidentialitate" className="hover:text-moon transition-colors">Confidențialitate</a></li>
                                    <li><a href="/termeni" className="hover:text-moon transition-colors">Termeni și Condiții</a></li>
                                    <li><a href="/cookies" className="hover:text-moon transition-colors">Politica Cookies</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="container-custom mt-12 pt-8 border-t border-night-900 text-center text-xs text-night-500">
                            <p>&copy; {new Date().getFullYear()} Calendar Solunar. Toate drepturile rezervate.</p>
                        </div>
                    </footer>
                </ClientProviders>
            </body>
        </html>
    );
}
