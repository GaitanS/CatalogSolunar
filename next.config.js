/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['three', 'suncalc'],
    },
    allowedDevOrigins: ['127.0.0.1', 'localhost'],
    images: {
        unoptimized: true,
    },
    async redirects() {
        const monthSlugs = [
            'ianuarie',
            'februarie',
            'martie',
            'aprilie',
            'mai',
            'iunie',
            'iulie',
            'august',
            'septembrie',
            'octombrie',
            'noiembrie',
            'decembrie',
        ];

        return [
            {
                source: '/calendar-solunar-2026',
                destination: '/solunar-2026',
                permanent: true,
            },
            {
                source: '/tabela-solunar-2026',
                destination: '/solunar-2026',
                permanent: true,
            },
            {
                source: '/solunare-2026',
                destination: '/solunar-2026',
                permanent: true,
            },
            {
                source: '/solunar-pescuit',
                destination: '/solunar-pescuit-2026',
                permanent: true,
            },
            {
                source: '/calendar-pescuit',
                destination: '/calendar-pescuit-2026',
                permanent: true,
            },
            {
                source: '/calendarul-pescarului-2026',
                destination: '/calendar-pescuit-2026',
                permanent: true,
            },
            ...monthSlugs.flatMap((month) => [
                {
                    source: `/solunar-${month}`,
                    destination: `/solunar-${month}-2026`,
                    permanent: true,
                },
                {
                    source: `/solunar-pescuit-${month}-2026`,
                    destination: `/solunar-${month}-2026`,
                    permanent: true,
                },
                {
                    source: `/blog/solunar-${month}-2026`,
                    destination: `/blog/solunar-${month}-2026-ghid`,
                    permanent: true,
                },
            ]),
        ];
    },
    async headers() {
        const isProduction = process.env.NODE_ENV === 'production';

        if (!isProduction) {
            return [
                {
                    source: '/(.*)',
                    headers: [
                        { key: 'X-Frame-Options', value: 'DENY' },
                        { key: 'X-Content-Type-Options', value: 'nosniff' },
                        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    ],
                },
                {
                    source: '/_next/:path*',
                    headers: [
                        { key: 'Cache-Control', value: 'no-store' },
                    ],
                },
            ];
        }

        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },
            {
                // Generated social images are assets, not indexable landing pages.
                source: '/:path*/opengraph-image',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
                ],
            },
            {
                // Same for Twitter/X image routes when present.
                source: '/:path*/twitter-image',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
                ],
            },
            {
                // Keep framework assets out of Google's page index reports.
                source: '/_next/static/:path*',
                headers: [
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
                ],
            },
            {
                // Cache all HTML pages - public so CDN/Googlebot can cache
                source: '/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
                ],
            },
            {
                // Cache static assets for 1 year
                source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                // Cache JS and CSS for 1 year (they have hashes in filenames)
                source: '/_next/static/(.*)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
