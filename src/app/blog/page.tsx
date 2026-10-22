import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import BlogArticleGrid from '@/components/BlogArticleGrid';
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

    // The monthly guides have their own grid above, so the library below
    // lists every other article exactly once.
    const monthlySlugs = new Set(monthlyArticles.map(a => a.slug));
    const libraryArticles = articles
        .filter(a => !monthlySlugs.has(a.slug))
        .map(a => ({
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            category: a.category,
            readTime: a.readTime,
            dateLabel: new Date(a.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' }),
        }));
    const categories = [...new Set(libraryArticles.map(a => a.category))];

    return (
        <div className="min-h-[100dvh] pb-12 pt-4 md:pt-6">
            <Breadcrumbs items={[
                { label: 'Acasă', href: '/' },
                { label: 'Ghiduri Pescuit' },
            ]} />
            <div className="container-custom">
                {/* Hero: titlu + luna recomandata */}
                <div className="mb-8 grid grid-cols-1 gap-4 lg:mb-12 lg:grid-cols-12 lg:gap-6">
                    <div className="card-panel relative overflow-hidden p-6 sm:p-8 lg:col-span-7 lg:p-10">
                        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-sky-300/10 blur-3xl" />
                        <p className="eyebrow relative">Ghiduri · {articles.length} articole</p>
                        <h1 className="relative mt-3 font-editorial text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
                            Calendar Pescuit 2026
                        </h1>
                        <p className="relative mt-5 max-w-[60ch] text-base leading-relaxed text-slate-300 md:text-lg">
                            Calendar pescuit 2026 pe luni, zile bune, ore optime și ghiduri practice pentru fiecare specie importantă. Începe cu solunar {priorityName} {priorityYear}.
                        </p>
                    </div>

                    {highlightedMonthlyArticle && (
                        <Link
                            href={`/blog/${highlightedMonthlyArticle.slug}`}
                            className="interactive-lift card-panel group relative flex flex-col justify-between overflow-hidden p-6 sm:p-8 lg:col-span-5"
                            style={{ background: 'linear-gradient(160deg, rgba(242,206,114,0.16), rgba(242,206,114,0.04) 55%, rgba(15,23,42,0.5))' }}
                        >
                            <div className="relative">
                                <p className="eyebrow !text-amber-200/80">Recomandat acum</p>
                                <h2 className="mt-2 font-editorial text-2xl leading-snug text-white transition-colors group-hover:text-amber-100 md:text-[28px]">
                                    Solunar {priorityName} {priorityYear} - calendar pescuit, zile bune și ore exacte
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                                    Pagina lunii {priorityName.toLowerCase()} răspunde direct căutărilor pentru solunar pescuit {priorityName.toLowerCase()} {priorityYear}, cu faze lunare, ferestre recomandate și specii active.
                                </p>
                            </div>
                            <span className="mt-6 inline-flex w-fit rounded-xl bg-gradient-to-b from-[#F7DC92] to-[#E8BC5A] px-4 py-2.5 text-sm font-bold text-[#0b1120] shadow-[0_8px_24px_-8px_rgba(242,206,114,0.6)]">
                                Vezi ghidul pentru {priorityName} {priorityYear} &rarr;
                            </span>
                        </Link>
                    )}
                </div>

                {/* Ghidurile lunare, in ordinea calendarului */}
                <section className="mb-10 md:mb-14">
                    <div className="mb-5 flex items-end justify-between gap-4">
                        <div>
                            <p className="eyebrow">Pe luni</p>
                            <h2 className="mt-1.5 font-editorial text-2xl text-white md:text-[28px]">
                                Solunar 2026 pe Luni
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Alege luna și vezi fazele lunii, zilele de top și orele recomandate.
                            </p>
                        </div>
                        <Link href="/" className="hidden text-sm font-bold text-moon transition-colors hover:text-white sm:inline-flex">
                            Calendar azi &rarr;
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {monthlyArticles.map((article) => {
                            const isPriority = article.slug === highlightedMonthlyArticle?.slug;
                            return (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    data-active={isPriority ? 'true' : undefined}
                                    className="glass-chip interactive-lift group rounded-2xl p-4"
                                >
                                    <h3 className={`line-clamp-2 text-sm font-bold transition-colors group-hover:text-amber-100 md:text-[15px] ${isPriority ? 'text-moon' : 'text-white'}`}>
                                        {article.title.replace(' ✓ ', ' - ')}
                                    </h3>
                                    <p className="mt-2 line-clamp-2 text-xs text-slate-400">
                                        {article.excerpt}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <BlogArticleGrid articles={libraryArticles} categories={categories} />

                {/* CTA */}
                <div className="card-panel mt-14 flex flex-col items-center gap-4 p-8 text-center md:p-10">
                    <p className="font-editorial text-2xl text-white">Vrei să verifici orele optime de pescuit?</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-[#F7DC92] to-[#E8BC5A] px-6 py-3 font-bold text-[#0b1120] shadow-[0_8px_24px_-8px_rgba(242,206,114,0.6)] transition-transform hover:-translate-y-0.5"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Calendar Solunar
                    </Link>
                </div>
            </div>
        </div>
    );
}
