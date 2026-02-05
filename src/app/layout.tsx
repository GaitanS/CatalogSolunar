import type { Metadata } from "next";
import { Roboto_Slab, Open_Sans } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import LazyBackground from "@/components/LazyBackground";
import ClientProviders from "@/components/ClientProviders";
import SchemaMarkup from "@/components/SchemaMarkup";

const robotoSlab = Roboto_Slab({
    subsets: ["latin", "latin-ext"],
    variable: "--font-roboto-slab",
    display: "swap",
    preload: true,
    adjustFontFallback: true,
    weight: ["400", "700"],
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
        default: 'Calendar Pescuit 2026 - Solunar pe Ore | Când Trage Peștele',
        template: '%s | Calendar Solunar'
    },
    description: "Calendar de pescuit 2026 cu solunar pe ore exacte. Vezi când trage peștele: perioade majore, faze lunare și prognoză 14 zile. Gratuit pentru România!",
    keywords: [
        "calendar pescuit 2026", "calendar de pescuit", "solunar pescuit pe ore",
        "solunar pescuit", "calendar solunar", "solunar 2026",
        "cand trage pestele", "faze lunare pescuit", "activitate pesti",
        "solunar azi", "solunar romania", "ore pescuit", "perioade majore solunar",
        "luna plina pescuit", "calendar lunar pescuit"
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
    verification: {
        google: 'google-site-verification-token',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
            <body className={`${openSans.variable} ${robotoSlab.variable} font-body bg-night-950 text-slate-100 min-h-screen antialiased selection:bg-moon selection:text-night-950`}>
                <ClientProviders>
                    <LazyBackground />
                    <header className="fixed top-0 left-0 right-0 z-50 bg-night-950/90 backdrop-blur-md border-b border-night-800">
                        <div className="container-custom py-4 flex items-center justify-between">
                            <a href="/" className="flex items-center gap-3 group">
                                <Image
                                    src="/logo.webp"
                                    alt="Solunar Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain group-hover:scale-110 transition-transform"
                                    priority
                                />
                                <span className="font-display text-xl font-bold text-white tracking-tight">Calendar Solunar</span>
                            </a>
                            <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
                                <a href="/" className="text-white hover:text-moon transition-colors">Acasă</a>
                                <a href="/azi" className="text-night-300 hover:text-moon transition-colors">Solunar Azi</a>
                                <a href="/lunar" className="text-night-300 hover:text-moon transition-colors">Faze Lunare</a>
                                <a href="/blog" className="text-night-300 hover:text-moon transition-colors">Ghiduri</a>
                                <a href="/despre" className="text-night-300 hover:text-moon transition-colors">Despre</a>
                            </nav>
                        </div>
                    </header>
                    <main className="pt-20">
                        {children}
                    </main>
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
