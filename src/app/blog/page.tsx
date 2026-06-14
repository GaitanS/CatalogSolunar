import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getAllArticles, getMonthlyArticles } from '@/data/blogArticles';

// Evergreen index — regenerate hourly so the "recommended" month stays current.
export const revalidate = 3600;

export const metadata: Metadata = {
    title: 'Ghiduri Pescuit 2026 - Solunar pe Luni, Specii și Tehnici',
    description: 'Ghiduri de pescuit 2026: calendar solunar pe luni cu zile bune și ore optime, faze lunare, plus ghiduri pe specii și tehnici de pescuit.',
    keywords: [
        'ghiduri pescuit 2026', 'solunar 2026 pe luni', 'calendar pescuit 2026',
        'calendar solunar 2026', 'zile bune pescuit', 'ore optime pescuit',
        'sfaturi pescuit', 'tehnici pescuit',
        'pescuit crap', 'pescuit salau', 'pescuit pastrav',
        'cele mai bune ore pescuit', 'sezon pescuit 2026',
        'cand se deschide sezonul de pescuit', 'pescuit method feeder',
        'presiune atmosferica pescuit', 'de ce nu musca pestii',
    ],
    alternates: {
        canonical: 'https://calendarsolunar.ro/blog',
    },
    openGraph: {
        title: 'Ghiduri Pescuit 2026 — Solunar pe Luni, Specii și Tehnici',
        description: 'Calendar solunar 2026 pe luni, ore bune de pescuit, faze lunare și ghiduri practice pentru pescari.',
        url: 'https://calendarsolunar.ro/blog',
    },
};

const MONTH_SLUGS = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];

export default function BlogPage() {
    const articles = getAllArticles();
    const monthlyArticles = getMonthlyArticles();
    // Highlight the current month (or next month from the 24th) instead of a
    // hardcoded one, so the index never looks frozen on a past month.
    const now = new Date();
    const priorityIdx = now.getDate() >= 24 ? (now.getMonth() + 1) % 12 : now.getMonth();
    const prioritySlug = MONTH_SLUGS[priorityIdx];
    const priorityName = prioritySlug.charAt(0).toUpperCase() + prioritySlug.slice(1);
    const priorityYear = now.getMonth() === 11 && now.getDate() >= 24 ? now.getFullYear() + 1 : now.getFullYear();
    const highlightedMonthlyArticle = monthlyArticles.find(article => article.slug === `solunar-${prioritySlug}-2026-ghid`) || monthlyArticles[0];
    const orderedMonthlyArticles = highlightedMonthlyArticle
        ? [highlightedMonthlyArticle, ...monthlyArticles.filter(article => article.slug !== highlightedMonthlyArticle.slug)]
        : monthlyArticles;
    const categories = [...new Set(articles.map(a => a.category))];
    const articlesByCategory = categories.reduce((acc, cat) => {
        acc[cat] = articles.filter(a => a.category === cat);
        return acc;
    }, {} as Record<string, typeof articles>);

    return (
        <div className="min-h-[100dvh] py-12 md:py-20">
            <Breadcrumbs items={[
                { label: 'Acasă', href: '/' },
                { label: 'Ghiduri Pescuit' },
            ]} />
            <div className="container-custom px-4">
                {/* Hero */}
                <div className="mb-12 md:mb-16 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-none text-white mb-5">
                        Calendar Pescuit 2026
                    </h1>
                    <p className="text-night-300 text-base md:text-lg leading-relaxed max-w-[65ch]">
                        Calendar pescuit 2026 pe luni, zile bune, ore optime și ghiduri practice pentru fiecare specie importantă. Începe cu solunar {priorityName} {priorityYear}.
                    </p>
                </div>

                {highlightedMonthlyArticle && (
                    <Link
                        href={`/blog/${highlightedMonthlyArticle.slug}`}
                        className="interactive-lift taste-surface mb-8 block rounded-2xl border border-amber-300/30 bg-amber-300/10 p-5 md:p-6 group"
                    >
                        <p className="text-[11px] uppercase tracking-[0.22em] text-amber-100/75 font-bold">
                            Recomandat acum
                        </p>
                        <h2 className="mt-2 text-2xl md:text-3xl font-display font-bold text-white group-hover:text-amber-100 transition-colors">
                            Solunar {priorityName} {priorityYear} - calendar pescuit, zile bune și ore exacte
                        </h2>
                        <p className="mt-3 max-w-[72ch] text-sm md:text-base leading-relaxed text-night-300">
                            Pagina lunii {priorityName.toLowerCase()} răspunde direct căutărilor pentru solunar pescuit {priorityName.toLowerCase()} {priorityYear}, cu faze lunare, ferestre recomandate și specii active.
                        </p>
                        <span className="mt-4 inline-flex rounded-xl bg-amber-300 px-4 py-2 text-sm font-bold text-night-950 transition-colors group-hover:bg-amber-200">
                            Vezi ghidul pentru {priorityName} {priorityYear} &rarr;
                        </span>
                    </Link>
                )}

                <section className="mb-10 md:mb-12">
                    <div className="flex items-end justify-between gap-4 mb-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-display font-bold text-white">
                                Solunar 2026 pe Luni
                            </h2>
                            <p className="text-night-400 text-sm mt-1">
                                Alege luna și vezi fazele lunii, zilele de top și orele recomandate.
                            </p>
                        </div>
                        <Link href="/" className="hidden sm:inline-flex text-sm font-bold text-moon hover:text-white transition-colors">
                            Calendar azi &rarr;
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {orderedMonthlyArticles.map((article) => (
                            <Link
                                key={article.slug}
                                href={`/blog/${article.slug}`}
                                className="interactive-lift taste-surface rounded-2xl border border-amber-400/15 bg-amber-400/10 p-4 group hover:border-amber-400/40 transition-colors"
                            >
                                <h3 className="text-sm md:text-base font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-2">
                                    {article.title.replace(' ✓ ', ' - ')}
                                </h3>
                                <p className="text-night-300 text-xs mt-2 line-clamp-2">
                                    {article.excerpt}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Category Navigation */}
                <nav className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(cat => (
                        <a
                            key={cat}
                            href={`#${cat.toLowerCase()}`}
                            className="px-4 py-2 bg-night-800 hover:bg-moon/10 text-night-300 hover:text-moon rounded-full text-sm font-medium transition-colors"
                        >
                            {cat} ({articlesByCategory[cat].length})
                        </a>
                    ))}
                </nav>

                {/* Featured Article */}
                {articles[0] && (
                    <Link
                        href={`/blog/${articles[0].slug}`}
                        className="block card-panel p-6 md:p-8 mb-8 group hover:border-moon/50 transition-colors"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-moon/10 text-moon rounded-full text-xs font-bold">
                                        {articles[0].category}
                                    </span>
                                    <span className="text-night-400 text-sm">
                                        {articles[0].readTime} min citire
                                    </span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 group-hover:text-moon transition-colors">
                                    {articles[0].title}
                                </h2>
                                <p className="text-night-300 leading-relaxed mb-4">
                                    {articles[0].excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-night-400">
                                    <span>{articles[0].author}</span>
                                    <span>•</span>
                                    <span>{new Date(articles[0].date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Article Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.slice(1).map((article) => (
                        <Link
                            key={article.slug}
                            href={`/blog/${article.slug}`}
                            className="card-glass p-5 group hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-0.5 bg-night-800 text-night-300 rounded text-xs font-medium">
                                    {article.category}
                                </span>
                                <span className="text-night-500 text-xs">
                                    {article.readTime} min
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-moon transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            <p className="text-night-400 text-sm leading-relaxed line-clamp-3 mb-3">
                                {article.excerpt}
                            </p>
                            <div className="text-xs text-night-500">
                                {new Date(article.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Articles by Category */}
                {categories.map(cat => (
                    <section key={cat} id={cat.toLowerCase()} className="mt-16 scroll-mt-24">
                        <h2 className="text-2xl font-display font-bold text-white mb-6">
                            {cat}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {articlesByCategory[cat].map(article => (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    className="card-glass p-4 group hover:bg-white/10 transition-colors"
                                >
                                    <h3 className="text-sm font-bold text-white group-hover:text-moon transition-colors line-clamp-2 mb-1">
                                        {article.title}
                                    </h3>
                                    <p className="text-night-500 text-xs">{article.readTime} min citire</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}

                {/* CTA */}
                <div className="text-center mt-16">
                    <p className="text-night-400 mb-4">
                        Vrei să verifici orele optime de pescuit?
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-moon text-night-950 font-bold rounded-xl hover:bg-moon/90 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calendar Solunar
                    </Link>
                </div>
            </div>
        </div>
    );
}
