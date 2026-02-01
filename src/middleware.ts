import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';

    // Redirect www to non-www
    if (hostname.startsWith('www.')) {
        const newHost = hostname.replace('www.', '');
        return NextResponse.redirect(
            new URL(`https://${newHost}${url.pathname}${url.search}`),
            301
        );
    }

    // Redirect http to https (handled by checking x-forwarded-proto)
    const proto = request.headers.get('x-forwarded-proto');
    if (proto === 'http') {
        return NextResponse.redirect(
            new URL(`https://${hostname}${url.pathname}${url.search}`),
            301
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|logo.webp|og-image.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
    ],
};
