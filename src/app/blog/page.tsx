import { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/data/blogArticles';

export const metadata: Metadata = {
    title: 'Ghiduri Pescuit și Articole | Calendar Solunar',
    description: 'Ghiduri practice pentru pescuit, teoria solunar explicată simplu, și sfaturi de la pescari cu experiență.',
};

export default function BlogPage() {
    const articles = getAllArticles();

    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="container-custom px-4">
                {/* Hero */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                        Ghiduri & Articole
                    </h1>
                    <p className="text-night-300 text-lg max-w-2xl mx-auto">
                        Sfaturi practice de pescuit. Fără teorie inutilă - doar ce funcționează.
                    </p>
                </div>

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
