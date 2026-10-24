import type { Metadata } from "next";
import { Sora, Fraunces } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import SchemaMarkup from "@/components/SchemaMarkup";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import AdSenseScript from "@/components/AdSenseScript";

// Both fonts are preloaded with display "optional". The CSS is inlined
// (experimental.inlineCss), so nothing holds back the first paint: with "swap"
// text first painted in the fallback and re-wrapped when the font arrived,
// which is layout shift on slow phones. "optional" uses the font only if it is
// ready within ~100 ms and never swaps later; the file is cached for the next
// page view.
const sora = Sora({
    subsets: ["latin", "latin-ext"],
    variable: "--font-sora",
    display: "optional",
    preload: true,
    adjustFontFallback: true,
});
// Editorial headings only. Upright 600 only: no page uses italic Fraunces.
const fraunces = Fraunces({
    subsets: ["latin", "latin-ext"],
    weight: ["600"],
    style: ["normal"],
    variable: "--font-fraunces",
    display: "optional",
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
                <meta name="google-adsense-account" content="ca-pub-4509784482094331" />
                {process.env.NODE_ENV === 'production' && (
                    <>
                        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
                        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
                        <link rel="dns-prefetch" href="https://fundingchoicesmessages.google.com" />
                    </>
                )}
                {/* Schema.org JSON-LD structured data for SEO */}
                <SchemaMarkup />
            </head>
            <body className={`${sora.variable} ${fraunces.variable} font-body text-slate-100 min-h-screen antialiased`}>
                <ClientProviders>
                    <AdSenseScript />
                    <SiteNav />
                    <main className="pb-6 md:pt-24">
                        {children}
                    </main>
                    <SiteFooter />
                </ClientProviders>
            </body>
        </html>
    );
}
