import type { Metadata } from "next";
import { Roboto_Slab, Open_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ConstellationBackground from "@/components/ConstellationBackground";
import ClientProviders from "@/components/ClientProviders";

const robotoSlab = Roboto_Slab({ subsets: ["latin"], variable: "--font-roboto-slab" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

export const metadata: Metadata = {
    title: "Calendar Solunar Pescuit | CalendarSolunar.ro",
    description: "Calendar solunar detaliat pentru pescuit. Află cele mai bune perioade de pescuit, fazele lunii și orele de activitate maximă în localitatea ta.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ro">
            <head>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4509784482094331"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            </head>
            <body className={`${openSans.variable} ${robotoSlab.variable} font-body bg-night-950 text-slate-100 min-h-screen antialiased selection:bg-moon selection:text-night-950`}>
                <ClientProviders>
                    <ConstellationBackground />
                    <header className="fixed top-0 left-0 right-0 z-50 bg-night-950/90 backdrop-blur-md border-b border-night-800">
                        <div className="container-custom py-4 flex items-center justify-between">
                            <a href="/" className="flex items-center gap-3 group">
                                <img src="/logo.png" alt="Solunar Logo" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform" />
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
                                    <img src="/logo.png" alt="Solunar Logo" className="w-6 h-6 object-contain" />
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
