import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const path = url.pathname;

    // 1. Intercept assets that IFrames look for at the root
    // They usually look for /_next/static or images at the root
    const response = (path.startsWith('/_next/') || path.startsWith('/images/'))
        ? (function () {
            const referer = request.headers.get('referer');
            if (referer) {
                const projectMatch = referer.match(/\/(?:p|api\/raw)\/([^\/]+)/);
                if (projectMatch) {
                    const slug = projectMatch[1];
                    return NextResponse.rewrite(new URL(`/api/raw/${slug}${path}`, request.url));
                }
            }
            return NextResponse.next();
        })()
        : NextResponse.next();

    return response;
}

export const config = {
    matcher: [
        '/_next/:path*',
        '/images/:path*',
        '/p/:path*',
        '/api/raw/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

