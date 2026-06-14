import type { Metadata } from "next";
import { Outfit, Open_Sans } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import LazyBackground from "@/components/LazyBackground";
import ClientProviders from "@/components/ClientProviders";
import SchemaMarkup from "@/components/SchemaMarkup";
import SiteNav from "@/components/SiteNav";

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
        default: 'Solunar 2026 Pescuit pe Ore - Calendar Solunar România',
        template: '%s | Calendar Solunar 2026 Pescuit'
    },
    description: "Calendar solunar 2026 cu ore de pescuit, perioade majore și minore, faze lunare și prognoză pe 14 zile. Date actualizate pentru orașe și locuri de pescuit din România.",
    keywords: [
        "solunar 2026", "solunar pescuit 2026", "calendar solunar",
        "calendar solunar 2026", "solunar pescuit pe ore", "calendar pescuit 2026",
        "zile bune pescuit 2026", "calendarul pescarului 2026", "solunar azi",
        "cand trage pestele", "solunar aprilie 2026", "solunar mai 2026",
        "solunar pescuit", "faze lunare pescuit", "perioade majore solunar",
        "solunar romania", "calendar lunar pescuit", "calendarul pescarului",
        "tabel solunar", "ore bune pescuit", "calendar de pescuit",
        "calendar pescuit", "solunar calendar 2026",
    ],
    openGraph: {
        title: 'Calendar Pescuit 2026 - Solunar pe Ore Exacte',
        description: 'Calendar de pescuit 2026 cu solunar pe ore, faze lunare, perioade majore și prognoză pe 14 zile pentru România.',
        url: 'https://calendarsolunar.ro',
        siteName: 'Calendar Solunar',
        locale: 'ro_RO',
        type: 'website',
        // OG image is provided by the file-based src/app/opengraph-image.tsx
        // route (the static og-image.png did not exist and 404'd).
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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ro">
            <head>
                {process.env.NODE_ENV === 'production' && (
                    <script
                        async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4509784482094331"
                        crossOrigin="anonymous"
                    />
                )}
                <meta name="google-adsense-account" content="ca-pub-4509784482094331" />
                {process.env.NODE_ENV === 'production' && (
                    <>
                        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
                        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
                        <link rel="dns-prefetch" href="https://fundingchoicesmessages.google.com" />
                    </>
                )}
                {/* Critical CSS inlined to eliminate render-blocking request - static string, no user input */}
                <style dangerouslySetInnerHTML={{ __html: 'body{background-color:#020617;color:#f1f5f9;margin:0;-webkit-font-smoothing:antialiased}.container-custom{width:100%;max-width:1400px;margin:0 auto;padding:0 1rem}@media(min-width:640px){.container-custom{padding:0 1.5rem}}.fixed{position:fixed}.top-0{top:0}.left-0{left:0}.right-0{right:0}.z-50{z-index:50}.flex{display:flex}.hidden{display:none}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.gap-8{gap:2rem}.py-4{padding-top:1rem;padding-bottom:1rem}.pt-20{padding-top:5rem}.text-white{color:#fff}.text-xl{font-size:1.25rem}.font-bold{font-weight:700}.text-sm{font-size:.875rem}.text-2xl{font-size:1.5rem}.text-3xl{font-size:1.875rem}.text-5xl{font-size:3rem}.mb-1{margin-bottom:.25rem}.mb-3{margin-bottom:.75rem}.text-center{text-align:center}.card-panel{background:#0B1221;border:1px solid rgba(255,255,255,.05);border-radius:1.5rem}.bg-night-950\\/90{background-color:rgba(2,6,23,.9)}.backdrop-blur-md{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}.border-b{border-bottom-width:1px}.border-night-800{border-color:#1e293b}@media(min-width:768px){.md\\:flex{display:flex}.md\\:text-5xl{font-size:3rem}}' }} />
                {/* Schema.org JSON-LD structured data for SEO */}
                <SchemaMarkup />
            </head>
            <body className={`${openSans.variable} ${outfit.variable} font-body bg-night-950 text-slate-100 min-h-screen antialiased selection:bg-moon selection:text-night-950`}>
                <ClientProviders>
                    <LazyBackground />
                    <SiteNav />
                    <main className="pb-20 md:pb-0 md:pt-20">
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
                                    Resursă pentru pescuit planificat cu date solunare, faze lunare și informații meteo.
                                    Folosim algoritmi astronomici preciși pentru a calcula cele mai bune momente de activitate a peștilor.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-display font-bold text-white mb-4">Link-uri Utile</h3>
                                <ul className="space-y-2 text-sm text-night-400">
                                    <li><a href="/azi" className="hover:text-moon transition-colors">Solunar Azi</a></li>
                                    <li><a href="/lunar" className="hover:text-moon transition-colors">Calendar Lunar</a></li>
                                    <li><a href="/rasarit-apus-soare" className="hover:text-moon transition-colors">Răsărit și Apus Soare</a></li>
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
