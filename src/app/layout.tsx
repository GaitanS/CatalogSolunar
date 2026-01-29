import type { Metadata } from "next";
import { Roboto_Slab, Open_Sans } from "next/font/google";
import "./critical.css";
import "./globals.css";
import Image from "next/image";
import LazyBackground from "@/components/LazyBackground";
import ClientProviders from "@/components/ClientProviders";
import AdSenseScript from "@/components/AdSenseScript";
import SchemaMarkup from "@/components/SchemaMarkup";

const robotoSlab = Roboto_Slab({
    subsets: ["latin"],
    variable: "--font-roboto-slab",
    display: "swap",
    preload: true,
});
const openSans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    metadataBase: new URL('https://calendarsolunar.ro'),
    title: {
        default: 'Solunar Pescuit 2026 - Calendar cu Ore Exacte',
        template: '%s | Calendar Solunar'
    },
    description: "Calendar solunar precis 2026 cu orele de activitate maximă a peștilor. Faze lunare, solunar pe ore, prognoze pescuit pentru România. Află când trage peștele!",
    keywords: [
        "solunar pescuit", "calendar solunar", "solunar 2026", "calendar pescuit 2026",
        "cand trage pestele", "solunar pescuit pe ore", "faze lunare pescuit", "activitate pesti",
        "solunar azi", "solunar romania", "ore pescuit", "perioade majore solunar",
        "luna plina pescuit", "calendar lunar pescuit"
    ],
    openGraph: {
        title: 'Solunar Pescuit 2026 - Calendar Lunar Complet',
        description: 'Află când trage peștele! Calendar solunar precis cu faze lunare, perioade majore și minore, prognoze 14 zile pentru România.',
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
        title: 'Solunar Pescuit 2026 - Ore Exacte de Activitate',
        description: 'Calendar solunar precis pentru pescuit. Perioade majore, faze lunare, prognoze.',
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
                {/* Google AdSense verification */}
                <meta name="google-adsense-account" content="ca-pub-4509784482094331" />
                {/* Preconnect to critical third-party origins */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
                {/* Schema.org JSON-LD structured data for SEO */}
                <SchemaMarkup />
            </head>
            <body className={`${openSans.variable} ${robotoSlab.variable} font-body bg-night-950 text-slate-100 min-h-screen antialiased selection:bg-moon selection:text-night-950`}>
                <ClientProviders>
                    <AdSenseScript />
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
                                    <li><a href="/lunar" className="hover:text-moon transition-colors">Calendar Lunar</a></li>
                                    <li><a href="/blog" className="hover:text-moon transition-colors">Articole și Ghiduri</a></li>
                                    <li><a href="/contact" className="hover:text-moon transition-colors">Contact</a></li>
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
