import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/data/blogArticles';

export const runtime = 'edge';
export const alt = 'Calendar Solunar - Blog';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);
    const title = article?.title || 'Calendar Solunar';
    const category = article?.category || 'Blog';
    const readTime = article?.readTime || 5;

    // Truncate title if too long
    const displayTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0a0f1a 0%, #1a2744 50%, #0a0f1a 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, sans-serif',
                    position: 'relative',
                    padding: '60px 80px',
                }}
            >
                {/* Moon decoration */}
                <div
                    style={{
                        position: 'absolute',
                        top: 50,
                        right: 80,
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        boxShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
                    }}
                />

                {/* Category badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 24,
                    }}
                >
                    <span
                        style={{
                            padding: '8px 20px',
                            background: 'rgba(251, 191, 36, 0.15)',
                            color: '#fbbf24',
                            borderRadius: 20,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        {category}
                    </span>
                    <span style={{ color: '#64748b', fontSize: 18 }}>
                        {readTime} min citire
                    </span>
                </div>

                {/* Article title */}
                <h1
                    style={{
                        fontSize: 52,
                        fontWeight: 'bold',
                        color: '#ffffff',
                        margin: 0,
                        textAlign: 'center',
                        lineHeight: 1.2,
                        maxWidth: '100%',
                    }}
                >
                    {displayTitle}
                </h1>

                {/* Site branding */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginTop: 40,
                    }}
                >
                    <span style={{ fontSize: 32 }}>🐟</span>
                    <span
                        style={{
                            fontSize: 24,
                            color: '#94a3b8',
                            fontWeight: 'bold',
                        }}
                    >
                        Calendar Solunar
                    </span>
                </div>

                {/* URL */}
                <p
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        fontSize: 20,
                        color: '#64748b',
                    }}
                >
                    calendarsolunar.ro/blog/{slug}
                </p>
            </div>
        ),
        { ...size }
    );
}
