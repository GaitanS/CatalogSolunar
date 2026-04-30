import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticles, BlogArticle, getAdjacentMonthlyArticles } from '@/data/blogArticles';
import { getAllCities } from '@/data/cities';
import { getAllSpecies } from '@/data/species';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const articles = getAllArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        return { title: 'Articol Negăsit' };
    }

    return {
        title: article.title,
        description: article.excerpt,
        keywords: article.keywords.join(', '),
        alternates: {
            canonical: `https://calendarsolunar.ro/blog/${slug}`,
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.date,
            authors: [article.author],
            url: `https://calendarsolunar.ro/blog/${slug}`,
        },
    };
}

// Extract headings for table of contents
function extractHeadings(content: string): { text: string; id: string; level: number }[] {
    const headings: { text: string; id: string; level: number }[] = [];
    const lines = content.trim().split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('# ')) {
            const text = trimmed.slice(2);
            const id = text.toLowerCase()
                .replace(/[^\w\săâîșț-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 60);
            headings.push({ text, id, level: 2 });
        } else if (trimmed.startsWith('## ')) {
            const text = trimmed.slice(3);
            const id = text.toLowerCase()
                .replace(/[^\w\săâîșț-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 60);
            headings.push({ text, id, level: 2 });
        } else if (trimmed.startsWith('### ')) {
            const text = trimmed.slice(4);
            const id = text.toLowerCase()
                .replace(/[^\w\săâîșț-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 60);
            headings.push({ text, id, level: 3 });
        }
    }
    return headings;
}

// Build internal link map from article keywords/titles, cities, and species
function injectInternalLinks(content: string, currentSlug: string, articles: BlogArticle[]): string {
    const linked = new Set<string>();

    // Link to city pages first (high priority)
    const cities = getAllCities();
    for (const city of cities) {
        if (linked.size >= 8) break; // max 8 total auto-links
        const cityKey = `city-${city.slug}`;
        if (linked.has(cityKey)) continue;
        const escaped = city.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?<!\\[.*?)\\b(${escaped})\\b(?![^\\[]*\\])`, 'i');
        if (re.test(content)) {
            content = content.replace(re, `[$1](/${city.slug})`);
            linked.add(cityKey);
        }
    }

    // Link to species pages
    const species = getAllSpecies();
    for (const s of species) {
        if (linked.size >= 8) break;
        const speciesKey = `species-${s.slug}`;
        if (linked.has(speciesKey)) continue;
        // Match species name (e.g., "crap", "salau")
        const escaped = s.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?<!\\[.*?)\\b(${escaped})\\b(?![^\\[]*\\])`, 'i');
        if (re.test(content)) {
            content = content.replace(re, `[$1](/${s.slug})`);
            linked.add(speciesKey);
        }
    }

    // Link to other articles
    for (const a of articles) {
        if (a.slug === currentSlug) continue;
        if (linked.size >= 8) break;
        for (const kw of a.keywords.slice(0, 2)) {
            if (kw.length < 6) continue;
            if (linked.has(a.slug)) break;
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(`(?<!\\[.*?)\\b(${escaped})\\b(?![^\\[]*\\])`, 'i');
            if (re.test(content)) {
                content = content.replace(re, `[$1](/blog/${a.slug})`);
                linked.add(a.slug);
                break;
            }
        }
    }
    return content;
}

// Simple markdown-like parser for the content
function parseContent(content: string, currentSlug?: string, articles?: BlogArticle[]) {
    // Inject internal links if articles provided
    if (currentSlug && articles) {
        content = injectInternalLinks(content, currentSlug, articles);
    }

    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-6 text-night-300">
                    {listItems.map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
                    ))}
                </ul>
            );
            listItems = [];
        }
        inList = false;
    };

    const flushTable = () => {
        if (tableRows.length > 0) {
            const header = tableRows[0];
            const body = tableRows.slice(2); // Skip separator row
            elements.push(
                <div key={`table-${elements.length}`} className="overflow-x-auto mb-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-night-700">
                                {header.map((cell, i) => (
                                    <th key={i} className="text-left py-2 px-3 text-white font-bold">
                                        {cell.trim()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {body.map((row, i) => (
                                <tr key={i} className="border-b border-night-800">
                                    {row.map((cell, j) => (
                                        <td key={j} className="py-2 px-3 text-night-300" dangerouslySetInnerHTML={{ __html: parseInline(cell.trim()) }} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
            tableRows = [];
        }
        inTable = false;
    };

    const parseInline = (text: string): string => {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-moon hover:underline">$1</a>')
            .replace(/`(.+?)`/g, '<code class="bg-night-800 px-1 rounded text-moon text-sm">$1</code>');
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Empty line
        if (trimmedLine === '') {
            flushList();
            flushTable();
            continue;
        }

        // Table row
        if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            flushList();
            inTable = true;
            const cells = trimmedLine.split('|').filter(c => c.trim() !== '');
            tableRows.push(cells);
            continue;
        } else if (inTable) {
            flushTable();
        }

        // Top-level headings inside article content are rendered as H2 to avoid duplicate H1s.
        if (trimmedLine.startsWith('# ')) {
            flushList();
            const headingText = trimmedLine.slice(2);
            const headingId = headingText.toLowerCase()
                .replace(/[^\w\săâîșț-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 60);
            elements.push(
                <h2 key={i} id={headingId} className="text-2xl font-display font-bold text-white mt-10 mb-4 scroll-mt-24">
                    {headingText}
                </h2>
            );
            continue;
        }

        // Heading 2
        if (trimmedLine.startsWith('## ')) {
            flushList();
            const headingText = trimmedLine.slice(3);
            const headingId = headingText.toLowerCase()
                .replace(/[^\w\săâîșț-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 60);
            elements.push(
                <h2 key={`h2-${i}`} id={headingId} className="text-xl md:text-2xl font-display font-bold text-white mt-8 mb-4 scroll-mt-24">
                    {headingText}
                </h2>
            );
            continue;
        }

        // Heading 3
        if (trimmedLine.startsWith('### ')) {
            flushList();
            const headingText = trimmedLine.slice(4);
            const headingId = headingText.toLowerCase()
                .replace(/[^\w\săâîșț-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 60);
            elements.push(
                <h3 key={`h3-${i}`} id={headingId} className="text-lg font-bold text-white mt-6 mb-3 scroll-mt-24">
                    {headingText}
                </h3>
            );
            continue;
        }

        // List item
        if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
            inList = true;
            listItems.push(trimmedLine.slice(2));
            continue;
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmedLine)) {
            if (!inList) {
                flushList();
            }
            inList = true;
            listItems.push(trimmedLine.replace(/^\d+\.\s/, ''));
            continue;
        }

        // Paragraph
        flushList();
        if (trimmedLine) {
            elements.push(
                <p
                    key={`p-${i}`}
                    className="text-night-300 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine) }}
                />
            );
        }
    }

    flushList();
    flushTable();

    return elements;
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const allArticles = getAllArticles();
    // Related articles: same category first, then others
    const sameCategory = allArticles.filter(a => a.slug !== article.slug && a.category === article.category);
    const otherArticles = allArticles.filter(a => a.slug !== article.slug && a.category !== article.category);
    const relatedArticles = [...sameCategory, ...otherArticles].slice(0, 6);
    const categoryArticles = sameCategory.slice(0, 5);

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "description": article.excerpt,
        "image": [
            "https://calendarsolunar.ro/logo.webp"
        ],
        "datePublished": article.date,
        "dateModified": article.date,
        "author": {
            "@type": "Organization",
            "name": article.author,
            "url": "https://calendarsolunar.ro"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Calendar Solunar",
            "logo": {
                "@type": "ImageObject",
                "url": "https://calendarsolunar.ro/logo.webp"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://calendarsolunar.ro/blog/${article.slug}`
        },
        "keywords": article.keywords.join(', '),
        "articleSection": article.category,
        "inLanguage": "ro",
        "wordCount": article.content.split(/\s+/).length,
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://calendarsolunar.ro" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://calendarsolunar.ro/blog" },
            { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://calendarsolunar.ro/blog/${article.slug}` }
        ]
    };

    // Generate FAQPage schema if article has Q&A structure
    const faqItems: { question: string; answer: string }[] = [];
    const contentLines = article.content.trim().split('\n');
    let currentQuestion = '';
    let currentAnswer = '';
    for (const line of contentLines) {
        const trimmed = line.trim();
        // Match numbered heading patterns like "## 1. Question?" or "## Question?"
        const qMatch = trimmed.match(/^##\s+(?:\d+\.\s+)?(.+\?)$/);
        if (qMatch) {
            if (currentQuestion && currentAnswer.trim()) {
                faqItems.push({ question: currentQuestion, answer: currentAnswer.trim().replace(/\n+/g, ' ').replace(/[#*`\[\]()]/g, '').slice(0, 500) });
            }
            currentQuestion = qMatch[1];
            currentAnswer = '';
        } else if (currentQuestion && trimmed && !trimmed.startsWith('##')) {
            currentAnswer += trimmed.replace(/\*\*/g, '').replace(/\[(.+?)\]\(.+?\)/g, '$1') + ' ';
        }
    }
    if (currentQuestion && currentAnswer.trim()) {
        faqItems.push({ question: currentQuestion, answer: currentAnswer.trim().replace(/\n+/g, ' ').replace(/[#*`\[\]()]/g, '').slice(0, 500) });
    }

    const faqSchema = faqItems.length >= 3 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    } : null;

    // JSON-LD uses static data from our own database, safe for dangerouslySetInnerHTML
    const articleSchemaJson = JSON.stringify(articleSchema);
    const breadcrumbSchemaJson = JSON.stringify(breadcrumbSchema);
    const faqSchemaJson = faqSchema ? JSON.stringify(faqSchema) : null;

    return (
        <div className="min-h-screen py-12 md:py-20">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchemaJson }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbSchemaJson }} />
            {faqSchemaJson && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchemaJson }} />}
            <div className="container-custom px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-night-400 mb-8">
                        <Link href="/" className="hover:text-moon transition-colors">Acasă</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-moon transition-colors">Blog</Link>
                        <span>/</span>
                        <span className="text-night-300 truncate max-w-[200px]">{article.title}</span>
                    </nav>

                    {/* Article Header */}
                    <header className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-moon/10 text-moon rounded-full text-sm font-bold">
                                {article.category}
                            </span>
                            <span className="text-night-400 text-sm">
                                {article.readTime} min citire
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                            {article.title}
                        </h1>
                        <p className="text-lg text-night-300 mb-6">
                            {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 py-4 border-t border-b border-night-800">
                            <div className="w-10 h-10 rounded-full bg-night-700 flex items-center justify-center text-moon font-bold">
                                CS
                            </div>
                            <div>
                                <div className="text-white font-medium">{article.author}</div>
                                <div className="text-night-400 text-sm">
                                    {new Date(article.date).toLocaleDateString('ro-RO', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Table of Contents */}
                    {(() => {
                        const headings = extractHeadings(article.content);
                        const h2Only = headings.filter(h => h.level === 2);
                        if (h2Only.length < 3) return null;
                        return (
                            <nav className="mb-10 p-5 card-panel">
                                <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Cuprins</h2>
                                <ol className="space-y-2">
                                    {h2Only.map((h, i) => (
                                        <li key={h.id}>
                                            <a
                                                href={`#${h.id}`}
                                                className="text-night-300 hover:text-moon transition-colors text-sm flex items-center gap-2"
                                            >
                                                <span className="text-moon/50 text-xs font-mono">{i + 1}.</span>
                                                {h.text}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        );
                    })()}

                    {/* Article Content */}
                    <article className="prose prose-invert max-w-none">
                        {parseContent(article.content, article.slug, allArticles)}
                    </article>

                    {/* Keywords */}
                    <div className="mt-12 pt-8 border-t border-night-800">
                        <div className="flex flex-wrap gap-2">
                            {article.keywords.map((keyword) => (
                                <span
                                    key={keyword}
                                    className="px-3 py-1 bg-night-800 text-night-300 rounded-full text-xs"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Article Navigation */}
                    {(() => {
                        const { prev, next } = getAdjacentMonthlyArticles(article.slug);
                        if (!prev && !next) return null;
                        return (
                            <nav className="mt-10 grid grid-cols-2 gap-4" aria-label="Navigare articole lunare">
                                {prev ? (
                                    <Link
                                        href={`/blog/${prev.slug}`}
                                        className="p-4 card-glass group hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-xs text-night-400 flex items-center gap-1 mb-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Luna anterioară
                                        </span>
                                        <span className="text-sm font-bold text-white group-hover:text-moon transition-colors line-clamp-2">
                                            {prev.title}
                                        </span>
                                    </Link>
                                ) : <div />}
                                {next ? (
                                    <Link
                                        href={`/blog/${next.slug}`}
                                        className="p-4 card-glass group hover:bg-white/10 transition-colors text-right"
                                    >
                                        <span className="text-xs text-night-400 flex items-center justify-end gap-1 mb-2">
                                            Luna următoare
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                        <span className="text-sm font-bold text-white group-hover:text-moon transition-colors line-clamp-2">
                                            {next.title}
                                        </span>
                                    </Link>
                                ) : <div />}
                            </nav>
                        );
                    })()}

                    {/* CTA */}
                    <div className="mt-12 p-6 card-panel text-center">
                        <h3 className="text-xl font-bold text-white mb-2">
                            Verifică orele optime de pescuit
                        </h3>
                        <p className="text-night-400 mb-4">
                            Calendar solunar personalizat pentru locația ta.
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

                    {/* Related Articles */}
                    {relatedArticles.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-xl font-display font-bold text-white mb-6">
                                Articole Recomandate
                            </h2>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/blog/${related.slug}`}
                                        className="card-glass p-4 group hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-xs text-night-400 mb-2 block">
                                            {related.category} · {related.readTime} min
                                        </span>
                                        <h3 className="text-sm font-bold text-white group-hover:text-moon transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* More from Category */}
                    {categoryArticles.length > 0 && (
                        <div className="mt-12 p-6 card-panel">
                            <h2 className="text-lg font-display font-bold text-white mb-4">
                                Mai multe din {article.category}
                            </h2>
                            <ul className="space-y-3">
                                {categoryArticles.map((cat) => (
                                    <li key={cat.slug}>
                                        <Link
                                            href={`/blog/${cat.slug}`}
                                            className="flex items-center gap-3 text-night-300 hover:text-moon transition-colors group"
                                        >
                                            <svg className="w-4 h-4 text-moon/50 group-hover:text-moon shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="text-sm">{cat.title}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/blog"
                                className="inline-block mt-4 text-sm text-moon hover:underline"
                            >
                                Toate articolele →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
