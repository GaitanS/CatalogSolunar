'use client';

/**
 * Lista de articole din /blog cu filtru pe categorii. Toate articolele sunt
 * randate in HTML (filtrul "Toate" e implicit), deci link-urile raman
 * vizibile pentru crawlere; filtrul doar ascunde carduri pe client.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';

export interface BlogGridArticle {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: number;
    /** Formatted on the server so client and server render the same text. */
    dateLabel: string;
}

const ALL = 'Toate';

const CATEGORY_DOT: Record<string, string> = {
    Ghiduri: '#93B4E8',
    Tehnici: '#F2CE72',
    Calendar: '#E8A15C',
    Destinații: '#6EE7B7',
    Sezon: '#7DD3FC',
    Echipament: '#C4B5FD',
};

function slugifyCategory(cat: string) {
    return cat.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export default function BlogArticleGrid({ articles, categories }: { articles: BlogGridArticle[]; categories: string[] }) {
    const [active, setActive] = useState(ALL);

    // Vechile ancore /blog#tehnici etc. deschid direct categoria respectiva.
    useEffect(() => {
        const sync = () => {
            const hash = decodeURIComponent(window.location.hash.slice(1));
            const match = categories.find((c) => slugifyCategory(c) === slugifyCategory(hash));
            if (match) setActive(match);
        };
        sync();
        window.addEventListener('hashchange', sync);
        return () => window.removeEventListener('hashchange', sync);
    }, [categories]);

    const counts = categories.reduce<Record<string, number>>((acc, c) => {
        acc[c] = articles.filter((a) => a.category === c).length;
        return acc;
    }, {});

    const select = (cat: string) => {
        setActive(cat);
        const url = cat === ALL ? window.location.pathname : `#${slugifyCategory(cat)}`;
        window.history.replaceState(null, '', url);
    };

    return (
        <section aria-labelledby="toate-articolele">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="eyebrow">Biblioteca</p>
                    <h2 id="toate-articolele" className="mt-1.5 font-editorial text-2xl text-white md:text-[28px]">
                        Toate ghidurile
                    </h2>
                </div>
                <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0" role="toolbar" aria-label="Filtrează după categorie">
                    {[ALL, ...categories].map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => select(cat)}
                            aria-pressed={active === cat}
                            className="glass-chip shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold text-slate-300 transition-colors hover:text-white"
                        >
                            {cat}
                            <span className="ml-1.5 text-[11px] opacity-60">{cat === ALL ? articles.length : counts[cat]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {articles.map((article, i) => {
                    const visible = active === ALL || article.category === active;
                    const featured = active === ALL && i === 0;
                    return (
                        <Link
                            key={article.slug}
                            href={`/blog/${article.slug}`}
                            className={`card-glass interactive-lift group flex-col p-5 ${visible ? 'flex' : 'hidden'} ${featured ? 'md:col-span-2 md:p-7' : ''}`}
                        >
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: CATEGORY_DOT[article.category] || '#93B4E8' }} />
                                <span className="font-semibold text-slate-300">{article.category}</span>
                                <span aria-hidden>·</span>
                                <span>{article.readTime} min</span>
                            </div>
                            <h3 className={`mt-3 font-semibold leading-snug text-white transition-colors group-hover:text-amber-100 ${featured ? 'font-editorial text-2xl md:text-3xl' : 'line-clamp-2 text-[17px]'}`}>
                                {article.title}
                            </h3>
                            <p className={`mt-2 text-sm leading-relaxed text-slate-400 ${featured ? 'line-clamp-3 md:max-w-[60ch]' : 'line-clamp-3'}`}>
                                {article.excerpt}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-4 text-xs text-slate-500">
                                <span>{article.dateLabel}</span>
                                <span className="font-semibold text-amber-200/80 transition-colors group-hover:text-amber-100">Citește &rarr;</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
