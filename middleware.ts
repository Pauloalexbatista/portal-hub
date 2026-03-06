import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Detect Asset Requests (Next.js internals or static files)
    const isAsset = pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname.startsWith('/images/'); // Common for images

    if (isAsset) {
        // 2. Intelligent Referer-based Routing
        // Check where this request is coming from
        const referer = request.headers.get('referer');
        if (referer) {
            try {
                const refererUrl = new URL(referer);
                const refererPath = refererUrl.pathname;

                // If the user is on a project page like /p/3gwine
                if (refererPath.startsWith('/p/')) {
                    const slug = refererPath.split('/')[2];
                    if (slug && !pathname.startsWith(`/p/${slug}`)) {
                        // REWRITE: internally point root assets to the project subpath
                        // Browser asks for /_next/... -> we internally serve /p/3gwine/_next/...
                        const newUrl = request.nextUrl.clone();
                        newUrl.pathname = `/p/${slug}${pathname}`;
                        return NextResponse.rewrite(newUrl);
                    }
                }
            } catch (e) {
                // Ignore invalid referer URLs
            }
        }

        // Default: serve as global asset
        return NextResponse.next();
    }

    // Allow login page and global routes
    if (pathname === '/' || pathname === '/admin') {
        return NextResponse.next()
    }

    // Check for session cookie
    const session = request.cookies.get('project_session')?.value

    // For this demo/brainstorming phase, we assume any valid project slug 
    // requires a session. If no session, redirect to home.
    if (!session) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/:path*',
}
