import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticles } from '@/data/blogArticles';

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    const articles = getAllArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const article = getArticleBySlug(params.slug);

    if (!article) {
        return { title: 'Articol Negăsit' };
    }

    return {
        title: `${article.title} | Calendar Solunar`,
        description: article.excerpt,
        keywords: article.keywords.join(', '),
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.date,
            authors: [article.author],
        },
    };
}

// Simple markdown-like parser for the content
function parseContent(content: string) {
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

        // Heading 2
        if (trimmedLine.startsWith('## ')) {
            flushList();
            elements.push(
                <h2 key={`h2-${i}`} className="text-xl md:text-2xl font-display font-bold text-white mt-8 mb-4">
                    {trimmedLine.slice(3)}
                </h2>
            );
            continue;
        }

        // Heading 3
        if (trimmedLine.startsWith('### ')) {
            flushList();
            elements.push(
                <h3 key={`h3-${i}`} className="text-lg font-bold text-white mt-6 mb-3">
                    {trimmedLine.slice(4)}
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

export default function ArticlePage({ params }: Props) {
    const article = getArticleBySlug(params.slug);

    if (!article) {
        notFound();
    }

    const allArticles = getAllArticles();
    const relatedArticles = allArticles
        .filter(a => a.slug !== article.slug)
        .slice(0, 3);

    return (
        <div className="min-h-screen py-12 md:py-20">
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

                    {/* Article Content */}
                    <article className="prose prose-invert max-w-none">
                        {parseContent(article.content)}
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
                                Citește și
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {relatedArticles.map((related) => (
                                    <Link
                                        key={related.slug}
                                        href={`/blog/${related.slug}`}
                                        className="card-glass p-4 group hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-xs text-night-400 mb-2 block">
                                            {related.category}
                                        </span>
                                        <h3 className="text-sm font-bold text-white group-hover:text-moon transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
