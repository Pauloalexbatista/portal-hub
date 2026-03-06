import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow login page, static files, and admin
    if (
        pathname === '/' ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
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
