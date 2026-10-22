import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { annualSeoLandingPages, monthlySeoLandingPages } from '@/data/seoLandingPages';

const MONTH_SLUGS = [
    'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
    'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
];

const landingExists = (slug: string) =>
    monthlySeoLandingPages.some((page) => page.slug === slug) || annualSeoLandingPages.some((page) => page.slug === slug);

/** Latest published year for a landing prefix, e.g. "solunar-ianuarie" -> 2027. */
function latestYearFor(prefix: string) {
    const years = [...monthlySeoLandingPages, ...annualSeoLandingPages]
        .filter((page) => page.slug.startsWith(`${prefix}-`))
        .map((page) => page.year);
    return years.length ? Math.max(...years) : undefined;
}

// Year-less URLs ("/solunar-mai", "/solunar-pescuit") point to the year people
// are planning for, so the target moves over time: these must stay 302, never
// 301, or browsers and Google would pin last year's page.
function yearlessTarget(pathname: string): string | undefined {
    const now = new Date();
    const month = pathname.match(/^\/solunar-([a-z]+)$/)?.[1];
    if (month && MONTH_SLUGS.includes(month)) {
        // The next occurrence of that month: in October, "ianuarie" means next January.
        const year = MONTH_SLUGS.indexOf(month) >= now.getMonth() ? now.getFullYear() : now.getFullYear() + 1;
        const slug = `solunar-${month}-${year}`;
        if (landingExists(slug)) return `/${slug}`;
        const latest = latestYearFor(`solunar-${month}`);
        return latest ? `/solunar-${month}-${latest}` : undefined;
    }
    if (pathname === '/solunar-pescuit' || pathname === '/calendar-pescuit') {
        const slug = `${pathname.slice(1)}-${now.getFullYear()}`;
        if (landingExists(slug)) return `/${slug}`;
        const latest = latestYearFor(pathname.slice(1));
        return latest ? `${pathname}-${latest}` : undefined;
    }
    return undefined;
}

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';
    const hostWithoutPort = hostname.split(':')[0];
    const isLocalhost = hostWithoutPort === 'localhost' || hostWithoutPort === '127.0.0.1' || hostWithoutPort === '::1';
    const canonicalOrigin = isLocalhost ? url.origin : 'https://calendarsolunar.ro';
    const pathname = url.pathname;

    if (pathname === '/$' || pathname === '/&') {
        return NextResponse.redirect(new URL('/', canonicalOrigin), 301);
    }

    if (pathname === '/blog/solunar-ianuarie-2026-ghid') {
        return NextResponse.redirect(new URL('/solunar-ianuarie-2026', canonicalOrigin), 301);
    }

    // There are no 2027 blog guides; send those URLs to the matching 2027 landing.
    const guide2027 = pathname.match(/^\/blog\/solunar-([a-z]+)-2027-ghid$/);
    if (guide2027) {
        const slug = `solunar-${guide2027[1]}-2027`;
        return NextResponse.redirect(new URL(landingExists(slug) ? `/${slug}` : '/solunar-2027', canonicalOrigin), 301);
    }

    const yearless = yearlessTarget(pathname);
    if (yearless) {
        return NextResponse.redirect(new URL(yearless, canonicalOrigin), 302);
    }

    // Redirect www to non-www
    if (!isLocalhost && hostname.startsWith('www.')) {
        const newHost = hostname.replace('www.', '');
        return NextResponse.redirect(
            new URL(`https://${newHost}${url.pathname}${url.search}`),
            301
        );
    }

    // http→https is enforced by the host (Hostinger SSL / nginx), not here: behind a
    // TLS-terminating proxy x-forwarded-proto can read "http" for HTTPS requests,
    // which would make a redirect here loop forever.

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', url.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|logo.webp|og-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
    ],
};
