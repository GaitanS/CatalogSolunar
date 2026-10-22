import Image from 'next/image';
import logo from '@/assets/logo.webp';

const CALENDAR_LINKS = [
    { href: '/azi', label: 'Solunar Azi' },
    { href: '/prognoza', label: 'Prognoză 14 zile' },
    { href: '/lunar', label: 'Calendar Lunar' },
    { href: '/rasarit-apus-soare', label: 'Răsărit și Apus Soare' },
    { href: '/solunar-2026', label: 'Solunar 2026' },
    { href: '/solunar-2027', label: 'Solunar 2027' },
];

const EXPLORE_LINKS = [
    { href: '/locuri-pescuit', label: 'Locuri de Pescuit' },
    { href: '/specii', label: 'Specii de Pești' },
    { href: '/blog', label: 'Articole și Ghiduri' },
    { href: '/despre', label: 'Despre Proiect' },
    { href: '/contact', label: 'Contact' },
];

const CITY_LINKS = [
    { href: '/bucuresti', label: 'București' },
    { href: '/cluj-napoca', label: 'Cluj-Napoca' },
    { href: '/timisoara', label: 'Timișoara' },
    { href: '/iasi', label: 'Iași' },
    { href: '/constanta', label: 'Constanța' },
    { href: '/brasov', label: 'Brașov' },
    { href: '/galati', label: 'Galați' },
    { href: '/craiova', label: 'Craiova' },
    { href: '/oradea', label: 'Oradea' },
    { href: '/sibiu', label: 'Sibiu' },
    { href: '/targu-mures', label: 'Târgu Mureș' },
    { href: '/bacau', label: 'Bacău' },
];

const LEGAL_LINKS = [
    { href: '/confidentialitate', label: 'Confidențialitate' },
    { href: '/termeni', label: 'Termeni și Condiții' },
    { href: '/cookies', label: 'Politica Cookies' },
];

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
    return (
        <div>
            <h3 className="eyebrow mb-4">{title}</h3>
            <ul className="space-y-2.5 text-sm">
                {links.map((l) => (
                    <li key={l.href}>
                        <a href={l.href} className="text-slate-400 transition-colors hover:text-moon">
                            {l.label}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function SiteFooter() {
    return (
        <footer className="relative z-10 mt-16 pb-32 md:pb-10">
            <div className="container-custom">
                <div className="card-panel overflow-hidden px-6 py-10 md:px-10">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
                        <div>
                            <a href="/" className="inline-flex items-center gap-2.5">
                                <Image src={logo} alt="Calendar Solunar" width={30} height={30} className="object-contain" loading="lazy" />
                                <span className="font-display text-lg font-bold tracking-tight text-white">Calendar Solunar</span>
                            </a>
                            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                                Ore de pescuit calculate astronomic pentru fiecare zi: perioade majore și minore,
                                faze lunare, răsărit și apus, pentru orașele și apele din România.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <a href="/azi" className="glass-chip rounded-full px-3.5 py-1.5 text-xs font-semibold text-moon transition-colors hover:bg-white/10">
                                    Solunar azi
                                </a>
                                <a href="/prognoza" className="glass-chip rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10">
                                    Prognoză 14 zile
                                </a>
                            </div>
                        </div>

                        <FooterColumn title="Calendar" links={CALENDAR_LINKS} />
                        <FooterColumn title="Explorează" links={EXPLORE_LINKS} />

                        <div>
                            <h3 className="eyebrow mb-4">Orașe</h3>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                                {CITY_LINKS.map((l) => (
                                    <li key={l.href}>
                                        <a href={l.href} className="text-slate-400 transition-colors hover:text-moon">
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="hairline my-8" />

                    <div className="flex flex-col gap-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
                        <p>&copy; {new Date().getFullYear()} Calendar Solunar. Toate drepturile rezervate.</p>
                        <ul className="flex flex-wrap gap-x-5 gap-y-2">
                            {LEGAL_LINKS.map((l) => (
                                <li key={l.href}>
                                    <a href={l.href} className="transition-colors hover:text-moon">
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
