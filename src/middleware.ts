import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

    const staleMonthlyGuideMatch = pathname.match(/^\/blog\/solunar-[a-z-]+-2027-ghid$/);
    if (staleMonthlyGuideMatch) {
        return NextResponse.redirect(new URL('/solunar-2026', canonicalOrigin), 302);
    }

    // Redirect www to non-www
    if (!isLocalhost && hostname.startsWith('www.')) {
        const newHost = hostname.replace('www.', '');
        return NextResponse.redirect(
            new URL(`https://${newHost}${url.pathname}${url.search}`),
            301
        );
    }

    // Redirect http to https (handled by checking x-forwarded-proto)
    const proto = request.headers.get('x-forwarded-proto');
    if (!isLocalhost && proto === 'http') {
        return NextResponse.redirect(
            new URL(`https://${hostname}${url.pathname}${url.search}`),
            301
        );
    }

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
